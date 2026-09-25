using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Domain.Requests
{
    public class SetPointSystemRequest
    {
        public PointSystem PointSystem { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string? CurrentPassword { get; set; }

        public string? NewPassword { get; set; }
    }

    public class DeleteAccountRequest
    {
        /// <summary>
        /// Re-entered to confirm the account owner is the one deleting it.
        /// </summary>
        public string? Password { get; set; }
    }
}
