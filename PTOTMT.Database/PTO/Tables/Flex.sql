﻿CREATE TABLE [PTO].[Flex]
(
	[Id] UNIQUEIDENTIFIER NOT NULL,
    [UserId] UNIQUEIDENTIFIER NOT NULL, 	
    [FlexTypeId] UNIQUEIDENTIFIER NOT NULL,
    [Description] NCHAR(50) NULL, 
    [IsForward] BIT NOT NULL,
    [StartDateTime] DATETIMEOFFSET NOT NULL, 
    [EndDateTime] DATETIMEOFFSET NOT NULL, 
    [Hours] DECIMAL(4,1) NOT NULL, 
    [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getdate()) NOT NULL,
    CONSTRAINT PK_FlexId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_UserFlex FOREIGN KEY ([FlexTypeId]) REFERENCES [Config].[FlexType] ([Id]),
    CONSTRAINT FK_UserFlex_UserId FOREIGN KEY ([UserId]) REFERENCES [security].[User] ([Id]),
    CONSTRAINT FK_UserFlex_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User] ([Id]),
    CONSTRAINT FK_UserFlex_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [security].[User]  ([Id])
)
