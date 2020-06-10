using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;


namespace PTOTMT.Service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StatusesController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public StatusesController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/Statuses
        [HttpGet]
        public IEnumerable<Status> GetStatus()
        {
            return uow.StatusRepo.GetAll();
        }

        // GET: api/Statuses/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Status> GetStatus(Guid? id)
        {
            var status = uow.StatusRepo.GetById(id);
            if (status == null)
            {
                return NotFound();
            }
            return status;
        }

        // PUT: api/Statuses/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutStatus(Guid? id, Status status)
        {
            if (id != status.Id)
            {
                return BadRequest();
            }
            if (uow.StatusRepo.Exists(id))
            {
                uow.StatusRepo.Put(status, status.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/Statuses
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Status> PostStatus(Status status)
        {
            uow.StatusRepo.Post(status);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetStatus), new { id = status.Id }, status);
        }

        // DELETE: api/Statuses/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteStatusById(Guid? id)
        {
            if (uow.StatusRepo.Exists(id))
            {
                uow.StatusRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/Statuses/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteStatus(Status status)
        {
            if (uow.StatusRepo.Exists(status.Id))
            {
                uow.StatusRepo.Delete(status);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        public bool StatusExists(Guid? id)
        {
            return uow.StatusRepo.Exists(id);
        }
    }
}
