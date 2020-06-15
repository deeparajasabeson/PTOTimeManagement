using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Cors;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using PTOTMT.Repository;
using PTOTMT.Common.Entities;
using PTOTMT.Common.Models;
using PTOTMT.Repository.Abstraction.Web;
using PTOTMT.Repository.Implementation.Web;


namespace PTOTMT.Service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CrossOrigin")]
    [Authorize]

    public class QuotasController : Microsoft.AspNetCore.Mvc.ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;
        private readonly IQuotaService quotaService;
        public QuotasController(IUnitOfWorkWebAPI _uow,
                                                  IQuotaService _quotaService)
        {
            uow = _uow;
            quotaService = _quotaService;
        }

        // GET: api/Quotas
        [HttpGet]
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
            if (id != quota.Id) {  return BadRequest(); }
            // check if any changes are in hours or in dates to  do changes in requests entries
            Quota quotaOld = uow.QuotaRepo.GetById(id);
            if (quotaOld == null)  { return NotFound(); }
            if (quotaOld.RemainingHours != quota.RemainingHours) { return BadRequest(); }

            quota.RemainingHours = quota.OriginalHours; //! important
            uow.QuotaRepo.Put(quota, quota.Id);
            uow.SaveChanges();

            if (quotaOld.StartDateTime != quota.StartDateTime ||
                 quotaOld.EndDateTime != quota.EndDateTime ||
                 quotaOld.OriginalHours != quota.OriginalHours)  {   // Either or both datetimes are different
                                                                     //Validate and re-allocate all requests related to this Quota and other waitlisted requests which fit in this date range in the same team
                quotaService.ReDoAllocate(quotaOld, quota);
            }
            return Ok();
            }



        // POST: api/Quotas/find
        [HttpGet("find")]
        public ActionResult<Quota> FindQuota(FindQuotaEntity entity)
        {
            var quota = uow.QuotaRepo.GetAll()
                                                         .Where(q => q.StartDateTime <= entity.StartDateTime
                                                                        &&  q.EndDateTime >= entity.EndDateTime 
                                                                        &&  q.RemainingHours >= entity.Hours)
                                                         .FirstOrDefault();
            return quota;
        }

        // POST: api/Quotas
        [HttpPost, Authorize(Roles = "Manager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult PostQuota(Quota quota)
        {
            if (QuotaExists(quota.Id)) {
                try
                {
                    uow.QuotaRepo.Put(quota, quota.Id);
                    uow.SaveChanges();
                }
                catch(DbUpdateConcurrencyException) { throw;  }
                return Ok();
            }
            else { 
                Quota addedQuota = uow.QuotaRepo.Post(quota);
                uow.SaveChanges();
                return CreatedAtAction(nameof(GetQuota), new { id = addedQuota.Id }, addedQuota);
            }
        }

        // DELETE: api/Quotas/5
        [HttpDelete("quotabyid/{id}"), Authorize(Roles = "Manager")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteQuotaById(Guid? id)
        {
            if (uow.QuotaRepo.Exists(id))
            {
                uow.QuotaRepo.DeleteById(id);
                uow.SaveChanges();
                return Ok();
            }
            return NotFound();
        }

        // DELETE: api/Quotas
        [HttpDelete, Authorize(Roles = "Manager")]
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
