using System;

namespace PTOTMT.Common.Models
{
    public class FindQuotaEntity
    {
        public string PTOId { get; set; }
        public DateTimeOffset StartDateTime  { get; set; }
        public DateTimeOffset EndDateTime { get; set; }
        public decimal Hours { get; set; }
    }
}

