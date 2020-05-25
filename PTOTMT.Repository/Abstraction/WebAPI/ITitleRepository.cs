using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface ITitleRepository : IRepository<Title>, IRepositoryExistsName
    {
    }
}

