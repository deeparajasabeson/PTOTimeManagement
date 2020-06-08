using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IQuotaRepository : IRepository<Quota>
    {
        bool UpdateRemainingHours(Quota quotaToAllot, decimal hoursToDeduct);
    }
}
