﻿using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IStatusRepository : IRepository<Status>, IRepositoryExistsName, IRepositoryGetByName<Status>    {    }
}
