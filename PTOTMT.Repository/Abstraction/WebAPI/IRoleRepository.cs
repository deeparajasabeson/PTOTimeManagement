using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IRoleRepository : IRepository<Role>, IRepositoryExistsName
    {
    }
}
