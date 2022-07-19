using API.DTOs;
using API.DTOs.CustomerDtos;
using API.Entitites;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(ICustomerRepository customerRepository, IMapper mapper, IPhotoService photoService)
        {
           
            _mapper = mapper;
            _customerRepository = customerRepository;
            _photoService = photoService;
        }

        [HttpPut("{username}")]
        public async Task<ActionResult> UpdateUser(string username,CustomerUpdateDTO customerUpdateDTO)
        {
            var currentUser = username;

            var user = await _customerRepository.GetUserByUserNameAsync(username);

            _mapper.Map(customerUpdateDTO, user);

            _customerRepository.Update(user);
            

            if (await _customerRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to update user");
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> getUsers([FromQuery] UserParams userParams)
        {
              var users = await _customerRepository.GetCustomersAsync(userParams);
                Response.AddPaginationHeader(
                users.CurrentPage,
                users.PageSize,
                users.TotalCount,
                users.TotalPages
            );
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<CustomerDto>> getUser(string username)
        {
            var customerToReturn = await _customerRepository.GetCustomerDtoAsync(username);
            return customerToReturn;

        }

        [HttpPost("{username}/add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file, string username)
        {
            
            var CurrentUser = username;
            var user = await _customerRepository.GetUserByUserNameAsync(username);

  
            var result = await _photoService.UploadPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new CustomerProfilePhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                IsMain = true
         
            };

            user.CustomerProfilePhoto.Clear();           
            user?.CustomerProfilePhoto?.Add(photo);
          

            if (await _customerRepository.SaveAllAsync())
            {
                 return _mapper.Map<PhotoDto>(photo);
            }

            return BadRequest("Problem adding Photos");
        }


 
        [HttpGet("search/{input}")]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> getSearchedCustomers([FromQuery] UserParams userPrams, string input)
        {  
           var customers = await _customerRepository.getSearchedCustomers(userPrams, input);
                Response.AddPaginationHeader(
                customers.CurrentPage,
                customers.PageSize,
                customers.TotalCount,
                customers.TotalPages
            );
            return Ok(customers);
        }


        [HttpDelete("{username}/delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(string username, int photoId)
        {
            var Currentuser = username;
            var user = await _customerRepository.GetUserByUserNameAsync(username);
            var photo = user.CustomerProfilePhoto.Single(p => p.Id == photoId);

           if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
               
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.CustomerProfilePhoto.Clear();           


            if (await _customerRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete photo");
        }
   
   
        [HttpDelete("delete-account/{username}")]
        public async Task<ActionResult> DeleteAccount(string username)
        {

            var user = await _customerRepository.GetUserByUserNameAsync(username);
          
            
            if(user == null) return NotFound();
            
            foreach(var photo in user.CustomerProfilePhoto){
            
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Error != null) return BadRequest(result.Error.Message);
            };
            }
          

            _customerRepository.Delete(user);


            if (await _customerRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete account");
        }
    }
}
