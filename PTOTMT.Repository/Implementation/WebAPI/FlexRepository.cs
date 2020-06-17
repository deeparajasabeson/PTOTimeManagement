using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
    {
        public class FlexRepository : Repository<Flex>, IFlexRepository
    {
            public PTOTMTWebAPIContext context
            {
                get
                {
                    return _context as PTOTMTWebAPIContext;
                }
            }

            public FlexRepository(PTOTMTWebAPIContext context)
            {
                this._context = context;
            }
    }
}

