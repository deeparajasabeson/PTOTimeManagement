CREATE TABLE [Config].[RequestType] (
    [Id]          UNIQUEIDENTIFIER   NOT NULL,
    [Name]        NVARCHAR (30)      NOT NULL,
    [Description] NVARCHAR (50)      NULL,
    [IsActive]    BIT                NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [CreatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    [UpdatedBy]   UNIQUEIDENTIFIER   NOT NULL,
    [UpdatedOn]   DATETIMEOFFSET (7) DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT PK_ResourceTypeId PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_UserResourceType_CreatedBy FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[AspNetUsers]  ([Id]),
    CONSTRAINT FK_UserResourceType_UpdatedBy FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[AspNetUsers]  ([Id])

);


