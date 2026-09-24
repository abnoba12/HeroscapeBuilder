using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Domain.Shop;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

[Route("api/[controller]/[action]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly EmailSender _emailSender;
    private readonly ShopSettings _siteSettings;
    private readonly ILogger<AuthController> _logger;

    public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration, EmailSender emailSender, ShopSettings siteSettings, ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _configuration = configuration;
        _emailSender = emailSender;
        _siteSettings = siteSettings;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        // Add the user to the "User" role
        var roleResult = await _userManager.AddToRoleAsync(user, "User");
        if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

        // The account exists either way; if the email fails the user can ask for it again from the login page.
        var emailSent = await SendVerificationEmail(user);

        return Ok(new { emailSent });
    }

    [HttpPost]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailModel model)
    {
        var user = string.IsNullOrEmpty(model.UserId) ? null : await _userManager.FindByIdAsync(model.UserId);
        if (user == null || string.IsNullOrEmpty(model.Token)) return BadRequest("This verification link is invalid.");
        if (user.EmailConfirmed) return Ok();

        string token;
        try
        {
            token = System.Text.Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
        }
        catch (FormatException)
        {
            return BadRequest("This verification link is invalid.");
        }

        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (!result.Succeeded) return BadRequest("This verification link is invalid or has expired. Request a new one from the login page.");

        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationModel model)
    {
        // Always answers the same way so the endpoint can't be used to find out which emails have accounts.
        var user = string.IsNullOrEmpty(model.Email) ? null : await _userManager.FindByEmailAsync(model.Email);
        if (user != null && !user.EmailConfirmed)
        {
            await SendVerificationEmail(user);
        }
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            if (!user.EmailConfirmed)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { code = "EmailNotConfirmed", message = "Please verify your email address before logging in." });
            }

            var roles = await _userManager.GetRolesAsync(user);

            // Generate JWT and Refresh Token
            var token = GenerateJwtToken(user, roles);
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);

            await _userManager.UpdateAsync(user);

            return Ok(new { token, refreshToken });
        }
        return Unauthorized("Invalid credentials.");
    }

    [HttpPost]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenModel model)
    {
        if (string.IsNullOrEmpty(model.RefreshToken)) return Unauthorized("Invalid or expired refresh token.");

        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == model.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime == null || user.RefreshTokenExpiryTime <= DateTime.Now)
        {
            return Unauthorized("Invalid or expired refresh token.");
        }

        // Generate new JWT and Refresh Token
        var roles = await _userManager.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
        await _userManager.UpdateAsync(user);

        return Ok(new { token, refreshToken });
    }



    private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        claims.AddRange(roles.Select(role => new Claim("roles", role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetConfigValue("HeroscapeBuilder", "Jwt:Key")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Emails the user a link to /user/verify-email. Returns false (and logs) if it couldn't be sent.
    /// </summary>
    private async Task<bool> SendVerificationEmail(ApplicationUser user)
    {
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        var link = $"{_siteSettings.SiteUrl}/user/verify-email?userId={Uri.EscapeDataString(user.Id)}&token={encodedToken}";

        if (!_emailSender.CanSend)
        {
            _logger.LogWarning("Email is not configured, so no verification email was sent to {Email}. Verification link: {Link}", user.Email, link);
            return false;
        }

        try
        {
            await _emailSender.Send(user.Email!, "Heroscape Builder", "Verify your Heroscape Builder account",
                $"Welcome to Heroscape Builder!\n\nPlease verify your email address by opening this link:\n\n{link}\n\nThe link expires in 24 hours. If you didn't create an account, you can ignore this email.");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send the verification email to {Email}", user.Email);
            return false;
        }
    }

    private string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        return Convert.ToBase64String(randomBytes);
    }

}

public class RegisterModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class ConfirmEmailModel
{
    public string UserId { get; set; }
    public string Token { get; set; }
}

public class ResendVerificationModel
{
    public string Email { get; set; }
}

public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}
