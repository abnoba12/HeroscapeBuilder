using HeroscapeBuilder.Server.Data.Entities;

namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class AbilityEntity
    {
        public int Id { get; set; }

        public int ArmyCardId { get; set; }

        public string AbilityName { get; set; }

        public string Ability { get; set; }
    }
}
