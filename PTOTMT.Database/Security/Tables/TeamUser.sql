CREATE TABLE [Security].[TeamUser]
(
	[Id] UNIQUEIDENTIFIER NOT NULL , 
    [UserId] UNIQUEIDENTIFIER NOT NULL , 
    [TeamId] UNIQUEIDENTIFIER NOT NULL , 
    [EffectiveDate] DATETIMEOFFSET NOT NULL,
     [IsActive]       BIT                NOT NULL,
    [CreatedBy]      UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]      DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]      UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]      DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_TeamUserId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_UserTeamUser_UserId FOREIGN KEY ([UserId]) REFERENCES [security].[User]  ([Id]),
    CONSTRAINT FK_TeamTeamUser FOREIGN KEY ([TeamId]) REFERENCES [Security].[Team] ([Id]),
    CONSTRAINT FK_UserTeamUser_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [security].[User]  ([Id]),
    CONSTRAINT FK_UserTeamUser_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [security].[User]  ([Id])
 );
