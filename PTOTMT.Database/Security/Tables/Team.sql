﻿CREATE TABLE [Security].[Team] (
    [Id]          UNIQUEIDENTIFIER   NOT NULL,
    [Name]        NVARCHAR (30)      NOT NULL,
    [Description] NVARCHAR (50)      NULL,
    [IsLeadership] BIT                NOT NULL,
    [MaxShiftSlideHours] DECIMAL(1,0) NOT NULL, 
    [ShiftStartTimeLimit] DECIMAL(4, 2) NOT NULL, 
    [ShiftEndTimeLimit] DECIMAL(4, 2) NOT NULL, 
    [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getdate()) NOT NULL,
    CONSTRAINT PK_TeamId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_UserTeam_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User]  ([Id]),
    CONSTRAINT FK_UserTeam_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [security].[User]  ([Id])
);

