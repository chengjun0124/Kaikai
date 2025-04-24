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
    public class SizeControllerTest
    {
        [ClassInitialize]
        public static void BeforeAll(TestContext context)
        {
            TestHelper.Auth();
        }


        [TestMethod]
        public void TestCRUDSize()
        {
            HttpWebResponse rep = TestHelper.Request("http://localhost:84/size/999999", "GET");
            Assert.AreEqual(rep.StatusCode, HttpStatusCode.NotFound);

            #region dto
            SizeDTO size = new SizeDTO()
            {
                SizeName = "尺码表名",
                Category = "西装",
                Sex = "M",
                NeckScopeL = 1,
                NeckScopeU = 2,
                ShoulderScopeL = 3,
                ShoulderScopeU = 4,
                FLengthScopeL = 5,
                FLengthScopeU = 6,
                BLengthScopeL = 7,
                BLengthScopeU = 8,
                ChestScopeL = 9,
                ChestScopeU = 10,
                WaistScopeL = 11,
                WaistScopeU = 12,
                LowerHemScopeL = 13,
                LowerHemScopeU = 14,
                LSleeveLengthScopeL = 15,
                LSleeveLengthScopeU = 16,
                LSleeveCuffScopeL = 17,
                LSleeveCuffScopeU = 18,
                SSleeveLengthScopeL = 19,
                SSleeveLengthScopeU = 20,
                SSleeveCuffScopeL = 21,
                SSleeveCuffScopeU = 22,
                SizeDetails = new List<SizeDetailDTO>()
            };
            size.SizeDetails.Add(new SizeDetailDTO()
            {
                SizeName = "S",
                SizeAlias = "39",
                Neck = 23,
                Shoulder = 24,
                FLength = 25,
                BLength = 26,
                Chest = 27,
                Waist = 28,
                LowerHem = 29,
                LSleeveLength = 30,
                LSleeveCuff = 31,
                SSleeveLength = 32,
                SSleeveCuff = 33,
                Sex = "M",
            });
            size.SizeDetails.Add(new SizeDetailDTO()
            {
                SizeName = "M",
                SizeAlias = "40",
                Neck = 34,
                Shoulder = 35,
                FLength = 36,
                BLength = 37,
                Chest = 38,
                Waist = 39,
                LowerHem = 40,
                LSleeveLength = 41,
                LSleeveCuff = 42,
                SSleeveLength = 43,
                SSleeveCuff = 44,
                Sex = "M",
            });
            #endregion

            size.SizeId = TestHelper.Request<int>("http://localhost:84/size", "POST", size);
            SizeDTO newSize = TestHelper.Request<SizeDTO>("http://localhost:84/size/" + size.SizeId, "GET");
            Assert.AreEqual(newSize, size);

            #region update dto
            size.SizeName = "尺码表名U";
            size.Category = "西装";
            size.Sex = "F";
            size.NeckScopeL += 1;
            size.NeckScopeU += 1;
            size.ShoulderScopeL += 1;
            size.ShoulderScopeU += 1;
            size.FLengthScopeL += 1;
            size.FLengthScopeU += 1;
            size.BLengthScopeL += 1;
            size.BLengthScopeU += 1;
            size.ChestScopeL += 1;
            size.ChestScopeU += 1;
            size.WaistScopeL += 1;
            size.WaistScopeU += 1;
            size.LowerHemScopeL += 1;
            size.LowerHemScopeU += 1;
            size.LSleeveLengthScopeL += 1;
            size.LSleeveLengthScopeU += 1;
            size.LSleeveCuffScopeL += 1;
            size.LSleeveCuffScopeU += 1;
            size.SSleeveLengthScopeL += 1;
            size.SSleeveLengthScopeU += 1;
            size.SSleeveCuffScopeL += 1;
            size.SSleeveCuffScopeU += 1;

            size.SizeDetails.ForEach(sd =>
            {
                sd.SizeName = sd.SizeName + "U";
                sd.SizeAlias = sd.SizeAlias + "U";
                sd.Neck += 1;
                sd.Shoulder += 1;
                sd.FLength += 1;
                sd.BLength += 1;
                sd.Chest += 1;
                sd.Waist += 1;
                sd.LowerHem += 1;
                sd.LSleeveLength += 1;
                sd.LSleeveCuff += 1;
                sd.SSleeveLength += 1;
                sd.SSleeveCuff += 1;
                sd.Sex = "F";
            });

            #endregion

            rep = TestHelper.Request("http://localhost:84/size", "PUT", size);
            Assert.AreEqual(rep.StatusCode, HttpStatusCode.OK);
            newSize = TestHelper.Request<SizeDTO>("http://localhost:84/size/" + size.SizeId, "GET");
            Assert.AreEqual(newSize, size);


            rep = TestHelper.Request("http://localhost:84/size/" + size.SizeId, "DELETE");
            Assert.AreEqual(rep.StatusCode, HttpStatusCode.OK);
            rep = TestHelper.Request("http://localhost:84/size/" + size.SizeId, "GET");
            Assert.AreEqual(rep.StatusCode, HttpStatusCode.NotFound);
        }
    }
}
