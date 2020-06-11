using System.Linq;
using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;
using PTOTMT.Common.ViewModels;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public UserRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }

        public User GetUserDetails(LoginViewModel credentials) 
        {
            return context.User.Where(user => user.UserName == credentials.username && user.Password == credentials.password).SingleOrDefault();
        }
    }
}
