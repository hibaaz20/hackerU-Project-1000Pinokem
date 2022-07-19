namespace API.Entitites
{
    public class AppAdmin
    {
        
        public int Id { get; set; }
        public string UserName { get; set; }  = default!;
     
        public string Email { get; set; }  = default!;

        public byte[] PasswordHash {get;set;} = default!;
        public byte[] PasswordSalt {get;set;} = default!;

        public ICollection<AdminProfilePhoto> AdminProfilePhoto { get; set; } = default!;
        
            
    }
}