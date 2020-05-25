CREATE TABLE [Config].[Location] (
    [Id]          UNIQUEIDENTIFIER   NOT NULL,
    [Name]        NVARCHAR (30)      NOT NULL,
    [Description] NVARCHAR (50)      NULL,
    [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_LocationId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_UserLocation_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[AspNetUsers]  ([Id]),
    CONSTRAINT FK_UserLocation_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES[dbo].[AspNetUsers]  ([Id])
);

