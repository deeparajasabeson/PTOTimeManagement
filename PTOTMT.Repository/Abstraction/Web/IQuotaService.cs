using PTOTMT.Common.Entities;


namespace PTOTMT.Repository.Abstraction.Web
{
    public interface IQuotaService
    {
        Quota FindQuota(Request request);
        Request SendEmails(Request request, Quota quotaToAllot);
    }
}
