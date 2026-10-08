namespace HeroscapeBuilder.Server.Domain.Exceptions
{
    public class MapException : Exception
    {
        public IReadOnlyList<string> Errors { get; }

        public MapException(params string[] errors)
            : base(string.Join(" ", errors))
        {
            Errors = errors;
        }
    }
}
