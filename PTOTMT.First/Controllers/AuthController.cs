using System;
using System.Text;
using System.Net.Http;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using PTOTMT.Common.ViewModels;
using PTOTMT.Common.Entities;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace PTOTMT.First.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost, Route("login")]
        public async Task<IActionResult> Login([FromBody]LoginViewModel user)
        {
            if (user == null)
            {
                return BadRequest("Invalid client request");
            }
            using (HttpClient httpclient = new HttpClient())
            {
                User userDetails = null;
                try
                {
                    httpclient.DefaultRequestHeaders.Accept.Clear();
                    httpclient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    string uri = $"https://localhost:44382/api/users/userdetails?username={user.username}&password={user.password}";
                    HttpResponseMessage response = await httpclient.GetAsync(uri);
                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        userDetails = JsonConvert.DeserializeObject<User>(content);
                    }
                    else
                    { 
                        throw new HttpRequestException("Http Web API call response is not successful");
                    }
                    if (userDetails != null)
                    {
                        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
                        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                        var tokenOptions = new JwtSecurityToken(
                            issuer: "http://localhost:5000",
                            audience: "http://localhost:5000",
                            claims: new List<Claim>(),
                            expires: DateTime.Now.AddMinutes(5),
                            signingCredentials: signinCredentials
                        );
                        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                        return Ok(new { Token = tokenString, User = userDetails });
                    }
                    else { return Unauthorized(); }
                }
                catch (HttpRequestException httpRequestException)
                {
                    return BadRequest($"Error getting user details from User ==>> {httpRequestException.Message}");
                }
            }
        }
    }
}
