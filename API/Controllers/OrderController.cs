using KaiKai.Common;
using KaiKai.DAL;
using KaiKai.Model;
using KaiKai.Model.DTO;
using KaiKai.Model.Enum;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;

namespace KaiKai.API.Controllers
{
    public class OrderController : BaseApiController
    {
        [Inject]
        public OrderDAL orderDAL { get; set; }

        Order order = null;
        List<Order> orders = null;

        #region APIs
        [HttpPost]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Validation("ValidateCreateOrder")]
        public int CreateOrder(OrderDTO dto)
        {
            Order o = Mapper.Map<Order>(dto);
            o.UserId = this.Identity.UserId;
            o.IsArchive = false;
            o.CreatedDate = DateTime.Now;
            return orderDAL.Insert(o).OrderId;
        }

        [HttpPut]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Validation("ValidateUpdateOrder")]
        public bool UpdateOrder(OrderDTO dto)
        {
            orderDAL.DeleteOrderDetails(order.OrderDetails);
            Mapper.Map<OrderDTO, Order>(dto, order);
            orderDAL.Update(order);
            return true;
        }

        //此功能前台已关闭，所以关闭对应API，如需启动，此API的代码需要依据功能重新实现
        //[HttpPut]
        //[ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        //[Route("order/updateorderdetailsbatch")]
        //[Validation("ValidateUpdateOrderDetailsBatch")]
        //public void UpdateOrderDetailsBatch(List<OrderDTO> dtos)
        //{
        //    dtos.ForEach(dto => {
        //        order = orders.Where(o => o.OrderId == dto.OrderId).First();

        //        order.LongSleeveIsEnabled = dto.LongSleeveIsEnabled;
        //        order.ShortSleeveIsEnabled = dto.ShortSleeveIsEnabled;

        //        orderDAL.DeleteOrderDetails(order.OrderDetails);

        //        for (int i = 0; i < dto.OrderDetails.Count; i++)
        //        {
        //            order.OrderDetails.Add(Mapper.Map<OrderDetail>(dto.OrderDetails.ToList()[i]));
        //        }

        //        orderDAL.Update(order);
        //    });

        //}

        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Validation("ValidateGetOrder")]
        public OrderDTO GetOrder(int id)
        {
            return Mapper.Map<OrderDTO>(order);
        }

        [HttpPut]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Route("order/{pageNumber}/{pageSize}")]
        [Validation("ValidateGetOrders")]
        public OrderListDTO GetOrders(int pageNumber, int pageSize, OrderDTO dto)
        {
            string group = CommonLogic.TrimAll(dto.Group);
            string company = CommonLogic.TrimAll(dto.Company);
            string department = CommonLogic.TrimAll(dto.Department);
            string job = CommonLogic.TrimAll(dto.Job);
            string employeeCode = CommonLogic.TrimAll(dto.EmployeeCode);
            string name = CommonLogic.NullIfEmpty(dto.Name);

            List<Order> orders = orderDAL.GetOrders(group, company, department, job, employeeCode, name, pageNumber, pageSize, true);

            OrderListDTO listDTO = new OrderListDTO();
            listDTO.RecordCount = orderDAL.GetOrderCount(group, company, department, job, employeeCode, name);


            orders.ForEach(o => listDTO.Orders.Add(Mapper.Map<OrderDTO>(o)));

            return listDTO;
        }

        [HttpDelete]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        public bool DeleteOrders(int[] ids)
        {
            //假删除，用于开发过程中的调试
            //List<Order> orders = orderDAL.GetOrders(ids);
            //orders.ForEach(o =>
            //{
            //    o.IsArchive = true;
            //    orderDAL.Update(o);
            //});

            //真实的删除
            List<Order> orders = orderDAL.GetOrders(ids);
            orders.ForEach(o =>
            {
                orderDAL.DeleteOrderDetails(o.OrderDetails);
            });
            orderDAL.Delete(orders);
            return true;
        }
        #endregion

        #region Validations
        [NonAction]
        public void ValidateGetOrder(int id)
        {
            order = orderDAL.GetOrder(id, true);
            if (order == null)
                base.IsIllegalParameter = true;
        }

        [NonAction]
        public void ValidateGetOrders(int pageNumber, int pageSize, OrderDTO dto)
        {
            if (pageNumber < 1)
            {
                this.IsIllegalParameter = true;
                return;
            }
            if (pageSize < 1 || pageSize > 50)
            {
                this.IsIllegalParameter = true;
                return;
            }
        }

        //此功能前台已关闭，所以关闭对应API，如需启动，此API的代码需要依据功能重新实现
        //[NonAction]
        //public void ValidateUpdateOrderDetailsBatch(List<OrderDTO> dtos)
        //{
        //    orders = orderDAL.GetOrders(dtos.Select(dto => dto.OrderId), true);
        //    if (orders.Count != dtos.Count)
        //    {
        //        this.IsIllegalParameter = true;
        //        return;
        //    }

        //    dtos.ForEach(dto => 
        //    {
        //        /*
        //         * this.AddInvalidMessage的第一个参数是一个标识符，告知客户端是哪个字段出错，客户端根据页面布局，将错误信息放置在适当的位置
        //         * 此处全部留空是因为：订单列表页数据太多，没有适当的位置放置这些错误信息，并且在客户端已对这些字段进行验证。
        //         * 所以客户端的订单列表页不需要处理这些服务器验证信息，因为从客户端过来的数据都是合格的。
        //         * 但服务端需要保留这里的验证逻辑，防止用户绕过客户端恶意提交数据
        //        */
        //        if (dto.LongSleeveIsEnabled == false && dto.ShortSleeveIsEnabled == false)
        //            this.AddInvalidMessage("", "长袖短袖至少勾选一款");

        //        int longSleeveCount = dto.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="长袖").Count();
        //        int shortSleeveCount = dto.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="短袖").Count();

        //        if (dto.LongSleeveIsEnabled)
        //        {
        //            if (longSleeveCount == 0)
        //                this.AddInvalidMessage("", "至少输入一条长袖");
        //        }

        //        if (dto.ShortSleeveIsEnabled)
        //        {
        //            if (shortSleeveCount == 0)
        //                this.AddInvalidMessage("", "至少输入一条短袖");
        //        }

        //        dto.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="长袖").ToList().ForEach(od =>
        //        {
        //            if (longSleeveCount > 1 && string.IsNullOrWhiteSpace(od.Color))
        //                this.AddInvalidMessage("", "有多款长袖时，请填写颜色");

        //            if (!string.IsNullOrWhiteSpace(od.Color))
        //            {
        //                if (od.Color.Length > 10)
        //                    this.AddInvalidMessage("", "颜色不得超过10个字符");
        //                else if (Regex.IsMatch(od.Color, @"[^a-zA-Z0-9\u4e00-\u9fa5]"))
        //                    this.AddInvalidMessage("", "颜色只能包含字母，数字和中文");
        //            }

        //            if (longSleeveCount > 1 && string.IsNullOrWhiteSpace(od.Cloth))
        //                this.AddInvalidMessage("", "有多款长袖时，请填写布料");

        //            if (!string.IsNullOrWhiteSpace(od.Cloth))
        //            {
        //                if (od.Cloth.Length > 10)
        //                    this.AddInvalidMessage("", "布料不得超过10个字符");
        //                else if (Regex.IsMatch(od.Cloth, @"[^a-zA-Z0-9/\-()~]"))
        //                    this.AddInvalidMessage("", "布料只能包含字母，数字和/-()~");
        //            }

        //            if (od.Amount < 1 || od.Amount > 9999999)
        //                this.AddInvalidMessage("", "长袖数量必须在1-9999999之间");
        //        });

        //        dto.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="短袖").ToList().ForEach(od =>
        //        {
        //            if (shortSleeveCount > 1 && string.IsNullOrWhiteSpace(od.Color))
        //                this.AddInvalidMessage("", "有多款短袖时，请填写颜色");

        //            if (!string.IsNullOrWhiteSpace(od.Color))
        //            {
        //                if (od.Color.Length > 10)
        //                    this.AddInvalidMessage("", "颜色不得超过10个字符");
        //                else if (Regex.IsMatch(od.Color, @"[^a-zA-Z0-9\u4e00-\u9fa5]"))
        //                    this.AddInvalidMessage("", "颜色只能包含字母，数字和中文");
        //            }

        //            if (shortSleeveCount > 1 && string.IsNullOrWhiteSpace(od.Cloth))
        //                this.AddInvalidMessage("", "有多款短袖时，请填写布料");

        //            if (!string.IsNullOrWhiteSpace(od.Cloth))
        //            {
        //                if (od.Cloth.Length > 10)
        //                    this.AddInvalidMessage("", "布料不得超过10个字符");
        //                else if (Regex.IsMatch(od.Cloth, @"[^a-zA-Z0-9/\-()~]"))
        //                    this.AddInvalidMessage("", "布料只能包含字母，数字和/-()~");
        //            }

        //            if (od.Amount < 1 || od.Amount > 9999999)
        //                this.AddInvalidMessage("", "短袖数量必须在1-9999999之间");
        //        });
        //    });
        //}

        [NonAction]
        public void ValidateCreateOrder(OrderDTO dto)
        {
            ValidateOrder(dto, true);
        }

        [NonAction]
        public void ValidateUpdateOrder(OrderDTO dto)
        {
            ValidateOrder(dto, false);
        }

        private void ValidateOrder(OrderDTO dto, bool isNew)
        {
            if (dto == null)
            {
                this.IsIllegalParameter = true;
                return;
            }

            if (!isNew)
            {
                order = orderDAL.GetOrder(dto.OrderId, true);
                if (order == null)
                {
                    this.IsIllegalParameter = true;
                    return;
                }
            }

            #region basic validation
            this.ValidatorContainer.SetValue("集团名称", dto.Group)
                .IsRequired(true)
                .Length(0, 20)
                .Pattern(@"^[^\\/:*?""<>|]+$", @"集团名称中不得出现\/:*?""<>|");

            this.ValidatorContainer.SetValue("公司名称", dto.Company)
                 .IsRequired(true)
                 .Length(0, 20)
                 .Pattern(@"^[^\\/:*?""<>|]+$", @"公司名称中不得出现\/:*?""<>|");

            this.ValidatorContainer.SetValue("部门名称", dto.Department)
                .IsRequired(true)
                .Length(0, 20);

            this.ValidatorContainer.SetValue("职务", dto.Job)
               .Length(0, 20);


            this.ValidatorContainer.SetValue("工号", dto.EmployeeCode)
               .Length(0, 20)
               .Pattern("^[a-zA-Z0-9]+$", "工号只能包含字母和数字");


            //else if (orderDAL.IsExistEmployeeCode(CommonLoigc.TrimSpace(dto.Company), CommonLoigc.TrimSpace(dto.EmployeeCode), isNew == true ? 0 : dto.OrderId))
            //    this.AddInvalidMessage("employeecode", "已添加过该员工订单，请勿重复添加");

            this.ValidatorContainer.SetValue("姓名", CommonLogic.Trim(dto.Name))
                .IsRequired(true)
               .Length(0, 30);

            this.ValidatorContainer.SetValue("年龄", dto.Age)
               .InRange((byte)1, (byte)150, null);

            this.ValidatorContainer.SetValue("性别", dto.Sex)
                .IsRequired(true)
                .IsInList("M", "F");

            this.ValidatorContainer.SetValue("身高", dto.Height)
                .DecimalLength(1)
                .InRange(1m, 999.9m, null);

            this.ValidatorContainer.SetValue("体重", dto.Weight)
                .DecimalLength(1)
                .InRange(1m, 999.9m, null);
            #endregion

            #region shirt validation
            #region fields validtion
            if (dto.ShirtLPrice.HasValue)
            {
                this.ValidatorContainer.SetValue("衬衫长袖加工费", dto.ShirtLPrice)
                .DecimalLength(2)
                .InRange(1m, 9999999.99m, null);
            }
            if (dto.ShirtSPrice.HasValue)
            {
                this.ValidatorContainer.SetValue("衬衫短袖加工费", dto.ShirtSPrice)
                .DecimalLength(2)
                .InRange(1m, 9999999.99m, null);

            }

            this.ValidatorContainer.SetValue("衬衫喜好", dto.ShirtPreSize)
               .IsRequired(true)
               .IsInList("B", "S");


            this.ValidatorContainer.SetValue("衬衫备注", CommonLogic.Trim(dto.ShirtMemo))
               .Length(0, 500);
            #endregion

            #region empty sizename
            if (string.IsNullOrWhiteSpace(dto.ShirtSizeName))
            {
                this.ValidatorContainer.SetValue("衬衫领围", dto.ShirtNeck)
                    .IsRequired(true)
                   .DecimalLength(1)
                   .InRange(1m, 999.9m, null);

                this.ValidatorContainer.SetValue("衬衫肩宽", dto.ShirtShoulder)
                    .IsRequired(true)
                   .DecimalLength(1)
                   .InRange(1m, 999.9m, null);

                if (!dto.ShirtFLength.HasValue && !dto.ShirtBLength.HasValue)
                    this.AddInvalidMessage("flength", "前衣长和后衣长至少填写一个");

                this.ValidatorContainer.SetValue("衬衫前衣长", dto.ShirtFLength)
                    .DecimalLength(1)
                   .InRange(1m, 999.9m, null);

                this.ValidatorContainer.SetValue("衬衫后衣长", dto.ShirtBLength)
                    .DecimalLength(1)
                   .InRange(1m, 999.9m, null);

                this.ValidatorContainer.SetValue("衬衫胸围", dto.ShirtChest)
                    .IsRequired(true)
                   .InRange(1, 999, null);


                this.ValidatorContainer.SetValue("衬衫腰围", dto.ShirtWaist)
                    .DecimalLength(1)
                   .InRange(1m, 999.9m, null);

                this.ValidatorContainer.SetValue("衬衫下摆", dto.ShirtLowerHem)
                    .DecimalLength(1)
                   .InRange(1m, 999.9m, null);



                if (dto.LongSleeveIsEnabled)
                {
                    this.ValidatorContainer.SetValue("衬衫长袖长", dto.ShirtLSleeveLength)
                    .IsRequired(true);
                }

                this.ValidatorContainer.SetValue("衬衫长袖长", dto.ShirtLSleeveLength)
                   .DecimalLength(1)
                  .InRange(1m, 999.9m, null);

                this.ValidatorContainer.SetValue("衬衫长袖口大", dto.ShirtLSleeveCuff)
                   .DecimalLength(1)
                  .InRange(1m, 999.9m, null);

                if (dto.ShortSleeveIsEnabled)
                {
                    this.ValidatorContainer.SetValue("衬衫短袖长", dto.ShirtSSleeveLength)
                    .IsRequired(true);
                }

                this.ValidatorContainer.SetValue("衬衫短袖长", dto.ShirtSSleeveLength)
                  .DecimalLength(1)
                 .InRange(1m, 999.9m, null);


                this.ValidatorContainer.SetValue("衬衫短袖口大", dto.ShirtSSleeveCuff)
                 .DecimalLength(1)
                .InRange(1m, 999.9m, null);

                if (dto.ShirtChestEnlarge.HasValue)
                {
                    this.ValidatorContainer.SetValue("衬衫胸围放大", dto.ShirtChestEnlarge)
                        .InRange(0, 50, null);
                }

                if (dto.ShirtWaistEnlarge.HasValue)
                {
                    this.ValidatorContainer.SetValue("衬衫腰围放大", dto.ShirtWaistEnlarge)
                        .InRange(0, 50, null);
                }

                if (dto.ShirtLowerHemEnlarge.HasValue)
                {
                    this.ValidatorContainer.SetValue("衬衫下摆放大", dto.ShirtLowerHemEnlarge)
                       .InRange(0, 50, null);
                }
            }
            #endregion
            #region non-empty sizename
            else
            {
                if (dto.ShirtNeck.HasValue)
                    this.AddInvalidMessage("neck", "衬衫领围和尺码不能同时存在");

                if (dto.ShirtShoulder.HasValue)
                    this.AddInvalidMessage("shoulder", "衬衫肩宽和尺码不能同时存在");

                if (dto.ShirtFLength.HasValue)
                    this.AddInvalidMessage("flength", "衬衫前衣长和尺码不能同时存在");

                if (dto.ShirtBLength.HasValue)
                    this.AddInvalidMessage("blength", "衬衫后衣长和尺码不能同时存在");

                if (dto.ShirtChest.HasValue)
                    this.AddInvalidMessage("chest", "衬衫胸围和尺码不能同时存在");

                if (dto.ShirtWaist.HasValue)
                    this.AddInvalidMessage("waist", "衬衫腰围和尺码不能同时存在");

                if (dto.ShirtLowerHem.HasValue)
                    this.AddInvalidMessage("lowerhem", "衬衫下摆和尺码不能同时存在");

                if (dto.ShirtLSleeveLength.HasValue)
                    this.AddInvalidMessage("lsleevelength", "衬衫长袖长和尺码不能同时存在");

                if (dto.ShirtLSleeveCuff.HasValue)
                    this.AddInvalidMessage("lsleevecuff", "衬衫长袖口大和尺码不能同时存在");

                if (dto.ShirtSSleeveLength.HasValue)
                    this.AddInvalidMessage("ssleevelength", "衬衫短袖长和尺码不能同时存在");

                if (dto.ShirtSSleeveCuff.HasValue)
                    this.AddInvalidMessage("ssleevecuff", "衬衫短袖口大和尺码不能同时存在");

                if (dto.ShirtChestEnlarge.HasValue)
                    this.AddInvalidMessage("chestenlarge", "衬衫胸围放大和尺码不能同时存在");

                if (dto.ShirtWaistEnlarge.HasValue)
                    this.AddInvalidMessage("waistenlarge", "衬衫腰围放大和尺码不能同时存在");

                if (dto.ShirtLowerHemEnlarge.HasValue)
                    this.AddInvalidMessage("lowerhemenlarge", "衬衫下摆放大和尺码不能同时存在");
            }
            #endregion

            #region details validation
            if (dto.LongSleeveIsEnabled == false && dto.ShortSleeveIsEnabled == false)
                this.AddInvalidMessage("longsleeve", "衬衫长袖短袖至少勾选一款");

            int longSleeveCount = dto.LongSleeves == null ? 0 : dto.LongSleeves.Count;
            int shortSleeveCount = dto.ShortSleeves == null ? 0 : dto.ShortSleeves.Count;

            if (dto.LongSleeveIsEnabled)
            {
                if (longSleeveCount == 0)
                    this.AddInvalidMessage("longsleeve", "衬衫至少输入一条长袖");
            }

            if (dto.ShortSleeveIsEnabled)
            {
                if (shortSleeveCount == 0)
                    this.AddInvalidMessage("shortsleeve", "衬衫至少输入一条短袖");
            }

            if (longSleeveCount > 0)
            {
                dto.LongSleeves.ToList().ForEach(od =>
                {
                    if (longSleeveCount > 1)
                    {
                        this.ValidatorContainer.SetValue("衬衫颜色", od.Color)
                            .IsRequired(true)
                            .Length(0, 10)
                            .Pattern("^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");
                    }
                    else
                    {
                        this.ValidatorContainer.SetValue("衬衫颜色", od.Color)
                            .Length(0, 10)
                            .Pattern("^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");
                    }

                    if (longSleeveCount > 1)
                    {
                        this.ValidatorContainer.SetValue("衬衫布料", od.Cloth)
                           .IsRequired(true)
                           .Length(0, 10)
                           .Pattern(@"^[a-zA-Z0-9/\-()~]+$", "只能包含字母，数字和/-()~");
                    }
                    else
                    {
                        this.ValidatorContainer.SetValue("衬衫布料", od.Cloth)
                           .Length(0, 10)
                           .Pattern(@"^[a-zA-Z0-9/\-()~]+$", "只能包含字母，数字和/-()~");
                    }

                    this.ValidatorContainer.SetValue("衬衫长袖数量", od.Amount)
                       .InRange(1, 9999999, null);
                });
            }

            if (shortSleeveCount > 0)
            {
                dto.ShortSleeves.ToList().ForEach(od =>
                {
                    if (shortSleeveCount > 1)
                    {
                        this.ValidatorContainer.SetValue("衬衫颜色", od.Color)
                            .IsRequired(true)
                            .Length(0, 10)
                            .Pattern("^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");
                    }
                    else
                    {
                        this.ValidatorContainer.SetValue("衬衫颜色", od.Color)
                            .Length(0, 10)
                            .Pattern("^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");
                    }

                    if (shortSleeveCount > 1)
                    {
                        this.ValidatorContainer.SetValue("衬衫布料", od.Cloth)
                           .IsRequired(true)
                           .Length(0, 10)
                           .Pattern(@"^[a-zA-Z0-9/\-()~]+$", "只能包含字母，数字和/-()~");
                    }
                    else
                    {
                        this.ValidatorContainer.SetValue("衬衫布料", od.Cloth)
                           .Length(0, 10)
                           .Pattern(@"^[a-zA-Z0-9/\-()~]+$", "只能包含字母，数字和/-()~");
                    }

                    this.ValidatorContainer.SetValue("衬衫短袖数量", od.Amount)
                       .InRange(1, 9999999, null);
                });
            }
            #endregion
            #endregion

            #region suit validation
            #region fields validtion
            this.ValidatorContainer.SetValue("西装备注", CommonLogic.Trim(dto.SuitMemo))
               .Length(0, 500);

            this.ValidatorContainer.SetValue("西装前衣长变量", dto.SuitFLengthVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西装袖长变量", dto.SuitSleeveLengthVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西装肩宽变量", dto.SuitShoulderVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西装胸围变量", dto.SuitChestVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西装中腰变量", dto.SuitMidWaistVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西装下摆变量", dto.SuitLowerhemVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西装袖口变量", dto.SuitSleeveCuffVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);

            this.ValidatorContainer.SetValue("西裤臀围变量", dto.SuitHipVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西裤腰围变量", dto.SuitWaistVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西裤腰成变量", dto.SuitWomanWaistVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西裤连腰直档变量", dto.SuitWaistForkVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西裤直档变量", dto.SuitForkVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西裤横档变量", dto.SuitLateralForkVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西裤中档变量", dto.SuitMidForkVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西裤净裤长变量", dto.SuitTrousersLengthVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西裤脚口变量", dto.SuitHemHeightVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);

            this.ValidatorContainer.SetValue("西装裙腰围变量", dto.SuitSkirtWaistVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西装裙臀围变量", dto.SuitSkirtHipVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("西装裙长变量", dto.SuitSkirtLengthVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            #endregion

            #region empty suit sizename
            if (string.IsNullOrWhiteSpace(dto.SuitModel) && string.IsNullOrWhiteSpace(dto.SuitSpec))
            {
                if (dto.SuitIsEnabled) 
                {
                    this.ValidatorContainer.SetValue("西装前衣长", dto.SuitFLength).IsRequired(true);
                    this.ValidatorContainer.SetValue("西装袖长", dto.SuitSleeveLength).IsRequired(true);
                    this.ValidatorContainer.SetValue("西装肩宽", dto.SuitShoulder).IsRequired(true);
                    this.ValidatorContainer.SetValue("西装胸围", dto.SuitChest).IsRequired(true);
                    this.ValidatorContainer.SetValue("西装中腰", dto.SuitMidWaist).IsRequired(true);
                    this.ValidatorContainer.SetValue("西装下摆", dto.SuitLowerhem).IsRequired(true);
                    this.ValidatorContainer.SetValue("西装袖口", dto.SuitSleeveCuff).IsRequired(true);
                }

                this.ValidatorContainer.SetValue("西装前衣长", dto.SuitFLength).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("西装袖长", dto.SuitSleeveLength).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("西装肩宽", dto.SuitShoulder).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("西装胸围", dto.SuitChest).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("西装中腰", dto.SuitMidWaist).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("西装下摆", dto.SuitLowerhem).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("西装袖口", dto.SuitSleeveCuff).DecimalLength(1).InRange(1m, 999.9m, null);
            }
            #endregion
            #region non-empty suit sizename
            else if (!string.IsNullOrWhiteSpace(dto.SuitModel) && !string.IsNullOrWhiteSpace(dto.SuitSpec))
            {
                if (dto.SuitFLength.HasValue)
                    this.AddInvalidMessage("neck", "西装前衣长和号型规格不能同时存在");
                if (dto.SuitSleeveLength.HasValue)
                    this.AddInvalidMessage("neck", "西装袖长和号型规格不能同时存在");
                if (dto.SuitShoulder.HasValue)
                    this.AddInvalidMessage("neck", "西装肩宽和号型规格不能同时存在");
                if (dto.SuitChest.HasValue)
                    this.AddInvalidMessage("neck", "西装胸围和号型规格不能同时存在");
                if (dto.SuitMidWaist.HasValue)
                    this.AddInvalidMessage("neck", "西装中腰和号型规格不能同时存在");
                if (dto.SuitLowerhem.HasValue)
                    this.AddInvalidMessage("neck", "西装下摆和号型规格不能同时存在");
                if (dto.SuitSleeveCuff.HasValue)
                    this.AddInvalidMessage("neck", "西装袖口和号型规格不能同时存在");
            }
            #endregion
            #region either suit sizename
            else
            {
                if (string.IsNullOrWhiteSpace(dto.SuitModel))
                    this.AddInvalidMessage("neck", "请输入西装号型");
                if (string.IsNullOrWhiteSpace(dto.SuitSpec))
                    this.AddInvalidMessage("neck", "请输入西装规格");
            }
            #endregion

            #region empty trousers sizename
            if (string.IsNullOrWhiteSpace(dto.SuitTrousersModel))
            {
                if (dto.SuitIsEnabled)
                {
                    this.ValidatorContainer.SetValue("西装臀围", dto.SuitHip).IsRequired(true);
                    this.ValidatorContainer.SetValue("西装横档", dto.SuitLateralFork).IsRequired(true);
                    this.ValidatorContainer.SetValue("西装净裤长", dto.SuitTrousersLength).IsRequired(true);
                    this.ValidatorContainer.SetValue("西装脚口", dto.SuitHemHeight).IsRequired(true);
                    if (dto.Sex == "M")
                    {
                        this.ValidatorContainer.SetValue("西装腰围", dto.SuitWaist).IsRequired(true);
                        this.ValidatorContainer.SetValue("西装连腰直档", dto.SuitWaistFork).IsRequired(true);
                    }
                    if (dto.Sex == "F")
                    {
                        this.ValidatorContainer.SetValue("西装腰成", dto.SuitWomanWaist).IsRequired(true);
                        this.ValidatorContainer.SetValue("西装直档", dto.SuitFork).IsRequired(true);
                        this.ValidatorContainer.SetValue("西装中档", dto.SuitMidFork).IsRequired(true);
                    }
                }

                this.ValidatorContainer.SetValue("西装臀围", dto.SuitHip).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("西装横档", dto.SuitLateralFork).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("西装净裤长", dto.SuitTrousersLength).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("西装脚口", dto.SuitHemHeight).DecimalLength(1).InRange(1m, 999.9m, null);

                if (dto.Sex == "M")
                {
                    this.ValidatorContainer.SetValue("西装腰围", dto.SuitWaist).DecimalLength(1).InRange(1m, 999.9m, null);
                    this.ValidatorContainer.SetValue("西装连腰直档", dto.SuitWaistFork).DecimalLength(1).InRange(1m, 999.9m, null);

                    if (dto.SuitWomanWaist.HasValue)
                        this.AddInvalidMessage("neck", "男士不能填写西装腰成");
                    if (dto.SuitFork.HasValue)
                        this.AddInvalidMessage("neck", "男士不能填写西装直档");
                    if (dto.SuitMidFork.HasValue)
                        this.AddInvalidMessage("neck", "男士不能填写西装中档");
                }

                if (dto.Sex == "F")
                {
                    this.ValidatorContainer.SetValue("西装腰成", dto.SuitWomanWaist).DecimalLength(1).InRange(1m, 999.9m, null);
                    this.ValidatorContainer.SetValue("西装直档", dto.SuitFork).DecimalLength(1).InRange(1m, 999.9m, null);
                    this.ValidatorContainer.SetValue("西装中档", dto.SuitMidFork).DecimalLength(1).InRange(1m, 999.9m, null);

                    if (dto.SuitWaist.HasValue)
                        this.AddInvalidMessage("neck", "女士不能填写西装腰围");
                    if (dto.SuitWaistFork.HasValue)
                        this.AddInvalidMessage("neck", "女士不能填写西装连腰直档");
                }
            }
            #endregion
            #region non-empty trousers sizename
            else
            {
                if (dto.SuitHip.HasValue)
                    this.AddInvalidMessage("neck", "西装臀围和号型不能同时存在");
                if (dto.SuitWaist.HasValue)
                    this.AddInvalidMessage("neck", "西装腰围和尺码不能同时存在");
                if (dto.SuitWomanWaist.HasValue)
                    this.AddInvalidMessage("neck", "西装腰成和号型不能同时存在");
                if (dto.SuitWaistFork.HasValue)
                    this.AddInvalidMessage("neck", "西装连腰直档和号型不能同时存在");
                if (dto.SuitFork.HasValue)
                    this.AddInvalidMessage("neck", "西装直档和号型不能同时存在");
                if (dto.SuitLateralFork.HasValue)
                    this.AddInvalidMessage("neck", "西装横档和号型不能同时存在");
                if (dto.SuitMidFork.HasValue)
                    this.AddInvalidMessage("neck", "西装中档和号型不能同时存在");
                if (dto.SuitTrousersLength.HasValue)
                    this.AddInvalidMessage("neck", "西装净裤长和号型不能同时存在");
                if (dto.SuitHemHeight.HasValue)
                    this.AddInvalidMessage("neck", "西装脚口和号型不能同时存在");
                
            }
            #endregion

            #region empty skirt sizename
            if (string.IsNullOrWhiteSpace(dto.SuitSkirtModel))
            {
                if (dto.SuitIsEnabled)
                {
                    if (dto.Sex == "F")
                    {
                        this.ValidatorContainer.SetValue("西装裙臀围", dto.SuitSkirtHip).IsRequired(true);
                        this.ValidatorContainer.SetValue("西装裙长", dto.SuitSkirtLength).IsRequired(true);
                        this.ValidatorContainer.SetValue("西装裙腰围", dto.SuitSkirtWaist).IsRequired(true);
                    }
                }
                if (dto.Sex == "M")
                {
                    if (dto.SuitSkirtHip.HasValue)
                        this.AddInvalidMessage("neck", "男士不能填写西装裙臀围");
                    if (dto.SuitSkirtLength.HasValue)
                        this.AddInvalidMessage("neck", "男士不能填写西装裙长");
                    if (dto.SuitSkirtWaist.HasValue)
                        this.AddInvalidMessage("neck", "男士不能填写西装裙腰围");
                }

                if (dto.Sex == "F")
                {
                    this.ValidatorContainer.SetValue("西装裙臀围", dto.SuitSkirtHip).DecimalLength(1).InRange(1m, 999.9m, null);
                    this.ValidatorContainer.SetValue("西装裙长", dto.SuitSkirtLength).DecimalLength(1).InRange(1m, 999.9m, null);
                    this.ValidatorContainer.SetValue("西装裙腰围", dto.SuitSkirtWaist).DecimalLength(1).InRange(1m, 999.9m, null);                    
                }
            }
            #endregion
            #region non-empty skirt sizename
            else
            {
                if (dto.Sex == "M")
                {
                    this.AddInvalidMessage("neck", "男士不能填写西装裙号型");

                    if (dto.SuitSkirtHip.HasValue)
                        this.AddInvalidMessage("neck", "男士不能填写西装裙臀围");
                    if (dto.SuitSkirtLength.HasValue)
                        this.AddInvalidMessage("neck", "男士不能填写西装裙长");
                    if (dto.SuitSkirtWaist.HasValue)
                        this.AddInvalidMessage("neck", "男士不能填写西装裙腰围");
                }
                else
                {
                    if (dto.SuitSkirtHip.HasValue)
                        this.AddInvalidMessage("neck", "西装裙臀围和号型不能同时存在");
                    if (dto.SuitSkirtLength.HasValue)
                        this.AddInvalidMessage("neck", "西装裙长和号型不能同时存在");
                    if (dto.SuitSkirtWaist.HasValue)
                        this.AddInvalidMessage("neck", "西装裙腰围和号型不能同时存在");
                }
            }
            #endregion

            #region details validation
            if (dto.SuitIsEnabled)
            {
                if (dto.Suits == null || dto.Suits.Count == 0)
                    this.AddInvalidMessage("longsleeve", "至少添加一条西装");
            }

            if (dto.Suits != null && dto.Suits.Count > 0)
            {
                dto.Suits.ToList().ForEach(od => 
                {
                    if (dto.SuitIsEnabled)
                    {
                        this.ValidatorContainer.SetValue("西装颜色", od.Color).IsRequired(true);
                        this.ValidatorContainer.SetValue("西装布料", od.Cloth).IsRequired(true);
                        this.ValidatorContainer.SetValue("西装种类", od.SubCategory).IsRequired(true);
                    }
                    this.ValidatorContainer.SetValue("西装颜色", od.Color)
                        .Length(0, 10)
                        .Pattern("^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");

                    this.ValidatorContainer.SetValue("西装布料", od.Cloth)
                        .Length(0, 10)
                        .Pattern(@"^[a-zA-Z0-9/\-()~]+$", "只能包含字母，数字和/-()~");

                    this.ValidatorContainer.SetValue("西装种类", od.SubCategory)
                        .Length(0, 10)
                        .Pattern(@"^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");

                    this.ValidatorContainer.SetValue("西装数量", od.Amount)
                        .InRange(1, 9999999, null);

                    this.ValidatorContainer.SetValue("西装加工费", od.Price)
                        .DecimalLength(2)
                        .InRange(1m, 9999999.99m, null);
                });
            }
            #endregion
            #endregion

            #region coat validation
            #region fields validtion
            this.ValidatorContainer.SetValue("大衣备注", CommonLogic.Trim(dto.CoatMemo))
               .Length(0, 500);

            this.ValidatorContainer.SetValue("大衣前衣长变量", dto.CoatFLengthVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("大衣袖长变量", dto.CoatSleeveLengthVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("大衣肩宽变量", dto.CoatShoulderVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("大衣胸围变量", dto.CoatChestVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("大衣中腰变量", dto.CoatMidWaistVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("大衣下摆变量", dto.CoatLowerhemVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            #endregion

            #region empty coat sizename
            if (string.IsNullOrWhiteSpace(dto.CoatModel) && string.IsNullOrWhiteSpace(dto.CoatSpec))
            {
                if (dto.CoatIsEnabled)
                {
                    this.ValidatorContainer.SetValue("大衣前衣长", dto.CoatFLength).IsRequired(true);
                    this.ValidatorContainer.SetValue("大衣袖长", dto.CoatSleeveLength).IsRequired(true);
                    this.ValidatorContainer.SetValue("大衣肩宽", dto.CoatShoulder).IsRequired(true);
                    this.ValidatorContainer.SetValue("大衣胸围", dto.CoatChest).IsRequired(true);
                    this.ValidatorContainer.SetValue("大衣中腰", dto.CoatMidWaist).IsRequired(true);
                    this.ValidatorContainer.SetValue("大衣下摆", dto.CoatLowerhem).IsRequired(true);
                }

                this.ValidatorContainer.SetValue("大衣前衣长", dto.CoatFLength).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("大衣袖长", dto.CoatSleeveLength).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("大衣肩宽", dto.CoatShoulder).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("大衣胸围", dto.CoatChest).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("大衣中腰", dto.CoatMidWaist).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("大衣下摆", dto.CoatLowerhem).DecimalLength(1).InRange(1m, 999.9m, null);
            }
            #endregion
            #region non-empty coat sizename
            else if (!string.IsNullOrWhiteSpace(dto.CoatModel) && !string.IsNullOrWhiteSpace(dto.CoatSpec))
            {
                if (dto.CoatFLength.HasValue)
                    this.AddInvalidMessage("neck", "大衣前衣长和号型规格不能同时存在");
                if (dto.CoatSleeveLength.HasValue)
                    this.AddInvalidMessage("neck", "大衣袖长和号型规格不能同时存在");
                if (dto.CoatShoulder.HasValue)
                    this.AddInvalidMessage("neck", "大衣肩宽和号型规格不能同时存在");
                if (dto.CoatChest.HasValue)
                    this.AddInvalidMessage("neck", "大衣胸围和号型规格不能同时存在");
                if (dto.CoatMidWaist.HasValue)
                    this.AddInvalidMessage("neck", "大衣中腰和号型规格不能同时存在");
                if (dto.CoatLowerhem.HasValue)
                    this.AddInvalidMessage("neck", "大衣下摆和号型规格不能同时存在");
            }
            #endregion
            #region either coat sizename
            else
            {
                if (string.IsNullOrWhiteSpace(dto.CoatModel))
                    this.AddInvalidMessage("neck", "请输入大衣号型");
                if (string.IsNullOrWhiteSpace(dto.CoatSpec))
                    this.AddInvalidMessage("neck", "请输入大衣规格");
            }
            #endregion

            #region details validation
            if (dto.CoatIsEnabled)
            {
                if (dto.Coats == null || dto.Coats.Count == 0)
                    this.AddInvalidMessage("longsleeve", "至少添加一条大衣");
            }

            if (dto.Coats != null && dto.Coats.Count > 0)
            {
                dto.Coats.ToList().ForEach(od =>
                {
                    if (dto.CoatIsEnabled)
                    {
                        this.ValidatorContainer.SetValue("大衣颜色", od.Color).IsRequired(true);
                        this.ValidatorContainer.SetValue("大衣布料", od.Cloth).IsRequired(true);
                        this.ValidatorContainer.SetValue("大衣种类", od.SubCategory).IsRequired(true);
                    }
                    this.ValidatorContainer.SetValue("大衣颜色", od.Color)
                        .Length(0, 10)
                        .Pattern("^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");

                    this.ValidatorContainer.SetValue("大衣布料", od.Cloth)
                        .Length(0, 10)
                        .Pattern(@"^[a-zA-Z0-9/\-()~]+$", "只能包含字母，数字和/-()~");

                    this.ValidatorContainer.SetValue("大衣种类", od.SubCategory)
                        .Length(0, 10)
                        .Pattern(@"^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");

                    this.ValidatorContainer.SetValue("大衣数量", od.Amount)
                        .InRange(1, 9999999, null);

                    this.ValidatorContainer.SetValue("大衣加工费", od.Price)
                        .DecimalLength(2)
                        .InRange(1m, 9999999.99m, null);
                });
            }
            #endregion
            #endregion

            #region waistcoat validation
            #region fields validtion
            this.ValidatorContainer.SetValue("背心备注", CommonLogic.Trim(dto.WaistcoatMemo))
               .Length(0, 500);

            this.ValidatorContainer.SetValue("背心前衣长变量", dto.WaistcoatFLengthVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("背心后衣长变量", dto.WaistcoatBLengthVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("背心肩宽变量", dto.WaistcoatShoulderVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("背心胸围变量", dto.WaistcoatChestVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("背心中腰变量", dto.WaistcoatMidWaistVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            this.ValidatorContainer.SetValue("背心下摆变量", dto.WaistcoatLowerhemVar).DecimalLength(1).InRange(-99.9m, 99.9m, null);
            #endregion

            #region empty waistcoat sizename
            if (string.IsNullOrWhiteSpace(dto.WaistcoatModel) && string.IsNullOrWhiteSpace(dto.WaistcoatSpec))
            {
                if (dto.WaistcoatIsEnabled)
                {
                    this.ValidatorContainer.SetValue("背心前衣长", dto.WaistcoatFLength).IsRequired(true);
                    this.ValidatorContainer.SetValue("背心后衣长", dto.WaistcoatBLength).IsRequired(true);
                    this.ValidatorContainer.SetValue("背心肩宽", dto.WaistcoatShoulder).IsRequired(true);
                    this.ValidatorContainer.SetValue("背心胸围", dto.WaistcoatChest).IsRequired(true);
                    this.ValidatorContainer.SetValue("背心中腰", dto.WaistcoatMidWaist).IsRequired(true);
                    this.ValidatorContainer.SetValue("背心下摆", dto.WaistcoatLowerhem).IsRequired(true);
                }

                this.ValidatorContainer.SetValue("背心前衣长", dto.WaistcoatFLength).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("背心后衣长", dto.WaistcoatBLength).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("背心肩宽", dto.WaistcoatShoulder).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("背心胸围", dto.WaistcoatChest).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("背心中腰", dto.WaistcoatMidWaist).DecimalLength(1).InRange(1m, 999.9m, null);
                this.ValidatorContainer.SetValue("背心下摆", dto.WaistcoatLowerhem).DecimalLength(1).InRange(1m, 999.9m, null);
            }
            #endregion
            #region non-empty waisttcoat sizename
            else if (!string.IsNullOrWhiteSpace(dto.WaistcoatModel) && !string.IsNullOrWhiteSpace(dto.WaistcoatSpec))
            {
                if (dto.WaistcoatFLength.HasValue)
                    this.AddInvalidMessage("neck", "背心前衣长和号型规格不能同时存在");
                if (dto.WaistcoatBLength.HasValue)
                    this.AddInvalidMessage("neck", "背心后衣长和号型规格不能同时存在");
                if (dto.WaistcoatShoulder.HasValue)
                    this.AddInvalidMessage("neck", "背心肩宽和号型规格不能同时存在");
                if (dto.WaistcoatChest.HasValue)
                    this.AddInvalidMessage("neck", "背心胸围和号型规格不能同时存在");
                if (dto.WaistcoatMidWaist.HasValue)
                    this.AddInvalidMessage("neck", "背心中腰和号型规格不能同时存在");
                if (dto.WaistcoatLowerhem.HasValue)
                    this.AddInvalidMessage("neck", "背心下摆和号型规格不能同时存在");
            }
            #endregion
            #region either waistcoat sizename
            else
            {
                if (string.IsNullOrWhiteSpace(dto.WaistcoatModel))
                    this.AddInvalidMessage("neck", "请输入背心号型");
                if (string.IsNullOrWhiteSpace(dto.WaistcoatSpec))
                    this.AddInvalidMessage("neck", "请输入背心规格");
            }
            #endregion

            #region details validation
            if (dto.WaistcoatIsEnabled)
            {
                if (dto.Waistcoats == null || dto.Waistcoats.Count == 0)
                    this.AddInvalidMessage("longsleeve", "至少添加一条背心");
            }

            if (dto.Waistcoats != null && dto.Waistcoats.Count > 0)
            {
                dto.Waistcoats.ToList().ForEach(od =>
                {
                    if (dto.WaistcoatIsEnabled)
                    {
                        this.ValidatorContainer.SetValue("背心颜色", od.Color).IsRequired(true);
                        this.ValidatorContainer.SetValue("背心布料", od.Cloth).IsRequired(true);
                        this.ValidatorContainer.SetValue("背心种类", od.SubCategory).IsRequired(true);
                    }
                    this.ValidatorContainer.SetValue("背心颜色", od.Color)
                        .Length(0, 10)
                        .Pattern("^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");

                    this.ValidatorContainer.SetValue("背心布料", od.Cloth)
                        .Length(0, 10)
                        .Pattern(@"^[a-zA-Z0-9/\-()~]+$", "只能包含字母，数字和/-()~");

                    this.ValidatorContainer.SetValue("背心种类", od.SubCategory)
                        .Length(0, 10)
                        .Pattern(@"^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");

                    this.ValidatorContainer.SetValue("背心数量", od.Amount)
                        .InRange(1, 9999999, null);

                    this.ValidatorContainer.SetValue("背心加工费", od.Price)
                        .DecimalLength(2)
                        .InRange(1m, 9999999.99m, null);
                });
            }
            #endregion
            #endregion

            #region accessory validation
            #region details validation
            if (dto.AccessoryIsEnabled)
            {
                if (dto.Accessories == null || dto.Accessories.Count == 0)
                    this.AddInvalidMessage("longsleeve", "至少添加一条配件");
            }

            if (dto.Accessories != null && dto.Accessories.Count > 0)
            {
                dto.Accessories.ToList().ForEach(od =>
                {
                    if (dto.AccessoryIsEnabled)
                    {
                        this.ValidatorContainer.SetValue("配件颜色", od.Color).IsRequired(true);
                        this.ValidatorContainer.SetValue("配件尺码", od.SizeName).IsRequired(true);
                        this.ValidatorContainer.SetValue("配件种类", od.SubCategory).IsRequired(true);
                    }
                    this.ValidatorContainer.SetValue("配件颜色", od.Color)
                        .Length(0, 10)
                        .Pattern("^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");

                    this.ValidatorContainer.SetValue("配件布料", od.Cloth)
                        .Length(0, 10)
                        .Pattern(@"^[a-zA-Z0-9/\-()~]+$", "只能包含字母，数字和/-()~");

                    this.ValidatorContainer.SetValue("配件种类", od.SubCategory)
                        .Length(0, 10)
                        .Pattern(@"^[a-zA-Z0-9\u4e00-\u9fa5]+$", "只能包含字母，数字和中文");

                    this.ValidatorContainer.SetValue("配件数量", od.Amount)
                        .InRange(1, 9999999, null);

                    this.ValidatorContainer.SetValue("配件加工费", od.Price)
                        .DecimalLength(2)
                        .InRange(1m, 9999999.99m, null);
                });
            }
            #endregion
            #endregion

            //所有变量字段没有验证
        }
        #endregion
    }
}
