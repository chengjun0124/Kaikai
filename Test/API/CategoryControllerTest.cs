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
    public class CategoryControllerTest
    {
        [ClassInitialize]
        public static void BeforeAll(TestContext context)
        {
            TestHelper.Auth();
        }


        [TestMethod]
        public void TestGetCategory()
        {
            HttpWebResponse rep = TestHelper.Request("http://localhost:84/category", "GET");
            Assert.AreEqual(rep.StatusCode, HttpStatusCode.OK);
        }
    }
}
