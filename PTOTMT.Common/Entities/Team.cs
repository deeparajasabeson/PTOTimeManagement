using System;

namespace PTOTMT.Common.Entities
{
    public class Team
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool isLeadership { get; set; }
        public decimal MaxShiftSlideHours { get; set; }
        public decimal ShiftStartTimeLimit { get; set; }
        public decimal ShiftEndTimeLimit { get; set; }
        public bool IsActive { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
    }
}
