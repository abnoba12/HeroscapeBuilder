using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Services
{
    public class ProfileService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly UserCardRepository _userCardRepository;
        private readonly TokenService _tokenService;
        private readonly HsbDbContext _context;

        public ProfileService(UserManager<ApplicationUser> userManager, UserCardRepository userCardRepository, TokenService tokenService, HsbDbContext context)
        {
            _userManager = userManager;
            _userCardRepository = userCardRepository;
            _tokenService = tokenService;
            _context = context;
        }

        public async Task<ProfileEntity> GetProfile(Guid userId)
        {
            return ToProfile(await FindUser(userId));
        }

        public async Task<ProfileEntity> SetPointSystem(Guid userId, SetPointSystemRequest request)
        {
            if (!Enum.IsDefined(request.PointSystem))
            {
                throw new ProfileException(ProfileErrorKind.Validation, $"\"{request.PointSystem}\" is not a known point system.");
            }

            var user = await FindUser(userId);
            user.PointSystem = request.PointSystem;
            ThrowIfFailed(await _userManager.UpdateAsync(user));

            return ToProfile(user);
        }

        /// <summary>
        /// Changes the password and returns fresh tokens for this session. Rotating the refresh token
        /// signs out any other device once its current access token expires.
        /// </summary>
        public async Task<(string Token, string RefreshToken)> ChangePassword(Guid userId, ChangePasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.CurrentPassword) || string.IsNullOrEmpty(request.NewPassword))
            {
                throw new ProfileException(ProfileErrorKind.Validation, "Enter your current password and a new password.");
            }

            var user = await FindUser(userId);
            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!result.Succeeded && result.Errors.Any(error => error.Code == nameof(IdentityErrorDescriber.PasswordMismatch)))
            {
                throw new ProfileException(ProfileErrorKind.Validation, "Your current password is incorrect.");
            }
            ThrowIfFailed(result);

            return await _tokenService.IssueTokens(user);
        }

        /// <summary>
        /// Permanently deletes the account along with its My Army and Battlegroups.
        /// </summary>
        public async Task DeleteAccount(Guid userId, DeleteAccountRequest request)
        {
            var user = await FindUser(userId);
            if (string.IsNullOrEmpty(request.Password) || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                throw new ProfileException(ProfileErrorKind.Validation, "Your password is incorrect.");
            }

            // Battlegroups (and their units) cascade in the database; My Army does not, so it is cleared first.
            // The context retries transient failures, so the transaction has to run inside its execution strategy.
            await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();
                await _userCardRepository.RemoveAllForUser(user.Id);
                ThrowIfFailed(await _userManager.DeleteAsync(user));
                await transaction.CommitAsync();
            });
        }

        private async Task<ApplicationUser> FindUser(Guid userId)
        {
            return await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new ProfileException(ProfileErrorKind.NotFound, "Account not found.");
        }

        private static ProfileEntity ToProfile(ApplicationUser user)
        {
            return new ProfileEntity
            {
                Email = user.Email ?? string.Empty,
                PointSystem = user.PointSystem,
            };
        }

        private static void ThrowIfFailed(IdentityResult result)
        {
            if (!result.Succeeded)
            {
                throw new ProfileException(ProfileErrorKind.Validation, result.Errors.Select(error => error.Description).ToArray());
            }
        }
    }
}
