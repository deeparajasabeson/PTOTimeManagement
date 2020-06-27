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
        public IEnumerable<Flex> GetFlexsByUserId(Guid userId)
        {
            var Flexs = GetFlex();
            return Flexs.Where(f => f.UserId == userId);
        }

        [HttpGet("flexrequestsbyuseridindaterange")]
        public IEnumerable<Flex> GetFlexsByUserIdInDateRange(Guid userId, DateTime fromDate, DateTime toDate)
        {
            IEnumerable<Flex> flexsRequests = GetFlex().Where(f => f.UserId == userId);
            DateTime date = new DateTime(1111, 11, 1, 1, 7, 13);
            if (fromDate != date && toDate != date)
            {
                flexsRequests = flexsRequests.Where(req => !((req.StartDateTime < fromDate && req.EndDateTime < fromDate) ||
                                                                                                        (req.StartDateTime > toDate && req.EndDateTime > toDate)));
            }
            else if (fromDate == date && toDate != date)
            {
                flexsRequests = flexsRequests.Where(req => req.StartDateTime <= toDate);
            }
            else if (fromDate != date && toDate == date)
            {
                flexsRequests = flexsRequests.Where(req => req.EndDateTime >= fromDate);
            }
            return flexsRequests;
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
            DateTime date = new DateTime(1111, 11, 1, 1, 7, 13);
            if (fromDate != date && toDate != date)
            {

                membersRequests = membersRequests.Where(flex => !((flex.StartDateTime < fromDate && flex.EndDateTime < fromDate) ||
                                                                                                        (flex.StartDateTime > toDate      && flex.EndDateTime > toDate)));
            }
            else if (fromDate == date && toDate != date)
            {
                membersRequests = membersRequests.Where(req => req.StartDateTime <= toDate);
            }
            else if (fromDate != date && toDate == date)
            {
                membersRequests = membersRequests.Where(req => req.EndDateTime >= fromDate);
            }
            return membersRequests;
        }

        // GET: api/requests/approveflex
        [HttpGet("approveflex")]
        public void ApproveFlex(Guid id)
        {
            Flex flex = uow.FlexRepo.GetById(id);
            Status approved = uow.StatusRepo.GetByName("Approved");
            flex.StatusId = approved.Id;
            uow.FlexRepo.Put(flex, flex.Id);
            uow.SaveChanges();
        }

        // GET: api/requests/declineflex
        [HttpGet("declineflex")]
        public void DeclineFlex(Guid id)
        {
            Flex flex = uow.FlexRepo.GetById(id);
            Status declined = uow.StatusRepo.GetByName("Declined");
            flex.StatusId = declined.Id;
            uow.FlexRepo.Put(flex, flex.Id);
            uow.SaveChanges();
        }

        // PUT: api/flexs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutFlex(Guid? id, Flex flex)
        {
            if (id != flex.Id)
            {
                return BadRequest();
            }
            if (uow.FlexRepo.Exists(id))
            {
                Flex flexOld = uow.FlexRepo.GetById(flex.Id);

                FlexType shiftSwap = uow.FlexTypeRepo.GetByName("Shift Swap");
                FlexType shiftSwapRequest = uow.FlexTypeRepo.GetByName("Shift Swap Request");
                if (flex.FlexTypeId == shiftSwap.Id)
                {
                    Flex coWorkerFlex = uow.FlexRepo.GetById(flex.CoWorkerFlexId);
                    if (flex.CoWorkerId != flexOld.CoWorkerId && coWorkerFlex.FlexTypeId == shiftSwapRequest.Id) {
                        //Delete the old Co-Worker Flex Entry; Need to send an email to old Co-Worker about the updates.
                        coWorkerFlex.IsActive = false;
                        uow.FlexRepo.Put(coWorkerFlex, coWorkerFlex.Id);
                        uow.SaveChanges();
                        quotaService.SendEmaisOnCoWorkerChange(coWorkerFlex);

                        //Create another request  for CoWorker Id
                        Guid coWorkerFlexId = CreateCoWorkerFlex(flex);
                        flex.CoWorkerFlexId = coWorkerFlexId;
                    }
                }
                Status approved = uow.StatusRepo.GetByName("Approved");
                if (flex.StatusId != flexOld.StatusId && flex.StatusId == approved.Id)
                {
                    quotaService.SendApproveFlexEmails(flex);
                }
                uow.FlexRepo.Put(flex, flex.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        private Guid CreateCoWorkerFlex(Flex flex)
        {
            Guid userId = flex.UserId;
            flex.UserId = flex.CoWorkerId;
            flex.CoWorkerId = userId;

            FlexType shiftSwapRequest = uow.FlexTypeRepo.GetByName("Shift Swap Request");
            flex.FlexTypeId = shiftSwapRequest.Id;

            flex.CoWorkerFlexId = flex.Id;

            Guid guid = Guid.NewGuid();
            flex.Id = guid;
            uow.FlexRepo.Post(flex);
            uow.SaveChanges();
            return guid;
        }

        // POST: api/flexs
        [HttpPost]
        public IActionResult PostFlex(Flex flex)
        {
            quotaService.SendFlexEmails(flex);
            Status waitlistStatus = uow.StatusRepo.GetAll().Where(status => status.Name == "WaitList").FirstOrDefault();
            flex.StatusId = waitlistStatus.Id;

            FlexType shiftSwap = uow.FlexTypeRepo.GetByName("Shift Swap");
            if(flex.FlexTypeId == shiftSwap.Id)
            {
                Guid guid = CreateCoWorkerFlex(flex);
                flex.CoWorkerFlexId = guid;
            }
            uow.FlexRepo.Post(flex);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetFlex), new { id = flex.Id }, flex);
        }

        // DELETE: api/flexs/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteFlexById(Guid? id)
        {
            if (uow.FlexRepo.Exists(id))
            {
                Flex flex = uow.FlexRepo.GetById(id);
                flex.IsActive = false;
                uow.FlexRepo.Put(flex, id);
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
                flex.IsActive = false;
                uow.FlexRepo.Put(flex, id);
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
