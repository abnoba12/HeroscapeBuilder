using AutoMapper;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Common.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ArmyCard, UnitEntity>()
                .ForMember(dest => dest.Set, opt => opt.MapFrom(src => src.SetNavigation))
                .ForMember(dest => dest.Abilities, opt => opt.MapFrom(src => src.ArmyCardAbilities.ToList()))
                .ForMember(dest => dest.Files, opt => opt.MapFrom(src => src.ArmyCardFiles.ToList()))
                .AfterMap((src, dest) =>
                {
                    TransformCaseHelper.ApplyTransformations(dest);
                });

            CreateMap<ArmyCardAbility, AbilityEntity>()
                .AfterMap((src, dest) =>
                {
                    TransformCaseHelper.ApplyTransformations(dest);
                });

            CreateMap<ArmyCardFile, UnitFileEntity>()
                .ForMember(dest => dest.UnitName, opt => opt.MapFrom(src => src.ArmyCard.Name))
                .ForMember(dest => dest.Thumb, opt => opt.MapFrom(src => src.InverseParentNavigation.FirstOrDefault(x => x.FilePurpose.Contains("Thumb")).FilePath))
                .AfterMap((src, dest) =>
                {
                    TransformCaseHelper.ApplyTransformations(dest);
                });

            CreateMap<Set, SetEntity>();
        }
    }
}
