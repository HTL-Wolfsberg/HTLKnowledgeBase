using API.ApplicationUser;
using API.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthenticationController> _logger;

    public AuthenticationController(UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration,
        ILogger<AuthenticationController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new ApplicationUser { UserName = model.Name, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            return Ok();
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var roles = await _userManager.GetRolesAsync(user);
            var tokenString = GenerateJwtToken(user, roles);

            var refreshToken = GenerateRefreshJwtToken(user);
            user.RefreshTokens.Add(new RefreshTokenModel { Token = refreshToken.Token, Created = DateTime.UtcNow, Expires = refreshToken.Expires });

            // Remove expired tokens
            user.RefreshTokens.RemoveAll(r => r.IsExpired);

            await _userManager.UpdateAsync(user);

            return Ok(new { Token = tokenString, RefreshToken = refreshToken.Token });
        }
        return Unauthorized();
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var principal = GetPrincipalFromExpiredToken(request.RefreshToken);
        if (principal == null)
        {
            return Unauthorized();
        }

        var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userManager.Users.Include(u => u.RefreshTokens)
            .SingleOrDefaultAsync(u => u.Id == userId);

        if (user == null || !user.RefreshTokens.Any(t => t.Token == request.RefreshToken && !t.IsExpired))
        {
            return Unauthorized();
        }

        var roles = await _userManager.GetRolesAsync(user);

        var newJwtToken = GenerateJwtToken(user, roles);
        var newRefreshToken = GenerateRefreshJwtToken(user);

        // Remove the used and expired refresh tokens
        user.RefreshTokens.RemoveAll(r => r.Token == request.RefreshToken || r.IsExpired);
        user.RefreshTokens.Add(newRefreshToken);
        await _userManager.UpdateAsync(user);

        return Ok(new { Token = newJwtToken, RefreshToken = newRefreshToken.Token });
    }

    private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
    {
        var roleClaims = roles.Select(role => new Claim(ClaimTypes.Role, role)).ToList();

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };
        claims.AddRange(roleClaims);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:ExpireMinutes"])),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return tokenString;
    }

    private RefreshTokenModel GenerateRefreshJwtToken(ApplicationUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var expires = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:RefreshTokenExpireMinutes"]));
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = issuer,
            Audience = audience,
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        var refreshToken = new RefreshTokenModel { Token = tokenString, Created = DateTime.UtcNow, Expires = expires };

        return refreshToken;
    }

    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        try
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(key),
            };

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Token validation failed: {ex.Message}");
            return null;
        }
    }
}
