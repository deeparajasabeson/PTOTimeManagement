using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface ITeamRepository : IRepository<Team>, IRepositoryExistsName
    {
    }
}
