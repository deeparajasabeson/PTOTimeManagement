using System.Linq;
using PTOTMT.Repository.Abstraction.Web;
using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Implementation.Web
{
    class QuotaService : IQuotaService
    {
        private readonly IUnitOfWorkWebAPI uow;
        private IEmailSender emailSender;

        public QuotaService(IUnitOfWorkWebAPI _uow, 
                                           IEmailSender _emailSender)
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
            User user = uow.UserRepo.GetById(request.UserId);
            User leadership = uow.UserRepo.GetById(user.ReportToUserId);

            string msgContent = $" for { request.Hours} hours <br/>from { request.StartDateTime} < br /> to{ request.EndDateTime}";
            string emailBody2User = $"Hi {user.FirstName} {user.LastName}, <br/>Your PTO request{msgContent}";
            string emailBody2Leadership = $"Hi {leadership.FirstName} {leadership.LastName},<br/>PTO request submitted by {user.FirstName} {user.LastName} ({user.NTLogin})  of your team {msgContent} ";
            
            if (quotaToAllot != null && uow.QuotaRepo.UpdateRemainingHours(quotaToAllot, request.Hours))
            {
                request.QuotaId = quotaToAllot.Id;
                var approvedStatus = uow.StatusRepo.GetAll().Where(status => status.Name == "Approved").FirstOrDefault();
                request.StatusId = approvedStatus.Id;
                msgContent = $"is approved under quota {quotaToAllot.Name}";
            }
            else
            {
                request.QuotaId = null;
                var waitlistStatus = uow.StatusRepo.GetAll().Where(status => status.Name == "WaitList").FirstOrDefault();
                request.StatusId = waitlistStatus.Id;
                msgContent = "is in Waiting List";
            }
            emailBody2User += msgContent;
            emailBody2Leadership += msgContent;
            //SendStatusEmails();
            var message = new EmailMessage(new string[] { user.EmailAddress }, "Email to User who applied PTO", emailBody2User);
            emailSender.SendEmail(message);
            message = new EmailMessage(new string[] { leadership.EmailAddress }, "Email to Leadership of User", emailBody2Leadership);
            emailSender.SendEmail(message);

            return request;
        }
    }
}
