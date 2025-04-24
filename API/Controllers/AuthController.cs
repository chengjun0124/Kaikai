using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using KaiKai.Model.DTO;
using Newtonsoft.Json;
using KaiKai.Common;
using System.Security.Principal;
using KaiKai.DAL;
using KaiKai.Model;
using Ninject;
using KaiKai.Model.Enum;
using System.Text.RegularExpressions;
using System.Web;

namespace KaiKai.API
{
    public class AuthController : BaseApiController
    {
        [Inject]
        public UserDAL userDAL { get; set; }
        
        User userEntity = null;


        [HttpGet]
        [Route("auth/{userName}/{password}")]
        [Validation("ValidAuth")]
        public AuthDTO Auth(string userName, string password)
        {
            //admin MD5 21232f297a57a5a743894a0e4a801fc3
            JWTDTO jwt = new JWTDTO()
            {
                UserId = userEntity.UserId,
                UserType = userEntity.UserTypeId,
                Expire = DateTime.Now.AddHours(12).Ticks
            };

            string claim = JsonConvert.SerializeObject(jwt);
            claim = EncodingHelper.EncodeBase64(claim);
            return new AuthDTO()
            {
                Jwt = "Basic " + claim + "." + EncodingHelper.HMACMD5(claim, Constant.JWTKey),
                UserTypeId = userEntity.UserTypeId
            };
        }

        [NonAction]
        public void ValidAuth(string userName, string password)
        {
            userEntity = userDAL.AuthUser(userName, EncodingHelper.MD5(password));
            if (userEntity == null)
            {
                this.AddInvalidMessage("login", "用户名或密码错误，请重新输入");
                return;
            }
        }
    }
}