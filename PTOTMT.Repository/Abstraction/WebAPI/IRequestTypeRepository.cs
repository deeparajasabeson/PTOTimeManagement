using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IRequestTypeRepository : IRepository<RequestType>, IRepositoryExistsName
    {
        RequestType GetByName(string name);
    }
}
