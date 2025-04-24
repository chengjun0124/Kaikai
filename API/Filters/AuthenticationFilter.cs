using KaiKai.Common;
using KaiKai.Model.DTO;
using KaiKai.Model.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Filters;

namespace KaiKai.API
{
    public class ApiAuthorizeAttribute : System.Web.Http.AuthorizeAttribute
    {
        UserTypeEnum[] _userTypes;
        public ApiAuthorizeAttribute(params UserTypeEnum[] userTypes) 
        {
            this._userTypes = userTypes;
        }
        

        protected override bool IsAuthorized(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            if (!actionContext.RequestContext.Principal.Identity.IsAuthenticated)
                return false;
            Identity identity = (Identity)actionContext.RequestContext.Principal.Identity;

            return this._userTypes.Contains(identity.UserType);
            
        }
    }
    public class Identity : IIdentity
    {
        public string AuthenticationType
        {
            get { return ""; }
        }

        public bool IsAuthenticated
        {
            get { return true; }
        }

        public string Name
        {
            get { return ""; }
        }

        public int UserId { get; set; }
        public UserTypeEnum UserType { get; set; }

    }

    public class AuthenticationFilter : IAuthenticationFilter
    {
        public async Task AuthenticateAsync(HttpAuthenticationContext context, System.Threading.CancellationToken cancellationToken)
        {
            // 1. Look for credentials in the request.
            HttpRequestMessage request = context.Request;
            AuthenticationHeaderValue authorization = request.Headers.Authorization;
            
            // 2. If there are no credentials, do nothing.
            if (authorization != null)
            {
                string claim = authorization.Parameter.Split('.')[0];
                string sign = authorization.Parameter.Split('.')[1];

                if (EncodingHelper.HMACMD5(claim, Constant.JWTKey) == sign)
                {
                    JWTDTO jwt = Newtonsoft.Json.JsonConvert.DeserializeObject<JWTDTO>(EncodingHelper.DecodeBase64(claim));

                    if (DateTime.Now.Ticks < jwt.Expire)
                    {
                        IIdentity i = new Identity() 
                        {
                            UserId =jwt.UserId,
                            UserType = (UserTypeEnum)jwt.UserType
                        };
                        IPrincipal p = new System.Security.Principal.GenericPrincipal(i, null);
                        context.Principal = p;
                    }
                }
            }
        }

        public async Task ChallengeAsync(HttpAuthenticationChallengeContext context, System.Threading.CancellationToken cancellationToken)
        {
            return;
        }

        public bool AllowMultiple
        {
            get { throw new NotImplementedException(); }
        }
    }
}