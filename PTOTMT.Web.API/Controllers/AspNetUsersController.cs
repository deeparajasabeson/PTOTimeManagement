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
    public class AspNetUsersController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public AspNetUsersController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/AspNetUser
        [HttpGet]
        public IEnumerable<AspNetUsers> GetAspNetUsers()
        {
            return uow.AspNetUsersRepo.GetAll();
        }

        // GET: api/AspNetUser/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<AspNetUsers> GetAspNetUser(Guid? id)
        {
            var aspnetuser = uow.AspNetUsersRepo.GetById(id);
            if (aspnetuser == null)
            {
                return NotFound();
            }
            return aspnetuser;
        }

        // PUT: api/AspNetUser/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutAspNetUser(Guid? id, AspNetUsers aspnetuser)
        {
            if (id != aspnetuser.Id)
            {
                return BadRequest();
            }
            if (uow.AspNetUsersRepo.Exists(id))
            {
                uow.AspNetUsersRepo.Put(aspnetuser);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/AspNetUser
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<AspNetUsers> PostAspNetUser(AspNetUsers aspnetuser)
        {
            AspNetUsers addedAspNetUser = uow.AspNetUsersRepo.Post(aspnetuser);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetAspNetUsers), new { id = addedAspNetUser.Id }, addedAspNetUser);
        }

        // DELETE: api/AspNetUser/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteAspNetUserById(Guid? id)
        {
            if (uow.AspNetUsersRepo.Exists(id))
            {
                uow.AspNetUsersRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/AspNetUser
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteAspNetUser(AspNetUsers aspnetuser)
        {
            if (uow.AspNetUsersRepo.Exists(aspnetuser.Id))
            {
                uow.AspNetUsersRepo.Delete(aspnetuser);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // Get: api/AspNetUser/AspNetUserExists/5
        public bool AspNetUserExists(Guid? id)
        {
            return uow.AspNetUsersRepo.Exists(id);
        }
    }
}
