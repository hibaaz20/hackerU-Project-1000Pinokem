using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Entitites
{
    public class AppCustomer
    {
        public int Id { get; set; }
        public string UserName { get; set; }  = default!;

        public byte[] PasswordHash {get;set;} = default!;
        public byte[] PasswordSalt {get;set;} = default!;

        public string City { get; set; } = default!;
        public string Email { get; set; }  = default!;
        
        public ICollection<CustomerProfilePhoto> CustomerProfilePhoto { get; set; } = default!;
        
        public ICollection<ShoppingCart> ShoppingCart { get; set; } = default!; 

        public ICollection<Orders> Orders {get; set;} = default!; 

        
    }
}