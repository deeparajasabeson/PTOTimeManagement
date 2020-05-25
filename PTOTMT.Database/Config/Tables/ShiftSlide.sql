CREATE TABLE Config.[ShiftSlide] (
    [Id]          UNIQUEIDENTIFIER   NOT NULL,
    [TeamFunctionId] UNIQUEIDENTIFIER NOT NULL, 
    [MaxShiftSlideHours] DECIMAL(1, 0) NOT NULL, 
    [ShiftStartTimeLimit] DECIMAL(1, 0) NOT NULL, 
    [ShiftEndTimeLimit] DECIMAL(1, 0) NOT NULL, 
    [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_ShiftSlideId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_TeamShiftSlide FOREIGN KEY ([TeamFunctionId]) REFERENCES [Security].[Team] ([Id]),
    CONSTRAINT FK_UserShiftSlide_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User] ([Id]),
    CONSTRAINT FK_UserShiftSlide_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [security].[User] ([Id])    
);