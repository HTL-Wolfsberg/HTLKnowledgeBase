using API.ApplicationUser;
using API.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
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

        var decryptedPassword = DecryptPassword(model.Password);

        var user = new ApplicationUser { UserName = model.Name, Email = model.Email };
        var result = await _userManager.CreateAsync(user, decryptedPassword);

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

        var decryptedPassword = DecryptPassword(model.Password);

        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user != null && await _userManager.CheckPasswordAsync(user, decryptedPassword))
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

    [HttpGet("login-google")]
    public IActionResult GoogleLogin()
    {
        var properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", "/api/authentication/google-response");
        return Challenge(properties, "Google");
    }

    [HttpGet("google-response")]
    public async Task<IActionResult> GoogleResponse()
    {
        var result = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);
        if (!result.Succeeded)
        {
            return BadRequest("External authentication error");
        }

        var externalClaims = result.Principal.Claims.ToList();
        var emailClaim = externalClaims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
        if (emailClaim == null )
        {
            return BadRequest("Email or name claim not found");
        }

        var email = emailClaim.Value;

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new ApplicationUser { UserName = email, Email = email };
            var identityResult = await _userManager.CreateAsync(user);
            if (!identityResult.Succeeded)
            {
                return BadRequest(identityResult.Errors);
            }
        }

        var roles = await _userManager.GetRolesAsync(user);
        var tokenString = GenerateJwtToken(user, roles);

        var refreshToken = GenerateRefreshJwtToken(user);
        user.RefreshTokens.Add(new RefreshTokenModel { Token = refreshToken.Token, Created = DateTime.UtcNow, Expires = refreshToken.Expires });

        user.RefreshTokens.RemoveAll(r => r.IsExpired);

        await _userManager.UpdateAsync(user);

        await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

        // Redirect to the Angular application with tokens
        var redirectUrl = $"http://localhost:4200/auth/callback?token={tokenString}&refreshToken={refreshToken.Token}";
        return Redirect(redirectUrl);
    }

    [HttpGet("login-microsoft")]
    public IActionResult MicrosoftLogin()
    {
        var properties = _signInManager.ConfigureExternalAuthenticationProperties("Microsoft", "/api/authentication/microsoft-response");
        return Challenge(properties, "Microsoft");
    }

    [HttpGet("microsoft-response")]
    public async Task<IActionResult> MicrosoftResponse()
    {
        var result = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);
        if (!result.Succeeded)
        {
            return BadRequest("External authentication error");
        }

        var externalClaims = result.Principal.Claims.ToList();
        var emailClaim = externalClaims.FirstOrDefault(c => c.Type == ClaimTypes.Email);

        if (emailClaim == null)
        {
            return BadRequest("Email or name claim not found");
        }

        var email = emailClaim.Value;

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new ApplicationUser { UserName = email, Email = email };
            var identityResult = await _userManager.CreateAsync(user);
            if (!identityResult.Succeeded)
            {
                return BadRequest(identityResult.Errors);
            }
        }

        var roles = await _userManager.GetRolesAsync(user);
        var tokenString = GenerateJwtToken(user, roles);

        var refreshToken = GenerateRefreshJwtToken(user);
        user.RefreshTokens.Add(new RefreshTokenModel { Token = refreshToken.Token, Created = DateTime.UtcNow, Expires = refreshToken.Expires });

        user.RefreshTokens.RemoveAll(r => r.IsExpired);

        await _userManager.UpdateAsync(user);

        await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

        // Redirect to the Angular application with tokens
        var redirectUrl = $"http://localhost:4200/auth/callback?token={tokenString}&refreshToken={refreshToken.Token}";
        return Redirect(redirectUrl);
    }

    private string GenerateValidUsername(string name)
    {
        // Replace spaces with underscores and remove invalid characters
        var username = new string(name.Where(char.IsLetterOrDigit).ToArray());
        return username;
    }




    private string DecryptPassword(string encryptedPassword)
    {
        using var aes = Aes.Create();
        var key = Encoding.UTF8.GetBytes("your-encryption-key-32bytes12345");
        var iv = Encoding.UTF8.GetBytes("yourIvKey16bytes");

        aes.Key = key;
        aes.IV = iv;
        aes.Padding = PaddingMode.PKCS7;
        aes.Mode = CipherMode.CBC;

        var encryptedBytes = Convert.FromBase64String(encryptedPassword);

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using var msDecrypt = new MemoryStream(encryptedBytes);
        using var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
        using var srDecrypt = new StreamReader(csDecrypt);
        var decryptedPassword = srDecrypt.ReadToEnd();

        return decryptedPassword;
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
