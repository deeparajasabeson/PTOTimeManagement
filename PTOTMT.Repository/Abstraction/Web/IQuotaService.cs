using PTOTMT.Common.Entities;
using System;

namespace PTOTMT.Repository.Abstraction.Web
{
    public interface IQuotaService
    {
        void ReDoAllocate(Quota quotaOld, Quota quota);
        Quota FindQuota(Request request);
        bool UpdateRemainingHours(Quota quotaToAllot, decimal hoursToDeduct);
        void SendStatusChangeEmails(Guid? statusOld, Request request, Quota quota);
        Request SendPTOEmails(Request request, Quota quotaToAllot);
        void SendFlexEmails(Flex flex);
        void SendApproveFlexEmails(Flex flex);
        void SendEmailsOnCoWorkerChange(Flex coWorkerFlex);
    }
}
