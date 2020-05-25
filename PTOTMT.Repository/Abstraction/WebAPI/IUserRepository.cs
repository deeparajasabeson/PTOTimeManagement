using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IUserRepository : IRepository<User>
    {
        User GetUser(string userName, string password);
    }
}