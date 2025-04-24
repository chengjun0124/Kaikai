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
    public class SizeController : BaseApiController
    {
        private static string[] CATEGORIES = new string[] { "衬衫", "西装", "大衣", "背心" };

        [Inject]
        public SizeDAL sizeDAL { get; set; }

        Size size;
        
        #region APIs
        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        public IQueryable<SizeDTO> GetSizes()
        {
            //DAL返回IQueryable，是为了能在API层选择要转换到DTO的字段。如果DAL直接返回List,那么就不能有选择性的输出字段，会把DTO里所有的字段统统输出
            return sizeDAL.GetSizes().Select(s => new SizeDTO { SizeId = s.SizeId, SizeName = s.SizeName, Sex = s.Sex, IsLocked = s.IsLocked });
        }

        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Route("size/defaultsizedetails")]
        public List<SizeDetailDTO> GetDefaultSizeDetails()
        {
            List<SizeDetailDTO> dto = new List<SizeDetailDTO>();

            List<SizeDetail> sizeDetails = sizeDAL.GetDefaultSizeDetails();

            sizeDetails.ForEach(sd => dto.Add(Mapper.Map<SizeDetailDTO>(sd)));

            return dto;
        }

        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Route("size/{pageNumber}/{pageSize}")]
        public SizeListDTO GetSizes(int pageNumber, int pageSize)
        {
            var sizes = sizeDAL.GetSizes(pageNumber, pageSize);
            SizeListDTO listDTO = new SizeListDTO();
            listDTO.RecordCount = sizeDAL.GetSizeCount();
            listDTO.Sizes = sizeDAL.GetSizes(pageNumber, pageSize).Select(s => new SizeDTO { SizeId = s.SizeId, SizeName = s.SizeName, Sex = s.Sex, IsLocked = s.IsLocked }).ToList();
            return listDTO;
        }

        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Validation("ValidateGetSize")]
        public SizeDTO GetSize(int id)
        {
            size.SizeDetails=size.SizeDetails.OrderBy(sd => sd.Seq).ToList();
            return Mapper.Map<SizeDTO>(size);
        }
        
        [HttpPut]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Validation("ValidateUpdateSize")]
        public bool UpdateSize(SizeDTO dto)
        {
            size.SizeName = dto.SizeName;
            size.Sex = dto.Sex;

            size.NeckScopeL = dto.NeckScopeL.Value;
            size.NeckScopeU = dto.NeckScopeU.Value;
            size.ShoulderScopeL = dto.ShoulderScopeL.Value;
            size.ShoulderScopeU = dto.ShoulderScopeU.Value;
            size.FLengthScopeL = dto.FLengthScopeL.Value;
            size.FLengthScopeU = dto.FLengthScopeU.Value;
            size.BLengthScopeL = dto.BLengthScopeL.Value;
            size.BLengthScopeU = dto.BLengthScopeU.Value;
            size.ChestScopeL = dto.ChestScopeL.Value;
            size.ChestScopeU = dto.ChestScopeU.Value;
            size.WaistScopeL = dto.WaistScopeL.Value;
            size.WaistScopeU = dto.WaistScopeU.Value;
            size.LowerHemScopeL = dto.LowerHemScopeL.Value;
            size.LowerHemScopeU = dto.LowerHemScopeU.Value;
            size.LSleeveLengthScopeL = dto.LSleeveLengthScopeL.Value;
            size.LSleeveLengthScopeU = dto.LSleeveLengthScopeU.Value;
            size.LSleeveCuffScopeL = dto.LSleeveCuffScopeL.Value;
            size.LSleeveCuffScopeU = dto.LSleeveCuffScopeU.Value;
            size.SSleeveLengthScopeL = dto.SSleeveLengthScopeL.Value;
            size.SSleeveLengthScopeU = dto.SSleeveLengthScopeU.Value;
            size.SSleeveCuffScopeL = dto.SSleeveCuffScopeL.Value;
            size.SSleeveCuffScopeU = dto.SSleeveCuffScopeU.Value;

            sizeDAL.DeleteSizeDetails(size.SizeDetails);

            int count = 1;
            dto.SizeDetails.ForEach(sd => 
            {
                var sizeDetail = Mapper.Map<SizeDetail>(sd);
                sizeDetail.Seq = count++;
                size.SizeDetails.Add(sizeDetail);
            });

            sizeDAL.Update(size);
            return true;
        }

        [HttpPost]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Validation("ValidateCreateSize")]
        public int CreateSize(SizeDTO dto)
        {
            size = Mapper.Map<Size>(dto);
            size.CreatedDate = DateTime.Now;

            int count = 1;
            size.SizeDetails.ToList().ForEach(sd => sd.Seq = count++);

            return sizeDAL.Insert(size).SizeId;
        }

        [HttpDelete]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Validation("ValidatieDeleteSize")]
        public bool DeleteSize(int id)
        {
            sizeDAL.DeleteSizeDetails(size.SizeDetails);
            sizeDAL.Delete(size);
            return true;
        }
        #endregion

        #region Validations
        [NonAction]
        public void ValidatieDeleteSize(int id)
        {
            size = sizeDAL.GetSize(id, true);
            if (size == null)
                this.IsIllegalParameter = true;

            this.ValidatorContainer.SetValue("lock", size.IsLocked)
                        .Custom(() => !size.IsLocked, "该尺码表已被锁定，不能删除");
        }

        [NonAction]
        public void ValidateGetSize(int id)
        {
            size = sizeDAL.GetSize(id, true);
            if (size == null)
                this.IsIllegalParameter = true;
        }

        [NonAction]
        public void ValidateUpdateSize(SizeDTO dto)
        {
            ValidateSize(dto, false);
        }

        [NonAction]
        public void ValidateCreateSize(SizeDTO dto)
        {
            ValidateSize(dto, true);
        }

        private void ValidateSize(SizeDTO dto, bool isNew)
        {
            if (!isNew)
            {
                size = sizeDAL.GetSize(dto.SizeId, true);

                if (size == null)
                {
                    this.IsIllegalParameter = true;
                    return;
                }

                if (size.IsLocked)
                {
                    this.ValidatorContainer.SetValue("sizename", dto.SizeName)
                        .Custom(() => false, "该尺码表已被锁定，不能修改");
                    return;
                }
            }


            this.ValidatorContainer.SetValue("尺码表名称", dto.SizeName)
                .IsRequired(true)
                .Length(null, 10)
                .Custom(() => !sizeDAL.IsExistedSizeName(dto.SizeName, dto.Sex, isNew ? 0 : dto.SizeId), "已存在");

            this.ValidatorContainer.SetValue("分类", dto.Category)
                .IsRequired(true)
                .IsInList(CATEGORIES);

            this.ValidatorContainer.SetValue("性别", dto.Sex)
                .IsRequired(true)
                .IsInList("M", "F");

            this.ValidatorContainer.SetValue("领围下限", dto.NeckScopeL)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("领围上限", dto.NeckScopeU)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("肩宽下限", dto.ShoulderScopeL)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("肩宽上限", dto.ShoulderScopeU)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("前衣长下限", dto.FLengthScopeL)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("前衣长上限", dto.FLengthScopeU)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("后衣长下限", dto.BLengthScopeL)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("后衣长上限", dto.BLengthScopeU)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("胸围下限", dto.ChestScopeL)
                .IsRequired(true)
                .InRange(1, 999, null);

            this.ValidatorContainer.SetValue("胸围上限", dto.ChestScopeU)
                .IsRequired(true)
                .InRange(1, 999, null);

            this.ValidatorContainer.SetValue("腰围下限", dto.WaistScopeL)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("腰围上限", dto.WaistScopeU)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("下摆下限", dto.LowerHemScopeL)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("下摆上限", dto.LowerHemScopeU)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("长袖长下限", dto.LSleeveLengthScopeL)
               .IsRequired(true)
               .InRange(0.1m, 999.9m, null)
               .DecimalLength(1);

            this.ValidatorContainer.SetValue("长袖长上限", dto.LSleeveLengthScopeU)
               .IsRequired(true)
               .InRange(0.1m, 999.9m, null)
               .DecimalLength(1);

            this.ValidatorContainer.SetValue("长袖口大下限", dto.LSleeveCuffScopeL)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("长袖口大上限", dto.LSleeveCuffScopeU)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("短袖长下限", dto.SSleeveLengthScopeL)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("短袖长上限", dto.SSleeveLengthScopeU)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("短袖口大下限", dto.SSleeveCuffScopeL)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);

            this.ValidatorContainer.SetValue("短袖口大上限", dto.SSleeveCuffScopeU)
                .IsRequired(true)
                .InRange(0.1m, 999.9m, null)
                .DecimalLength(1);
            
            this.ValidatorContainer.SetValue("尺寸明细", dto.SizeDetails.Count)
                .Compare("0条", 0, CompareOperation.Greater);

            dto.SizeDetails.ForEach(sd => 
            {
                this.ValidatorContainer.SetValue("尺码", sd.SizeName)
                .IsRequired(true)
                .Length(null, 10)
                .Pattern("^[0-9a-zA-Z/]+$", "只能包含字母，数字，/")
                .Custom(() => 
                {
                    if (dto.SizeDetails.Where(s => s.SizeName == sd.SizeName).Count() > 1)
                        return false;
                    else
                        return true;
                }, "不能重名");

                this.ValidatorContainer.SetValue("尺码别名", sd.SizeAlias)
                .IsRequired(true)
                .Length(null, 10)
                .Pattern("^[0-9a-zA-Z/]+$", "只能包含字母，数字，/");

                this.ValidatorContainer.SetValue("领围", sd.Neck)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);

                this.ValidatorContainer.SetValue("肩宽", sd.Shoulder)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);

                this.ValidatorContainer.SetValue("前衣长", sd.FLength)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);

                this.ValidatorContainer.SetValue("后衣长", sd.BLength)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);

                this.ValidatorContainer.SetValue("胸围", sd.Chest)
                .InRange(1, 999, null);

                this.ValidatorContainer.SetValue("腰围", sd.Waist)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);

                this.ValidatorContainer.SetValue("下摆", sd.LowerHem)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);

                this.ValidatorContainer.SetValue("长袖长", sd.LSleeveLength)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);

                this.ValidatorContainer.SetValue("长袖口大", sd.LSleeveCuff)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);

                this.ValidatorContainer.SetValue("短袖长", sd.SSleeveLength)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);

                this.ValidatorContainer.SetValue("短袖口大", sd.SSleeveCuff)
                .InRange(1m, 999.9m, null)
                .DecimalLength(1);
            });
        }
        #endregion
    }
}
