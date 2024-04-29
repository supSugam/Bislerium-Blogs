﻿using Microsoft.AspNetCore.Mvc;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.DTOs;
using Microsoft.AspNetCore.Authorization;
using Bislerium_Blogs.Server.Helpers;

namespace Bislerium_Blogs.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;

        public AuthController(IAuthService authService,IEmailService emailService)
        {
            _authService = authService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> RegisterUserAsync([FromForm] RegisterUserDto registerUserDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var result = await _authService.RegisterUserAsync(registerUserDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginUserAsync([FromBody] LoginUserDto loginUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var result = await _authService.LoginUserAsync(loginUserDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("test-mail")]
        public async Task<IActionResult> TestMail()
        {
            try
            {
                await _emailService.SendOTP("sugam.subedi.s22@icp.edu.np", "Bruh");
                return Ok("Mail Sent");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("verify-otp")]
        [AuthorizedOnly]

        public async Task<IActionResult> VerifyOTP([FromBody] VerifyOtpDto verifyOtpDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                 await _authService.VerifyOtpAsync(verifyOtpDto);
                return Ok("Verified, You may login now!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
