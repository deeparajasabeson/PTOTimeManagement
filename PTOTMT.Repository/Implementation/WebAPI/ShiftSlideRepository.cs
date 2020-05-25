using PTOTMT.Common.Entities;
using PTOTMT.Repository.Abstraction.WebAPI;

namespace PTOTMT.Repository.Implementation.WebAPI
{
    public class ShiftSlideRepository : Repository<ShiftSlide>, IShiftSlideRepository
    {
        public PTOTMTWebAPIContext context
        {
            get
            {
                return _context as PTOTMTWebAPIContext;
            }
        }

        public ShiftSlideRepository(PTOTMTWebAPIContext context)
        {
            this._context = context;
        }
    }
}
