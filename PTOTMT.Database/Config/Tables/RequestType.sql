﻿CREATE TABLE [Config].[RequestType] (
    [Id]          UNIQUEIDENTIFIER   NOT NULL,
    [Name]        NVARCHAR (30)      NOT NULL,
    [Description] NVARCHAR (50)      NULL,
    [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getdate()) NOT NULL,
    CONSTRAINT PK_ResourceTypeId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_UserResourceType_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User] ([Id]),
    CONSTRAINT FK_UserResourceType_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [security].[User] ([Id])

);


