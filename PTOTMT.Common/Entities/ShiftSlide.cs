using System;

namespace PTOTMT.Common.Entities
{
    public class ShiftSlide
    {
        public Guid Id { get; set; }
        public Guid TeamFunctionId { get; set; }
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
