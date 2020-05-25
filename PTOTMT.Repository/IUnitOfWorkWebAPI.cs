using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository
{
    public interface IUnitOfWorkWebAPI
    {
        IAspNetUsersRepository AspNetUsersRepo { get; }
        IAspNetRolesRepository AspNetRolesRepo { get; }
        ILocationRepository LocationRepo { get; }
        IQuotaRepository QuotaRepo { get; }
        IRequestRepository RequestRepo { get; }
        IRequestTypeRepository RequestTypeRepo { get; }
        IRoleRepository RoleRepo { get; }
        IShiftSlideRepository ShiftSlideRepo { get; }
        IStatusRepository StatusRepo { get; }
        ITeamRepository TeamRepo { get; }
        ITeamUserRepository TeamUserRepo { get; }
        ITitleRepository TitleRepo { get; }
        IUserRepository UserRepo { get; }
        int SaveChanges();
    }
}
