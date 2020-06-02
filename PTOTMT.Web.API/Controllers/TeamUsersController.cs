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
    public class TeamUsersController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public TeamUsersController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/TeamUsers
        [HttpGet]
        public IEnumerable<TeamUser> GetTeamUser()
        {
            return uow.TeamUserRepo.GetAll();
        }

        // GET: api/TeamUsers/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<TeamUser> GetTeamUser(Guid? id)
        {
            var teamUser = uow.TeamUserRepo.GetById(id);
            if (teamUser == null)
            {
                return NotFound();
            }
            return teamUser;
        }

        // PUT: api/TeamUsers/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutTeamUser(Guid? id, TeamUser teamUser)
        {
            if (id != teamUser.Id)
            {
                return BadRequest();
            }
            if (uow.TeamUserRepo.Exists(id))
            {
                uow.TeamUserRepo.Put(teamUser, teamUser.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/TeamUsers
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<TeamUser> PostTeamUser(TeamUser teamUser)
        {
            uow.TeamUserRepo.Post(teamUser);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetTeamUser), new { id = teamUser.Id }, teamUser);
        }

        // DELETE: api/TeamUsers/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteTeamUserById(Guid? id)
        {
            if (uow.TeamUserRepo.Exists(id))
            {
                uow.TeamUserRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/TeamUsers/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteTeamUser(TeamUser teamUser)
        {
            if (uow.TeamUserRepo.Exists(teamUser.Id))
            {
                uow.TeamUserRepo.Delete(teamUser);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        public bool TeamUserExists(Guid? id)
        {
            return uow.TeamUserRepo.Exists(id);
        }
    }
}
