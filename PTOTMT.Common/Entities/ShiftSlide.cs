using System;

namespace PTOTMT.Common.Entities
{
    public class ShiftSlide
    {
        public Guid Id { get; set; }
        public Guid TeamFunctionId { get; set; }
        public Decimal MaxShiftSlideHours { get; set; }
        public Decimal ShiftStartTimeLimit { get; set; }
        public Decimal ShiftEndTimeLimit { get; set; }
        public Boolean IsActive { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
    }
}
