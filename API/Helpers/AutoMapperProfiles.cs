using API.DTOs;
using API.DTOs.CustomerDtos;
using API.Entitites;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppCustomer, CustomerDto>()
              .ForMember(
                dest => dest.PhotoUrl,
                opt => {
                    opt.MapFrom(src => src.CustomerProfilePhoto.First(p => p.IsMain).Url);
                }
            );

            CreateMap<Products, ProductDto>()
              .ForMember(
                dest => dest.PhotoUrl,
                opt => {
                    opt.MapFrom(src => src.ProductPhotos.First(p => p.isMain).Url);
                }
            ); 
         
            CreateMap<AppAdmin, AdminDto>() 
            .ForMember(
                dest => dest.PhotoUrl,
                opt => {
                    opt.MapFrom(src => src.AdminProfilePhoto.First(p => p.IsMain).Url);
                }
            );
;
            
            CreateMap<RegisterDto, AppCustomer>()
            .ForMember(
                dest => dest.UserName,
                opt => {
                    opt.MapFrom(src => src.Username.ToLower());
                }
            );

            CreateMap<RegisterAdminDto, AppAdmin>()
            .ForMember(
                dest => dest.UserName,
                opt => {
                    opt.MapFrom(src => src.UserName.ToLower());
                }
            );


            CreateMap<CustomerProfilePhoto, PhotoDto>();
            CreateMap<ProductPhotos, PhotoDto>();
            CreateMap<AdminProfilePhoto, PhotoDto>();
            CreateMap<CustomerUpdateDTO, AppCustomer>();  
            CreateMap<ProductUpdateDTO, Products>();  
            CreateMap<Orders, OrderDto>();  
            CreateMap<AppCustomer, UserDto>();


            CreateMap<AdminUpdateDTO, AppAdmin>();  

          






        }
        
    }
}