using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Entities;

namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class AbilityEntity
    {
        public int Id { get; set; }

        public int ArmyCardId { get; set; }

        [TransformCase(Case = "Capitalize")]
        public string AbilityName { get; set; }

        public string Ability { get; set; }
    }
}
