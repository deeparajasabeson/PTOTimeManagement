using System;

namespace PTOTMT.Common.Entities
{
    public class Status
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Boolean IsActive { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
    }
}
