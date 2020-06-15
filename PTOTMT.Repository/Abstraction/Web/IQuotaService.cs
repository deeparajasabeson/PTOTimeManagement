using PTOTMT.Common.Entities;
using System;

namespace PTOTMT.Repository.Abstraction.Web
{
    public interface IQuotaService
    {
        void ReDoAllocate(Quota quotaOld, Quota quota);
        Quota FindQuota(Request request);
        bool UpdateRemainingHours(Quota quotaToAllot, decimal hoursToDeduct);
        Request SendEmails(Request request, Quota quotaToAllot);
        void SendStatusChangeEmails(Guid? statusOld, Request request, Quota quota);
    }
}
