using Microsoft.AspNetCore.Identity;
using System;
using PTOTMT.Common.Entities;

namespace PTOTMT.Web.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Guid TitleId { get; set; }
        public string NTLogin { get; set; }
        public string EmailAddress { get; set; }
        public Guid RoleId { get; set; }
        public Guid ReportToUserId { get; set; }
        public Guid LocationId { get; set; }
        public Guid TeamFunctionId { get; set; }
        public Boolean IsActive { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
    }
}
