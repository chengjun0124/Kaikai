using KaiKai.Model;
using KaiKai.Model.Enum;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using KaiKai.Model.DTO;

namespace KaiKai.DAL
{
    public class OrderDAL : BaseDAL<Order>
    {
        public OrderDAL(KaiKaiContext dbContext)
        {
            base.dbContext = dbContext;
        }

        public Order GetOrder(int orderId, bool isGetDetails)
        {
            IQueryable<Order> list = dbContext.Query<Order>();

            if (isGetDetails)
                list = list.Include(o => o.OrderDetails);

            return list.Where(o =>
                o.OrderId == orderId
                && o.IsArchive == false
                ).FirstOrDefault();
        }

        public List<Order> GetOrders(IEnumerable<int> orderIds, bool isGetDetails)
        {
            IQueryable<Order> list = dbContext.Query<Order>();

            if (isGetDetails)
                list = list.Include(o => o.OrderDetails);

            return list.Where(o =>
                orderIds.Contains(o.OrderId)
                && o.IsArchive == false
                ).ToList();
        }

        public List<Order> GetOrders(string company, bool isGetDetails)
        {
            IQueryable<Order> list = dbContext.Query<Order>();

            if (isGetDetails)
                list = list.Include(o => o.OrderDetails);

            return list.Where(o => o.IsArchive == false && o.Company == company).ToList();
        }

        public List<Order> GetAllOrders()
        {
            return dbContext.Query<Order>().Where(o => o.IsArchive == false).ToList();
        }

        public List<Order> GetOrders(string group, string company, string department, string job, string employeeCode, string name, int pageNumber, int pageSize, bool isGetDetails)
        {
            IQueryable<Order> list = dbContext.Query<Order>();
            if (isGetDetails)
                list = list.Include(o => o.OrderDetails);

            if (group != null)
                list = list.Where(o => o.Group == group);
            if (company != null)
                list = list.Where(o => o.Company == company);
            if (department != null)
                list = list.Where(o => o.Department == department);
            if (job != null)
            {
                //job is nullable, and NULL is saved when job is empty(null or "" or " ")
                //if job is null, that means do not filter job; if job is "null", that means only keep the null jobs
                if (job == "null")
                    list = list.Where(o => o.Job == null);
                else
                    list = list.Where(o => o.Job == job);
            }
            if (employeeCode != null)
                list = list.Where(o => o.EmployeeCode == employeeCode);
            if (name != null)
                list = list.Where(o => o.Name == name);

            return list.Where(o => o.IsArchive == false)
                .OrderByDescending(o => o.CreatedDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        public bool IsExistEmployeeCode(string company, string employeeCode, int orderId)
        {
            int c = dbContext.Query<Order>().Where(o =>
                o.IsArchive == false
                && o.Company == company
                && o.EmployeeCode == employeeCode
                && o.OrderId != orderId
                ).Count();
            return c > 0;
        }

        public List<Order> GetOrders(int[] ids)
        {
            return dbContext.Query<Order>().Where(o => o.IsArchive == false && ids.Contains(o.OrderId)).ToList();
        }

        public int GetOrderCount(string group, string company, string department, string job, string employeeCode, string name)
        {
            IQueryable<Order> list = dbContext.Query<Order>();

            if (group != null)
                list = list.Where(o => o.Group == group);
            if (company != null)
                list = list.Where(o => o.Company == company);
            if (department != null)
                list = list.Where(o => o.Department == department);
            if (job != null)
            {
                //job is nullable, and NULL is saved when job is empty(null or "" or " ")
                //if job is null, that means do not filter job; if job is "null", that means only keep the null jobs
                if (job == "null")
                    list = list.Where(o => o.Job == null);
                else
                    list = list.Where(o => o.Job == job);
            }
            if (employeeCode != null)
                list = list.Where(o => o.EmployeeCode == employeeCode);
            if (name != null)
                list = list.Where(o => o.Name == name);

            return list.Where(o =>
                 o.IsArchive == false
                ).Count();
        }

        public void DeleteOrderDetails(IEnumerable<OrderDetail> entities)
        {
            dbContext.Delete<OrderDetail>(entities);
        }

        public List<KaiKai.Model.Group> GetGroupOptions()
        {
            return dbContext.Query<Order>().Where(o => o.IsArchive == false).Select(o => new Group { GroupName = o.Group, CompanyName = o.Company, Department = o.Department, Job = o.Job }).Distinct().ToList();
        }

        public List<string> GetCompanies()
        {
            return dbContext.Query<Order>().Where(c => c.IsArchive == false).Select(o => o.Company).Distinct().ToList();
        }
    }
}
