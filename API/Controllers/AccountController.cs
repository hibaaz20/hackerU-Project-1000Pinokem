using System.Security.Cryptography;
using API.Data;
using API.DTOs;
using API.Entitites;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
           using var hmac = new HMACSHA512();

            if(await UserExists(registerDto.Username) || await AdminExists(registerDto.Username)) return BadRequest("Username already exists");
            if(await EmailExists(registerDto.Email) || await AdminEmailExists(registerDto.Email)) return BadRequest("Email already exists");
            
            var user = _mapper.Map<AppCustomer>(registerDto);

            user.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;
            
            _context.Customers.Add(user);

            await _context.SaveChangesAsync();

            
           return new UserDto
            {
                UserName = registerDto.Username.ToLower(),
                Token = _tokenService.CreateToken(user),
                Email = registerDto.Email,
                City = registerDto.City
                
            };

           
        }



        [HttpPost("adminRegister")]
        public async Task<ActionResult<AdminDto>> AdminRegister(RegisterAdminDto registerAdminDto)
        {
           using var hmac = new HMACSHA512();

            if(await AdminExists(registerAdminDto.UserName) || await UserExists(registerAdminDto.UserName)) return BadRequest("Username already exists");
            if(await AdminEmailExists(registerAdminDto.Email)) return BadRequest("Email already exists");
        
         
            var admin = _mapper.Map<AppAdmin>(registerAdminDto);

            admin.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerAdminDto.Password));
            admin.PasswordSalt = hmac.Key;
        
           
            _context.Admins.Add(admin);
            
            await _context.SaveChangesAsync();
           
           
            return new AdminDto
            {
                UserName = registerAdminDto.UserName.ToLower(),
                Token = _tokenService.CreateToken(admin),
                Email = registerAdminDto.Email,

            };

        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto loginDto)
        {
            var user = await this._context.Customers.Include(x => x.CustomerProfilePhoto).SingleOrDefaultAsync(x=> x.UserName == loginDto.UserName.ToLower());
           if(user == null) return Unauthorized("Invalid username");
           
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));

            for (var i = 0; i < computedHash.Length; i++)
            {
                if(computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            return new UserDto
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
                Email = user.Email,
                City = user.City
            };
       
        }



        [HttpPost("adminLogin")]
        public async Task<ActionResult<AdminDto>> AdminLogin(AdminLoginDto loginDto)
        {
            var admin = await this._context.Admins.Include(x => x.AdminProfilePhoto).SingleOrDefaultAsync(x=> x.UserName == loginDto.UserName.ToLower());
            if(admin == null) return  Unauthorized("Invalid username");
        
            using var hmac = new HMACSHA512(admin.PasswordSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));

            for (var i = 0; i < computedHash.Length; i++)
            {
                if(computedHash[i] != admin.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            return new AdminDto
            {
                UserName = admin.UserName,
                Token = _tokenService.CreateToken(admin),
                Email = admin.Email

            };
        }
        
        
        private async Task<bool> UserExists(string username)
        {
            return await _context.Customers.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }

        private async Task<bool> AdminExists(string username)
        {
            return await _context.Admins.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }
        
        private async Task<bool> EmailExists(string email)
        {
            return await _context.Customers.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }
        private async Task<bool> AdminEmailExists(string email)
        {
            return await _context.Admins.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }
       
    }

}