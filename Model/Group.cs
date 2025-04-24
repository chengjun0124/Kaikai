using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model
{
    public class Group : BaseModel
    {
        public string GroupName { get; set; }
        public string CompanyName { get; set; }
        public string Department { get; set; }
        public string Job { get; set; }
    }
}
