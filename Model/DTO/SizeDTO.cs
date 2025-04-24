using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model.DTO
{
    public class SizeDTO : BaseDTO
    {
        public int SizeId;
        public string SizeName;
        public string Category;
        public string Sex;
        public bool IsLocked;

        //如果不同的API都用到这个SizeDTO，然而有的只需要返回SizeId，SizeName，有的还需要返回下面的字段，但是又不想新建新的DTO，就得用JsonProperty(NullValueHandling = NullValueHandling.Ignore)，让API不返回null字段
        //这样的话，问题是DTO和model的字段类型不完全一一对应，比如model里有decimal NeckScopeL,但DTO里必须是decimal? NeckScopeL,那么在做表单验证时，需多加小心。
        //而且这样设计，DAL层必须配合返回IQueryable<>,而不是List<>,用了IQueryable<>才能在API里选择性的加载字段
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? NeckScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? NeckScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? ShoulderScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? ShoulderScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? FLengthScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? FLengthScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? BLengthScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? BLengthScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? ChestScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? ChestScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? WaistScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? WaistScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? LowerHemScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? LowerHemScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? LSleeveLengthScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? LSleeveLengthScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? LSleeveCuffScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? LSleeveCuffScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? SSleeveLengthScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? SSleeveLengthScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? SSleeveCuffScopeL;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? SSleeveCuffScopeU;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<SizeDetailDTO> SizeDetails;

    }

    public class SizeDetailDTO
    {
        public string SizeName;
        public string SizeAlias;
        public decimal Neck;
        public decimal Shoulder;
        public decimal FLength;
        public decimal BLength;
        public int Chest;
        public decimal Waist;
        public decimal LowerHem;
        public decimal LSleeveLength;
        public decimal LSleeveCuff;
        public decimal SSleeveLength;
        public decimal SSleeveCuff;
        public string Sex;
    }

    public class SizeListDTO : BaseDTO
    {
        public SizeListDTO()
        {
            this.Sizes = new List<SizeDTO>();
        }
        public List<SizeDTO> Sizes;
        public int RecordCount;
    }



}
