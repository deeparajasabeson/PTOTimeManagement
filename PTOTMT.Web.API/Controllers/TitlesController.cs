using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;

namespace PTOTMT.Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TitlesController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public TitlesController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/Titles
        [HttpGet]
        public IEnumerable<Title> GetTitle()
        {
            return uow.TitleRepo.GetAll();
        }

        // GET: api/Titles/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Title> GetTitle(Guid? id)
        {
            var title = uow.TitleRepo.GetById(id);
            if (title == null)
            {
                return NotFound();
            }
            return title;
        }

        // PUT: api/Titles/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutTitle(Guid? id, Title title)
        {
            if (id != title.Id)
            {
                return BadRequest();
            }
            if (uow.TitleRepo.Exists(id))
            {
                uow.TitleRepo.Put(title, title.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/Titles
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Title> PostTitle(Title title)
        {
            uow.TitleRepo.Post(title);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetTitle), new { id = title.Id }, title);
        }

        // DELETE: api/Titles/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteTitleById(Guid? id)
        {
            if (uow.TitleRepo.Exists(id))
            {
                uow.TitleRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/Titles/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteTitle(Title title)
        {
            if (uow.TitleRepo.Exists(title.Id))
            {
                uow.TitleRepo.Delete(title);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        public bool TitleExists(Guid? id)
        {
            return uow.TitleRepo.Exists(id);
        }
    }
}
