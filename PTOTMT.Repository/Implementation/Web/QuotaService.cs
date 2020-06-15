using System.Linq;
using PTOTMT.Repository.Abstraction.Web;
using PTOTMT.Common.Entities;
using System.Collections.Generic;
using System;

namespace PTOTMT.Repository.Implementation.Web
{
    public class QuotaService : IQuotaService
    {
        private readonly IUnitOfWorkWebAPI uow;
        private IEmailSender emailSender;

        public QuotaService(IUnitOfWorkWebAPI _uow, 
                                           IEmailSender _emailSender)
        {
            uow = _uow;
            emailSender = _emailSender;
        }

        public void ReDoAllocate(Quota quotaOld, Quota quota)
        {
            Status cancelled = uow.StatusRepo.GetByName("Cancelled");
            Status approved = uow.StatusRepo.GetByName("Approved");
            Status waitlist = uow.StatusRepo.GetByName("WaitList");

            List<Request> ptoList = uow.RequestRepo
                                                             .GetAll()
                                                             .Where(pto => pto.StatusId != cancelled.Id &&
                                                                                       pto.QuotaId == quotaOld.Id ||
                                                                                       (pto.StartDateTime >= quota.StartDateTime &&
                                                                                             pto.EndDateTime <= quota.EndDateTime &&
                                                                                             pto.QuotaId == null &&
                                                                                             pto.StatusId == waitlist.Id &&
                                                                                             uow.UserRepo.GetById(pto.UserId).TeamFunctionId == quota.TeamId
                                                                                       ))
                                                             .OrderBy(pto => pto.CreatedOn)
                                                             .ToList();
            foreach (Request request in ptoList)
            {
                decimal remaininghours = uow.QuotaRepo.GetById(quota.Id).RemainingHours;
                Guid? statusOld = request.StatusId;
                if (remaininghours >= request.Hours)
                {
                    quota.RemainingHours -= request.Hours;
                    uow.QuotaRepo.Put(quota, quota.Id);
                    request.QuotaId = quota.Id;
                    request.StatusId = approved.Id;
                }
                else
                {
                    request.QuotaId = null;
                    request.StatusId = waitlist.Id;
                }
                uow.RequestRepo.Put(request, request.Id);
                uow.SaveChanges();
                if(statusOld != request.StatusId)
                {
                    SendStatusChangeEmails(statusOld, request, quota);
                }
            }
        }

        public Request AllocateQuota(Request request)
        {
            Quota quotaToAllot = FindQuota(request);
            uow.RequestRepo.Post(request);
            uow.SaveChanges();
            return SendEmails(request, quotaToAllot);
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
