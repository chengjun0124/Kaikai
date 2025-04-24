using AutoMapper;
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
    public class UserController : BaseApiController
    {
        [Inject]
        public UserDAL userDAL { get; set; }

        User user;
        
        #region APIs
        [HttpPost]
        [ApiAuthorize(UserTypeEnum.Admin)]
        [Validation("ValidateCreateUser")]
        public int CreateUser(UserDTO dto)
        {
            User ee = Mapper.Map<User>(dto);
            ee.Password = EncodingHelper.MD5(dto.PassWord);
            ee.CreatedDate = DateTime.Now;

            userDAL.Insert(ee);
            return ee.UserId;
        }

        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin)]
        [Route("user/{pageNumber}/{pageSize}")]
        public UserListDTO GetUsers(int pageNumber, int pageSize)
        {
            var users = userDAL.GetUsers(pageNumber, pageSize);
            UserListDTO listDTO = new UserListDTO();
            listDTO.RecordCount = userDAL.GetOrderCount();
            users.ForEach(u => listDTO.Users.Add(Mapper.Map<UserDTO>(u)));
            return listDTO;
        }

        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin)]
        [Validation("ValidateGetUser")]
        public UserDTO GetUser(int id)
        {
            return Mapper.Map<UserDTO>(user);
        }

        [HttpPut]
        [ApiAuthorize(UserTypeEnum.Admin)]
        [Validation("ValidateUpdateUser")]
        public bool UpdateUser(UserDTO dto)
        {
            if (dto.PassWord != null && dto.PassWord.Length > 0)
                user.Password = EncodingHelper.MD5(dto.PassWord);
            user.UserName = dto.Username;
            user.UserTypeId = (int)dto.UserTypeId;
            userDAL.Update(user);
            return true;
        }

        [HttpDelete]
        [ApiAuthorize(UserTypeEnum.Admin)]
        [Validation("ValidateDeleteUser")]
        public bool DeleteUser(int id)
        {
            user.IsDeleted = true;
            userDAL.Update(user);
            return true;
        }
        
        #endregion

        #region Validations
        [NonAction]
        public void ValidateGetUser(int id)
        {
            user = userDAL.GetUser(id);
            if (user == null)
            {
                this.IsIllegalParameter = true;
            }
        }

        [NonAction]
        public void ValidateCreateUser(UserDTO dto)
        {
            ValidateUser(dto, true);
        }

        [NonAction]
        public void ValidateUpdateUser(UserDTO dto)
        {
            user = userDAL.GetUser(dto.UserId);
            if (user == null)
            {
                this.IsIllegalParameter = true;
                return;
            }

            ValidateUser(dto, false);
        }

        [NonAction]
        public void ValidateDeleteUser(int id)
        {
            user = userDAL.GetUser(id);
            if (user == null)
            {
                this.IsIllegalParameter = true;
                return;
            }

            this.ValidatorContainer.SetValue("ddd", 1)
                .Custom(() => user.UserId != this.Identity.UserId, "不能删除自己");

            
        }

        private void ValidateUser(UserDTO dto, bool isCreate)
        {
            this.ValidatorContainer.SetValue("用户名", dto.Username)
                .IsRequired(true)
                .Length(null, 16)
                .Pattern("^[0-9a-zA-Z]+$", "只能包含字母和数字")
                .Custom(() => !userDAL.IsExistedUserName(dto.Username, isCreate ? 0 : dto.UserId), "已存在");

            this.ValidatorContainer.SetValue("密码", dto.PassWord);
            if (isCreate)
                this.ValidatorContainer.IsRequired(false);
            this.ValidatorContainer
                .Length(8, 16)
                .Pattern("[a-zA-Z]", "至少包含一个字母")
                .Pattern("[0-9]", "至少包含一个数字");

            this.ValidatorContainer.SetValue("用户类型", dto.UserTypeId)
                .IsInList(UserTypeEnum.Admin, UserTypeEnum.Operator);
        }
        #endregion
    }
}
