using Microsoft.EntityFrameworkCore.Internal;
using System.Linq;
using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class RequestTypeRepository : Repository<RequestType>, IRequestTypeRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public RequestTypeRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }

        public RequestType GetByName(string name)
        {
            return this._context.RequestType.Where(rt => rt.Name == name).FirstOrDefault();
        }

        public bool ExistsName(string name)
        {
            return this._context.RequestType.Where(entity => entity.Name == name).Any();
        }
    }
}
