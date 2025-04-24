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
using System.Text.RegularExpressions;
using System.Web.Http;

namespace KaiKai.API.Controllers
{
    public class CompanyController : BaseApiController
    {
        [Inject]
        public OrderDAL orderDAL { get; set; }

        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Route("group/options")]
        public List<GroupOptionDTO> GetGroupOptions()
        {
            List<KaiKai.Model.Group> groups = orderDAL.GetGroupOptions();

            List<GroupOptionDTO> dtos = new List<GroupOptionDTO>();

            groups.Select(g => g.GroupName).Distinct().ToList().ForEach(group => {
                GroupOptionDTO dto = new GroupOptionDTO();
                dto.Text = dto.Value = group;

                groups.Where(g => g.GroupName == group).Select(g => g.CompanyName).Distinct().ToList().ForEach(companyName =>
                {
                    CompanyOptionDTO companyDTO = new CompanyOptionDTO();
                    companyDTO.Text = companyDTO.Value = companyName;

                    groups.Where(g => g.GroupName == group && g.CompanyName == companyName).Select(c => c.Department).Distinct().ToList().ForEach(department =>
                    {
                        companyDTO.Departments.Add(new OptionDTO() { Text = department, Value = department });
                    });

                    groups.Where(g => g.GroupName == group && g.CompanyName == companyName).Select(c => c.Job).Distinct().ToList().ForEach(job =>
                    {
                        companyDTO.Jobs.Add(new OptionDTO() { Text = job, Value = job });
                    });

                    dto.Companies.Add(companyDTO);
                });
                dtos.Add(dto);
            });

            return dtos;
        }

        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]        
        public List<string> GetCompanies()
        {
            return orderDAL.GetCompanies();
        }


    }
}
