using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IFlexTypeRepository : IRepository<FlexType>, IRepositoryExistsName, IRepositoryGetByName   {    }
}

