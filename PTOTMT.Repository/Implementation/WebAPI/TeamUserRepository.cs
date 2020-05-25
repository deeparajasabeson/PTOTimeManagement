using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class TeamUserRepository : Repository<TeamUser>, ITeamUserRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public TeamUserRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }
    }
}
