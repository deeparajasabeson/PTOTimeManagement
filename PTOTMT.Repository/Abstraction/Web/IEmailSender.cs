using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.Web
{
    public interface  IEmailSender
    {
        void SendEmail(EmailMessage message);
        Flex SendEmails(Flex flex);
    }
}