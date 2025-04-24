using AutoMapper;
using KaiKai.Common;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace KaiKai.API
{
    public class BaseApiController : ApiController
    {
        [Inject]
        public IMapper Mapper { get; set; }
        public BaseApiController()
        {
            this._invalidMessages = new List<InvalidMessage>();
            this.ValidatorContainer = new ValidatorContainer(this.InvalidMessages);
        }

        private List<InvalidMessage> _invalidMessages;
        public List<InvalidMessage> InvalidMessages
        {
            get
            {
                return this._invalidMessages;
            }
        }

        

        public void AddInvalidMessage(string id, string msg)
        {
            this.InvalidMessages.Add(new InvalidMessage() 
            {
                Message = msg,
                Id = id
            });
        }
        
        public bool IsIllegalParameter{ get; set; }
        public ValidatorContainer ValidatorContainer { get; set; }


        protected Identity Identity
        {
            get
            {
                return (Identity)this.User.Identity;
            }
        }
    }

    
}