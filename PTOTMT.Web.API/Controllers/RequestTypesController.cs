using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;


namespace PTOTMT.Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("CrossOrigin")]

    public class RequestTypesController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public RequestTypesController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/RequestTypes
        [HttpGet]
        public IEnumerable<RequestType> GetRequestTypes()
        {
            return uow.RequestTypeRepo.GetAll();

        }

        // GET: api/RequestTypes/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<RequestType> GetRequestType(Guid? id)
        {
            var requestType = uow.RequestTypeRepo.GetById(id);
            if (requestType == null)
            {
                return NotFound();
            }
            return requestType;
        }

        // GET: api/requesttypes/requesttypebyname/{name}
        [HttpGet("requesttypebyname/{name}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<RequestType> GetRequestTypeByName(string name)
        {
            var requestType = uow.RequestTypeRepo.GetByName(name);
            if (requestType == null)
            {
                return NotFound();
            }
            return requestType;
        }

        // PUT: api/RequestTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutRequestType(Guid? id, RequestType requestType)
        {
            if (id != requestType.Id)
            {
                return BadRequest();
            }
            if (uow.RequestTypeRepo.Exists(id))
            {
                uow.RequestTypeRepo.Put(requestType, requestType.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/RequestTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<RequestType> PostRequestType(RequestType requestType)
        {
            uow.RequestTypeRepo.Post(requestType);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetRequestType), new { id = requestType.Id }, requestType);
        }

        // DELETE: api/RequestTypes/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteRequestTypeById(Guid? id)
        {
            if (uow.RequestTypeRepo.Exists(id))
            {
                uow.RequestTypeRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/RequestTypes/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteRequestType(RequestType requestType)
        {
            if (uow.RequestTypeRepo.Exists(requestType.Id))
            {
                uow.RequestTypeRepo.Delete(requestType);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        [HttpGet("exists/{id}")]
        public bool RequestTypeExists(Guid? id)
        {
            return uow.RequestTypeRepo.Exists(id);
        }
    }
}
