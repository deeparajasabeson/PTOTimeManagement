using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using PTOTMT.Repository.Abstraction.WebAPI;
using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected PTOTMTWebAPIContext _context { get; set; }

        public List<TEntity> GetAll()
        {
            return _context.Set<TEntity>().ToList();
        }

        public TEntity GetById(object Id)
        {
            return _context.Set<TEntity>().Find(Id);
        }

        public void Put(TEntity model)
        {
            _context.Entry<TEntity>(model).State = EntityState.Modified;
        }

        public TEntity Post(TEntity model)
        {
            return _context.Set<TEntity>().Add(model).Entity;
        }

        public void Delete(TEntity model)
        {
            _context.Set<TEntity>().Remove(model);
        }

        public void DeleteById(object Id)
        {
            TEntity entity = this.GetById(Id);
            this.Delete(entity);
        }

        public bool Exists(object Id)
        {
            return (_context.Set<TEntity>().Find(Id) != null);
        }
    }
}