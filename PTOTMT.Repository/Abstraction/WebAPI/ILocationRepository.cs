using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface ILocationRepository : IRepository<Location>, IRepositoryExistsName
    {
    }
}
