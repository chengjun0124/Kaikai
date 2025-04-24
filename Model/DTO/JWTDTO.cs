using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model.DTO
{
    public class JWTDTO : BaseDTO
    {
        public int UserId;
        public int UserType;
        public long Expire;
    }
}
