using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Repositories;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerRepository _repository;
        private readonly IUrlHelper _urlHelper;

        public CustomersController(ICustomerRepository repository)
        {
            _repository = repository;
        }

        [HttpGet(Name = nameof(GetAll))]
        public ActionResult GetAll()
        {
            List<Customer> customers = _repository.GetAll().ToList();
            return Ok(customers);
        }

        [HttpGet]
        [Route("{id:int}", Name = nameof(GetSingle))]
        public ActionResult GetSingle(int id)
        {
            Customer customer = _repository.GetSingle(id);

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        [HttpPost(Name = nameof(AddCustomer))]
        public ActionResult<CustomerDto> AddCustomer([FromBody] CustomerCreateDto createDto)
        {
            if (createDto == null)
            {
                return BadRequest();
            }

            Customer toAdd = Mapper.Map<Customer>(createDto);

            _repository.Add(toAdd);

            if (!_repository.Save())
            {
                throw new Exception("Creating a Customer failed on save.");
            }

            Customer newCustomer = _repository.GetSingle(toAdd.Id);

            return CreatedAtRoute(nameof(GetSingle), new { id = newCustomer.Id },
                Mapper.Map<CustomerDto>(newCustomer));
        }

        [HttpDelete]
        [Route("{id:int}", Name = nameof(RemoveCustomer))]
        public ActionResult RemoveCustomer(int id)
        {
            Customer Customer = _repository.GetSingle(id);

            if (Customer == null)
            {
                return NotFound();
            }

            _repository.Delete(id);

            if (!_repository.Save())
            {
                throw new Exception("Deleting a Customer failed on save.");
            }

            return NoContent();
        }

        [HttpPut]
        [Route("{id:int}", Name = nameof(UpdateCustomer))]
        public ActionResult<CustomerDto> UpdateCustomer(int id, [FromBody] CustomerUpdateDto updateDto)
        {
            if (updateDto == null)
            {
                return BadRequest();
            }

            var existingCustomer = _repository.GetSingle(id);

            if (existingCustomer == null)
            {
                return NotFound();
            }
            
            Mapper.Map(updateDto, existingCustomer);

            _repository.Update(id, existingCustomer);

            if (!_repository.Save())
            {
                throw new Exception("Updating a Customer failed on save.");
            }

            return Ok(Mapper.Map<CustomerDto>(existingCustomer));
        }
    }
}