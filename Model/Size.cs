using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model
{
    public class Size : BaseModel
    {
        public int SizeId { get; set; }
        public string SizeName { get; set; }
        public string Category { get; set; }
        public string Sex { get; set; }
        public DateTime CreatedDate { get; set; }
        public decimal NeckScopeL { get; set; }
        public decimal NeckScopeU { get; set; }
        public decimal ShoulderScopeL { get; set; }
        public decimal ShoulderScopeU { get; set; }
        public decimal FLengthScopeL { get; set; }
        public decimal FLengthScopeU { get; set; }
        public decimal BLengthScopeL { get; set; }
        public decimal BLengthScopeU { get; set; }
        public int ChestScopeL { get; set; }
        public int ChestScopeU { get; set; }
        public decimal WaistScopeL { get; set; }
        public decimal WaistScopeU { get; set; }
        public decimal LowerHemScopeL { get; set; }
        public decimal LowerHemScopeU { get; set; }
        public decimal LSleeveLengthScopeL { get; set; }
        public decimal LSleeveLengthScopeU { get; set; }
        public decimal LSleeveCuffScopeL { get; set; }
        public decimal LSleeveCuffScopeU { get; set; }
        public decimal SSleeveLengthScopeL { get; set; }
        public decimal SSleeveLengthScopeU { get; set; }
        public decimal SSleeveCuffScopeL { get; set; }
        public decimal SSleeveCuffScopeU { get; set; }
        public bool IsLocked { get; set; }
        public bool IsDefault { get; set; }

        public virtual ICollection<SizeDetail> SizeDetails { get; set; }
    }

    public class SizeConfiguration : EntityTypeConfiguration<Size>
    {
        public SizeConfiguration()
        {
            this.HasKey(s => s.SizeId);
        }
    }
}
