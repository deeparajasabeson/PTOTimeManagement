using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IRepositoryGetByName<TEntity> where TEntity : class
    {
        TEntity GetByName(string name);
    }
}

