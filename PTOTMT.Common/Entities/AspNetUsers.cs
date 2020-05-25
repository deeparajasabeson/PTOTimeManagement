using System;
using Microsoft.AspNetCore.Identity;

namespace PTOTMT.Common.Entities
{
    public class AspNetUsers :IdentityUser<Guid>
    {
        //public Guid Id { get; set; }
        //public string UserName { get; set; }
        //public string NormalizedUserName { get; set; }
        //public string Email { get; set; }
        //public string NormalizedEmail { get; set; }
        //public Boolean EmailConfirmed { get; set; }
        //public string PasswordHash { get; set; }
        //public string SecurityStamp { get; set; }
        //public string ConcurrencyStamp { get; set; }
        //public string PhoneNumber { get; set; }
        //public Boolean PhoneNumberConfirmed { get; set; }
        //public Boolean TwoFactorEnabled { get; set; }
        //public DateTimeOffset LockoutEnd { get; set; }
        //public Boolean LockoutEnabled { get; set; }
        //public int AccessFailedCount { get; set; }
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

