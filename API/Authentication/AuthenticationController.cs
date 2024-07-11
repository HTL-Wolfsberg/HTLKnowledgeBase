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

    public AuthenticationController(UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
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
        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var roles = await _userManager.GetRolesAsync(user);
            var tokenString = GenerateJwtToken(user, roles);

            var refreshToken = GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);

            await _userManager.UpdateAsync(user);

            return Ok(new { Token = tokenString, RefreshToken = refreshToken.Token });
        }
        return Unauthorized();
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
    {
        var user = await _userManager.Users.Include(u => u.RefreshTokens)
            .SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == request.RefreshToken));

        if (user == null)
            return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);
        var refreshToken = user.RefreshTokens.Single(x => x.Token == request.RefreshToken);

        if (refreshToken.IsExpired)
            return Unauthorized();

        var newJwtToken = GenerateJwtToken(user, roles);
        var newRefreshToken = GenerateRefreshToken();

        refreshToken.Token = newRefreshToken.Token;
        refreshToken.Expires = newRefreshToken.Expires;
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


    private RefreshTokenModel GenerateRefreshToken()
    {
        return new RefreshTokenModel
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            Expires = DateTime.UtcNow.AddDays(7),
            Created = DateTime.UtcNow
        };
    }

}
