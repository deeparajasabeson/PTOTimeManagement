using PTOTMT.Common.Entities;

namespace PTOTMT.Repository.Abstraction.WebAPI
{
    public interface IRepositoryGetByName
    {
        FlexType GetByName(string name);
    }
}

