using System;
using System.Collections.Generic;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IRepository<TEntity> where TEntity : class
    {
        List<TEntity> GetAll();
        TEntity GetById(object id);
        void Put(TEntity model);
        TEntity Post(TEntity model);
        void Delete(TEntity model);
        void DeleteById(object id);
        bool Exists(object id);
    }
}
