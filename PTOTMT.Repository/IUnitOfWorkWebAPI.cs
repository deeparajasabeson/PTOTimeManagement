using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository
{
    public interface IUnitOfWorkWebAPI
    {
        ILocationRepository LocationRepo { get; }
        IQuotaRepository QuotaRepo { get; }
        IRequestRepository RequestRepo { get; }
        IRequestTypeRepository RequestTypeRepo { get; }
        IRoleRepository RoleRepo { get; }
        IStatusRepository StatusRepo { get; }
        ITeamRepository TeamRepo { get; }
        IUserRepository UserRepo { get; }
        IFlexRepository FlexRepo { get; }
        IFlexTypeRepository FlexTypeRepo { get; }
        int SaveChanges();
    }
}
