using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;
using Microsoft.AspNetCore.Cors;

namespace PTOTMT.Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("CrossOrigin")]
    public class UsersController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public UsersController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/Users
        [HttpGet, Route("")]
        public IEnumerable<User> GetUser()
        {
            return uow.UserRepo.GetAll();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<User> GetUser(Guid? id)
        {
            var user = uow.UserRepo.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutUser(Guid? id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }
            if (uow.UserRepo.Exists(id))
            {
                uow.UserRepo.Put(user);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/Users
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<User> PostUser(User user)
        {
            uow.UserRepo.Post(user);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteUserById(Guid? id)
        {
            if (uow.UserRepo.Exists(id))
            {
                uow.UserRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/Users/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteUser(User user)
        {
            if (uow.UserRepo.Exists(user.Id))
            {
                uow.UserRepo.Delete(user);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        [HttpGet("userexists/{id}")]
        public bool UserExists(Guid? id)
        {
            return uow.UserRepo.Exists(id);
        }

        [HttpGet("userdetails")]
        public ActionResult<User> GetUserDetails([FromQuery] string username, [FromQuery] string password)
        {
            return uow.UserRepo.GetUserDetails(username, password);
        }
    }
}
