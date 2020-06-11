using System;
using System.Linq;
using System.Text;
using System.Security.Claims;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;
using PTOTMT.Common.ViewModels;


namespace PTOTMT.Service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CrossOrigin")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration config;
        private readonly IUnitOfWorkWebAPI uow;
        public UsersController(IUnitOfWorkWebAPI _uow, IConfiguration _config)
        {
            uow = _uow;
            config = _config;
        }

        // GET: api/Users
        [HttpGet, Route("")]
        public IEnumerable<User> GetUser()
        {
            return uow.UserRepo.GetAll();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<User> GetUser(Guid? id)
        {
            var user = uow.UserRepo.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult PutUser(Guid? id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }
            if (uow.UserRepo.Exists(id))
            {
                uow.UserRepo.Put(user, user.Id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // POST: api/Users
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<User> PostUser(User user)
        {
            uow.UserRepo.Post(user);
            uow.SaveChanges();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteUserById(Guid? id)
        {
            if (uow.UserRepo.Exists(id))
            {
                uow.UserRepo.DeleteById(id);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/Users/5
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteUser(User user)
        {
            if (uow.UserRepo.Exists(user.Id))
            {
                uow.UserRepo.Delete(user);
                uow.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        [HttpGet("userexists/{id}")]
        public bool UserExists(Guid? id)
        {
            return uow.UserRepo.Exists(id);
        }

        [AllowAnonymous]
        [HttpPost, Route("login")]
        public IActionResult Login([FromBody]LoginViewModel credentials)
        {
            if (credentials == null) { return Unauthorized(); }
            try
            {
                User user = uow.UserRepo.GetUserDetails(credentials);
                if (user == null) { return Unauthorized(); }
                string tokenString = GenerateJWTToken(user);
                return Ok(new { Token = tokenString, User = user });
            }
            catch (Exception ex) { throw ex; }
        }

        //Generate JWT token with or without claims
        private string GenerateJWTToken(User user)
        {
            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            SigningCredentials signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            List<Claim> claims = new List<Claim>();
            if (user != null)
            {
                claims.AddRange(new[]
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                });
                Role role = uow.RoleRepo.GetById(user.RoleId);
                if (role != null)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role.Name));
                }

            }
            JwtSecurityToken tokenOptions = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: signinCredentials
            );
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        //Get all claims from token
        public string GetClaim(string token, string claimType)
        {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            JwtSecurityToken securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
            var stringClaimValue = securityToken.Claims.First(claim => claim.Type == claimType).Value;
            return stringClaimValue;
        }

        // To check whether it is a valid token of the user
        public bool ValidateCurrentToken(string token)
        {
            SymmetricSecurityKey mySecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@123"));
            string myIssuer = "https://localhost:44327/";
            string myAudience = "https://localhost:44382/";

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = myIssuer,
                    ValidAudience = myAudience,
                    IssuerSigningKey = mySecurityKey
                }, out SecurityToken validatedToken);
            }
            catch
            {
                return false;
            }
            return true;
        }
    }
}


