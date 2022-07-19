using API.Entitites;

namespace API.Interfaces
{
    public interface IAdminRepository
    {
        void Update(AppAdmin admin);

        Task<bool> SaveAllAsync();

        Task<AppAdmin> GetAdminByUserNameAsync(string username);
        Task<AdminDto> GetAdminDtoAsync(string username);


    }
}