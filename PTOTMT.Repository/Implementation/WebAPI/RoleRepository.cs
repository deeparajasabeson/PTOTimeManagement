using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;
using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public RoleRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }

        public bool ExistsName(string name)
        {
            return this._context.Role.Where(entity => entity.Name == name).Any();
        }
    }
}
