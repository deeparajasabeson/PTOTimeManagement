CREATE TABLE [PTO].[Quota]
(
	[Id] UNIQUEIDENTIFIER NOT NULL,
    [Name] NCHAR(30) NULL, 
    [Description] NCHAR(50) NULL, 
    [StartDateTime] DATETIMEOFFSET NOT NULL, 
    [EndDateTime] DATETIMEOFFSET NOT NULL, 
    [OriginalHours] DECIMAL(1) NOT NULL, 
    [RemainingHours] DECIMAL(1) NOT NULL, 
    [TeamId] UNIQUEIDENTIFIER NOT NULL, 	[IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_QuotaId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_TeamQuota FOREIGN KEY ([TeamId]) REFERENCES [Security].[Team] ([Id]),
    CONSTRAINT FK_UserQuota_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User] ([Id]),
    CONSTRAINT FK_UserQuota_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [security].[User]  ([Id])
)
