using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using API.Entitites;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public static class Seed
    {   
        public static async Task SeedUsers(DataContext context)
        {
            if(await context.Customers.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/Json/UserSeedData.json");

            var users = JsonSerializer.Deserialize<List<AppCustomer>>(userData);

            if(users != null)
            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();
                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("1234"));
                user.PasswordSalt = hmac.Key;
                
                context.Customers.Add(user);
            }
            await context.SaveChangesAsync();
        }


        public static async Task SeedAdmins(DataContext context)
        {
            if(await context.Admins.AnyAsync()) return;

            var adminData = await System.IO.File.ReadAllTextAsync("Data/Json/AdminSeedData.json");

            var admins = JsonSerializer.Deserialize<List<AppAdmin>>(adminData);

            if(admins != null)
            foreach (var admin in admins)
            {
                using var hmac = new HMACSHA512();
                admin.UserName = admin.UserName.ToLower();
                admin.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("1234"));
                admin.PasswordSalt = hmac.Key;
                
                context.Admins.Add(admin);
            }
            await context.SaveChangesAsync();
        }



        
           public static async Task SeedProducts(DataContext context)
        {
            if(await context.Products.AnyAsync()) return;

            var productData = await System.IO.File.ReadAllTextAsync("Data/Json/products.json");

            var products = JsonSerializer.Deserialize<List<Products>>(productData);

            if(products != null)
            foreach (var product in products)
            {                
                context.Products.Add(product);
            }
            await context.SaveChangesAsync();
        }
    }
}