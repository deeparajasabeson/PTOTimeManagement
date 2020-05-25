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
    public class AspNetRolesController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public AspNetRolesController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/AspNetRoles
        [HttpGet]
        public IEnumerable<AspNetRoles> GetAspNetRoles()
        {
            return uow.AspNetRolesRepo.GetAll();
        }

        // GET: api/AspNetRole/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<AspNetRoles> GetAspNetRole(Guid? id)
        {
            var aspnetrole = uow.AspNetRolesRepo.GetById(id);
            if (aspnetrole == null)
            {
                return NotFound();
            }
            return aspnetrole;
        }

        // PUT: api/AspNetRole/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutAspNetRole(Guid? id, AspNetRoles aspnetrole)
        {
            if (id != aspnetrole.Id)
            {
                return BadRequest();
            }
            if (uow.AspNetRolesRepo.Exists(id))
            {
                uow.AspNetRolesRepo.Put(aspnetrole);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/AspNetRole
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<AspNetRoles> PostAspNetRole(AspNetRoles aspnetrole)
        {
            AspNetRoles addedAspNetRole = uow.AspNetRolesRepo.Post(aspnetrole);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetAspNetRoles), new { id = addedAspNetRole.Id }, addedAspNetRole);
        }

        // DELETE: api/AspNetRole/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteAspNetRoleById(Guid? id)
        {
            if (uow.AspNetRolesRepo.Exists(id))
            {
                uow.AspNetRolesRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/AspNetRole
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteAspNetRole(AspNetRoles aspnetrole)
        {
            if (uow.AspNetRolesRepo.Exists(aspnetrole.Id))
            {
                uow.AspNetRolesRepo.Delete(aspnetrole);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // Get: api/AspNetRole/AspNetRoleExists/5
        public bool AspNetRoleExists(Guid? id)
        {
            return uow.AspNetRolesRepo.Exists(id);
        }
    }
}
