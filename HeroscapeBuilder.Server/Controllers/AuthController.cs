using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Program;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System.Text;

[Route("api/[controller]/[action]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(UserManager<ApplicationUser> userManager, TokenService tokenService, IEmailService emailService,
        IConfiguration configuration, ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _emailService = emailService;
        _configuration = configuration;
        _logger = logger;
    }

    private static string Encode(string token) => WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
    private static string Decode(string token) => Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));

    private string SiteUrl(string path) => $"{(_configuration["App:BaseUrl"] ?? "https://heroscapebuilder.com").TrimEnd('/')}{path}";

    // Mail trouble must never reveal whether an account exists, so failures are logged and the caller still gets the generic reply.
    private async Task TrySendAsync(string to, string subject, string body)
    {
        try { await _emailService.SendAsync(to, subject, body); }
        catch (Exception ex) { _logger.LogError(ex, "Failed to send '{Subject}' email", subject); }
    }

    private async Task SendConfirmationAsync(ApplicationUser user)
    {
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var link = SiteUrl($"/user/confirm-email?userId={Uri.EscapeDataString(user.Id)}&token={Encode(token)}");
        await TrySendAsync(user.Email!, "Confirm your Heroscape Builder account",
            $"<p>Welcome to Heroscape Builder!</p><p><a href=\"{link}\">Confirm your email address</a> to finish creating your account.</p>");
    }

    [HttpPost]
    [EnableRateLimiting(SecurityHardening.RegisterLimiter)]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        // Add the user to the "User" role
        var roleResult = await _userManager.AddToRoleAsync(user, "User");
        if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

        await SendConfirmationAsync(user);
        return Ok("User registered successfully.");
    }

    [HttpPost]
    [EnableRateLimiting(SecurityHardening.RegisterLimiter)]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailModel model)
    {
        var user = await _userManager.FindByIdAsync(model.UserId ?? "");
        if (user == null) return BadRequest("This confirmation link is not valid.");
        try
        {
            var result = await _userManager.ConfirmEmailAsync(user, Decode(model.Token ?? ""));
            if (!result.Succeeded) return BadRequest("This confirmation link is invalid or has expired.");
        }
        catch (FormatException)
        {
            return BadRequest("This confirmation link is not valid.");
        }
        return Ok("Email confirmed.");
    }

    [HttpPost]
    [EnableRateLimiting(SecurityHardening.RegisterLimiter)]
    public async Task<IActionResult> ResendConfirmation([FromBody] EmailModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email ?? "");
        if (user != null && !await _userManager.IsEmailConfirmedAsync(user))
        {
            await SendConfirmationAsync(user);
        }
        return Ok("If that account needs confirming, a new email is on its way.");
    }

    [HttpPost]
    [EnableRateLimiting(SecurityHardening.RegisterLimiter)]
    public async Task<IActionResult> ForgotPassword([FromBody] EmailModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email ?? "");
        if (user != null && await _userManager.IsEmailConfirmedAsync(user))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var link = SiteUrl($"/user/reset-password?email={Uri.EscapeDataString(user.Email!)}&token={Encode(token)}");
            await TrySendAsync(user.Email!, "Reset your Heroscape Builder password",
                $"<p>We received a request to reset your password.</p><p><a href=\"{link}\">Choose a new password</a></p><p>If you didn't ask for this, you can ignore this email.</p>");
        }
        return Ok("If an account exists for that email, a reset link is on its way.");
    }

    [HttpPost]
    [EnableRateLimiting(SecurityHardening.RegisterLimiter)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
    {
        const string invalid = "This reset link is invalid or has expired.";
        var user = await _userManager.FindByEmailAsync(model.Email ?? "");
        if (user == null) return BadRequest(invalid);

        IdentityResult result;
        try
        {
            result = await _userManager.ResetPasswordAsync(user, Decode(model.Token ?? ""), model.Password ?? "");
        }
        catch (FormatException)
        {
            return BadRequest(invalid);
        }
        if (!result.Succeeded) return BadRequest(result.Errors);

        // Sign out anywhere the old password was used.
        user.RefreshToken = string.Empty;
        user.RefreshTokenExpiryTime = null;
        await _userManager.UpdateAsync(user);
        return Ok("Password updated.");
    }

    [HttpPost]
    [EnableRateLimiting(SecurityHardening.LoginLimiter)]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return StatusCode(StatusCodes.Status403Forbidden, "EmailNotConfirmed");
            }
            var (token, refreshToken) = await _tokenService.IssueTokens(user);
            return Ok(new { token, refreshToken });
        }
        return Unauthorized("Invalid credentials.");
    }

    [HttpPost]
    [EnableRateLimiting(SecurityHardening.RefreshLimiter)]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenModel model)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == model.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime == null || user.RefreshTokenExpiryTime <= DateTime.Now)
        {
            return Unauthorized("Invalid or expired refresh token.");
        }

        var (token, refreshToken) = await _tokenService.IssueTokens(user);
        return Ok(new { token, refreshToken });
    }
}

public class RegisterModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class EmailModel
{
    public string? Email { get; set; }
}

public class ConfirmEmailModel
{
    public string? UserId { get; set; }
    public string? Token { get; set; }
}

public class ResetPasswordModel
{
    public string? Email { get; set; }
    public string? Token { get; set; }
    public string? Password { get; set; }
}
