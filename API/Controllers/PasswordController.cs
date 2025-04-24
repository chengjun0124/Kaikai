using KaiKai.Common;
using KaiKai.DAL;
using KaiKai.Model;
using KaiKai.Model.DTO;
using KaiKai.Model.Enum;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace KaiKai.API.Controllers
{
    public class PasswordController : BaseApiController
    {
        [Inject]
        public UserDAL eeDAL { get; set; }

        User user = null;

        [HttpPut]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Validation("ValidateUpdatePassword")]
        public bool UpdatePassword(PasswordDTO dto)
        {
            user.Password = EncodingHelper.MD5(dto.NewPassword);
            eeDAL.Update(user);
            return true;
        }

        [NonAction]
        public void ValidateUpdatePassword(PasswordDTO dto)
        {
            user = eeDAL.GetUser(this.Identity.UserId);
            if (user == null)
            {
                this.IsIllegalParameter = true;
                return;
            }

            this.ValidatorContainer.SetValue("旧密码", dto.OldPassword)
                .IsRequired(false)
                .Custom(() => EncodingHelper.MD5(dto.OldPassword) == user.Password, "不正确");

            this.ValidatorContainer.SetValue("新密码", dto.NewPassword)
                .IsRequired(false)
                .Length(8, 16)
                .Pattern("[a-zA-Z]", "至少包含一个字母")
                .Pattern("[0-9]", "至少包含一个数字");
        }
    }
}

