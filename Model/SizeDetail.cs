using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model
{
    public class SizeDetail : BaseModel
    {
        public int SizeId { get; set; }
        public string SizeName { get; set; }
        public string SizeAlias { get; set; }
        public decimal Neck { get; set; }
        public decimal Shoulder { get; set; }
        public decimal FLength { get; set; }
        public decimal BLength { get; set; }
        public int Chest { get; set; }
        public decimal Waist { get; set; }
        public decimal LowerHem { get; set; }
        public decimal LSleeveLength { get; set; }
        public decimal LSleeveCuff { get; set; }
        public decimal SSleeveLength { get; set; }
        public decimal SSleeveCuff { get; set; }
        public int Seq { get; set; }

        public virtual Size Size { get; set; }

    }

    public class SizeDetailConfiguration : EntityTypeConfiguration<SizeDetail>
    {
        public SizeDetailConfiguration()
        {
            this.HasKey(s => new { s.SizeId, s.SizeName });

            this.HasRequired(e => e.Size)
              .WithMany(et => et.SizeDetails)
              .HasForeignKey(e => e.SizeId);
        }
    }
}
