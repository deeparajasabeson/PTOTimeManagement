using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;


namespace PTOTMT.Service.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CrossOrigin")]
    [Authorize]
    public class TeamsController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public TeamsController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/Teams
        [HttpGet]
        public IEnumerable<Team> GetTeam()
        {
            return uow.TeamRepo.GetAll();
        }

        // GET: api/Teams/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Team> GetTeam(Guid? id)
        {
            var team = uow.TeamRepo.GetById(id);
            if (team == null)
            {
                return NotFound();
            }
            return team;
        }

        // PUT: api/Teams/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutTeam(Guid? id, Team team)
        {
            if (id != team.Id)
            {
                return BadRequest();
            }
            if (uow.TeamRepo.Exists(id))
            {
                uow.TeamRepo.Put(team, team.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/Teams
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Team> PostTeam(Team team)
        {
            uow.TeamRepo.Post(team);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, team);
        }

        // DELETE: api/Teams/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteTeamById(Guid? id)
        {
            if (uow.TeamRepo.Exists(id))
            {
                uow.TeamRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/Teams/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteTeam(Team team)
        {
            if (uow.TeamRepo.Exists(team.Id))
            {
                uow.TeamRepo.Delete(team);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        public bool TeamExists(Guid? id)
        {
            return uow.TeamRepo.Exists(id);
        }
    }
}
