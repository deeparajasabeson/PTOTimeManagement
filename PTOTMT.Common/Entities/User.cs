using System;

namespace PTOTMT.Common.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string NTLogin { get; set; }
        public string EmailAddress { get; set; }
        public Guid RoleId { get; set; }
        public Guid ReportToUserId { get; set; }
        public Guid LocationId { get; set; }
        public Guid TeamFunctionId { get; set; }
        public bool IsActive { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
    }
}
