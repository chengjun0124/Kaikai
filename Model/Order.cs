using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model
{
    public class Order : BaseModel
    {
        public Order()
        {
            this.OrderDetails = new List<OrderDetail>();
        }
        public int OrderId { get; set; }
        public string Group { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }
        public string Job { get; set; }
        public string EmployeeCode { get; set; }
        public string Name { get; set; }
        public byte? Age { get; set; }
        public string Sex { get; set; }
        public decimal? Height { get; set; }
        public decimal? Weight { get; set; }
        public decimal? ShirtNeck { get; set; }
        public decimal? ShirtShoulder { get; set; }
        public decimal? ShirtFLength { get; set; }
        public decimal? ShirtBLength { get; set; }
        public int? ShirtChest { get; set; }
        public decimal? ShirtWaist { get; set; }
        public decimal? ShirtLowerHem { get; set; }
        public decimal? ShirtLSleeveLength { get; set; }
        public decimal? ShirtLSleeveCuff { get; set; }
        public decimal? ShirtLPrice { get; set; }
        public decimal? ShirtSSleeveLength { get; set; }
        public decimal? ShirtSSleeveCuff { get; set; }
        public decimal? ShirtSPrice { get; set; }
        public string ShirtPreSize { get; set; }
        public string ShirtMemo { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsArchive { get; set; }
        public string ArchiveName { get; set; }
        public bool LongSleeveIsEnabled { get; set; }
        public bool ShortSleeveIsEnabled { get; set; }
        public string ShirtSizeName { get; set; }
        public int? ShirtChestEnlarge { get; set; }
        public int? ShirtWaistEnlarge { get; set; }
        public int? ShirtLowerHemEnlarge { get; set; }
        public string SuitModel { get; set; }
	    public string SuitSpec { get; set; }
	    public decimal? SuitFLength { get; set; }
	    public decimal? SuitSleeveLength { get; set; }
	    public decimal? SuitShoulder { get; set; }
	    public decimal? SuitChest { get; set; }
	    public decimal? SuitMidWaist { get; set; }
	    public decimal? SuitLowerhem { get; set; }
	    public decimal? SuitSleeveCuff { get; set; }
	    public string SuitTrousersModel { get; set; }
	    public decimal? SuitWaist { get; set; }
	    public decimal? SuitHip { get; set; }
	    public decimal? SuitWaistFork { get; set; }
	    public decimal? SuitLateralFork { get; set; }
	    public decimal? SuitTrousersLength { get; set; }
	    public decimal? SuitHemHeight { get; set; }
	    public decimal? SuitWomanWaist { get; set; }
	    public decimal? SuitFork { get; set; }
	    public decimal? SuitMidFork { get; set; }
	    public string SuitSkirtModel { get; set; }
	    public decimal? SuitSkirtWaist { get; set; }
	    public decimal? SuitSkirtHip { get; set; }
	    public decimal? SuitSkirtLength { get; set; }
	    public bool SuitIsEnabled { get; set; }
        public string CoatModel { get; set; }
	    public string CoatSpec { get; set; }
	    public decimal? CoatFLength { get; set; }
	    public decimal? CoatSleeveLength { get; set; }
	    public decimal? CoatShoulder { get; set; }
	    public decimal? CoatChest { get; set; }
	    public decimal? CoatMidWaist { get; set; }
	    public decimal? CoatLowerhem { get; set; }
	    public bool CoatIsEnabled { get; set; }
        public string WaistcoatModel { get; set; }
	    public string WaistcoatSpec { get; set; }
	    public decimal? WaistcoatFLength { get; set; }
	    public decimal? WaistcoatBLength { get; set; }
	    public decimal? WaistcoatShoulder { get; set; }
	    public decimal? WaistcoatChest { get; set; }
	    public decimal? WaistcoatMidWaist { get; set; }
	    public decimal? WaistcoatLowerhem { get; set; }
        public bool WaistcoatIsEnabled { get; set; }
        public bool AccessoryIsEnabled { get; set; }
        public decimal? SuitFLengthVar { get; set; }
        public decimal? SuitSleeveLengthVar { get; set; }
        public decimal? SuitShoulderVar { get; set; }
        public decimal? SuitChestVar { get; set; }
        public decimal? SuitMidWaistVar { get; set; }
        public decimal? SuitLowerhemVar { get; set; }
        public decimal? SuitSleeveCuffVar { get; set; }
        public decimal? SuitWaistVar { get; set; }
        public decimal? SuitHipVar { get; set; }
        public decimal? SuitWaistForkVar { get; set; }
        public decimal? SuitLateralForkVar { get; set; }
        public decimal? SuitTrousersLengthVar { get; set; }
        public decimal? SuitHemHeightVar { get; set; }
        public decimal? SuitWomanWaistVar { get; set; }
        public decimal? SuitForkVar { get; set; }
        public decimal? SuitMidForkVar { get; set; }
        public decimal? SuitSkirtWaistVar { get; set; }
        public decimal? SuitSkirtHipVar { get; set; }
        public decimal? SuitSkirtLengthVar { get; set; }
        public decimal? CoatFLengthVar { get; set; }
        public decimal? CoatSleeveLengthVar { get; set; }
        public decimal? CoatShoulderVar { get; set; }
        public decimal? CoatChestVar { get; set; }
        public decimal? CoatMidWaistVar { get; set; }
        public decimal? CoatLowerhemVar { get; set; }
        public decimal? WaistcoatFLengthVar { get; set; }
        public decimal? WaistcoatBLengthVar { get; set; }
        public decimal? WaistcoatShoulderVar { get; set; }
        public decimal? WaistcoatChestVar { get; set; }
        public decimal? WaistcoatMidWaistVar { get; set; }
        public decimal? WaistcoatLowerhemVar { get; set; }
        public string SuitMemo {get; set;}
        public string CoatMemo { get; set; }
        public string WaistcoatMemo { get; set; }


        public virtual User User { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }

    public class OrderConfiguration : EntityTypeConfiguration<Order>
    {
        public OrderConfiguration()
        {
            this.HasKey(o => o.OrderId);


            this.HasRequired(e => e.User)
                .WithMany(et => et.Orders)
                .HasForeignKey(e => e.UserId);
        }
    }
}
