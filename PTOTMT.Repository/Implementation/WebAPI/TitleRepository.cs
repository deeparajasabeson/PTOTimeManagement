using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;
using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class TitleRepository : Repository<Title>, ITitleRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public TitleRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }

        public bool ExistsName(string name)
        {
            return this._context.Title.Where(entity => entity.Name == name).Any();
        }
    }
}
