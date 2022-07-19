using API.Entitites;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class AdminRepository : IAdminRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AdminRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        
        public void addAdmin(AppAdmin admin)
        {
            _context.Admins.Add(admin);
        }


        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppAdmin admin)
        {
            _context.Entry<AppAdmin>(admin).State = EntityState.Modified;

        }

        public async Task<AppAdmin> GetAdminEmail(string email)
        {
             return await _context.Admins
            .SingleOrDefaultAsync(x => x.Email == email);   
        }

        public async Task<AppAdmin> GetAdminByUserNameAsync(string username)
        {
            return await _context.Admins
            .Include(x => x.AdminProfilePhoto)
            .SingleOrDefaultAsync(x => x.UserName == username);        
        }

        public async Task<AdminDto> GetAdminDtoAsync(string username)
        {
            return await _context.Admins
           .Where(x => x.UserName == username)
           .ProjectTo<AdminDto>(_mapper.ConfigurationProvider)
           .SingleOrDefaultAsync();
        }

      
    }
}