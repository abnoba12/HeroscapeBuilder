namespace HeroscapeBuilder.Server.Domain.Exceptions
{
    public enum ProfileErrorKind
    {
        Validation,
        NotFound,
    }

    public class ProfileException : Exception
    {
        public ProfileErrorKind Kind { get; }

        public IReadOnlyList<string> Errors { get; }

        public ProfileException(ProfileErrorKind kind, params string[] errors)
            : base(string.Join(" ", errors))
        {
            Kind = kind;
            Errors = errors;
        }
    }
}
