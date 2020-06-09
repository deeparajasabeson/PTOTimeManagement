CREATE TABLE [PTO].[Request]
(
	[Id] UNIQUEIDENTIFIER NOT NULL , 
    [UserId] UNIQUEIDENTIFIER NOT NULL, 
    [RequestTypeId] UNIQUEIDENTIFIER NOT NULL, 
    [Description] NVARCHAR(50) NULL, 
    [StartDateTime] DATETIMEOFFSET NOT NULL, 
    [EndDateTime] DATETIMEOFFSET NOT NULL, 
    [Hours] DECIMAL(1, 0) NOT NULL, 
    [StatusId] UNIQUEIDENTIFIER NOT NULL, 
    [QuotaId] UNIQUEIDENTIFIER NULL, 
     [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_RequestId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_UserRequest_UserId FOREIGN KEY ([UserId]) REFERENCES[Security].[User]  ([Id]),
    CONSTRAINT FK_RequestTypeRequest FOREIGN KEY ([RequestTypeId]) REFERENCES [Config].[RequestType] ([Id]),
    CONSTRAINT FK_StatusRequest FOREIGN KEY ([StatusId]) REFERENCES [Config].[Status] ([Id]),
    CONSTRAINT FK_QuotaRequest FOREIGN KEY ([QuotaId]) REFERENCES [PTO].[Quota] ([Id]),
    CONSTRAINT FK_UserRequest_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User]  ([Id]),
    CONSTRAINT FK_UserRequest_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [security].[User] ([Id])
)