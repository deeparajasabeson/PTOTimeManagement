using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;
using System.Linq;

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

        public User GetUserDetails(string userName, string password) 
        {
            return context.User.Where(user => user.UserName == userName && user.Password == password).FirstOrDefault();
        }
    }
}
