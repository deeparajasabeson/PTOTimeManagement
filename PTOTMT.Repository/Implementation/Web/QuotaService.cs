using PTOTMT.Repository.Abstraction.Web;
using PTOTMT.Common.Entities;
using System.Linq;

namespace PTOTMT.Repository.Implementation.Web
{
    class QuotaService : IQuotaService
    {
        private readonly IUnitOfWorkWebAPI uow;
        private IEmailSender emailSender;
        public QuotaService(IUnitOfWorkWebAPI _uow, IEmailSender _emailSender)
        {
            uow = _uow;
            emailSender = _emailSender;
        }
        public Quota FindQuota(Request request)
        {
                return uow.QuotaRepo.GetAll()
                                   .Where(quota => quota.StartDateTime <= request.StartDateTime
                                                           && quota.EndDateTime >= request.EndDateTime
                                                           && quota.RemainingHours >= request.Hours)
                                   .FirstOrDefault();
        }

        public Request SendEmails(Request request, Quota quotaToAllot)
        {
            string emailBody = $"Your PTO request for { request.Hours} hours from { request.StartDateTime} to{request.EndDateTime} ";
            if (quotaToAllot != null && uow.QuotaRepo.UpdateRemainingHours(quotaToAllot, request.Hours))
            {
                request.QuotaId = quotaToAllot.Id;
                var approvedStatus = uow.StatusRepo.GetAll().Where(status => status.Name == "Approved").FirstOrDefault();
                request.StatusId = approvedStatus.Id;
                emailBody += $"is approved under quota {quotaToAllot.Name}";
            }
            else
            {
                request.QuotaId = null;
                var waitlistStatus = uow.StatusRepo.GetAll().Where(status => status.Name == "WaitList").FirstOrDefault();
                request.StatusId = waitlistStatus.Id;
                emailBody += "is in Waiting List";
            }
            //SendStatusEmails();
            var message = new EmailMessage(new string[] { "deeparajasabeson@gmail.com" }, "Test email", emailBody);
            emailSender.SendEmail(message);
            return request;
        }
    }
}
