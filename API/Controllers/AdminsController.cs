using API.DTOs;
using API.DTOs.CustomerDtos;
using API.Entitites;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class AdminsController : BaseApiController
    {
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;
        private readonly IAdminRepository _adminRepository;
        public AdminsController(IMapper mapper, IAdminRepository adminRepository, IPhotoService photoService)
        {
            _photoService = photoService;
            _adminRepository = adminRepository;
            _mapper = mapper;

        }



        [HttpGet("{username}")]
        public async Task<ActionResult<AdminDto>> getAdmin(string username)
        {
            var adminToReturn = await _adminRepository.GetAdminDtoAsync(username);
            return adminToReturn;

        }



        [HttpPost("{username}/add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file, string username)
        {

            var CurrentUser = username;
            var user = await _adminRepository.GetAdminByUserNameAsync(username);


            var result = await _photoService.UploadPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new AdminProfilePhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                IsMain = true

            };

            user.AdminProfilePhoto.Clear();
            user?.AdminProfilePhoto?.Add(photo);


            if (await _adminRepository.SaveAllAsync())
            {
                return _mapper.Map<PhotoDto>(photo);
            }

            return BadRequest("Problem adding Photos");
        }


        [HttpPut("{username}")]
        public async Task<ActionResult> UpdateUser(string username, AdminUpdateDTO customerUpdateDTO)
        {
            var currentUser = username;

            var user = await _adminRepository.GetAdminByUserNameAsync(username);

            _mapper.Map(customerUpdateDTO, user);

            _adminRepository.Update(user);
            

            if (await _adminRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to update user");
        }


        [HttpDelete("{username}/delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(string username, int photoId)
        {
            var Currentuser = username;
            var user = await _adminRepository.GetAdminByUserNameAsync(username);
            var photo = user.AdminProfilePhoto.Single(p => p.Id == photoId);

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.AdminProfilePhoto.Clear();


            if (await _adminRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete photo");
        }
    }
}
