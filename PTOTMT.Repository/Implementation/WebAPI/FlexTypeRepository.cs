using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;
using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class FlexTypeRepository : Repository<FlexType>, IFlexTypeRepository
    { 
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public FlexTypeRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }

        public FlexType GetByName(string name)
        {
            return this._context.FlexType.Where(rt => rt.Name == name).FirstOrDefault();
        }

        public bool ExistsName(string name)
        {
            return this._context.RequestType.Where(entity => entity.Name == name).Any();
        }
    }
}

