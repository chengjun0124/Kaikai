using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace KaiKai.Common
{
    public class EncodingHelper
    {
        public static string DecodeBase64(string base64)
        {
            byte[] bpath = Convert.FromBase64String(base64);
            return System.Text.UTF8Encoding.Default.GetString(bpath);
        }

        public static string EncodeBase64(string str)
        {
            System.Text.Encoding encode = System.Text.Encoding.UTF8;
            byte[] bytedata = encode.GetBytes(str);
            return Convert.ToBase64String(bytedata, 0, bytedata.Length);
        }

        public static string MD5(string str)
        {
            string cl = str;
            string pwd = "";
            MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] s = md5.ComputeHash(Encoding.UTF8.GetBytes(str));
            
            for (int i = 0; i < s.Length; i++)
            {
                // 将得到的字符串使用十六进制类型格式。格式后的字符是小写的字母，如果使用大写（X）则格式后的字符是大写字符
                pwd = pwd + s[i].ToString("x2");

            }
            return pwd;
        }

        public static string HMACMD5(string str,string key)
        {
            string cl = str;
            string pwd = "";
            HMACMD5 md5 = new HMACMD5();
            md5.Key = Encoding.UTF8.GetBytes(key);
            byte[] s = md5.ComputeHash(Encoding.UTF8.GetBytes(str));

            for (int i = 0; i < s.Length; i++)
            {
                // 将得到的字符串使用十六进制类型格式。格式后的字符是小写的字母，如果使用大写（X）则格式后的字符是大写字符
                pwd = pwd + s[i].ToString("x2");

            }
            return pwd;
        }
    }
}
