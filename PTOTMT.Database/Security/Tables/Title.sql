CREATE TABLE [Security].[Title] (
    [Id]          UNIQUEIDENTIFIER   NOT NULL,
    [Name]        NVARCHAR (30)      NOT NULL,
    [Description] NVARCHAR (50)      NULL,
    [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_TitleId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_UserTitle_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User]  ([Id]),
    CONSTRAINT FK_UserTitle_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES[security].[User] ([Id])
);

