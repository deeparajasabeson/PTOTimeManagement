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

    public class RolesController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public RolesController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/Roles
        [HttpGet]
        [AllowAnonymous]
        public IEnumerable<Role> GetRole()
        {
            return uow.RoleRepo.GetAll();
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Role> GetRole(Guid? id)
        {
            var role = uow.RoleRepo.GetById(id);
            if (role == null)
            {
                return NotFound();
            }
            return role;
        }

        // PUT: api/Roles/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutRole(Guid? id, Role role)
        {
            if (id != role.Id)
            {
                return BadRequest();
            }
            if (uow.RoleRepo.Exists(id))
            {
                uow.RoleRepo.Put(role, role.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/Roles
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Role> PostRole(Role role)
        {
            uow.RoleRepo.Post(role);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, role);
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteRoleById(Guid? id)
        {
            if (uow.RoleRepo.Exists(id))
            {
                uow.RoleRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/Roles/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteRole(Role role)
        {
            if (uow.RoleRepo.Exists(role.Id))
            {
                uow.RoleRepo.Delete(role);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        public bool RoleExists(Guid? id)
        {
            return uow.RoleRepo.Exists(id);
        }
    }
}
