using KaiKai.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace KaiKai.API
{
    public class InvalidException : Exception
    {
        public InvalidException()
        {
            this.Messages = new List<InvalidMessage>();
        }
        public List<InvalidMessage> Messages { get; set; }
    }

    public class IllegalParameterException : Exception
    {

    }
}