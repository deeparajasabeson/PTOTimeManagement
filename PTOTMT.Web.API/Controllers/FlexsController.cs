using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;
using PTOTMT.Repository.Abstraction.Web;


namespace PTOTMT.Service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CrossOrigin")]
    [Authorize]
    public class FlexsController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;
        private readonly IQuotaService quotaService;
        private readonly IEmailSender emailSender;
        public FlexsController(IUnitOfWorkWebAPI _uow, 
                                              IQuotaService _quotaService,
                                              IEmailSender _emailSender)
        {
            uow = _uow;
            quotaService = _quotaService;
            emailSender = _emailSender;
        }

        // GET: api/Flexs
        [HttpGet]
        public IEnumerable<Flex> GetFlex()
        {
            return uow.FlexRepo.GetAll();
        }

        // GET: api/Flexs/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Flex> GetFlex(Guid? id)
        {
            var Flex = uow.FlexRepo.GetById(id);
            if (Flex == null)
            {
                return NotFound();
            }
            return Flex;
        }

        // GET: api/Flexs/flexsbyuserid/<userId:Guid>
        [HttpGet("flexsbyuserid/{userId}")]
        public IEnumerable<Flex> GetFlexsByUserId(Guid? userId)
        {
            var Flexs = GetFlex();
            return Flexs.Where(f => f.UserId == userId);
        }

        // GET: api/requests/flexsreportingmembers
        [HttpGet("flexsreportingmembers")]
        public IEnumerable<Flex> GetFlexsReportingMembers(Guid leadershipuserId, DateTime fromDate, DateTime toDate)
        {
            IEnumerable<Flex> flexList = GetFlex();
            IEnumerable<User> reportingMembersList = uow.UserRepo.GetAll().Where(u => u.ReportToUserId == leadershipuserId);

            IEnumerable<Flex> membersRequests = from flex in flexList
                                                                            join mem in reportingMembersList
                                                                            on flex.UserId equals mem.Id
                                                                            select flex;
            if (fromDate != null && toDate != null)
            {

                membersRequests = membersRequests.Where(flex => !((flex.StartDateTime < fromDate && flex.EndDateTime < fromDate) ||
                                                                                                        (flex.StartDateTime > toDate      && flex.EndDateTime > toDate)));
            }
            else if (fromDate == null && toDate != null)
            {
                membersRequests = membersRequests.Where(req => req.StartDateTime <= toDate);
            }
            else if (fromDate != null && toDate == null)
            {
                membersRequests = membersRequests.Where(req => req.EndDateTime >= fromDate);
            }
            return membersRequests;
        }


        // PUT: api/flexs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutFlex(Guid? id, Flex Flex)
        {
            if (id != Flex.Id)
            {
                return BadRequest();
            }
            if (uow.FlexRepo.Exists(id))
            {
                uow.FlexRepo.Put(Flex, Flex.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/flexs
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult PostFlex(Flex flex)
        {
            flex = emailSender.SendEmails(flex);
            return CreatedAtAction(nameof(GetFlex), new { id = flex.Id }, flex);
        }

        // DELETE: api/flexs/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteFlexById(Guid? id)
        {
            if (uow.FlexRepo.Exists(id))
            {
                uow.FlexRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/flexs/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteFlex(Flex flex)
        {
            if (uow.FlexRepo.Exists(flex.Id))
            {
                uow.FlexRepo.Delete(flex);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        public bool FlexExists(Guid? id)
        {
            return uow.FlexRepo.Exists(id);
        }
    }
}
