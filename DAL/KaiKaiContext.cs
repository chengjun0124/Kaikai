using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using KaiKai.Model;
using System.Configuration;

namespace KaiKai.DAL
{
    public class KaiKaiContext : BaseContext
    {
        public KaiKaiContext() : base(ConfigurationManager.AppSettings["DBConnection"]) { }
        

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Configurations.Add(new UserTypeConfiguration());
            modelBuilder.Configurations.Add(new UserConfiguration());
            modelBuilder.Configurations.Add(new OrderConfiguration());
            modelBuilder.Configurations.Add(new OrderDetailConfiguration());
            modelBuilder.Configurations.Add(new SizeConfiguration());
            modelBuilder.Configurations.Add(new SizeDetailConfiguration());
            
        }
    }
}
