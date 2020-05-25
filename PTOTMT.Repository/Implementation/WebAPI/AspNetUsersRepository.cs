using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;
using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class AspNetUsersRepository : Repository<AspNetUsers>, IAspNetUsersRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public AspNetUsersRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }
    }
}

