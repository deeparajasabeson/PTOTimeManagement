using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Cors;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PTOTMT.Service.Controllers
{
    [Route("api/[controller]")]
    [Microsoft.AspNetCore.Mvc.ApiController]
    [EnableCors("CrossOrigin")]
    public class QuotasController : Microsoft.AspNetCore.Mvc.ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public QuotasController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/Quotas
        [System.Web.Http.HttpGet]
        public IEnumerable<Quota> GetQuota()
        {
            return uow.QuotaRepo.GetAll();
        }

        // GET: api/Quotas/5
        [HttpGet]
        [Route("{id}")]
        public ActionResult<Quota> GetQuota(Guid? id)
        {
            return uow.QuotaRepo.GetById(id);
        }

        // GET: api/Quotas/quotabyteamid/<teamId:Guid>
        [HttpGet("quotasbyteamid/{teamId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<Quota> GetQuotasByTeamId(Guid? teamId)
        {
            var quotas = GetQuota();
            return quotas.Where(q => q.TeamId == teamId);
        }

        // PUT: api/Quotas/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult PutQuota(Guid? id, Quota quota)
        {
            if (id != quota.Id)
            {
                return BadRequest();
            }
            if (uow.QuotaRepo.Exists(id))
            {
                uow.QuotaRepo.Put(quota);
                uow.SaveChanges();
                return Ok();
            }
            return NotFound();
        }

        // POST: api/Quotas
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult PostQuota(Quota quota)
        {
            if (QuotaExists(quota.Id)) {
                try
                {
                    uow.QuotaRepo.Put(quota);
                    uow.SaveChanges();
                }
                catch(DbUpdateConcurrencyException)
                {
                    throw;
                }
                return Ok();
            }
            else { 
                Quota addedQuota = uow.QuotaRepo.Post(quota);
                uow.SaveChanges();
                return CreatedAtAction(nameof(GetQuota), new { id = addedQuota.Id }, addedQuota);
            }
        }

        // DELETE: api/Quotas/5
        [Microsoft.AspNetCore.Mvc.HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteQuotaById(Guid? id)
        {
            if (uow.QuotaRepo.Exists(id))
            {
                uow.QuotaRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/Quotas/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteQuota(Quota quota)
        {
            if (uow.QuotaRepo.Exists(quota.Id))
            {
                uow.QuotaRepo.Delete(quota);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        [HttpGet("exists/{id}")]
        public bool QuotaExists(Guid? id)
        {
            return uow.QuotaRepo.Exists(id);
        }
    }
}
