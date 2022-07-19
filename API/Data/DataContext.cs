using API.Entities;
using API.Entitites;
using Microsoft.EntityFrameworkCore;
namespace API.Data
{
    public class DataContext : DbContext
{
    

    public DataContext(DbContextOptions options) : base(options){}
     
        public DbSet<AppCustomer> Customers { get;set;} = default!;
      
        public DbSet<AppAdmin> Admins { get;set;} = default!;
        public DbSet<AdminProfilePhoto> AdminsPhotos { get;set;} = default!;
        public DbSet<CustomerProfilePhoto> CustomersPhotos { get;set;} = default!;
        public DbSet<ProductPhotos> ProductsPhotos { get;set;} = default!;


        public DbSet<Products> Products { get;set;} = default!;
        public DbSet<ShoppingCart> ShoppingCart { get;set;} = default!;
        public DbSet<Orders> Orders { get;set;} = default!;


        protected override void OnModelCreating(ModelBuilder builder)
        {
             base.OnModelCreating(builder);

            builder.Entity<ShoppingCart>().HasKey(k => new { k.ProductAddedId, k.SourceUserId });
            builder.Entity<Orders>().HasKey(k => new {k.OrderId});


            builder.Entity<ShoppingCart>()
                .HasOne(u => u.SourceUser)
                .WithMany(u => u.ShoppingCart)
                .HasForeignKey(u => u.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            
            builder.Entity<Orders>()
                .HasOne(u => u.Customer)
                .WithMany(u => u.Orders)
                .HasForeignKey(u => u.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);



        }


        
    } 
   
}