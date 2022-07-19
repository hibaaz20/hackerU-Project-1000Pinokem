using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
       public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) 
       {
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IAdminRepository, AdminRepository>();
            services.AddScoped<IOrdersRepository, OrdersRepository>();
            services.AddScoped<IPhotoService, PhotoService>();
            
            
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            
            services.AddDbContext<DataContext>(optios =>
                optios.UseSqlite(config.GetConnectionString("DefaultConnection"))
            );

            return services;
       }
    }
}