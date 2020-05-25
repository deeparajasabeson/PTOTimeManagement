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
    public class LocationsController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public LocationsController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }

        // GET: api/Locations
        [HttpGet]
        public IEnumerable<Location> GetLocation()
        {
            return uow.LocationRepo.GetAll();
        }

        // GET: api/Locations/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Location> GetLocation(Guid? id)
        {
            var location = uow.LocationRepo.GetById(id);
            if (location == null)
            {
                return NotFound();
            }
            return location;
        }

        // PUT: api/Locations/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutLocation(Guid? id, Location location)
        {
            if (id != location.Id)
            {
                return BadRequest();
            }
            if (uow.LocationRepo.Exists(id))
            {
                uow.LocationRepo.Put(location);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/Locations
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Location> PostLocation(Location location)
        {
            Location addedLocation = uow.LocationRepo.Post(location);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetLocation), new { id = addedLocation.Id }, addedLocation);
        }

        // DELETE: api/Locations/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteLocationById(Guid? id)
        {
            if (uow.LocationRepo.Exists(id))
            {
                uow.LocationRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/Locations/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteLocation(Location location)
        {
            if (uow.LocationRepo.Exists(location.Id))
            {
                uow.LocationRepo.Delete(location);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        public bool LocationExists(Guid? id)
        {
            return uow.LocationRepo.Exists(id);
        }
    }
}
