using System;

namespace PTOTMT.Common.Entities
{
    public class Quota
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTimeOffset StartDateTime  { get; set; }
        public DateTimeOffset EndDateTime { get; set; }
        public decimal OriginalHours { get; set; }
        public decimal RemainingHours  { get; set; }
        public Guid TeamId { get; set; }
        public bool IsActive { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
    }
}
