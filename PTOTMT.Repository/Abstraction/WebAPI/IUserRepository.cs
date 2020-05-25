using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IUserRepository : IRepository<User>
    {
        User GetUserDetails(string userName, string password);
    }
}