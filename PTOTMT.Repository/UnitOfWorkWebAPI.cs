using PTOTMT.Repository.Abstraction.WebAPI;
using PTOTMT.Repository.Implementation.WebAPI;
using PTOTMT.Common.Entities;

namespace PTOTMT.Repository
{
    public class UnitOfWorkWebAPI : IUnitOfWorkWebAPI
    {
        private PTOTMTWebAPIContext context;
        public UnitOfWorkWebAPI(PTOTMTWebAPIContext _context)
        {
            context = _context;
        }

        private ILocationRepository _LocationRepo;
        public ILocationRepository LocationRepo
        {
            get
            {
                if (_LocationRepo == null)
                {
                    _LocationRepo = new LocationRepository(context);
                }
                return _LocationRepo;
            }
        }

        private IQuotaRepository _QuotaRepo;
        public IQuotaRepository QuotaRepo
        {
            get
            {
                if (_QuotaRepo == null)
                {
                    _QuotaRepo = new QuotaRepository(context);
                }
                return _QuotaRepo;
            }
        }
        private IRequestRepository _RequestRepo;
        public IRequestRepository RequestRepo
        {
            get
            {
                if (_RequestRepo == null)
                {
                    _RequestRepo = new RequestRepository(context);
                }
                return _RequestRepo;
            }
        }
        private IRequestTypeRepository _RequestTypeRepo;
        public IRequestTypeRepository RequestTypeRepo
        {
            get
            {
                if (_RequestTypeRepo == null)
                {
                    _RequestTypeRepo = new RequestTypeRepository(context);
                }
                return _RequestTypeRepo;
            }
        }
        private IRoleRepository _RoleRepo;
        public IRoleRepository RoleRepo
        {
            get
            {
                if (_RoleRepo == null)
                {
                    _RoleRepo = new RoleRepository(context);
                }
                return _RoleRepo;
            }
        }

        private IStatusRepository _StatusRepo;
        public IStatusRepository StatusRepo
        {
            get
            {
                if (_StatusRepo == null)
                {
                    _StatusRepo = new StatusRepository(context);
                }
                return _StatusRepo;
            }
        }
        private ITeamRepository _TeamRepo;
        public ITeamRepository TeamRepo
        {
            get
            {
                if (_TeamRepo == null)
                {
                    _TeamRepo = new TeamRepository(context);
                }
                return _TeamRepo;
            }
        }
        private ITeamUserRepository _TeamUserRepo;
        public ITeamUserRepository TeamUserRepo
        {
            get
            {
                if (_TeamUserRepo == null)
                {
                    _TeamUserRepo = new TeamUserRepository(context);
                }
                return _TeamUserRepo;
            }
        }
        private ITitleRepository _TitleRepo;
        public ITitleRepository TitleRepo
        {
            get
            {
                if (_TitleRepo == null)
                {
                    _TitleRepo = new TitleRepository(context);
                }
                return _TitleRepo;
            }
        }
        private IUserRepository _UserRepo;
        public IUserRepository UserRepo
        {
            get
            {
                if (_UserRepo == null)
                {
                    _UserRepo = new UserRepository(context);
                }
                return _UserRepo;
            }
        }

        public int SaveChanges()
        {
            return context.SaveChanges();
        }
    }
}