using HeroscapeBuilder.Server.Common.Helpers;

namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class UnitFileEntity
    {
        public long Id { get; set; }

        public int ArmyCardId { get; set; }

        public string? UnitName { get; set; }

        public string FilePurpose { get; set; } = null!;

        public string RawFilePath { get; set; }
        public string FilePath
        {
            get => RawFilePath.PrependFilePath();
            set => RawFilePath = value;
        }

        public string RawThumbPath { get; set; } = null;
        public string Thumb
        {
            get => RawThumbPath.PrependFilePath();
            set => RawThumbPath = value;
        }


        public DateTime CreatedAt { get; set; }
    }
}
