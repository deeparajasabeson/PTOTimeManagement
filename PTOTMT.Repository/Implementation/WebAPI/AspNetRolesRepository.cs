using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;
using PTOTMT.Repository.Abstraction.WebAPI;
using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class AspNetRolesRepository : Repository<AspNetRoles>, IAspNetRolesRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public AspNetRolesRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }

        public bool ExistsName(string name)
        {
            return this._context.AspNetRoles.Where(entity => entity.Name == name).Any();
        }
    }
}

