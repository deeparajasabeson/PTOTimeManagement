using PTOTMT.Common.Entities;
using PTOTMT.Common.ViewModels;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IUserRepository : IRepository<User>
    {
        User GetUserDetails(LoginViewModel credentials);
    }
}