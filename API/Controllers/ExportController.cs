using AutoMapper;
using KaiKai.Common;
using KaiKai.DAL;
using KaiKai.Model;
using KaiKai.Model.DTO;
using KaiKai.Model.Enum;
using Ninject;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace KaiKai.API.Controllers
{
    public class ExportController : BaseApiController
    {
        [Inject]
        public OrderDAL orderDAL { get; set; }
        [Inject]
        public SizeDAL sizeDAL { get; set; }

        Size manSize=null;
        Size womanSize = null;
        List<Order> orders =null;

        #region APIs
        [HttpGet]
        [ApiAuthorize(UserTypeEnum.Admin, UserTypeEnum.Operator)]
        [Route("export/{company}/{category}/{manSizeId}/{womanSizeId}")]
        [Validation("ValidateExport")]
        public HttpResponseMessage Export(string company, string category, int manSizeId, int womanSizeId)
        {
            HSSFWorkbook book = new NPOI.HSSF.UserModel.HSSFWorkbook();
            
            ICellStyle style = book.CreateCellStyle();
            HSSFFont font = (HSSFFont)book.CreateFont();
            font.FontHeightInPoints = 11;
            style.SetFont(font);
            style.BorderBottom = BorderStyle.Thin;
            style.BorderLeft = BorderStyle.Thin;
            style.BorderRight = BorderStyle.Thin;
            style.BorderTop = BorderStyle.Thin;
            style.VerticalAlignment = VerticalAlignment.Center;

            ICellStyle redForeground = book.CreateCellStyle();
            redForeground.CloneStyleFrom(style);
            redForeground.FillForegroundColor = NPOI.HSSF.Util.HSSFColor.Coral.Index;
            redForeground.FillPattern = FillPattern.SolidForeground;

            ICellStyle greenForeground = book.CreateCellStyle();
            greenForeground.CloneStyleFrom(style);
            greenForeground.FillForegroundColor = NPOI.HSSF.Util.HSSFColor.LightGreen.Index;
            greenForeground.FillPattern = FillPattern.SolidForeground;

            CreateSexSheet(book, style);
            CreateDepartmentSheet(book, style);
            CreateColorClothSheet2(book, style);
            CreateOrderListSheet(book, redForeground, greenForeground, style, "M");
            CreateOrderListSheet(book, redForeground, greenForeground, style, "F");
            CreateAllCompanySheet(book, style);

            MemoryStream ms = new MemoryStream();
            book.Write(ms);
            byte[] b = ms.ToArray();


            book = null;
            ms.Close();
            ms.Dispose();
            ms = null;


            var response = new HttpResponseMessage();
            response.Content = new ByteArrayContent(b);
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = System.Web.HttpUtility.UrlEncode(company+DateTime.Now.ToString("yyyy-MM-dd"), System.Text.Encoding.UTF8) + ".xls" };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
            response.Content.Headers.ContentLength = b.Length;
            return response;
        }

        private void CreateAllCompanySheet(HSSFWorkbook book, ICellStyle style)
        {
            ISheet sheet = book.CreateSheet("所有公司");
            int rowIndex = 0;
            IRow row = null;

            List<Order> allOrders = orderDAL.GetAllOrders();
            List<OrderDetail> allDetails = ConvertOrdersToOrderDetails(allOrders);
            List<OrderDetail> longSleeveODs = allDetails.Where(od => od.Order.LongSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "长袖").OrderBy(od => od.Color).ThenBy(od => od.Cloth).ToList();
            List<OrderDetail> shortSleeveODs = allDetails.Where(od => od.Order.ShortSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory=="短袖").OrderBy(od => od.Color).ThenBy(od => od.Cloth).ToList();

            #region 表头
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "序号", style);
            ExcelHelper.CreateCell(row, 1, "公司名称", style);

            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex+1, 0, "序号", style);
            ExcelHelper.CreateCell(row, 1, "公司名称", style);

            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 1, 0, 0));
            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 1, 1, 1));

            int cellIndex = 1;
            if (longSleeveODs.Count > 0)
            {
                int mergeIndexStart = cellIndex + 1;
                longSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(od =>
                {
                    cellIndex++;
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), cellIndex, "长袖", style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), cellIndex, od.Key.Color + " " + od.Key.Cloth, style);
                });
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex, mergeIndexStart, cellIndex));
            }

            if (shortSleeveODs.Count > 0)
            {
                int mergeIndexStart = cellIndex + 1;
                shortSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(od =>
                {
                    cellIndex++;
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), cellIndex, "短袖", style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), cellIndex, od.Key.Color + " " + od.Key.Cloth, style);
                });
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex, mergeIndexStart, cellIndex));
            }

            ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "小计", style);
            ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), cellIndex, "小计", style);
            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 1, cellIndex, cellIndex));

            ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "人数", style);
            ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), cellIndex, "人数", style);
            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 1, cellIndex, cellIndex));
            rowIndex = 1;
            #endregion

            #region 表身
            int number = 0;
            allDetails.OrderBy(od => od.Order.Company).GroupBy(od => od.Order.Company).ToList().ForEach(com => 
            {
                rowIndex++;
                row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, ++number, style);
                ExcelHelper.CreateCell(row, 1, com.Key, style);

                cellIndex = 1;
                longSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(cc =>
                {
                    ExcelHelper.CreateCell(row, ++cellIndex,
                    com.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.LongSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="长袖").Sum(s => s.Amount)
                        , style);
                });

                shortSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(cc =>
                {
                    ExcelHelper.CreateCell(row, ++cellIndex,
                    com.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.ShortSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="短袖").Sum(s => s.Amount)
                        , style);
                });

                ExcelHelper.CreateCell(row, ++cellIndex, com.Where(od => (od.Order.LongSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="长袖") || (od.Order.ShortSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="短袖")).Sum(s => s.Amount)
                    , style);

                ExcelHelper.CreateCell(row, ++cellIndex, allOrders.Where(o=>o.Company==com.Key).Count(), style);

            });


            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "", style);
            cellIndex = 1;
            ExcelHelper.CreateCell(row, 1, "总计", style);
            if (longSleeveODs.Count > 0)
            {
                longSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(cc =>
                {
                    ExcelHelper.CreateCell(row, ++cellIndex,
                    allDetails.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.LongSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="长袖").Sum(s => s.Amount)
                        , style);
                });
            }
            if (shortSleeveODs.Count > 0)
            {
                shortSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(cc =>
                {
                    ExcelHelper.CreateCell(row, ++cellIndex,
                    allDetails.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.ShortSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="短袖").Sum(s => s.Amount)
                        , style);
                });
            }
            ExcelHelper.CreateCell(row, ++cellIndex, allDetails.Where(od => (od.Order.LongSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="长袖") || (od.Order.ShortSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="短袖")).Sum(s => s.Amount)
                , style);
            ExcelHelper.CreateCell(row, ++cellIndex, allOrders.Count(), style);
            
            #endregion

        }

        private string GetSizeNameByChest(Order order, Size manSize, Size womanSize)
        {
            //女装默认尺码表      男装默认尺码表
            //87-90   5R         99-102  37
            //90-93   7R         103-106 38
            //93-96   9R         107-110 39
            //96-99   11R        111-114 40
            //99-102  13R        115-118 41
            //103-106 15R        119-122 42
            //106-109 17R        123-126 43
            //109-112 19R        127-130 44
            //112-115 21R	 	 131-134 45
            if (string.IsNullOrWhiteSpace(order.ShirtSizeName))
            {
                SizeDetail sizeDetail = null;
                Size size = order.Sex == "M" ? manSize : womanSize;
                int chest = order.ShirtChest.Value + (order.ShirtChestEnlarge.HasValue ? order.ShirtChestEnlarge.Value : 0);

                //比最小的尺寸还要小
                if (size.SizeDetails.OrderBy(sd => sd.Chest).First().Chest > chest)
                    return "特小";
                //比最大的尺寸还要大
                if (size.SizeDetails.OrderByDescending(sd => sd.Chest).First().Chest < chest)
                    return "特大";
                //尺寸正好匹配，返回匹配的尺寸，不然向大一号的尺寸靠拢。比如订单胸围是96，尺寸表中的胸围是95,99,103，那么应该匹配胸围是99的尺寸。
                return size.SizeDetails.Where(sd => sd.Chest >= chest).OrderBy(sd => sd.Chest).First().SizeName;
            }
            else
                return order.ShirtSizeName;

            #region 旧的计算尺寸的逻辑
            ////比最小的尺寸还要小
            //sizeDetail = size.SizeDetails.OrderBy(sd => sd.Chest).First();
            //if (sizeDetail.Chest - size.ChestScopeL > chest)
            //    return "特小";

            ////比最大的尺寸还要大
            //sizeDetail = size.SizeDetails.OrderByDescending(sd => sd.Chest).First();
            //if (sizeDetail.Chest + size.ChestScopeU < chest)
            //    return "特大";


            //List<SizeDetail> sizeDetails = size.SizeDetails.Where(s => s.Chest - size.ChestScopeL <= chest && s.Chest + size.ChestScopeU >= chest).OrderBy(s => s.Chest).ToList();
            //if (sizeDetails.Count == 1)
            //    return sizeDetails[0].SizeName;
            //else if (sizeDetails.Count == 2)
            //{
            //    /*
            //     * 胸围可能在SizeDetails表里重叠，比如尺码5R胸围87-90，7R胸围90-93
            //     * 90就是重叠，如果订单胸围正好是90，上面变量sizeDetails.Count就是2，
            //     * 在这种情况中，如果是男装特大码（胸围>=133），取较小的Size
            //     * 其他情况如果age有值，order.Age<=age取较小尺码，order.Age>age取较大尺码
            //     * 如果age==null，order.PreSize=='S'取较小的那条尺码；order.PreSize=='B'取较大的那条尺码
            //    */
            //    if (order.Sex == "M" && chest >= 133)
            //    {
            //        return sizeDetails[0].SizeName;
            //    }
            //    else
            //    {
            //        if (age.HasValue && order.Age.HasValue)
            //        {
            //            if (order.Age.Value <= age)
            //                return sizeDetails[0].SizeName;
            //            else
            //                return sizeDetails[1].SizeName;
            //        }
            //        else
            //        {
            //            if (order.PreSize == "S")
            //                return sizeDetails[0].SizeName;
            //            else
            //                return sizeDetails[1].SizeName;
            //        }
            //    }
            //}
            //else
            //{
            //    return "未找到正确尺码";
            //}
            #endregion
        }

        private double CalculateTotalPrice(List<Order> orders)
        {
            return orders.Sum(o => o.OrderDetails.Sum(s =>
            {
                decimal lPrice = 0;
                decimal sPrice = 0;
                if (o.ShirtLPrice.HasValue)
                    lPrice = o.ShirtLPrice.Value;
                if (o.ShirtSPrice.HasValue)
                    sPrice = o.ShirtSPrice.Value;

                if (s.Category == "衬衫" && s.SubCategory == "长袖" && s.Order.LongSleeveIsEnabled)
                    return Convert.ToDouble(s.Amount * lPrice);
                else if (s.Category == "衬衫" && s.SubCategory == "短袖" && s.Order.ShortSleeveIsEnabled)
                    return Convert.ToDouble(s.Amount * sPrice);
                else
                    return 0;
            }));
        }

        private void AddTotal(ISheet sheet, int rowIndex, ICellStyle style, List<Order> orders,bool isShowHeader)
        {
            IRow row;
            if (isShowHeader)
            {
                row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 1, "正常规格数量", style);
                ExcelHelper.CreateCell(row, 2, "特殊规格数量", style);
                ExcelHelper.CreateCell(row, 3, "人数", style);
                rowIndex++;
            }

            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "长袖总计", style);
            ExcelHelper.CreateCell(row, 1, orders.Where(o => o.LongSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "长袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 2, orders.Where(o => o.LongSleeveIsEnabled == true && string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="长袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 3, orders.Where(o => o.LongSleeveIsEnabled == true).Count(), style);



            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "短袖总计", style);
            ExcelHelper.CreateCell(row, 1, orders.Where(o => o.ShortSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "短袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 2, orders.Where(o => o.ShortSleeveIsEnabled == true && string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "短袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 3, orders.Where(o => o.ShortSleeveIsEnabled == true).Count(), style);


            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "总计", style);
            ExcelHelper.CreateCell(row, 1, orders.Sum(o => o.OrderDetails.Where(od => (od.Order.LongSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="长袖") || (od.Order.ShortSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="短袖")).Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 2, "", style);
            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex, 1, 2));
            ExcelHelper.CreateCell(row, 3, orders.Count(), style);

            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "加工费", style);
            ExcelHelper.CreateCell(row, 1, CalculateTotalPrice(orders), style);
        }

        private void CreateDepartmentSheet(HSSFWorkbook book, ICellStyle style)
        {
            ISheet sheet = book.CreateSheet("部门");
            IRow row = null;
            int rowIndex = 0;

            CreateTitle(sheet, ref rowIndex);

            rowIndex++;
            CreateColorClothTable(sheet, ref rowIndex, style);

            //新增一空白航
            rowIndex++;

            rowIndex++;
            CreateHeader(sheet, style, ref rowIndex, new string[] { "汇总类型", "性别", "尺码", "正常规格数量", "特殊规格数量", "正常规格数量", "特殊规格数量", "人数" }, new string[] { "长袖", "短袖" }, "正常规格数量", 1);

            orders.OrderBy(o=>o.Department).ThenBy(o => GetSizeNameByChest(o, manSize, womanSize)).GroupBy(o => o.Department).ToList().ForEach(department =>
            {
                int depMergeIndexStart = rowIndex + 1;
                department.GroupBy(o1 => o1.Sex).ToList().ForEach(sex => {

                    int sexMergeIndexStart = rowIndex + 1;
                    sex.GroupBy(order => GetSizeNameByChest(order, manSize, womanSize)).ToList().ForEach(size =>
                    {
                        rowIndex++;
                        row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, department.Key, style);
                        ExcelHelper.CreateCell(row, 1, sex.Key == "M" ? "男" : "女", style);
                        ExcelHelper.CreateCell(row, 2, size.Key, style);
                        ExcelHelper.CreateCell(row, 3, size.Sum(s => s.OrderDetails.Where(a => a.Category == "衬衫" && a.SubCategory == "长袖" && a.Order.LongSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(s.ShirtSizeName)).Sum(s1 => s1.Amount)), style);
                        ExcelHelper.CreateCell(row, 4, size.Sum(s => s.OrderDetails.Where(a => a.Category == "衬衫" && a.SubCategory == "长袖" && a.Order.LongSleeveIsEnabled == true && string.IsNullOrWhiteSpace(s.ShirtSizeName)).Sum(s1 => s1.Amount)), style);
                        ExcelHelper.CreateCell(row, 5, size.Sum(s => s.OrderDetails.Where(a => a.Category == "衬衫" && a.SubCategory == "短袖" && a.Order.ShortSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(s.ShirtSizeName)).Sum(s1 => s1.Amount)), style);
                        ExcelHelper.CreateCell(row, 6, size.Sum(s => s.OrderDetails.Where(a => a.Category == "衬衫" && a.SubCategory == "短袖" && a.Order.ShortSleeveIsEnabled == true && string.IsNullOrWhiteSpace(s.ShirtSizeName)).Sum(s1 => s1.Amount)), style);
                        ExcelHelper.CreateCell(row, 7, size.Count(), style);

                    });

                    sheet.AddMergedRegion(new CellRangeAddress(sexMergeIndexStart, rowIndex, 1, 1));

                });

                sheet.AddMergedRegion(new CellRangeAddress(depMergeIndexStart, rowIndex, 0, 0));

            });

            //人数总计
            CreatePeopleCount(sheet.GetRow(rowIndex - 1), 8, orders.Count, style);

            //新增一空白航
            rowIndex++;

            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 3, "正常规格数量", style);
            ExcelHelper.CreateCell(row, 4, "特殊规格数量", style);
            ExcelHelper.CreateCell(row, 5, "人数", style);

            orders.OrderBy(o => o.Department).GroupBy(o => o.Department).ToList().ForEach(dep => {

                int depMergeIndexStart = rowIndex + 1;
                dep.OrderByDescending(o=>o.Sex).GroupBy(o1 => o1.Sex).ToList().ForEach(sex =>
                {
                    int sexMergeIndexStart = rowIndex + 1; 

                    rowIndex++;
                    row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, dep.Key, style);
                    ExcelHelper.CreateCell(row, 1, sex.Key == "M" ? "男" : "女", style);
                    ExcelHelper.CreateCell(row, 2, "长袖小计", style);
                    ExcelHelper.CreateCell(row, 3, sex.Sum(a => a.OrderDetails.Where(s => s.Category == "衬衫" && s.SubCategory == "长袖" && s.Order.LongSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(a.ShirtSizeName)).Sum(s => s.Amount)), style);
                    ExcelHelper.CreateCell(row, 4, sex.Sum(a => a.OrderDetails.Where(s => s.Category == "衬衫" && s.SubCategory == "长袖" && s.Order.LongSleeveIsEnabled == true && string.IsNullOrWhiteSpace(a.ShirtSizeName)).Sum(s => s.Amount)), style);
                    ExcelHelper.CreateCell(row, 5, sex.Count(), style);

                    rowIndex++;
                    row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, dep.Key, style);
                    ExcelHelper.CreateCell(row, 1, sex.Key == "M" ? "男" : "女", style);
                    ExcelHelper.CreateCell(row, 2, "短袖小计", style);
                    ExcelHelper.CreateCell(row, 3, sex.Sum(a => a.OrderDetails.Where(s => s.Category == "衬衫" && s.SubCategory == "短袖" && s.Order.ShortSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(a.ShirtSizeName)).Sum(s => s.Amount)), style);
                    ExcelHelper.CreateCell(row, 4, sex.Sum(a => a.OrderDetails.Where(s => s.Category == "衬衫" && s.SubCategory == "短袖" && s.Order.ShortSleeveIsEnabled == true && string.IsNullOrWhiteSpace(a.ShirtSizeName)).Sum(s => s.Amount)), style);
                    ExcelHelper.CreateCell(row, 5, "", style);
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex, 5, 5));

                    sheet.AddMergedRegion(new CellRangeAddress(sexMergeIndexStart, rowIndex, 1, 1));

                });

                sheet.AddMergedRegion(new CellRangeAddress(depMergeIndexStart, rowIndex, 0, 0));
            });

            //人数总计
            CreatePeopleCount(sheet.GetRow(rowIndex - 1), 6, orders.Count, style);


            //新增一空白航
            rowIndex++;


            rowIndex++;
            AddTotal(sheet, rowIndex, style, orders, true);



            //sheet.SetColumnWidth(0, 10 * 256);
            //sheet.SetColumnWidth(1, 14 * 256);
            //sheet.SetColumnWidth(2, 14 * 256);
            //sheet.SetColumnWidth(3, 14 * 256);
            //sheet.SetColumnWidth(4, 14 * 256);
            //sheet.SetColumnWidth(5, 14 * 256);
            //sheet.SetColumnWidth(6, 14 * 256);
        }

        private void CreateColorClothSheet2(HSSFWorkbook book, ICellStyle style)
        {
            ISheet sheet = book.CreateSheet("颜色布料");
            int rowIndex = 0;
            IRow row = null;

            CreateTitle(sheet, ref rowIndex);

            rowIndex++;
            CreateColorClothTable(sheet, ref rowIndex, style);

            //新增一空白航
            rowIndex++;

            rowIndex++;
            List<OrderDetail> ods = ConvertOrdersToOrderDetails(orders);
            List<OrderDetail> longSleeveODs = ods.Where(od => od.Order.LongSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="长袖").OrderBy(od => od.Color).ThenBy(od => od.Cloth).ToList();
            List<OrderDetail> shortSleeveODs = ods.Where(od => od.Order.ShortSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="短袖").OrderBy(od=>od.Color).ThenBy(od=>od.Cloth).ToList();

            #region 表头
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "汇总类型", style);
            ExcelHelper.CreateCell(row, 1, "性别", style);

            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex+1, 0, "汇总类型", style);
            ExcelHelper.CreateCell(row, 1, "性别", style);

            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex+2, 0, "汇总类型", style);
            ExcelHelper.CreateCell(row, 1, "性别", style);

            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 2, 0, 0));
            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 2, 1, 1));

            int cellIndex = 1;
            int startIndex = cellIndex;//重置变量，记录每一新行的开始的列下表
            if (longSleeveODs.Count > 0)
            {
                int mergeIndexStart = cellIndex + 1;
                longSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(od =>
                {
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "长袖", style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "长袖", style);

                    cellIndex = startIndex;//画下一行时，重置列下标
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++cellIndex, od.Key.Color + " " + od.Key.Cloth, style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++cellIndex, "", style);
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex + 1, rowIndex + 1, cellIndex - 1, cellIndex));
                    

                    cellIndex = startIndex;
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++cellIndex, "正常规格数量", style);
                    sheet.SetColumnWidth(cellIndex, 14 * 256);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++cellIndex, "特殊规格数量", style);
                    sheet.SetColumnWidth(cellIndex, 14 * 256);

                    startIndex = cellIndex;//重置变量设置成新的下标
                });
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex, mergeIndexStart, cellIndex));
            }

            if (shortSleeveODs.Count > 0)
            {
                int mergeIndexStart = cellIndex + 1;
                shortSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(od =>
                {
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "短袖", style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "短袖", style);

                    cellIndex = startIndex;//画下一行时，重置列下标
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++cellIndex, od.Key.Color + " " + od.Key.Cloth, style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++cellIndex, "", style);
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex + 1, rowIndex + 1, cellIndex - 1, cellIndex));


                    cellIndex = startIndex;
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++cellIndex, "正常规格数量", style);
                    sheet.SetColumnWidth(cellIndex, 14 * 256);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++cellIndex, "特殊规格数量", style);
                    sheet.SetColumnWidth(cellIndex, 14 * 256);

                    startIndex = cellIndex;//重置变量设置成新的下标
                });
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex, mergeIndexStart, cellIndex));
            }

            ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "人数", style);
            ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), cellIndex, "人数", style);
            ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), cellIndex, "人数", style);
            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 2, cellIndex, cellIndex));
            rowIndex += 2;
            #endregion

            #region 表身
            ods.OrderBy(od => od.Order.Department).GroupBy(od => od.Order.Department).ToList().ForEach(dep => 
            {
                int depMergeIndexStart = rowIndex + 1;
                dep.OrderByDescending(d => d.Order.Sex).GroupBy(d => d.Order.Sex).ToList().ForEach(sex => 
                {
                    rowIndex++;
                    cellIndex = -1;
                    row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, ++cellIndex, dep.Key, style);
                    ExcelHelper.CreateCell(row, ++cellIndex, sex.Key == "M" ? "男" : "女", style);

                    longSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(cc => 
                    {
                        
                        ExcelHelper.CreateCell(row, ++cellIndex,
                        sex.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.LongSleeveIsEnabled == true && od.Category=="衬衫" && od.SubCategory=="长袖" && !string.IsNullOrWhiteSpace(od.Order.ShirtSizeName)).Sum(s => s.Amount)
                            , style);

                        ExcelHelper.CreateCell(row, ++cellIndex,
                        sex.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.LongSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "长袖" && string.IsNullOrWhiteSpace(od.Order.ShirtSizeName)).Sum(s => s.Amount)
                            , style);
                    });

                    shortSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(cc =>
                    {
                        ExcelHelper.CreateCell(row, ++cellIndex,
                        sex.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.ShortSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "短袖" && !string.IsNullOrWhiteSpace(od.Order.ShirtSizeName)).Sum(s => s.Amount)
                            , style);

                        ExcelHelper.CreateCell(row, ++cellIndex,
                        sex.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.ShortSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "短袖" && string.IsNullOrWhiteSpace(od.Order.ShirtSizeName)).Sum(s => s.Amount)
                            , style);
                    });

                    ExcelHelper.CreateCell(row, ++cellIndex, sex.GroupBy(s=>s.Order).Count(), style);
                });
                sheet.AddMergedRegion(new CellRangeAddress(depMergeIndexStart, rowIndex, 0, 0));

            });
            CreatePeopleCount(sheet.GetRow(rowIndex - 1), ++cellIndex, orders.Count, style);
            #endregion

            //新增一空白行
            rowIndex++;

            #region 表头
            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "汇总类型", style);
            ExcelHelper.CreateCell(row, 1, "性别", style);
            ExcelHelper.CreateCell(row, 2, "尺码", style);

            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex + 1, 0, "汇总类型", style);
            ExcelHelper.CreateCell(row, 1, "性别", style);
            ExcelHelper.CreateCell(row, 2, "尺码", style);

            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex + 2, 0, "汇总类型", style);
            ExcelHelper.CreateCell(row, 1, "性别", style);
            ExcelHelper.CreateCell(row, 2, "尺码", style);

            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 2, 0, 0));
            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 2, 1, 1));
            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 2, 2, 2));

            cellIndex = 2;
            startIndex = cellIndex;//重置变量，记录每一新行的开始的列下表
            if (longSleeveODs.Count > 0)
            {
                int mergeIndexStart = cellIndex + 1;
                longSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(od =>
                {
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "长袖", style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "长袖", style);

                    cellIndex = startIndex;//画下一行时，重置列下标
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++cellIndex, od.Key.Color + " " + od.Key.Cloth, style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++cellIndex, "", style);
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex + 1, rowIndex + 1, cellIndex - 1, cellIndex));


                    cellIndex = startIndex;
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++cellIndex, "正常规格数量", style);
                    sheet.SetColumnWidth(cellIndex, 14 * 256);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++cellIndex, "特殊规格数量", style);
                    sheet.SetColumnWidth(cellIndex, 14 * 256);

                    startIndex = cellIndex;//重置变量设置成新的下标
                });
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex, mergeIndexStart, cellIndex));
            }

            if (shortSleeveODs.Count > 0)
            {
                int mergeIndexStart = cellIndex + 1;
                shortSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(od =>
                {
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "短袖", style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "短袖", style);

                    cellIndex = startIndex;//画下一行时，重置列下标
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++cellIndex, od.Key.Color + " " + od.Key.Cloth, style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++cellIndex, "", style);
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex + 1, rowIndex + 1, cellIndex - 1, cellIndex));


                    cellIndex = startIndex;
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++cellIndex, "正常规格数量", style);
                    sheet.SetColumnWidth(cellIndex, 14 * 256);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++cellIndex, "特殊规格数量", style);
                    sheet.SetColumnWidth(cellIndex, 14 * 256);

                    startIndex = cellIndex;//重置变量设置成新的下标
                });
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex, mergeIndexStart, cellIndex));
            }

            ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++cellIndex, "人数", style);
            ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), cellIndex, "人数", style);
            ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), cellIndex, "人数", style);
            sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex + 2, cellIndex, cellIndex));
            rowIndex += 2;
            #endregion

            #region 表身
            ods.OrderBy(od => od.Order.Department).GroupBy(od => od.Order.Department).ToList().ForEach(dep =>
            {
                int depMergeIndexStart = rowIndex + 1;
                dep.OrderByDescending(d => d.Order.Sex).GroupBy(d => d.Order.Sex).ToList().ForEach(sex =>
                {
                    int sexMergeIndexStart = rowIndex + 1;
                    sex.OrderBy(s => GetSizeNameByChest(s.Order, manSize, womanSize)).GroupBy(s => GetSizeNameByChest(s.Order, manSize, womanSize)).ToList().ForEach(size =>
                    {
                        rowIndex++;
                        cellIndex = -1;
                        row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, ++cellIndex, dep.Key, style);
                        ExcelHelper.CreateCell(row, ++cellIndex, sex.Key == "M" ? "男" : "女", style);
                        ExcelHelper.CreateCell(row, ++cellIndex, size.Key, style);

                        longSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(cc =>
                        {
                            ExcelHelper.CreateCell(row, ++cellIndex,
                            sex.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.LongSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "长袖" && od.Order.ShirtSizeName == size.Key).Sum(s => s.Amount)
                                , style);

                            ExcelHelper.CreateCell(row, ++cellIndex,
                            sex.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.LongSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "长袖" && string.IsNullOrWhiteSpace(od.Order.ShirtSizeName) && GetSizeNameByChest(od.Order, manSize, womanSize) == size.Key).Sum(s => s.Amount)
                                , style);
                        });

                        shortSleeveODs.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(cc =>
                        {
                            ExcelHelper.CreateCell(row, ++cellIndex,
                            sex.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.ShortSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "短袖" && od.Order.ShirtSizeName == size.Key).Sum(s => s.Amount)
                                , style);

                            ExcelHelper.CreateCell(row, ++cellIndex,
                            sex.Where(od => od.Color.ToLower() == cc.Key.Color.ToLower() && od.Cloth.ToLower() == cc.Key.Cloth.ToLower() && od.Order.ShortSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "短袖" && string.IsNullOrWhiteSpace(od.Order.ShirtSizeName) && GetSizeNameByChest(od.Order, manSize, womanSize) == size.Key).Sum(s => s.Amount)
                                , style);
                        });

                        ExcelHelper.CreateCell(row, ++cellIndex, size.GroupBy(s => s.Order).Count(), style);
                    });
                    sheet.AddMergedRegion(new CellRangeAddress(sexMergeIndexStart, rowIndex, 1, 1));
                });
                sheet.AddMergedRegion(new CellRangeAddress(depMergeIndexStart, rowIndex, 0, 0));
            });
            CreatePeopleCount(sheet.GetRow(rowIndex - 1), ++cellIndex, orders.Count, style);
            #endregion

            //新增一空白行
            rowIndex++;

            rowIndex++;
            AddTotal(sheet, rowIndex, style, orders, true);
        }

        private void CreateColorClothSheet(HSSFWorkbook book, ICellStyle style)
        {
            ISheet sheet = book.CreateSheet("颜色布料");
            int rowIndex = 0;
            IRow row = null;

            CreateTitle(sheet, ref rowIndex);

            rowIndex++;
            CreateColorClothTable(sheet, ref rowIndex, style);

            //新增一空白航
            rowIndex++;

            rowIndex++;
            CreateHeader(sheet, style, ref rowIndex, new string[] { "汇总类型", "性别", "颜色", "布料", "尺码", "正常规格数量", "特殊规格数量", "正常规格数量", "特殊规格数量", "人数" }, new string[] { "长袖", "短袖" }, "正常规格数量", 1);

            List<OrderDetail> orderDetails = new List<OrderDetail>();
            orders.OrderBy(o => o.ShirtChest).GroupBy(o => o.Department).ToList().ForEach(department =>
            {
                int depMergeIndexStart = rowIndex + 1;
                department.GroupBy(o1 => o1.Sex).ToList().ForEach(g_sex =>
                {
                    int sexMergeIndexStart = rowIndex + 1;
                    orderDetails.Clear();
                    g_sex.ToList().ForEach(o => orderDetails.AddRange(o.OrderDetails));

                    orderDetails.OrderBy(od => od.Color).ThenBy(od=>od.Cloth).GroupBy(od => new { Color = od.Color, Cloth = od.Cloth }).ToList().ForEach(g_cc =>
                    {
                        int ccMergeIndexStart = rowIndex + 1;
                        g_cc.GroupBy(x => GetSizeNameByChest(x.Order, manSize, womanSize)).ToList().ForEach(g_size =>
                        {
                            rowIndex++;
                            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, department.Key, style);
                            ExcelHelper.CreateCell(row, 1, g_sex.Key == "M" ? "男" : "女", style);
                            ExcelHelper.CreateCell(row, 2, g_cc.Key.Color, style);
                            ExcelHelper.CreateCell(row, 3, g_cc.Key.Cloth, style);
                            ExcelHelper.CreateCell(row, 4, g_size.Key, style);
                            ExcelHelper.CreateCell(row, 5, g_size.Where(s => s.Category == "衬衫" && s.SubCategory == "长袖" && s.Order.LongSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(s.Order.ShirtSizeName)).Sum(s1 => s1.Amount), style);
                            ExcelHelper.CreateCell(row, 6, g_size.Where(s => s.Category == "衬衫" && s.SubCategory == "长袖" && s.Order.LongSleeveIsEnabled == true && string.IsNullOrWhiteSpace(s.Order.ShirtSizeName)).Sum(s1 => s1.Amount), style);
                            ExcelHelper.CreateCell(row, 7, g_size.Where(s => s.Category == "衬衫" && s.SubCategory == "短袖" && s.Order.ShortSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(s.Order.ShirtSizeName)).Sum(s1 => s1.Amount), style);
                            ExcelHelper.CreateCell(row, 8, g_size.Where(s => s.Category == "衬衫" && s.SubCategory == "短袖" && s.Order.ShortSleeveIsEnabled == true && string.IsNullOrWhiteSpace(s.Order.ShirtSizeName)).Sum(s1 => s1.Amount), style);
                            ExcelHelper.CreateCell(row, 9, g_size.Count(), style);
                        });

                        sheet.AddMergedRegion(new CellRangeAddress(ccMergeIndexStart, rowIndex, 2, 2));
                        sheet.AddMergedRegion(new CellRangeAddress(ccMergeIndexStart, rowIndex, 3, 3));

                    });

                    sheet.AddMergedRegion(new CellRangeAddress(sexMergeIndexStart, rowIndex, 1, 1));
                });


                sheet.AddMergedRegion(new CellRangeAddress(depMergeIndexStart, rowIndex, 0, 0));
            });

            //人数总计
            CreatePeopleCount(sheet.GetRow(rowIndex - 1), 10, orders.Count, style);


            //新增一空白航
            rowIndex++;

            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 5, "正常规格数量", style);
            ExcelHelper.CreateCell(row, 6, "特殊规格数量", style);
            ExcelHelper.CreateCell(row, 7, "人数", style);

            orders.OrderBy(o => o.ShirtChest).GroupBy(o => o.Department).ToList().ForEach(department =>
            {
                int depMergeIndexStart = rowIndex + 1;
                department.GroupBy(o1 => o1.Sex).ToList().ForEach(g_sex =>
                {
                    int sexMergeIndexStart = rowIndex + 1;
                    orderDetails.Clear();
                    g_sex.ToList().ForEach(o => orderDetails.AddRange(o.OrderDetails));

                    orderDetails.OrderBy(od => od.Color).ThenBy(od => od.Cloth).GroupBy(od => new { Color = od.Color, Cloth = od.Cloth }).ToList().ForEach(g_cc =>
                    {
                        int ccMergeIndexStart = rowIndex + 1;
                        rowIndex++;
                        row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, department.Key, style);
                        ExcelHelper.CreateCell(row, 1, g_sex.Key == "M" ? "男" : "女", style);
                        ExcelHelper.CreateCell(row, 2, g_cc.Key.Color, style);
                        ExcelHelper.CreateCell(row, 3, g_cc.Key.Cloth, style);
                        ExcelHelper.CreateCell(row, 4, "长袖小计", style);
                        ExcelHelper.CreateCell(row, 5, g_cc.Where(s => s.Category=="衬衫" && s.SubCategory=="长袖" && s.Order.LongSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(s.Order.ShirtSizeName)).Sum(s => s.Amount), style);
                        ExcelHelper.CreateCell(row, 6, g_cc.Where(s => s.Category=="衬衫" && s.SubCategory=="长袖" && s.Order.LongSleeveIsEnabled == true && string.IsNullOrWhiteSpace(s.Order.ShirtSizeName)).Sum(s => s.Amount), style);
                        ExcelHelper.CreateCell(row, 7, g_cc.Where(s => s.Order.LongSleeveIsEnabled == true).Count(), style);


                        rowIndex++;
                        row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, department.Key, style);
                        ExcelHelper.CreateCell(row, 1, g_sex.Key == "M" ? "男" : "女", style);
                        ExcelHelper.CreateCell(row, 2, g_cc.Key.Color, style);
                        ExcelHelper.CreateCell(row, 3, g_cc.Key.Cloth, style);
                        ExcelHelper.CreateCell(row, 4, "短袖小计", style);
                        ExcelHelper.CreateCell(row, 5, g_cc.Where(s => s.Category == "衬衫" && s.SubCategory == "短袖" && s.Order.ShortSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(s.Order.ShirtSizeName)).Sum(s => s.Amount), style);
                        ExcelHelper.CreateCell(row, 6, g_cc.Where(s => s.Category == "衬衫" && s.SubCategory == "短袖" && s.Order.ShortSleeveIsEnabled == true && string.IsNullOrWhiteSpace(s.Order.ShirtSizeName)).Sum(s => s.Amount), style);
                        ExcelHelper.CreateCell(row, 7, g_cc.Where(s => s.Order.ShortSleeveIsEnabled == true).Count(), style);

                        sheet.AddMergedRegion(new CellRangeAddress(ccMergeIndexStart, rowIndex, 2, 2));
                        sheet.AddMergedRegion(new CellRangeAddress(ccMergeIndexStart, rowIndex, 3, 3));
                    });

                    sheet.AddMergedRegion(new CellRangeAddress(sexMergeIndexStart, rowIndex, 1, 1));
                });


                sheet.AddMergedRegion(new CellRangeAddress(depMergeIndexStart, rowIndex, 0, 0));
            });

            //人数总计
            CreatePeopleCount(sheet.GetRow(rowIndex - 1), 8, orders.Count, style);


            //新增一空白航
            rowIndex++;

            rowIndex++;
            AddTotal(sheet, rowIndex, style, orders, true);


            //sheet.SetColumnWidth(0, 10 * 256);
            //sheet.SetColumnWidth(1, 14 * 256);
            //sheet.SetColumnWidth(2, 14 * 256);
            
            //sheet.SetColumnWidth(4, 10 * 256);
            //sheet.SetColumnWidth(5, 14 * 256);
            //sheet.SetColumnWidth(6, 14 * 256);
            //sheet.SetColumnWidth(7, 14 * 256);
            //sheet.SetColumnWidth(8, 14 * 256);
        }


        private List<OrderDetail> ConvertOrdersToOrderDetails(List<Order> source)
        {
            List<OrderDetail> ods = new List<OrderDetail>();
            source.ForEach(o => ods.AddRange(o.OrderDetails));
            return ods;
        }

        private void CreateColorClothTable(ISheet sheet, ref int rowIndex, ICellStyle style)
        {
            //这个区域里的数据画法和别的地方有所不同，这里是行数固定，列数不定，先创建了固定数量的行，4行
            ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "", style);
            ExcelHelper.CreateRowAndCell(sheet, rowIndex + 1, 0, "", style);
            ExcelHelper.CreateRowAndCell(sheet, rowIndex + 2, 0, "", style);
            ExcelHelper.CreateRowAndCell(sheet, rowIndex + 3, 0, "", style);
            ExcelHelper.CreateRowAndCell(sheet, rowIndex + 4, 0, "", style);

            List<OrderDetail> ods = ConvertOrdersToOrderDetails(orders);
            List<OrderDetail> manLongSleeve = ods.Where(od => od.Order.Sex == "M" && od.Order.LongSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "长袖").OrderBy(od => od.Color).ThenBy(od => od.Color).ToList();//男长袖
            List<OrderDetail> manShortSleeve = ods.Where(od => od.Order.Sex == "M" && od.Order.ShortSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "短袖").OrderBy(od => od.Color).ThenBy(od => od.Color).ToList();//男短袖
            List<OrderDetail> womanLongSleeve = ods.Where(od => od.Order.Sex == "F" && od.Order.LongSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "长袖").OrderBy(od => od.Color).ThenBy(od => od.Color).ToList();//女长袖
            List<OrderDetail> womanShortSleeve = ods.Where(od => od.Order.Sex == "F" && od.Order.ShortSleeveIsEnabled == true && od.Category == "衬衫" && od.SubCategory == "短袖").OrderBy(od => od.Color).ThenBy(od => od.Color).ToList();//女短袖

            int cellIndex = -1;
            //随后，画4行动态数量的列，如果manLongSleeve.Count==0,不画出改数据
            CreateColorClothColumn(sheet, rowIndex, ref cellIndex, style, manLongSleeve, "男长袖");
            //再重置行号，再画4行动态数量的列
            CreateColorClothColumn(sheet, rowIndex, ref cellIndex, style, manShortSleeve, "男短袖");
            CreateColorClothColumn(sheet, rowIndex, ref cellIndex, style, womanLongSleeve, "女长袖");
            CreateColorClothColumn(sheet, rowIndex, ref cellIndex, style, womanShortSleeve, "女短袖");
            rowIndex = rowIndex + 4;


            rowIndex++;
            IRow row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "总计", style);
            ExcelHelper.CreateCell(row, 1, orders.Count(), style);

            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "加工费", style);
            ExcelHelper.CreateCell(row, 1, CalculateTotalPrice(orders), style);
        }


        private void CreateColorClothColumn(ISheet sheet, int rowIndex, ref int cellIndex, ICellStyle style, List<OrderDetail> orderDetails, string columnName)
        {
            if (orderDetails.Count > 0)
            {
                int index = cellIndex;
                int startIndex = cellIndex;//重置变量，记录每一新行的开始的列下表
                bool flag = false;//第一次进循环，画男长袖小计，男短袖小计，女长袖小计，女短袖小计，第二次进循环就不画了

                int mergeIndexStart = cellIndex + 1;
                orderDetails.GroupBy(od => new { Color = od.Color.ToLower(), Cloth = od.Cloth.ToLower() }).ToList().ForEach(cc =>
                {
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++index, columnName, style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex), ++index, "", style);

                    index = startIndex;//画下一行时，重置列下标
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++index, cc.Key.Color+" "+cc.Key.Cloth, style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 1), ++index, "", style);
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex + 1, rowIndex + 1, index-1, index));

                    index = startIndex;
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++index, "正常规格数量", style);
                    sheet.SetColumnWidth(index, 14 * 256);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 2), ++index, "特殊规格数量", style);
                    sheet.SetColumnWidth(index, 14 * 256);

                    index = startIndex;
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 3), ++index, cc.Where(od => !string.IsNullOrWhiteSpace(od.Order.ShirtSizeName)).Sum(s => s.Amount), style);
                    ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 3), ++index, cc.Where(od => string.IsNullOrWhiteSpace(od.Order.ShirtSizeName)).Sum(s => s.Amount), style);

                    index = startIndex;
                    if (!flag)
                    {
                        ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 4), ++index, columnName + "小计", style);
                        ExcelHelper.CreateCell(sheet.GetRow(rowIndex + 4), ++index, orderDetails.Sum(s=>s.Amount), style);
                        flag = true;
                    }
                    else
                    {
                        index++;
                        index++;
                    }

                    startIndex = index;//重置变量设置成新的下标
                });

                cellIndex = index;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex, mergeIndexStart, index));
            }
        }


        private void CreateSexSheet(HSSFWorkbook book, ICellStyle style)
        {
            ISheet sheet = book.CreateSheet("性别");
            IRow row = null;
            int rowIndex = 0;

            CreateTitle(sheet, ref rowIndex);

            rowIndex++;
            CreateColorClothTable(sheet, ref rowIndex, style);


            //新增一空白航
            rowIndex++;


            rowIndex++;
            CreateHeader(sheet, style, ref rowIndex, new string[] { "汇总类型", "尺码", "正常规格数量", "特殊规格数量", "正常规格数量", "特殊规格数量", "人数" }, new string[] { "长袖", "短袖" }, "正常规格数量", 1);

            orders.OrderBy(o => GetSizeNameByChest(o,manSize,womanSize)).GroupBy(o => o.Sex).ToList().ForEach(sex =>
            {
                int mergeIndexStart = rowIndex + 1;
                sex.GroupBy(order => GetSizeNameByChest(order, manSize, womanSize)).ToList().ForEach(number =>
                {
                    rowIndex++;
                    row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, sex.Key == "M" ? "男" : "女", style);
                    ExcelHelper.CreateCell(row, 1, number.Key, style);
                    ExcelHelper.CreateCell(row, 2, number.Sum(s => s.OrderDetails.Where(a => a.Category == "衬衫" && a.SubCategory == "长袖" && a.Order.LongSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(a.Order.ShirtSizeName)).Sum(s1 => s1.Amount)), style);
                    ExcelHelper.CreateCell(row, 3, number.Sum(s => s.OrderDetails.Where(a => a.Category == "衬衫" && a.SubCategory == "长袖" && a.Order.LongSleeveIsEnabled == true && string.IsNullOrWhiteSpace(a.Order.ShirtSizeName)).Sum(s1 => s1.Amount)), style);
                    ExcelHelper.CreateCell(row, 4, number.Sum(s => s.OrderDetails.Where(a => a.Category == "衬衫" && a.SubCategory == "短袖" && a.Order.ShortSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(a.Order.ShirtSizeName)).Sum(s1 => s1.Amount)), style);
                    ExcelHelper.CreateCell(row, 5, number.Sum(s => s.OrderDetails.Where(a => a.Category == "衬衫" && a.SubCategory == "短袖" && a.Order.ShortSleeveIsEnabled == true && string.IsNullOrWhiteSpace(a.Order.ShirtSizeName)).Sum(s1 => s1.Amount)), style);
                    ExcelHelper.CreateCell(row, 6, number.Count(), style);
                });

                sheet.AddMergedRegion(new CellRangeAddress(mergeIndexStart, rowIndex, 0, 0));

            });

            //人数总计
            CreatePeopleCount(sheet.GetRow(rowIndex - 1), 7, orders.Count, style);            

            //新增一空白航
            rowIndex++;


            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 1, "正常规格数量", style);
            ExcelHelper.CreateCell(row, 2, "特殊规格数量", style);
            ExcelHelper.CreateCell(row, 3, "人数", style);

            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "男长袖小计", style);
            ExcelHelper.CreateCell(row, 1, orders.Where(o => o.Sex == "M" && o.LongSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "长袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 2, orders.Where(o => o.Sex == "M" && o.LongSleeveIsEnabled == true && string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "长袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 3, orders.Where(o => o.Sex == "M" && o.LongSleeveIsEnabled == true).Count(), style);

            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "男短袖小计", style);
            ExcelHelper.CreateCell(row, 1, orders.Where(o => o.Sex == "M" && o.ShortSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="短袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 2, orders.Where(o => o.Sex == "M" && o.ShortSleeveIsEnabled == true && string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="短袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 3, orders.Where(o => o.Sex == "M" && o.ShortSleeveIsEnabled == true).Count(), style);

            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "女长袖小计", style);
            ExcelHelper.CreateCell(row, 1, orders.Where(o => o.Sex == "F" && o.LongSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="长袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 2, orders.Where(o => o.Sex == "F" && o.LongSleeveIsEnabled == true && string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "长袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 3, orders.Where(o => o.Sex == "F" && o.LongSleeveIsEnabled == true).Count(), style);

            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "女短袖小计", style);
            ExcelHelper.CreateCell(row, 1, orders.Where(o => o.Sex == "F" && o.ShortSleeveIsEnabled == true && !string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "短袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 2, orders.Where(o => o.Sex == "F" && o.ShortSleeveIsEnabled == true && string.IsNullOrWhiteSpace(o.ShirtSizeName)).Sum(o => o.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "短袖").Sum(s => s.Amount)), style);
            ExcelHelper.CreateCell(row, 3, orders.Where(o => o.Sex == "F" && o.ShortSleeveIsEnabled == true).Count(), style);

            rowIndex++;
            AddTotal(sheet, rowIndex, style, orders, false);


            //sheet.SetColumnWidth(0, 12 * 256);
            //sheet.SetColumnWidth(1, 14 * 256);
            //sheet.SetColumnWidth(2, 14 * 256);
            //sheet.SetColumnWidth(3, 14 * 256);
            //sheet.SetColumnWidth(4, 14 * 256);
            //sheet.SetColumnWidth(5, 14 * 256);
        }

        private void CreatePeopleCount(IRow row, int cellIndex, int count, ICellStyle style)
        {
            ExcelHelper.CreateCell(row, cellIndex, "人数总计", style);
            ExcelHelper.CreateCell(row.Sheet.GetRow(row.RowNum + 1), cellIndex, count, style);
        }


        private void CreateTitle(ISheet sheet, ref int rowIndex)
        {
            IRow row = null;
            ICellStyle headerStyle = sheet.Workbook.CreateCellStyle();
            HSSFFont font = (HSSFFont)sheet.Workbook.CreateFont();
            font.FontHeightInPoints = 16;
            headerStyle.SetFont(font);
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, orders[0].Company, headerStyle);
        }

        private void CreateHeader(ISheet sheet, ICellStyle style, ref int rowIndex, string[] heads, string[] groupNames, string groupStartColumn, int mergeAmount)
        {
            #region 第一行输出所有的头，从groupStartColumn所在的位置开始横向合并，合并mergeAmount个            
            IRow row = null;
            int groupNamesIndex = 0;
            for (int i = 0; i < heads.Length; i++)
            {
                if (i == 0)
                    row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, i, heads[i], style);
                else
                {
                    if (heads[i] == groupStartColumn)
                    {
                        ExcelHelper.CreateCell(row, i, groupNames[groupNamesIndex], style);
                        groupNamesIndex++;

                        //合并列前，需创建空白列，否则合并列后单元格边框没有
                        for (int j = 1; j <= mergeAmount; j++)
                        {
                            ExcelHelper.CreateCell(row, i + j, "", style);
                        }

                        sheet.AddMergedRegion(new CellRangeAddress(rowIndex, rowIndex, i, i + mergeAmount));
                        i += mergeAmount;
                    }
                    else
                        ExcelHelper.CreateCell(row, i, heads[i], style);
                }
            }
            #endregion

            #region 第二行的列全部向第一行相同的列合并，第一行合并过的列不回冲掉
            rowIndex++;
            int[] outPutColumns = new int[mergeAmount + 1];
            for (int i = 0; i < outPutColumns.Length; i++)
                outPutColumns[i] = -1;

            for (int i = 0; i < heads.Length; i++)
            {
                if (i == 0)
                    row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, i, heads[i], style);
                else
                    ExcelHelper.CreateCell(row, i, heads[i], style);

                //不是特定字段向上合并
                if (heads[i] == groupStartColumn)
                {
                    for (int j = 0; j < outPutColumns.Length; j++)
                    {
                        outPutColumns[j] = i + j;
                    }
                }

                if (!outPutColumns.Contains(i))
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex, i, i));//和上一行的该列合并
            }
            #endregion
        }

        private void CreateOrderListSheet(HSSFWorkbook book, ICellStyle redForeground, ICellStyle greenForeground, ICellStyle style, string sex)
        {
            ISheet sheet = book.CreateSheet("所有订单-" + (sex == "M" ? "男" : "女"));
            string sizeName, sizeNameByNeck;
            SizeDetail sizeDetail=null;
            string[] heads = new string[] { "部门", "职务", "姓名", "性别", "身高", "大身尺码", "尺码带尺码", "领围", "肩宽", "胸围", "腰围", "下摆", "胸围", "腰围", "下摆", "前衣长", "后衣长", "长袖长", "短袖长", "长袖口大", "短袖口大", "长袖加工费", "长袖数量", "短袖加工费", "短袖数量", "备注" };

            
            int rowIndex = 0;
            int cellIndex = 0;
            IRow row=null;

            CreateTitle(sheet, ref rowIndex);

            rowIndex++;
            row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, 0, "", greenForeground);
            ExcelHelper.CreateCell(row, 1, "小于尺码表尺码", style);
            ExcelHelper.CreateCell(row, 2, "", redForeground);
            ExcelHelper.CreateCell(row, 3, "大于尺码表尺码", style);

            rowIndex++;
            CreateHeader(sheet, style, ref rowIndex, heads, new string[] { "测量尺码", "成衣尺码" }, "胸围", 2);

            orders.Where(o => o.Sex == sex).GroupBy(o => o.Department).ToList().ForEach(dep =>
            {
                int depMergeIndexStart = rowIndex + 1;

                dep.GroupBy(o => o.Job).ToList().ForEach(job => 
                {
                    int jobMergeIndexStart = rowIndex + 1;

                    job.ToList().ForEach(o =>
                    {
                        sizeNameByNeck = "";
                        sizeName = GetSizeNameByChest(o, manSize, womanSize);
                        sizeDetail = null;
                        //根据胸围计算尺码，在这种情况下需要找到对应的sizeDetail，用于导出带色块的列，如领围小于sizeDetail里的领围用绿色表示
                        //即使根据胸围计算尺码，当胸围超大或超小时，是有可能找不到sizeDetail的，因为没有sizeDetail，所以无法比较，所以也就不无显示色块
                        if (string.IsNullOrEmpty(o.ShirtSizeName))
                        {
                            if (o.Sex == "M")
                            {
                                sizeDetail = manSize.SizeDetails.Where(sd => sd.Neck == o.ShirtNeck).FirstOrDefault();
                                if (sizeDetail != null)
                                    sizeNameByNeck = sizeDetail.SizeName;

                                sizeDetail = manSize.SizeDetails.Where(sd => sd.SizeName == sizeName).FirstOrDefault();

                            }
                            else
                            {
                                sizeDetail = womanSize.SizeDetails.Where(sd => sd.Neck == o.ShirtNeck).FirstOrDefault();
                                if (sizeDetail != null)
                                    sizeNameByNeck = sizeDetail.SizeName;

                                sizeDetail = womanSize.SizeDetails.Where(sd => sd.SizeName == sizeName).FirstOrDefault();
                            }


                        }
                        rowIndex++;
                        cellIndex = 0;

                        row = ExcelHelper.CreateRowAndCell(sheet, rowIndex, cellIndex, o.Department, style);
                        ExcelHelper.CreateCell(row, ++cellIndex, o.Job, style);
                        //ExcelHelper.CreateCell(row, ++cellIndex, o.EmployeeCode, style);

                        if (orders.Where(order => order.Name == o.Name).Count() > 1)//相同名字的员工，名字标红
                            ExcelHelper.CreateCell(row, ++cellIndex, o.Name, redForeground);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.Name, style);

                        //ExcelHelper.CreateCell(row, ++cellIndex, o.Age.ToString(), style);
                        ExcelHelper.CreateCell(row, ++cellIndex, o.Sex == "M" ? "男" : "女", style);
                        ExcelHelper.CreateCell(row, ++cellIndex, o.Height.ToString(), style);
                        //ExcelHelper.CreateCell(row, ++cellIndex, o.Weight.ToString(), style);
                        ExcelHelper.CreateCell(row, ++cellIndex, sizeName, style);
                        ExcelHelper.CreateCell(row, ++cellIndex, sizeNameByNeck, style);

                        if (sizeDetail != null)
                            CreateForegroundCell(row, o.ShirtNeck.Value, sizeDetail.Neck, sizeDetail.Size.NeckScopeU, sizeDetail.Size.NeckScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtNeck.ToString(), style);

                        if (sizeDetail != null)
                            CreateForegroundCell(row, o.ShirtShoulder.Value, sizeDetail.Shoulder, sizeDetail.Size.ShoulderScopeU, sizeDetail.Size.ShoulderScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtShoulder.ToString(), style);

                        ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtChest, style);

                        if (sizeDetail != null && o.ShirtWaist.HasValue)
                            CreateForegroundCell(row, o.ShirtWaist.Value, sizeDetail.Waist, sizeDetail.Size.WaistScopeU, sizeDetail.Size.WaistScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtWaist.ToString(), style);

                        if (sizeDetail != null && o.ShirtLowerHem.HasValue)
                            CreateForegroundCell(row, o.ShirtLowerHem.Value, sizeDetail.LowerHem, sizeDetail.Size.LowerHemScopeU, sizeDetail.Size.LowerHemScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtLowerHem.ToString(), style);

                        if (o.ShirtChest.HasValue)
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtChest.Value + (o.ShirtChestEnlarge.HasValue ? o.ShirtChestEnlarge.Value : 0), style);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, "", style);

                        if (o.ShirtWaist.HasValue)
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtWaist.Value + (o.ShirtWaistEnlarge.HasValue ? o.ShirtWaistEnlarge.Value : 0), style);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, "", style);

                        if (o.ShirtLowerHem.HasValue)
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtLowerHem.Value + (o.ShirtLowerHemEnlarge.HasValue ? o.ShirtLowerHemEnlarge.Value : 0), style);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, "", style);

                        if (sizeDetail != null && o.ShirtFLength.HasValue)
                            CreateForegroundCell(row, o.ShirtFLength.Value, sizeDetail.FLength, sizeDetail.Size.FLengthScopeU, sizeDetail.Size.FLengthScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtFLength.ToString(), style);

                        if (sizeDetail != null && o.ShirtBLength.HasValue)
                            CreateForegroundCell(row, o.ShirtBLength.Value, sizeDetail.BLength, sizeDetail.Size.BLengthScopeU, sizeDetail.Size.BLengthScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtBLength.ToString(), style);

                        if (sizeDetail != null && o.ShirtLSleeveLength.HasValue)
                            CreateForegroundCell(row, o.ShirtLSleeveLength.Value, sizeDetail.LSleeveLength, sizeDetail.Size.LSleeveLengthScopeU, sizeDetail.Size.LSleeveLengthScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtLSleeveLength.ToString(), style);

                        if (sizeDetail != null && o.ShirtSSleeveLength.HasValue)
                            CreateForegroundCell(row, o.ShirtSSleeveLength.Value, sizeDetail.SSleeveLength, sizeDetail.Size.SSleeveLengthScopeU, sizeDetail.Size.SSleeveLengthScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtSSleeveLength.ToString(), style);

                        if (sizeDetail != null && o.ShirtLSleeveCuff.HasValue)
                            CreateForegroundCell(row, o.ShirtLSleeveCuff.Value, sizeDetail.LSleeveCuff, sizeDetail.Size.LSleeveCuffScopeU, sizeDetail.Size.LSleeveCuffScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtLSleeveCuff.ToString(), style);

                        if (sizeDetail != null && o.ShirtSSleeveCuff.HasValue)
                            CreateForegroundCell(row, o.ShirtSSleeveCuff.Value, sizeDetail.SSleeveCuff, sizeDetail.Size.SSleeveCuffScopeU, sizeDetail.Size.SSleeveCuffScopeL, redForeground, greenForeground, style, ++cellIndex);
                        else
                            ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtSSleeveCuff.ToString(), style);

                        ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtLPrice.ToString(), style);

                        string details = "";
                        o.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="长袖" && od.Order.LongSleeveIsEnabled == true).ToList().ForEach(od =>
                        {
                            details += "布料:" + od.Cloth + " 颜色:" + od.Color + " 数量:" + od.Amount + "\n";
                        });
                        ExcelHelper.CreateCell(row, ++cellIndex, details, style);

                        ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtSPrice.ToString(), style);

                        details = "";
                        o.OrderDetails.Where(od => od.Category=="衬衫" && od.SubCategory=="短袖" && od.Order.ShortSleeveIsEnabled == true).ToList().ForEach(od =>
                        {
                            details += "布料:" + od.Cloth + " 颜色:" + od.Color + " 数量:" + od.Amount + "\n";
                        });
                        ExcelHelper.CreateCell(row, ++cellIndex, details, style);
                        ExcelHelper.CreateCell(row, ++cellIndex, o.ShirtMemo, style);
                    });

                    sheet.AddMergedRegion(new CellRangeAddress(jobMergeIndexStart, rowIndex, 1, 1));
                });
                

                sheet.AddMergedRegion(new CellRangeAddress(depMergeIndexStart, rowIndex, 0, 0));
            });


            sheet.SetColumnWidth(1, 16 * 256);
            sheet.SetColumnWidth(3, 16 * 256);
        }



        private void CreateForegroundCell(IRow row, decimal size, decimal sizeInTable, decimal scopeU, decimal scopeL, ICellStyle redForeground, ICellStyle greenForeground, ICellStyle style, int cellIndex)
        {
            if (size > sizeInTable + scopeU)
            {
                ExcelHelper.CreateCell(row, cellIndex, size.ToString(), redForeground);
            }
            else if (size < sizeInTable - scopeL)
            {
                ExcelHelper.CreateCell(row, cellIndex, size.ToString(), greenForeground);
            }
            else
                ExcelHelper.CreateCell(row, cellIndex, size.ToString(), style);
        }
        #endregion

        #region Validations
        [NonAction]
        public void ValidateExport(string company, string category, int manSizeId, int womanSizeId)
        {
            manSize = sizeDAL.GetSize(manSizeId, "M");
            womanSize = sizeDAL.GetSize(womanSizeId, "F");
            if (manSize == null || womanSize == null)
            {
                this.IsIllegalParameter = true;
                return;
            }

            orders = orderDAL.GetOrders(company, true);
            if (orders.Count == 0)
            {
                this.IsIllegalParameter = true;
                return;
            }

            //this.ValidatorContainer.SetValue("age", age)
            //    .InRange(1, 150, null);

            //this.ValidatorContainer.SetValue("manChestEnlarge", manChestEnlarge)
            //    .InRange(0, 20, null);

            //this.ValidatorContainer.SetValue("womanChestEnlarge", womanChestEnlarge)
            //    .InRange(0, 20, null);

            //这个API的验证错误信息，不会在前台显示，因为前台ajax call使用了arraybuffer
        }
        #endregion
    }
}
