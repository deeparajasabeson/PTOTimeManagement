/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/
Use PTOTimeManagement

    Alter Table Security.[User]
    Drop CONSTRAINT FK_TitleUser,
                                       FK_RoleUser,
                                       FK_UserUser_ReportToUserId,
                                       FK_LocationUser,
                                       FK_TeamUser,
                                       FK_UserUser_CreatedBy,
                                       FK_UserUser_UpdatedBy
       
    --delete all rows from Tables
    delete from Security.Role 
    delete from Config.Location 
    delete from Security.Title
    delete from Security.Team 
    delete from Config.RequestType
    delete from Security.[User]
GO

Declare @UserId uniqueidentifier = NEWID(),
             @TitleId uniqueidentifier = NEWID(),
             @RoleId uniqueidentifier = NEWID(),
              @ReportToUserId uniqueidentifier = NEWID(),
             @LocationId uniqueidentifier = NEWID(),
             @TeamId uniqueidentifier = NEWID(),
             @RequestTypeId uniqueidentifier = NEWID(),
             @StatusId uniqueidentifier = NEWID()

 -- Security.User TABLE
Insert into Security.[User]
(Id, FirstName, LastName, UserName, Password, TitleId, NTLogin, EmailAddress, RoleId, ReportToUserId, LocationId, TeamFunctionId, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values
(@UserId, 'Deepa', 'Rajasabeson', 'deeparajasabeson@gmail.com', 'deepa', @TitleId, 'drajas401', 'deeparajasabeson@gmail.com', @RoleId, @ReportToUserId, @LocationId,  @TeamId, 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())


Insert into Security.[User]
(Id, FirstName, LastName, UserName, Password,TitleId, NTLogin, EmailAddress, RoleId, ReportToUserId, LocationId, TeamFunctionId, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values
(@ReportToUserId, 'Harold', 'Gulube', 'haroldgulube@gmail.com', 'harold' , @TitleId , 'hgulub400', 'haroldgulube@gmail.com',@RoleId, @UserId,@LocationId, @TeamId, 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())

-- Security.Role TABLE
Insert into Security.Role 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn) 
Values  
(NEWID(), 'Manager', 'Team Manager', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Security.Role 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn) 
Values  
(NEWID(), 'Developer 1', 'Developer 1', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Security.Role 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn) 
Values  
(@RoleId, 'Developer 2', 'Developer 2', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())

--Config.Location TABLE
Insert into Config.Location 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn) 
Values 
(@LocationId, 'Nashville', 'Branch Office in Nashville DownTown',1,@UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Config.Location 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn) 
Values 
(NEWID(), 'Schaumburg', 'Main Office in Schaumburg City',1,@UserId, GETUTCDATE(), @UserId, GETUTCDATE())


--Security.Team TABLE
Insert into Security.Team 
(Id, Name, Description, MaxShiftSlideHours, ShiftStartTimeLimit, ShiftEndTimeLimit, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values
(NEWID(), 'Help Desk', 'Team of Help Desk Associates', 3,  8, 9, 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Security.Team 
(Id, Name, Description, MaxShiftSlideHours, ShiftStartTimeLimit, ShiftEndTimeLimit, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
(NEWID(), 'OnBoarding / Recovery (OBR)', 'OnBoarding, Recovery Team', 3,  9, 6, 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Security.Team 
(Id, Name, Description, MaxShiftSlideHours, ShiftStartTimeLimit, ShiftEndTimeLimit, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
(@TeamId, 'Sales Order Entry (SOE)', 'Sales Order Entry Team', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Security.Team 
(Id, Name, Description, MaxShiftSlideHours, ShiftStartTimeLimit, ShiftEndTimeLimit, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
(NEWID(), 'Leadership / Admin', 'Leadership, Admin Team', 3,  8, 6, 1,@UserId, GETUTCDATE(), @UserId, GETUTCDATE())


--Security.Title TABLE
Insert into Security.Title
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
( @TitleId, 'SomeTitle', 'Some Title',1,@UserId, GETUTCDATE(), @UserId, GETUTCDATE())

--Config.RequestType TABLE
Insert into Config.RequestType 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values
(@RequestTypeId, 'Vacation', 'Vacation Holidays', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Config.RequestType
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
(NEWID(), 'Personnel Swap', 'Trade a day or a shift with a co-worker', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Config.RequestType
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
(NEWID(), 'Flex Time', 'Self-Shift Swap-Swap own off day with a work day', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Config.RequestType 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
(NEWID(), 'Float', 'Float', 1,@UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Config.RequestType 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
(NEWID(), 'Bereavement', 'Leave for family members Death', 1,@UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Config.RequestType 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
(NEWID(), 'Shift Slide', 'Shift start and end time', 1,@UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Config.RequestType 
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values 
(NEWID(), 'Jury Duty', 'Jury Duty', 1,@UserId, GETUTCDATE(), @UserId, GETUTCDATE())

--Config.Status TABLE
Insert into Config.Status
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values
(@StatusId, 'WaitList', 'Entry is in Waiting List queue', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Config.Status
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values
(NEWID(), 'Approved', 'Entry is approved already', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())
Insert into Config.Status
(Id, Name, Description, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn)
Values
(NEWID(), 'Cancelled', 'Entry is cancelled by Leadership / Applier', 1, @UserId, GETUTCDATE(), @UserId, GETUTCDATE())


--Add keys back in Security.User TABLE
Alter Table Security.[User]
ADD  CONSTRAINT FK_TitleUser FOREIGN KEY ([TitleId]) REFERENCES [Security].[Title] ([Id]),
          CONSTRAINT FK_RoleUser FOREIGN KEY (RoleId) REFERENCES [Security].[Role] ([Id]) ,
         CONSTRAINT FK_UserUser_ReportToUserId FOREIGN KEY (ReportToUserId) REFERENCES [Security].[User] ([Id]),
         CONSTRAINT FK_LocationUser FOREIGN KEY (LocationId) REFERENCES [Config].[Location] ([Id]),
         CONSTRAINT FK_TeamUser FOREIGN KEY (TeamFunctionId) REFERENCES [Security].[Team] ([Id]),
         CONSTRAINT FK_UserUser_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Security].[User] ([Id]),
         CONSTRAINT FK_UserUser_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Security].[User] ([Id])

GO
