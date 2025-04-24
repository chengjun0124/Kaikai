using KaiKai.Model.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model.DTO
{

    public class UserListDTO
    {
        public UserListDTO()
        {
            this.Users = new List<UserDTO>();
        }
        public List<UserDTO> Users;
        public int RecordCount;
    }


    public class UserDTO : BaseDTO
    {
        public int UserId;
        public string Username;
        public string PassWord;
        public UserTypeEnum UserTypeId;
    }
}
