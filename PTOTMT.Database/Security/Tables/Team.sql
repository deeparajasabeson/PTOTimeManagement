CREATE TABLE [Security].[Team] (
    [Id]          UNIQUEIDENTIFIER   NOT NULL,
    [Name]        NVARCHAR (30)      NOT NULL,
    [Description] NVARCHAR (50)      NULL,
    [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_TeamId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_UserTeam_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[AspNetUsers]  ([Id]),
    CONSTRAINT FK_UserTeam_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[AspNetUsers]  ([Id])
);

