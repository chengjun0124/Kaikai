using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model
{
    public class User : BaseModel
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int UserTypeId { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsDeleted { get; set; }


        public virtual UserType UserType { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }

    public class UserConfiguration : EntityTypeConfiguration<User>
    {
        public UserConfiguration()
        {
            this.HasKey(e => e.UserId);
            this.Property(e => e.UserName).IsRequired().HasMaxLength(16).IsUnicode(false);
            this.Property(e => e.Password).IsRequired().IsUnicode(false).IsFixedLength().HasMaxLength(32);
            this.Property(e => e.UserTypeId).IsRequired();
            
            this.Property(e => e.CreatedDate).IsRequired();
            this.Property(e => e.IsDeleted).IsRequired();
            

            this.HasRequired(e => e.UserType)
                .WithMany(et => et.Users)
                .HasForeignKey(e => e.UserTypeId);
        }
    }
}
