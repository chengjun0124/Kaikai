using KaiKai.Model.DTO;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;

namespace KaiKai.Test.API
{
    [TestClass]
    public class OrderControllerTest
    {
        [ClassInitialize]
        public static void BeforeAll(TestContext context)
        {
            TestHelper.Auth();
        }


        [TestMethod]
        public void TestCRUDOrder()
        {
            HttpWebResponse rep = TestHelper.Request("http://localhost:84/order/1", "GET");
            Assert.AreEqual(rep.StatusCode, HttpStatusCode.NotFound);

            #region dto
            OrderDTO order = new OrderDTO() 
            {
                Group="集团名称",
                Company="公司名称",
                Department="部门",
                Name="姓名",
                Sex="F",
                ShirtNeck=1.1m,
                ShirtShoulder=2.2m,
                ShirtFLength=3.3m,
                ShirtBLength=4,
                ShirtChest=5,
                LongSleeveIsEnabled=true,
                ShortSleeveIsEnabled=true,
                ShirtPreSize="B",
                ShirtLSleeveLength=6,
                ShirtSSleeveLength=7,
                Job = "Job",
                EmployeeCode = "EmployeeCode",
                Age = null,
                Height = 9,
                Weight = 10,
                ShirtWaist = 11,
                ShirtLowerHem = 12,
                ShirtLSleeveCuff = 13,
                ShirtLPrice = 14,
                ShirtSSleeveCuff = 15,
                ShirtSPrice = 16,
                ShirtMemo = "ShirtMemo",
                ShirtSizeName = null,
                ShirtChestEnlarge = 17,
                ShirtWaistEnlarge = 18,
                ShirtLowerHemEnlarge = 19,
                SuitModel = null,
                SuitSpec = null,
                SuitFLength = 20,
                SuitSleeveLength = 21,
                SuitShoulder = 22,
                SuitChest = 23,
                SuitMidWaist = 24,
                SuitLowerhem = 25,
                SuitSleeveCuff = 26,
                SuitTrousersModel = null,
                //SuitWaist = 27,
                SuitHip = 28,
                //SuitWaistFork = 29,
                SuitLateralFork = 30,
                SuitTrousersLength = 31,
                SuitHemHeight = 32,
                SuitWomanWaist = 33,
                SuitFork = 34,
                SuitMidFork = 35,
                SuitSkirtModel = null,
                SuitSkirtWaist = 36,
                SuitSkirtHip = 37,
                SuitSkirtLength = 38,
                SuitIsEnabled = true,
                CoatModel = null,
                CoatSpec = null,
                CoatFLength = 39,
                CoatSleeveLength = 40,
                CoatShoulder = 41,
                CoatChest = 42,
                CoatMidWaist = 43,
                CoatLowerhem = 44,
                CoatIsEnabled = true,
                WaistcoatModel = null,
                WaistcoatSpec = null,
                WaistcoatFLength = 45,
                WaistcoatBLength = 46,
                WaistcoatShoulder = 47,
                WaistcoatChest = 48,
                WaistcoatMidWaist = 49,
                WaistcoatLowerhem = 50,
                WaistcoatIsEnabled = true,
                AccessoryIsEnabled = true,
                SuitFLengthVar = 51,
                SuitSleeveLengthVar = 52,
                SuitShoulderVar = 53,
                SuitChestVar = 54,
                SuitMidWaistVar = 55,
                SuitLowerhemVar = 56,
                SuitSleeveCuffVar = 57,
                SuitWaistVar = 58,
                SuitHipVar = 59,
                SuitWaistForkVar = 60,
                SuitLateralForkVar = 61,
                SuitTrousersLengthVar = 62,
                SuitHemHeightVar = 63,
                SuitWomanWaistVar = 64,
                SuitForkVar = 65,
                SuitMidForkVar = 66,
                SuitSkirtWaistVar = 67,
                SuitSkirtHipVar = 68,
                SuitSkirtLengthVar = 69,
                CoatFLengthVar = 70,
                CoatSleeveLengthVar = 71,
                CoatShoulderVar = 72,
                CoatChestVar = 73,
                CoatMidWaistVar = 74,
                CoatLowerhemVar = 75,
                WaistcoatFLengthVar = 76,
                WaistcoatBLengthVar = 77,
                WaistcoatShoulderVar = 78,
                WaistcoatChestVar = 79,
                WaistcoatMidWaistVar = 80,
                WaistcoatLowerhemVar = 81,
                SuitMemo = "SuitMemo",
                CoatMemo = "CoatMemo",
                WaistcoatMemo = "WaistcoatMemo",
                LongSleeves = new List<OrderDetailDTO>(),
                ShortSleeves = new List<OrderDetailDTO>(),
                Suits = new List<OrderDetailDTO>(),
                Coats = new List<OrderDetailDTO>(),
                Waistcoats = new List<OrderDetailDTO>(),
                Accessories = new List<OrderDetailDTO>()
            };
            order.LongSleeves.Add(new OrderDetailDTO() 
            {
                Color = "长袖颜色",
                Cloth = "Cotton01",
                Amount = 51
            });
            order.LongSleeves.Add(new OrderDetailDTO()
            {
                Color = "长袖颜色2",
                Cloth = "Cotton011",
                Amount = 52
            });
            order.ShortSleeves.Add(new OrderDetailDTO()
            {
                Color = "短袖颜色",
                Cloth = "Cotton02",
                Amount = 53
            });
            order.ShortSleeves.Add(new OrderDetailDTO()
            {
                Color = "短袖颜色2",
                Cloth = "Cotton022",
                Amount = 54
            });
            order.Suits.Add(new OrderDetailDTO()
            {
                SubCategory = "薄西装",
                Color = "黑色西装",
                Cloth = "Cloth01",
                Amount = 55,
                Price = 56.99m
            });
            order.Suits.Add(new OrderDetailDTO()
            {
                SubCategory = "薄西装2",
                Color = "黑色西装2",
                Cloth = "Cloth01",
                Amount = 57,
                Price = 58.99m
            });
            order.Coats.Add(new OrderDetailDTO()
            {
                SubCategory = "薄大衣",
                Color = "黑色大衣",
                Cloth = "Cloth03",
                Amount = 58,
                Price = 59.99m
            });
            order.Coats.Add(new OrderDetailDTO()
            {
                SubCategory = "薄大衣1",
                Color = "黑色大衣1",
                Cloth = "Cloth04",
                Amount = 60,
                Price = 16.99m
            });
            order.Waistcoats.Add(new OrderDetailDTO()
            {
                SubCategory = "薄背心",
                Color = "黑色背心",
                Cloth = "Cloth05",
                Amount = 16,
                Price = 62.99m
            });
            order.Waistcoats.Add(new OrderDetailDTO()
            {
                SubCategory = "薄背心1",
                Color = "黑色背心1",
                Cloth = "Cloth06",
                Amount = 63,
                Price = 64.99m
            });
            order.Accessories.Add(new OrderDetailDTO()
            {
                SubCategory = "薄配件",
                Color = "黑色配件",
                Cloth = "Cloth07",
                Amount = 64,
                SizeName = "配件尺码",
                Price = 65.99m
            });
            order.Accessories.Add(new OrderDetailDTO()
            {
                SubCategory = "薄配件1",
                Color = "黑色配件1",
                Cloth = "Cloth08",
                Amount = 66,
                SizeName = "配件尺码1",
                Price = 67.99m
            });
            #endregion

            order.OrderId= TestHelper.Request<int>("http://localhost:84/order", "POST", order);
            OrderDTO newOrder = TestHelper.Request<OrderDTO>("http://localhost:84/order/" + order.OrderId, "GET");
            Assert.AreEqual(newOrder, order);

            #region update dto
            order.Group = "集团名称U";
            order.Company = "公司名称U";
            order.Department = "部门U";
            order.Name = "姓名U";
            order.Sex = "F";
            order.ShirtNeck = 11;
            order.ShirtShoulder = 21;
            order.ShirtFLength = 31;
            order.ShirtBLength = 41;
            order.ShirtChest = 51;
            order.LongSleeveIsEnabled = false;
            order.ShortSleeveIsEnabled = true;
            order.ShirtPreSize = "S";
            order.ShirtLSleeveLength = 61;
            order.ShirtSSleeveLength = 71;
            order.Job = "JobU";
            order.EmployeeCode = "EmployeeCodeU";
            order.Age = 81;
            order.Height = 91;
            order.Weight = 101;
            order.ShirtWaist = 111;
            order.ShirtLowerHem = 121;
            order.ShirtLSleeveCuff = 131;
            order.ShirtLPrice = 141;
            order.ShirtSSleeveCuff = 151;
            order.ShirtSPrice = 161;
            order.ShirtMemo = "ShirtMemoU";
            order.ShirtSizeName = null;
            order.ShirtChestEnlarge = 11;
            order.ShirtWaistEnlarge = 12;
            order.ShirtLowerHemEnlarge = 13;
            order.SuitModel = null;
            order.SuitSpec = null;
            order.SuitFLength = 201;
            order.SuitSleeveLength = 211;
            order.SuitShoulder = 221;
            order.SuitChest = 231;
            order.SuitMidWaist = 241;
            order.SuitLowerhem = 251;
            order.SuitSleeveCuff = 261;
            order.SuitTrousersModel = null;
            //order.SuitWaist = 271;
            order.SuitHip = 281;
            //order.SuitWaistFork = 291;
            order.SuitLateralFork = 301;
            order.SuitTrousersLength = 311;
            order.SuitHemHeight = 321;
            order.SuitWomanWaist = 331;
            order.SuitFork = 341;
            order.SuitMidFork = 351;
            order.SuitSkirtModel = null;
            order.SuitSkirtWaist = 361;
            order.SuitSkirtHip = 371;
            order.SuitSkirtLength = 381;
            order.SuitIsEnabled = false;
            order.CoatModel = null;
            order.CoatSpec = null;
            order.CoatFLength = 391;
            order.CoatSleeveLength = 401;
            order.CoatShoulder = 411;
            order.CoatChest = 421;
            order.CoatMidWaist = 431;
            order.CoatLowerhem = 441;
            order.CoatIsEnabled = false;
            order.WaistcoatModel = null;
            order.WaistcoatSpec = null;
            order.WaistcoatFLength = 451;
            order.WaistcoatBLength = 461;
            order.WaistcoatShoulder = 471;
            order.WaistcoatChest = 481;
            order.WaistcoatMidWaist = 491;
            order.WaistcoatLowerhem = 501;
            order.WaistcoatIsEnabled = false;
            order.AccessoryIsEnabled = false;
            order.SuitFLengthVar += 1;
            order.SuitSleeveLengthVar += 1;
            order.SuitShoulderVar += 1;
            order.SuitChestVar += 1;
            order.SuitMidWaistVar += 1;
            order.SuitLowerhemVar += 1;
            order.SuitSleeveCuffVar += 1;
            order.SuitWaistVar += 1;
            order.SuitHipVar += 1;
            order.SuitWaistForkVar += 1;
            order.SuitLateralForkVar += 1;
            order.SuitTrousersLengthVar += 1;
            order.SuitHemHeightVar += 1;
            order.SuitWomanWaistVar += 1;
            order.SuitForkVar += 1;
            order.SuitMidForkVar += 1;
            order.SuitSkirtWaistVar += 1;
            order.SuitSkirtHipVar += 1;
            order.SuitSkirtLengthVar += 1;
            order.CoatFLengthVar += 1;
            order.CoatSleeveLengthVar += 1;
            order.CoatShoulderVar += 1;
            order.CoatChestVar += 1;
            order.CoatMidWaistVar += 1;
            order.CoatLowerhemVar += 1;
            order.WaistcoatFLengthVar += 1;
            order.WaistcoatBLengthVar += 1;
            order.WaistcoatShoulderVar += 1;
            order.WaistcoatChestVar += 1;
            order.WaistcoatMidWaistVar += 1;
            order.WaistcoatLowerhemVar += 1;
            order.SuitMemo = "SuitMemoU";
            order.CoatMemo = "CoatMemoU";
            order.WaistcoatMemo = "WaistcoatMemoU";

            order.LongSleeves.ToList().ForEach(od => 
            {
                od.Color = od.Color + "U";
                od.Cloth = od.Cloth + "U";
                od.Amount += 1;
            });
            order.ShortSleeves.ToList().ForEach(od =>
            {
                od.Color = od.Color + "U";
                od.Cloth = od.Cloth + "U";
                od.Amount += 1;
            });
            order.Suits.ToList().ForEach(od =>
            {
                od.SubCategory = od.SubCategory+ "U";
                od.Color= od.Color+ "U";
                od.Cloth = od.Cloth + "U";
                od.Price += 1;
            });
            order.Coats.ToList().ForEach(od =>
            {
                od.SubCategory = od.SubCategory + "U";
                od.Color = od.Color + "U";
                od.Cloth = od.Cloth + "U";
                od.Price += 1;
            });
            order.Waistcoats.ToList().ForEach(od =>
            {
                od.SubCategory = od.SubCategory + "U";
                od.Color = od.Color + "U";
                od.Cloth = od.Cloth + "U";
                od.Price += 1;
            });
            order.Accessories.ToList().ForEach(od =>
            {
                od.SubCategory = od.SubCategory + "U";
                od.Color = od.Color + "U";
                od.Cloth = od.Cloth + "U";
                od.Price += 1;
            });
            order.LongSleeves.Add(new OrderDetailDTO()
            {
                Color = "长袖颜色2",
                Cloth = "Cotton012",
                Amount = 100
            });
            order.LongSleeves.Add(new OrderDetailDTO()
            {
                Color = "长袖颜色3",
                Cloth = "Cotton013",
                Amount = 101
            });
            order.ShortSleeves.Add(new OrderDetailDTO()
            {
                Color = "短袖颜色3",
                Cloth = "Cotton03",
                Amount = 102
            });
            order.ShortSleeves.Add(new OrderDetailDTO()
            {
                Color = "短袖颜色4",
                Cloth = "Cotton024",
                Amount = 103
            });
            order.Suits.Add(new OrderDetailDTO()
            {
                SubCategory = "薄西装3",
                Color = "黑色西装3",
                Cloth = "Cloth09",
                Amount = 104,
                Price = 104.99m
            });
            order.Suits.Add(new OrderDetailDTO()
            {
                SubCategory = "薄西装4",
                Color = "黑色西装4",
                Cloth = "Cloth10",
                Amount = 105,
                Price = 105.99m
            });
            order.Coats.Add(new OrderDetailDTO()
            {
                SubCategory = "薄大衣3",
                Color = "黑色大衣3",
                Cloth = "Cloth11",
                Amount = 106,
                Price = 106.99m
            });
            order.Coats.Add(new OrderDetailDTO()
            {
                SubCategory = "薄大衣4",
                Color = "黑色大衣4",
                Cloth = "Cloth12",
                Amount = 107,
                Price = 107.99m
            });
            order.Waistcoats.Add(new OrderDetailDTO()
            {
                SubCategory = "薄背心3",
                Color = "黑色背心3",
                Cloth = "Clot13",
                Amount = 108,
                Price = 108.99m
            });
            order.Waistcoats.Add(new OrderDetailDTO()
            {
                SubCategory = "薄背心4",
                Color = "黑色背心4",
                Cloth = "Cloth14",
                Amount = 109,
                Price = 109.99m
            });
            order.Accessories.Add(new OrderDetailDTO()
            {
                SubCategory = "薄配件3",
                Color = "黑色配件3",
                Cloth = "Cloth15",
                Amount = 110,
                SizeName = "配件尺码3",
                Price = 110.99m
            });
            order.Accessories.Add(new OrderDetailDTO()
            {
                SubCategory = "薄配件4",
                Color = "黑色配件4",
                Cloth = "Cloth16",
                Amount = 111,
                SizeName = "配件尺码4",
                Price = 111.99m
            });
            #endregion

            rep = TestHelper.Request("http://localhost:84/order", "PUT", order);
            Assert.AreEqual(rep.StatusCode, HttpStatusCode.OK);
            newOrder = TestHelper.Request<OrderDTO>("http://localhost:84/order/" + order.OrderId, "GET");
            Assert.AreEqual(newOrder, order);


            rep = TestHelper.Request("http://localhost:84/order", "DELETE", new int[1] { order.OrderId });
            Assert.AreEqual(rep.StatusCode, HttpStatusCode.OK);
            rep = TestHelper.Request("http://localhost:84/order/" + order.OrderId, "GET");
            Assert.AreEqual(rep.StatusCode, HttpStatusCode.NotFound);
        }
    }
}
