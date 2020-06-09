using PTOTMT.Common.Entities;
using System.Threading.Tasks;

namespace PTOTMT.Repository.Abstraction.Web
{
    public interface  IEmailSender
    {
        void SendEmail(EmailMessage message);
    }
}