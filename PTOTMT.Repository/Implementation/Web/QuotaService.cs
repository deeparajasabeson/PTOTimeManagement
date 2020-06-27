using System;
using System.Linq;
using System.Collections.Generic;
using PTOTMT.Repository.Abstraction.Web;
using PTOTMT.Common.Entities;


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
                if (UpdateRemainingHours(quota, request.Hours))
                {
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
                if (statusOld != request.StatusId)
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
            return SendPTOEmails(request, quotaToAllot);
        }

        public Quota FindQuota(Request request)
        {
            return uow.QuotaRepo.GetAll()
                               .Where(quota => quota.StartDateTime <= request.StartDateTime
                                                       && quota.EndDateTime >= request.EndDateTime
                                                       && quota.RemainingHours >= request.Hours)
                               .FirstOrDefault();
        }

        public bool UpdateRemainingHours(Quota quotaToAllot, decimal hoursToDeduct)
        {
            if (quotaToAllot.RemainingHours <= hoursToDeduct)
            {
                quotaToAllot.RemainingHours -= hoursToDeduct;
                uow.QuotaRepo.Put(quotaToAllot, quotaToAllot.Id);
                return true;
            }
            else { return false; }
        }

    public Request SendPTOEmails(Request request, Quota quotaToAllot)
        {
            User user = uow.UserRepo.GetById(request.UserId);
            User leadership = uow.UserRepo.GetById(user.ReportToUserId);

            string msgContent = $" for { request.Hours} hours <br/>from { request.StartDateTime} < br /> to { request.EndDateTime}";
            string emailBody2User = $"Hi {user.FirstName} {user.LastName}, <br/>Your PTO request{msgContent}";
            string emailBody2Leadership = $"Hi {leadership.FirstName} {leadership.LastName},<br/>PTO request submitted by {user.FirstName} {user.LastName} ({user.NTLogin})  of your team {msgContent} ";

            if (quotaToAllot != null && UpdateRemainingHours(quotaToAllot, request.Hours))
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
                msgContent = " is in Waiting List";
            }
            emailBody2User += msgContent;
            emailBody2Leadership += msgContent;
            var message = new EmailMessage(new string[] { user.EmailAddress }, "Email to User who applied PTO", emailBody2User);
            emailSender.SendEmail(message);
            message = new EmailMessage(new string[] { leadership.EmailAddress }, "Email to Leadership of User", emailBody2Leadership);
            emailSender.SendEmail(message);

            return request;
        }

        public void SendStatusChangeEmails(Guid? statusOld, Request request, Quota quotaToAllot)
        {
            User user = uow.UserRepo.GetById(request.UserId);
            User leadership = uow.UserRepo.GetById(user.ReportToUserId);

            string reason = "Due to quota updates, PTO request status is changed";
            string msgContent = $" for { request.Hours} hours <br/>from { request.StartDateTime} < br /> to{ request.EndDateTime}";

            string emailBody2User = $"Hi {user.FirstName} {user.LastName}, <br/>{reason}.<br/><br/>Your PTO request{msgContent}";
            string emailBody2Leadership = $"Hi {leadership.FirstName} {leadership.LastName},<br/>{reason}. <br/><br/>PTO request submitted by {user.FirstName} {user.LastName} ({user.NTLogin})  of your team {msgContent} ";

            Status approved = uow.StatusRepo.GetByName("Approved");
            Status waitlist = uow.StatusRepo.GetByName("WaitList");
            if (request.StatusId == approved.Id && statusOld == waitlist.Id) {
                msgContent = $" is changed from Waiting List status to <b>Approved under quota {quotaToAllot.Name}</b>."; 
            } else if (request.StatusId == waitlist.Id && statusOld == approved.Id) {
                msgContent = " is changed from Approved to <b>Waiting List Status</b>.";
            }
            emailBody2User += msgContent;
            emailBody2Leadership += msgContent;

            var message = new EmailMessage(new string[] { user.EmailAddress }, "Email to User who applied PTO", emailBody2User);
            emailSender.SendEmail(message);
            message = new EmailMessage(new string[] { leadership.EmailAddress }, "Email to Leadership of User", emailBody2Leadership);
            emailSender.SendEmail(message);
        }

        public void SendFlexEmails(Flex flex) {
            User user = uow.UserRepo.GetById(flex.UserId);
            User leadership = uow.UserRepo.GetById(user.ReportToUserId);
            FlexType flexType = uow.FlexTypeRepo.GetById(flex.FlexTypeId);
            string emailBody2User = $"Hi {user.FirstName} {user.LastName}, <br/>Your ";
            string emailBody2Leadership = $"Hi {leadership.FirstName} {leadership.LastName},<br/>Flex request submitted by {user.FirstName} {user.LastName} ({user.NTLogin})  of your team ";

            if (flexType.Name == "Shift Slide" || flexType.Name == "Pre-Arranged Shift Slide") {
                emailBody2User += $"Shift Slide request to move your schedule for { flex.Hours} hours ";
                string msgContent = (flex.IsForward) ? "Forward" : "Backward" + $"<br>from { flex.StartDateTime} < br /> to { flex.EndDateTime} is in Waiting List for your ";
                emailBody2User += msgContent + "Manager's approval.";

                emailBody2Leadership += $" has submitted a Shift Slide request to move schedule for {flex.Hours} hours";
                emailBody2Leadership += msgContent + "approval.";
            }
            else if (flexType.Name == "Shift Swap") {
                User coWorker = uow.UserRepo.GetById(flex.CoWorkerId);
                string email2CoWorker = emailBody2User + $" CoWorker  { user.FirstName } { user.LastName } ({user.NTLogin})  has requested a Shift Swap on { flex.StartDateTime.Date } from { flex.StartDateTime.TimeOfDay } to { flex.EndDateTime.TimeOfDay } with your shift on { flex.StartDateTime.Date} from { flex.AnotherStartDateTime.TimeOfDay } to { flex.AnotherEndDateTime.TimeOfDay }.  This request is waiting for your approval.";
               EmailMessage msg = new EmailMessage(new string[] { coWorker.EmailAddress }, "Email to Co-Worker", email2CoWorker);
                emailSender.SendEmail(msg);

                string msgContent = $"shift < br>on { flex.StartDateTime.Date } from { flex.StartDateTime.TimeOfDay } to { flex.EndDateTime.TimeOfDay } with Co-Worker { coWorker.FirstName } { coWorker.LastName } ({coWorker.NTLogin}) shift on { flex.AnotherStartDateTime.Date} from { flex.AnotherStartDateTime.TimeOfDay } to { flex.AnotherEndDateTime.TimeOfDay }";

                emailBody2User += $"Shift Swap request to move your " + msgContent + "is in Waiting List for the approvals from your Co-Worker and Manager.";
                emailBody2Leadership += $" has submitted a Shift Swap request to move " + msgContent + "is in Waiting List for your approval.";
            }
            else if (flexType.Name == "Self-Shift Swap") {
                string msgContent = $"shift < br> from { flex.StartDateTime.TimeOfDay } to { flex.EndDateTime.TimeOfDay } on { flex.StartDateTime.Date } with shift on { flex.AnotherStartDateTime.Date} ";

                emailBody2User += $"Shift Swap request to move your " + msgContent + "is in Waiting List for your Manager's approval.";
                emailBody2Leadership += $" has submitted a Shift Swap request to move " + msgContent + "is in Waiting List for your approval.";
            }

            var message = new EmailMessage(new string[] { user.EmailAddress }, "Email to User who applied Flex", emailBody2User);
            emailSender.SendEmail(message);
            message = new EmailMessage(new string[] { leadership.EmailAddress }, "Email to Leadership of User", emailBody2Leadership);
            emailSender.SendEmail(message);
        }

        public void SendApproveFlexEmails(Flex flex)
        {
            User user = uow.UserRepo.GetById(flex.UserId);
            User leadership = uow.UserRepo.GetById(user.ReportToUserId);

            string emailBody2User = $"Hi {user.FirstName} {user.LastName}, <br/><br/>Your flex request ";

            string emailBody2Leadership = $"Hi {leadership.FirstName} {leadership.LastName}, <br/><br/>Flex Request submitted by {user.FirstName} {user.LastName} ({user.NTLogin})  of your team";

            string msgContent;
            FlexType flexType = uow.FlexTypeRepo.GetById(flex.FlexTypeId);
            if (flexType.Name == "Shift Slide" || flexType.Name == "Pre-Arranged Shift Slide")
            {
                emailBody2User += $"Shift Slide request to move your schedule for { flex.Hours} hours ";
                msgContent = (flex.IsForward) ? "Forward" : "Backward" + $"<br>from { flex.StartDateTime} < br /> to { flex.EndDateTime} is ";
                    
                emailBody2User += msgContent + "approved by your manager.";
                emailBody2Leadership += $" has submitted a Shift Slide request to move schedule for {flex.Hours} hours" + msgContent + "approved by you.";
            }
            else if (flexType.Name == "Shift Swap")
            {
                User coWorker = uow.UserRepo.GetById(flex.CoWorkerId);
                string email2CoWorker = emailBody2User + $" CoWorker  { user.FirstName } { user.LastName } ({user.NTLogin})  has requested a Shift Swap on { flex.StartDateTime.Date } from { flex.StartDateTime.TimeOfDay } to { flex.EndDateTime.TimeOfDay } with your shift on { flex.StartDateTime.Date} from { flex.AnotherStartDateTime.TimeOfDay } to { flex.AnotherEndDateTime.TimeOfDay }.  This request is waiting for your approval.";
                EmailMessage msg = new EmailMessage(new string[] { coWorker.EmailAddress }, "Email to Co-Worker", email2CoWorker);
                emailSender.SendEmail(msg);

                msgContent = $"shift < br>on { flex.StartDateTime.Date } from { flex.StartDateTime.TimeOfDay } to { flex.EndDateTime.TimeOfDay } with Co-Worker { coWorker.FirstName } { coWorker.LastName } ({coWorker.NTLogin}) shift on { flex.AnotherStartDateTime.Date} from { flex.AnotherStartDateTime.TimeOfDay } to { flex.AnotherEndDateTime.TimeOfDay }";

                emailBody2User += $"Shift Swap request to move your " + msgContent + "is approved by your Manager.";
                emailBody2Leadership += $" has submitted a Shift Swap request to move " + msgContent + "is approved by you.";
            }
            else if (flexType.Name == "Self-Shift Swap")
            {
                msgContent = $"shift < br> from { flex.StartDateTime.TimeOfDay } to { flex.EndDateTime.TimeOfDay } on { flex.StartDateTime.Date } with shift on { flex.AnotherStartDateTime.Date} ";

                emailBody2User += $"Shift Swap request to move your " + msgContent + "is approved by your Manager.";
                emailBody2Leadership += $" has submitted a Shift Swap request to move " + msgContent + "is approved by you.";
            }
            var message = new EmailMessage(new string[] { user.EmailAddress }, "Email to User who applied PTO", emailBody2User);
            emailSender.SendEmail(message);
            message = new EmailMessage(new string[] { leadership.EmailAddress }, "Email to Leadership of User", emailBody2Leadership);
            emailSender.SendEmail(message);
        }

        public void SendEmailsOnCoWorkerChange(Flex coWorkerFlex)
        {
            User user = uow.UserRepo.GetById(coWorkerFlex.CoWorkerId);
            User coWorker = uow.UserRepo.GetById(coWorkerFlex.UserId);
            User leadership = uow.UserRepo.GetById(coWorker.ReportToUserId);

            string msgContent = $"Flex Request submitted by { user.FirstName } { user.LastName } ({ user.NTLogin })  of your team is updated.";

            string emailBody2CoWorker = $"Hi {coWorker.FirstName} {coWorker.LastName}, <br/><br/>Shift Swap " + msgContent + $"Request to swap your shift on  { coWorkerFlex.StartDateTime.Date } from { coWorkerFlex.StartDateTime.TimeOfDay } to { coWorkerFlex.EndDateTime.TimeOfDay } is cancelled.";

            string emailBody2Leadership = $"Hi {leadership.FirstName} {leadership.LastName}, <br/><br/>Shift Swap " + msgContent +  $"<br>Request was submitted earlier for shift < br>on { coWorkerFlex.StartDateTime.Date } from { coWorkerFlex.StartDateTime.TimeOfDay } to { coWorkerFlex.EndDateTime.TimeOfDay } with Co-Worker { coWorker.FirstName } { coWorker.LastName } ({coWorker.NTLogin}) shift on { coWorkerFlex.AnotherStartDateTime.Date} from { coWorkerFlex.AnotherStartDateTime.TimeOfDay } to { coWorkerFlex.AnotherEndDateTime.TimeOfDay }.  Now it is changed request to another Co-worker in the team.";

            EmailMessage msg = new EmailMessage(new string[] { coWorker.EmailAddress }, "Email to Old Co-Worker indicate cancellation", emailBody2CoWorker);
            emailSender.SendEmail(msg);
            msg = new EmailMessage(new string[] { leadership.EmailAddress }, "Email to Leadership indicate change", emailBody2Leadership);
            emailSender.SendEmail(msg);
        }
    }
}
