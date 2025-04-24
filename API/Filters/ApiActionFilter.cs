using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http.Filters;
using System.Net.Http;
using System.Web.Http;
using System.Reflection;

namespace KaiKai.API
{
    public class ApiActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            //base.OnActionExecuting(actionContext);
            var attrs = actionContext.ActionDescriptor.GetCustomAttributes<ValidationAttribute>();

            if (attrs.Count > 0)
            {
                BaseApiController control = (BaseApiController)actionContext.ControllerContext.Controller;

                object[] inputs = new object[actionContext.ActionArguments.Values.Count];
                for (int i = 0; i < inputs.Length; i++)
                {
                    inputs[i] = actionContext.ActionArguments.ToList()[i].Value;
                }

                foreach (var attr in attrs)
                {
                    control.GetType().InvokeMember(attr.MethodName, BindingFlags.InvokeMethod, null, control, inputs);
                }

                if (control.IsIllegalParameter)
                    throw new IllegalParameterException();

                if (control.InvalidMessages.Count > 0)
                    throw new InvalidException() { Messages = control.InvalidMessages };
            }
            
        }
    }
}