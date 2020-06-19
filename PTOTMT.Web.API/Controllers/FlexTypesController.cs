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

        public class FlexTypesController : ControllerBase
        {
            private readonly IUnitOfWorkWebAPI uow;

            public FlexTypesController(IUnitOfWorkWebAPI _uow)
            {
                uow = _uow;
            }

            // GET: api/FlexTypes
            [HttpGet]
            public IEnumerable<FlexType> GetFlexTypes()
            {
                return uow.FlexTypeRepo.GetAll();
            }

            // GET: api/FlexTypes/5
            [HttpGet("{id}")]
            [ProducesResponseType(StatusCodes.Status404NotFound)]
            public ActionResult<FlexType> GetFlexType(Guid? id)
            {
                var flexType = uow.FlexTypeRepo.GetById(id);
                if (flexType == null)
                {
                    return NotFound();
                }
                return flexType;
            }

            // GET: api/flextypes/flextypebyname/{name}
            [HttpGet("flextypebyname/{name}")]
            [ProducesResponseType(StatusCodes.Status404NotFound)]
            public ActionResult<FlexType> GetFlexTypeByName(string name)
            {
                var flexType = uow.FlexTypeRepo.GetByName(name);
                if (flexType == null)
                {
                    return NotFound();
                }
                return flexType;
            }

            // PUT: api/FlexTypes/5
            // To protect from overposting attacks, enable the specific properties you want to bind to, for
            // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
            [HttpPut("{id}")]
            [ProducesResponseType(StatusCodes.Status400BadRequest)]
            [ProducesResponseType(StatusCodes.Status404NotFound)]
            [ProducesResponseType(StatusCodes.Status204NoContent)]
            public IActionResult PutFlexType(Guid? id, FlexType flexType)
            {
                if (id != flexType.Id)
                {
                    return BadRequest();
                }
                if (uow.FlexTypeRepo.Exists(id))
                {
                    uow.FlexTypeRepo.Put(flexType, flexType.Id);
                    uow.SaveChanges();
                    return NoContent();
                }
                return NotFound();
            }

            // POST: api/FlexTypes
            // To protect from overposting attacks, enable the specific properties you want to bind to, for
            // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
            [HttpPost]
            [ProducesResponseType(StatusCodes.Status200OK)]
            public ActionResult<FlexType> PostFlexType(FlexType flexType)
            {
                uow.FlexTypeRepo.Post(flexType);
                uow.SaveChanges();
                return CreatedAtAction(nameof(GetFlexType), new { id = flexType.Id }, flexType);
            }

            // DELETE: api/flextypes/5
            [HttpDelete("{id}")]
            [ProducesResponseType(StatusCodes.Status404NotFound)]
            public IActionResult DeleteFlexTypeById(Guid? id)
            {
                if (uow.FlexTypeRepo.Exists(id))
                {
                    uow.FlexTypeRepo.DeleteById(id);
                    uow.SaveChanges();
                    return NoContent();
                }
                return NotFound();
            }

            // DELETE: api/flextypes/5
            [HttpDelete]
            [ProducesResponseType(StatusCodes.Status404NotFound)]
            public ActionResult DeleteFlexType(FlexType flexType)
            {
                if (uow.FlexTypeRepo.Exists(flexType.Id))
                {
                    uow.FlexTypeRepo.Delete(flexType);
                    uow.SaveChanges();
                    return NoContent();
                }
                return NotFound();
            }

            [HttpGet("exists/{id}")]
            public bool FlexTypeExists(Guid? id)
            {
                return uow.FlexTypeRepo.Exists(id);
            }
        }
    }
