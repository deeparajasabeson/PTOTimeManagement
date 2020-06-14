﻿CREATE TABLE [PTO].[Flex]
(
	[Id] UNIQUEIDENTIFIER NOT NULL,
    [FlexId] UNIQUEIDENTIFIER NOT NULL,
    [Name] NCHAR(30) NULL, 
    [Description] NCHAR(50) NULL, 
    [StartDateTime] DATETIMEOFFSET NOT NULL, 
    [EndDateTime] DATETIMEOFFSET NOT NULL, 
    [OriginalHours] DECIMAL(1) NOT NULL, 
    [UserId] UNIQUEIDENTIFIER NOT NULL, 	
    [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_FlexId PRIMARY KEY CLUSTERED ([Id] ASC),
    --CONSTRAINT FK_UserFlex FOREIGN KEY ([FlexId]) REFERENCES [Config].[Flex] ([Id]),
    CONSTRAINT FK_UserFlex_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User] ([Id]),
    CONSTRAINT FK_UserFlex_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [security].[User]  ([Id])
)
