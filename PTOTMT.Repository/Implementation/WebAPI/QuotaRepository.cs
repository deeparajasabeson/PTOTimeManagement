using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class QuotaRepository : Repository<Quota>, IQuotaRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public QuotaRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }

        public bool UpdateRemainingHours(Quota quotaToAllot, decimal hoursToDeduct)
        {
            if (quotaToAllot.RemainingHours <= hoursToDeduct)
            {
                quotaToAllot.RemainingHours -= hoursToDeduct;
                 Put(quotaToAllot, quotaToAllot.Id);
                 return true;
            }
            else { return false; }
        }
    }
}
