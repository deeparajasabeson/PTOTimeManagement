using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;
using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class TeamRepository : Repository<Team>, ITeamRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public TeamRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }

        public bool ExistsName(string name)
        {
            return this._context.Team.Where(entity => entity.Name == name).Any();
        }
    }
}
