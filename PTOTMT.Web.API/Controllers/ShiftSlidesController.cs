using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;

namespace PTOTMT.Service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShiftSlidesController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public ShiftSlidesController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/ShiftSlides
        [HttpGet]
        public IEnumerable<ShiftSlide> GetShiftSlide()
        {
            return uow.ShiftSlideRepo.GetAll();
        }

        // GET: api/ShiftSlides/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ShiftSlide> GetShiftSlide(Guid? id)
        {
            var shiftSlide = uow.ShiftSlideRepo.GetById(id);
            if (shiftSlide == null)
            {
                return NotFound();
            }
            return shiftSlide;
        }

        // PUT: api/ShiftSlides/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutShiftSlide(Guid? id, ShiftSlide shiftSlide)
        {
            if (id != shiftSlide.Id)
            {
                return BadRequest();
            }
            if (uow.ShiftSlideRepo.Exists(id))
            {
                uow.ShiftSlideRepo.Put(shiftSlide, shiftSlide.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/ShiftSlides
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<ShiftSlide> PostShiftSlide(ShiftSlide shiftSlide)
        {
            uow.ShiftSlideRepo.Post(shiftSlide);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetShiftSlide), new { id = shiftSlide.Id }, shiftSlide);
        }

        // DELETE: api/ShiftSlides/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteShiftSlideById(Guid? id)
        {
            if (uow.ShiftSlideRepo.Exists(id))
            {
                uow.ShiftSlideRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/ShiftSlides/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteShiftSlide(ShiftSlide shiftSlide)
        {
            if (uow.ShiftSlideRepo.Exists(shiftSlide.Id))
            {
                uow.ShiftSlideRepo.Delete(shiftSlide);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        public bool ShiftSlideExists(Guid? id)
        {
            return uow.ShiftSlideRepo.Exists(id);
        }
    }
}
