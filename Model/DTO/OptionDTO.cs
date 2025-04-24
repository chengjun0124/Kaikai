using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model.DTO
{
    public class OptionDTO : BaseDTO
    {
        public string Text;
        public string Value;
    }

    public class CompanyOptionDTO : OptionDTO
    {
        public CompanyOptionDTO() 
        {
            this.Departments = new List<OptionDTO>();
            this.Jobs = new List<OptionDTO>();
        }
        public List<OptionDTO> Departments;
        public List<OptionDTO> Jobs;
    }

    public class GroupOptionDTO : OptionDTO
    {
        public GroupOptionDTO() 
        {
            this.Companies = new List<CompanyOptionDTO>();
        }

        public List<CompanyOptionDTO> Companies;
    }

    public class CategoryOptionDTO : OptionDTO
    {
        public CategoryOptionDTO() 
        {
            this.ManSizes = new List<OptionDTO>();
            this.WomanSizes = new List<OptionDTO>();
        }

        public List<OptionDTO> ManSizes;
        public List<OptionDTO> WomanSizes;
    }
}
