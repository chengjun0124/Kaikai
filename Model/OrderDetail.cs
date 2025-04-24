using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model
{
    public class OrderDetail : BaseModel
    {
        public Guid OrderDetailId { get; set; }
        public string Color { get; set; }
        public string Cloth { get; set; }
        public int Amount { get; set; }
        //public bool IsLongSleeve { get; set; }
        public int OrderId { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public decimal? Price { get; set; }
        public string SizeName { get; set; }
        public int Seq { get; set; }

        public virtual Order Order { get; set; }
    }

    public class OrderDetailConfiguration : EntityTypeConfiguration<OrderDetail>
    {
        public OrderDetailConfiguration()
        {
            this.HasKey(o => o.OrderDetailId);

            this.Property(o => o.OrderDetailId).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            this.HasRequired(e => e.Order)
              .WithMany(et => et.OrderDetails)
              .HasForeignKey(e => e.OrderId);
        }
    }
}
