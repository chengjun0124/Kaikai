using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace KaiKai.API
{
    public class Constant
    {
        public const string JWTKey = "js*un8w#)*.17s^3";
        private const string SERVICE_SUBJECT_IMAGE_FOLDER = @"Service\Subject\";
        private const string SERVICE_EFFECT_IMAGE_FOLDER = @"Service\Effect\";
        private const string EMPLOYEE_PORTRAIT_IMAGE_FOLDER = @"Employee\Portrait\";
        private const string USER_PORTRAIT_IMAGE_FOLDER = @"User\Portrait\";

        //if System.Web.HttpRuntime.AppDomainAppPath does not work, try AppDomain.CurrentDomain.BaseDirectory
        private static readonly string uploadFolder = System.Web.HttpRuntime.AppDomainAppPath + @"Upload\";
        public static readonly string SERVICE_SUBJECT_IMAGE_FOLDER_Absolute = uploadFolder + SERVICE_SUBJECT_IMAGE_FOLDER;
        public static readonly string SERVICE_EFFECT_IMAGE_FOLDER_Absolute = uploadFolder + SERVICE_EFFECT_IMAGE_FOLDER;
        public static readonly string EMPLOYEE_PORTRAIT_IMAGE_FOLDER_Absolute = uploadFolder + EMPLOYEE_PORTRAIT_IMAGE_FOLDER;
        public static readonly string USER_PORTRAIT_IMAGE_FOLDER_Absolute = uploadFolder + USER_PORTRAIT_IMAGE_FOLDER;


        private static string GetUrl()
        {
            //string url = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Host;

            //if (!HttpContext.Current.Request.Url.IsDefaultPort)
            //    url += ":" + HttpContext.Current.Request.Url.Port;

            //url += HttpContext.Current.Request.ApplicationPath;

            //if (!url.EndsWith("/"))
            //    url += "/";

            //return url;

            return ConfigurationManager.AppSettings["APIURL"];
        }

        public static readonly string SERVICE_SUBJECT_IMAGE_FOLDER_URL = GetUrl() + "upload/" + SERVICE_SUBJECT_IMAGE_FOLDER.Replace("\\", "/");
        public static readonly string SERVICE_EFFECT_IMAGE_FOLDER_URL = GetUrl() + "upload/" + SERVICE_EFFECT_IMAGE_FOLDER.Replace("\\", "/");
        public static readonly string EMPLOYEE_PORTRAIT_IMAGE_FOLDER_URL = GetUrl() + "upload/" + EMPLOYEE_PORTRAIT_IMAGE_FOLDER.Replace("\\", "/");
        public static readonly string USER_PORTRAIT_IMAGE_FOLDER_URL = GetUrl() + "upload/" + USER_PORTRAIT_IMAGE_FOLDER.Replace("\\", "/");


        public static readonly TimeSpan SERVICE_BUFFER = TimeSpan.FromMinutes(10);
        public static readonly TimeSpan TIME_INTERVAL = TimeSpan.FromMinutes(30);

        public const int SERVICE_SUBJECT_IMAGE_WIDTH_THUMBNAIL = 210;
        public const int SERVICE_SUBJECT_IMAGE_HEIGHT_THUMBNAIL = 140;
        public const int SERVICE_EFFECT_IMAGE_WIDTH_THUMBNAIL = 195;
        public const int SERVICE_EFFECT_IMAGE_HEIGHT_THUMBNAIL = 135;
        public const int EMPLOYEE_PORTRAIT_IMAGE_WIDTH_THUMBNAIL = 130;
        public const int EMPLOYEE_PORTRAIT_IMAGE_HEIGHT_THUMBNAIL = 150;



        public const int USER_LOGIN_VALIDCODE_EXPIRATION= 15;



        public static readonly string USER_LOGIN_VALIDCODE_TEMPLATE_ID = ConfigurationManager.AppSettings["USER_LOING_VALIDCODE_TEMPLATE_ID"];



        
    }
}