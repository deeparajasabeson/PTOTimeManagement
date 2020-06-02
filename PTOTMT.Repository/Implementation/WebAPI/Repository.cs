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

        public IEnumerable<TEntity> GetAll()
        {
            return _context.Set<TEntity>().ToList();
        }

        public TEntity GetById(object Id)
        {
            return _context.Set<TEntity>().Find(Id);
        }

        public void Put(TEntity model, object Id)
        {
            _context.Set<TEntity>().AsNoTracking();
            var entity = _context.Set<TEntity>().Find(Id);
            if (entity != null)
            {
                try
                {
                    _context.Entry(entity).State = EntityState.Detached;
                    _context.Set<TEntity>().Update(model);
                }
                catch(DbUpdateException ex) { throw ex; }
            }
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