using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;
using PTOTMT.Repository.Implementation.Web;
using System.Threading.Tasks;
using PTOTMT.Repository.Abstraction.Web;

namespace PTOTMT.Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("CrossOrigin")]
    public class RequestsController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;
        private IEmailSender emailSender;
        public RequestsController(IUnitOfWorkWebAPI _uow, EmailSender _emailSender)
        {
            uow = _uow;
            emailSender = _emailSender;
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
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IEnumerable<Request> GetRequestsByUserId(Guid? userId)
        {
            var requests = GetRequest();
            return requests.Where(r => r.UserId == userId);
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
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<Request>> PostRequest(Request request)
        {
            Quota quotaToAllot = FindQuota(request);
            string emailBody = $"Your PTO request for { request.Hours} hours from { request.StartDateTime} to{request.EndDateTime} ";
            if (quotaToAllot != null  && uow.QuotaRepo.UpdateRemainingHours(quotaToAllot, request.Hours))
            {
                request.QuotaId = quotaToAllot.Id;
                var approvedStatus = uow.StatusRepo.GetAll().Where(status => status.Name == "Approved").FirstOrDefault();
                request.StatusId = approvedStatus.Id;
                emailBody +=  $"is approved under quota {quotaToAllot.Name}";
            }
            else
            {
                request.QuotaId = null;
                var waitlistStatus = uow.StatusRepo.GetAll().Where(status => status.Name == "WaitList").FirstOrDefault();
                request.StatusId = waitlistStatus.Id;
                emailBody += "is in Waiting List";
            }
            uow.RequestRepo.Post(request);
            uow.SaveChanges();

            //SendStatusEmails();
            var message = new EmailMessage(new string[] { "deeparajasabeson@gmail.com" }, "Test email", emailBody);
            //_emailSender.SendEmail(message);
            await emailSender.SendEmailAsync(message);

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

        private Quota FindQuota(Request request)
        {
            return uow.QuotaRepo.GetAll()
                               .Where(quota => quota.StartDateTime <= request.StartDateTime
                                                       && quota.EndDateTime >= request.EndDateTime
                                                       && quota.RemainingHours >= request.Hours)
                               .FirstOrDefault();
        }
    }
}
