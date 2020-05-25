CREATE TABLE [Security].[User] (
    [Id]             UNIQUEIDENTIFIER   NOT NULL,
    [FirstName]      NVARCHAR (30)      NOT NULL,
    [LastName]       NVARCHAR (30)      NOT NULL,
    [UserName]      NVARCHAR(50)  NOT NULL,
    [Password]       NVARCHAR(30)  NOT NULL,
    [TitleId]        UNIQUEIDENTIFIER   NOT NULL,
    [NTLogin]        NVARCHAR (12)      NOT NULL,
    [EmailAddress]   NVARCHAR (50)      NOT NULL,
    [RoleId]         UNIQUEIDENTIFIER   NOT NULL,
    [ReportToUserId] UNIQUEIDENTIFIER   NOT NULL,
    [LocationId]     UNIQUEIDENTIFIER   NOT NULL,
    [TeamFunctionId] UNIQUEIDENTIFIER   NOT NULL,
    [IsActive]       BIT                NOT NULL,
    [CreatedBy]      UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]      DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]      UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]      DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_UserId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_LocationUser FOREIGN KEY ([LocationId]) REFERENCES [Config].[Location] ([Id]),
    CONSTRAINT FK_UserUser_ReportToUserId FOREIGN KEY ([ReportToUserId]) REFERENCES [security].[User]  ([Id]),
    CONSTRAINT FK_RoleUser FOREIGN KEY ([RoleId]) REFERENCES [Security].[Role] ([Id]),
    CONSTRAINT FK_TeamUser FOREIGN KEY ([TeamFunctionId]) REFERENCES [Security].[Team] ([Id]),
    CONSTRAINT FK_TitleUser FOREIGN KEY ([TitleId]) REFERENCES [Security].[Title] ([Id]),
    CONSTRAINT FK_UserUser_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User]  ([Id]),
    CONSTRAINT FK_UserUser_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES[security].[User]  ([Id])
);


GO
CREATE NONCLUSTERED INDEX [idx_userid]
    ON [Security].[User]([Id] ASC);

