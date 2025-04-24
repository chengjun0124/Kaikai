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
    public class UserDAL : BaseDAL<User>
    {
        public UserDAL(KaiKaiContext dbContext)
        {
            base.dbContext = dbContext;
        }

        public User AuthUser(string userName, string password)
        {
            return dbContext.Query<User>().Where(
                u => u.Password == password
                && u.UserName == userName
                && u.IsDeleted == false)
                .FirstOrDefault();
        }

        public List<User> GetUsers(int pageNumber, int pageSize)
        {
            IQueryable<User> list = dbContext.Query<User>();

            return list
                .Where(ee => ee.IsDeleted == false)
                .OrderByDescending(ee => ee.CreatedDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize).ToList();
        }

        public int GetOrderCount()
        {
            return dbContext.Query<User>()
                .Where(e => e.IsDeleted == false).Count();
        }

        public bool IsExistedUserName(string userName, int userId)
        {
            return dbContext.Query<User>()
                .Where(u => u.UserName == userName
                    && u.IsDeleted == false
                    && u.UserId != userId
                ).Count() > 0;
        }



        public User GetUser(int userId)
        {
            return dbContext.Query<User>()
                .Where(ee => ee.UserId == userId && ee.IsDeleted == false).FirstOrDefault();
        }

        
    }
}
