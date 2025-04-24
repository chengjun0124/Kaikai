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
    public class CategoryController : BaseApiController
    {
        private static string[] CATEGORIES = new string[] { "衬衫", "西装", "大衣", "背心" };

        [Inject]
        public SizeDAL sizeDAL { get; set; }

        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        public List<CategoryOptionDTO> GetCategories()
        {
            List<CategoryOptionDTO> dtos = new List<CategoryOptionDTO>();
            List<Size> sizes = sizeDAL.GetSizes().ToList();

            CATEGORIES.ToList().ForEach(category =>
            {
                dtos.Add(new CategoryOptionDTO()
                {
                    Text = category,
                    Value = category,
                    ManSizes = sizes.Where(size => size.Sex == "M" && size.Category == category).Select(s => new OptionDTO() { Text = s.SizeName, Value = s.SizeId.ToString() }).ToList(),
                    WomanSizes = sizes.Where(size => size.Sex == "F" && size.Category == category).Select(s => new OptionDTO() { Text = s.SizeName, Value = s.SizeId.ToString() }).ToList()
                });
            });
            return dtos;
        }
    }
}
