using System;
using System.Text;
using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using PTOTMT.Common.ViewModels;
using PTOTMT.Common.Entities;

namespace PTOTMT.First.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        public AuthController(IHttpClientFactory clientFactory) {
            _clientFactory = clientFactory;
        }

        [HttpPost, Route("login")]
        public IActionResult Login([FromBody]LoginViewModel user)
        {
            if (user == null)
            {
                return BadRequest("Invalid client request");
            }

            // Get an instance of HttpClient from the factpry that we registered
            // in Startup.cs
            User userDetails;
            var request = new HttpRequestMessage( HttpMethod.Get, 
                                            $"http://localhost:44327/api/user/getuser?username={user.username}&password={user.password}");
            request.Headers.Add("Accept", "application/json");

            var client = _clientFactory.CreateClient();
            var response = client.SendAsync(request);
            userDetails = response.Result.Content.ReadAsAsync<User>().Result;
            if (userDetails != null)
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: "http://localhost:5000",
                    audience: "http://localhost:5000",
                    claims: new List<Claim>(),
                    expires: DateTime.Now.AddMinutes(5),
                    signingCredentials: signinCredentials
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString, User = userDetails });
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}
