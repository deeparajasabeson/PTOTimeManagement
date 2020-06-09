using System;

namespace PTOTMT.Common.Entities
{
    public class Request
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid RequestTypeId { get; set; }
        public string Description { get; set; }
        public DateTimeOffset StartDateTime { get; set; }
        public DateTimeOffset EndDateTime { get; set; }
        public decimal Hours { get; set; }
        public Guid? StatusId { get; set; }
        public Guid? QuotaId { get; set; }
        public bool IsActive { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
    }
}
