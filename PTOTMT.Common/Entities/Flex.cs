﻿using System;

namespace PTOTMT.Common.Entities
{
    public class Flex
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid FlexTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsForward { get; set; }
        public DateTimeOffset StartDateTime { get; set; }
        public DateTimeOffset EndDateTime { get; set; }
        public decimal Hours { get; set; }
        public Guid CoWorkerId { get; set; }
        public Guid CoWorkerFlexId { get; set; }
        public DateTimeOffset AnotherStartDateTime { get; set; }
        public DateTimeOffset AnotherEndDateTime { get; set; }
        public Guid StatusId { get; set; }
        public bool IsActive { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
    }
}

