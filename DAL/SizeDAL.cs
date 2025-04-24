using KaiKai.Model;
using KaiKai.Model.Enum;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace KaiKai.DAL
{
    public class SizeDAL : BaseDAL<Size>
    {
        public SizeDAL(KaiKaiContext dbContext)
        {
            base.dbContext = dbContext;
        }

        public IQueryable<Size> GetSizes()
        {
            return base.Query();
        }

        public IQueryable<Size> GetSizes(int pageNumber, int pageSize)
        {
            IQueryable<Size> list = dbContext.Query<Size>();

            return list
                .OrderByDescending(s => s.SizeName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);
        }


        public int GetSizeCount() 
        {
            return dbContext.Query<Size>().Count();
        }

        public Size GetSize(int sizeId, string sex)
        {
            return dbContext.Query<Size>().Where(s => s.SizeId == sizeId && s.Sex == sex).FirstOrDefault();
        }

        public Size GetSize(int sizeId, bool isGetSizeDetails)
        {
            IQueryable<Size> list = dbContext.Query<Size>();

            if (isGetSizeDetails)
                list.Include(s => s.SizeDetails);

            return list.Where(s => s.SizeId == sizeId).FirstOrDefault();
        }

        public List<SizeDetail> GetDefaultSizeDetails()
        {
            IQueryable<SizeDetail> list = dbContext.Query<SizeDetail>();

            list = list.Include(a => a.Size);

            return list.Where(sd => sd.Size.IsDefault == true).ToList();
        }

        public void DeleteSizeDetails(IEnumerable<SizeDetail> entities)
        {
            dbContext.Delete<SizeDetail>(entities);
        }

        public bool IsExistedSizeName(string sizeName, string sex, int sizeId)
        {
            return dbContext.Query<Size>()
                    .Where(s => s.SizeName == sizeName
                        && s.Sex == sex
                        && s.SizeId != sizeId
                    ).Count() > 0;
        }
    }
}
