using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace KaiKai.API
{
    public class ValidationAttribute : Attribute
    {
        public string MethodName { get; set; }
        public ValidationAttribute(string methodName)
        {
            this.MethodName = methodName;
        }
    }
}