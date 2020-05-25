using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class RequestRepository : Repository<Request>, IRequestRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public RequestRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }
    }
}
