using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace KaiKai.Common
{
    public class CommonLogic
    {

        public static string Trim(string value)
        {
            if (value == null)
                return null;
            else
                return value.Trim();
        }

        public static string TrimAll(string value)
        {
            if (value != null && value.Trim().Length == 0)
                value = null;
            else if (value != null)
                value = Regex.Replace(value, @"\s", "");

            return value;
        }

        public static string NullIfEmpty(string value)
        {
            if (value == null)
                return null;
            else if (value.Trim().Length == 0)
                return null;
            else
                return value;
        }

        public static int GetDecimalLength(decimal num)
        {
            string str = num.ToString();
            int index = str.IndexOf(".");
            if (index > -1)
            {
                str = str.Substring(index + 1, str.Length - index - 1);
                return str.Length;
            }
            else
                return 0;
        }
        
    }
}
