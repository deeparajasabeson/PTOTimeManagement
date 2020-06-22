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
    public class RequestsController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;
        private readonly IQuotaService quotaService;
        public RequestsController(IUnitOfWorkWebAPI _uow, 
                                                     IQuotaService _quotaService)
        {
            uow = _uow;
            quotaService = _quotaService;
        }

        // GET: api/Requests
        [HttpGet]
        public IEnumerable<Request> GetRequest()
        {
            return uow.RequestRepo.GetAll();
        }

        // GET: api/Requests/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Request> GetRequest(Guid? id)
        {
            var request = uow.RequestRepo.GetById(id);
            if (request == null)
            {
                return NotFound();
            }
            return request;
        }

        // GET: api/requests/ptorequestsbyuserid/<userId:Guid>
        [HttpGet("ptorequestsbyuserid/{userId}")]
        public IEnumerable<Request> GetRequestsByUserId(Guid userId)
        {
            var requests = GetRequest();
            return requests.Where(r => r.UserId == userId);
        }

        [HttpGet("ptorequestsbyuseridindaterange")]
        public IEnumerable<Request> GetPTOsByUserIdInDateRange(Guid userId, DateTime fromDate, DateTime toDate) {
            var requests = GetRequest();
            return requests.Where(r => r.UserId == userId);
        }
            
        // GET: api/requests/ptorequestsreportingmembers/<userId:Guid>
        [HttpGet("requestsreportingmembers")]
        public IEnumerable<Request> GetRequestsReportingMembers(Guid leadershipuserId, DateTime fromDate, DateTime toDate)
        {
            IEnumerable<Request> requestList = GetRequest();
            IEnumerable<User> reportingMembersList = uow.UserRepo.GetAll().Where(u => u.ReportToUserId == leadershipuserId);

            IEnumerable<Request> membersRequests = from req in requestList
                                                                                  join mem in reportingMembersList
                                                                                  on req.UserId equals mem.Id
                                                                                  select req;
            if(fromDate != null && toDate != null) {
                membersRequests = membersRequests.Where(req => !((req.StartDateTime < fromDate && req.EndDateTime < fromDate) || 
                                                                                                        (req.StartDateTime > toDate      && req.EndDateTime > toDate)));
            }
            else if (fromDate == null && toDate != null) {
                    membersRequests = membersRequests.Where(req => req.StartDateTime <= toDate);
             }
            else if (fromDate != null && toDate == null) {
                    membersRequests = membersRequests.Where(req => req.EndDateTime >= fromDate);
            }
            return membersRequests;
        }

        // PUT: api/Requests/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutRequest(Guid? id, Request request)
        {
            if (id != request.Id)
            {
                return BadRequest();
            }
            if (uow.RequestRepo.Exists(id))
            {
                uow.RequestRepo.Put(request, request.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/Requests
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult PostRequest(Request request)
        {
            Quota quotaToAllot = quotaService.FindQuota(request);
            uow.RequestRepo.Post(request);
            uow.SaveChanges();
            request = quotaService.SendEmails(request, quotaToAllot);
            return CreatedAtAction(nameof(GetRequest), new { id = request.Id }, request);
        }

        // DELETE: api/Requests/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteRequestById(Guid? id)
        {
            if (uow.RequestRepo.Exists(id))
            {
                uow.RequestRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/Requests/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteRequest(Request request)
        {
            if (uow.RequestRepo.Exists(request.Id))
            {
                uow.RequestRepo.Delete(request);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        public bool RequestExists(Guid? id)
        {
            return uow.RequestRepo.Exists(id);
        }
    }
}
