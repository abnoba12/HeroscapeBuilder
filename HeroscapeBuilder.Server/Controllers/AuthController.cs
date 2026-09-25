using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]/[action]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly TokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, TokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
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

        return Ok("User registered successfully.");
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var (token, refreshToken) = await _tokenService.IssueTokens(user);
            return Ok(new { token, refreshToken });
        }
        return Unauthorized("Invalid credentials.");
    }

    [HttpPost]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenModel model)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == model.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.Now)
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
