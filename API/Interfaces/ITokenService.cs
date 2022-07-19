using API.Entitites;

namespace API.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppCustomer user);
        string CreateToken(AppAdmin admin);

        
    }
}