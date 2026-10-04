namespace HeroscapeBuilder.Server.Domain.Exceptions
{
    public class PowerRankingException : Exception
    {
        public bool TooManyRequests { get; }

        public PowerRankingException(string message, bool tooManyRequests = false) : base(message)
        {
            TooManyRequests = tooManyRequests;
        }
    }
}
