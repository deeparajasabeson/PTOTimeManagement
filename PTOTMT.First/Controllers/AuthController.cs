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
        public async Task<IActionResult> Login([FromBody]LoginViewModel credentials)
        {
            if (credentials == null)
            {
                return BadRequest("Invalid client request");
            }
            using HttpClient httpclient = new HttpClient();
            try
            {
                httpclient.DefaultRequestHeaders.Accept.Clear();
                httpclient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string tokenString = await GenerateJWTToken(null, httpclient);
                httpclient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenString);

                User user = await GetUser(credentials, httpclient);
                if (user == null)
                {
                    return Unauthorized();
                }

                tokenString = await GenerateJWTToken(user, httpclient);
                return Ok(new { Token = tokenString, User = user });
            }
            catch (Exception ex) { throw ex; }
        }

        private async Task<User> GetUser(LoginViewModel user, HttpClient httpclient)
        {
            try
            {
                string uri = $"https://localhost:44382/api/users/userdetails?username={user.username}&password={user.password}";
                HttpResponseMessage response = await httpclient.GetAsync(uri);
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException("Http Web API call response from UsersController Service is not successful");
                }
                string content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<User>(content);
            }
            catch (HttpRequestException httpRequestException)
            {
                throw new HttpRequestException($"Error getting user details from User ==>> {httpRequestException.Message}");
            }
        }

        private async Task<string> GenerateJWTToken(User user, HttpClient httpclient)
        {
            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
            SigningCredentials signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            List<Claim> claims = new List<Claim>();
            if (user != null)
            {
                Role role = await GetUserRole(user.RoleId, httpclient);
                claims.AddRange(new[]
                {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, role.Name)
            });
            }
            JwtSecurityToken tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:5000",
                audience: "http://localhost:5000",
                claims: claims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: signinCredentials
            );
            return  new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        private async Task<Role> GetUserRole(Guid roleId, HttpClient httpclient)
        {
            try
            {
                string uri = $"https://localhost:44382/api/roles/userdetails?Id={roleId}";
                HttpResponseMessage response = await httpclient.GetAsync(uri);
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException("Http Web API call response from RolesController Service is not successful");
                }
                string content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Role>(content);
            }
            catch (HttpRequestException httpRequestException)
            {
                throw new HttpRequestException($"Error getting role details of User ==>> {httpRequestException.Message}");
            }
        }
    }
}
