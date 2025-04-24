using KaiKai.Model.DTO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Test
{
    public class TestHelper
    {
        public static string JWT;

        public static void Auth()
        {
            if (JWT == null)
            {
                HttpWebRequest req = HttpWebRequest.CreateHttp("http://localhost:84/auth/chengjun0124/qiuzhiqing0124");
                req.Method = "get";
                WebResponse rep = req.GetResponse();
                byte[] b = new byte[rep.ContentLength];
                rep.GetResponseStream().Read(b, 0, b.Length);
                JWT = JsonConvert.DeserializeObject<AuthDTO>(System.Text.Encoding.UTF8.GetString(b)).Jwt;
            }
        }
        public static HttpWebResponse Request(string api, string medthod)
        {
            return Request(api, medthod, null);
        }
        public static HttpWebResponse Request(string api, string medthod, object dto)
        {
            HttpWebRequest req = HttpWebRequest.CreateHttp(api);
            req.Headers.Add("Authorization", JWT);
            req.Method = medthod;
            if (dto != null)
            {
                req.ContentType = "application/json";
                byte[] byteArray = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(dto));
                using (Stream reqStream = req.GetRequestStream())
                 {
                     reqStream.Write(byteArray, 0, byteArray.Length);
                 }
            }
            HttpWebResponse rep = null;
            try
            {
                rep = (HttpWebResponse)req.GetResponse();
            }
            catch (WebException ex)
            {
                rep = (HttpWebResponse)ex.Response;
                byte[] b = new byte[ex.Response.ContentLength];
                ex.Response.GetResponseStream().Read(b, 0, b.Length);
                Console.Write(System.Text.Encoding.UTF8.GetString(b));
            }

            return rep;
        }


        public static T Request<T>(string api, string medthod)
        {
            return Request<T>(api, medthod, null);
        }

        public static T Request<T>(string api, string medthod, BaseDTO dto)
        {
            HttpWebRequest req = HttpWebRequest.CreateHttp(api);
            req.Headers.Add("Authorization", JWT);
            req.Method = medthod;
            if (dto != null)
            {
                req.ContentType = "application/json";
                byte[] byteArray = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(dto));
                using (Stream reqStream = req.GetRequestStream())
                {
                    reqStream.Write(byteArray, 0, byteArray.Length);
                }
            }
            T result;
            try
            {
                using (Stream reqStream = req.GetResponse().GetResponseStream())
                {
                    result = JsonConvert.DeserializeObject<T>(new StreamReader(reqStream).ReadToEnd());
                }
            
            }
            catch (WebException ex)
            {
                using (Stream reqStream = ex.Response.GetResponseStream())
                {
                    Console.Write((new StreamReader(reqStream).ReadToEnd()));
                }
                throw ex;
            }
            return result;
        }
    }
}
