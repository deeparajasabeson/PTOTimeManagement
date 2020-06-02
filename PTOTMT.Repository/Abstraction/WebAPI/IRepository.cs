using System;
using System.Collections.Generic;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IRepository<TEntity> where TEntity : class
    {
        IEnumerable<TEntity> GetAll();
        TEntity GetById(object id);
        void Put(TEntity model, object id);
        TEntity Post(TEntity model);
        void Delete(TEntity model);
        void DeleteById(object id);
        bool Exists(object id);
    }
}
