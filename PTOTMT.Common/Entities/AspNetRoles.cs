using System;
using Microsoft.AspNetCore.Identity;

namespace PTOTMT.Common.Entities
{
    public class AspNetRoles : IdentityRole<Guid>
    {
        public string Description { get; set; }
        public Boolean IsActive { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
    }
}

