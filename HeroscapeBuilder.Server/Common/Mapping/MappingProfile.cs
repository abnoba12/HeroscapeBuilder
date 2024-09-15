using AutoMapper;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Integrations.SupabaseIntegration.DTO;

namespace HeroscapeBuilder.Server.Common.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ArmyCard, UnitEntity>()
                .ForMember(dest => dest.Set, opt => opt.MapFrom(src => src.SetNavigation))
                .ForMember(dest => dest.Abilities, opt => opt.MapFrom(src => src.ArmyCardAbilities.ToList()))
                .ForMember(dest => dest.Files, opt => opt.MapFrom(src => src.ArmyCardFiles.ToList()));

            CreateMap<ArmyCardFile, UnitFileEntity>()
                .ForMember(dest => dest.Thumb, opt => opt.MapFrom(src => src.Children.FirstOrDefault(x => x.FilePurpose.Contains("Thumb")).FilePath));

            CreateMap<Supabase.Storage.FileObject, SupabaseFileDTO>();

            CreateMap<Set, SetEntity>();
        }
    }
}
