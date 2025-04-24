using System;
using System.Web;
using Microsoft.Web.Infrastructure.DynamicModuleHelper;
using Ninject;
using System.Web.Http.Dependencies;
using Ninject.Syntax;
using Ninject.Activation;
using Ninject.Parameters;
using System.Collections.Generic;
using KaiKai.DAL;
using AutoMapper;

namespace KaiKai.API
{
    public class NinjectDependencyResolverForWebApi : NinjectDependencyScope, IDependencyResolver
    {
        private IKernel kernel;
        public NinjectDependencyResolverForWebApi(IKernel kernel)
            : base(kernel)
        {
            if (kernel == null)
            {
                throw new ArgumentNullException("kernel");
            }
            this.kernel = kernel;
        }
        public IDependencyScope BeginScope()
        {
            return new NinjectDependencyScope(kernel);
        }
    }

    public class NinjectDependencyScope : IDependencyScope
    {
        private IResolutionRoot resolver;
        internal NinjectDependencyScope(IResolutionRoot resolver)
        {
            System.Diagnostics.Contracts.Contract.Assert(resolver != null);
            this.resolver = resolver;
        }
        public void Dispose()
        {
            resolver = null;
        }
        public object GetService(Type serviceType)
        {
            return resolver.TryGet(serviceType);
        }
        public IEnumerable<object> GetServices(Type serviceType)
        {
            return resolver.GetAll(serviceType);
        }
    }

    public class NinjectRegister
    {
        private static readonly IKernel Kernel;
        static NinjectRegister()
        {
            Kernel = new StandardKernel();
            AddBindings();
        }
        private static void AddBindings()
        {
            Kernel.Bind<KaiKaiContext>().To<KaiKaiContext>().InScope(cx => HttpContext.Current);
            Kernel.Bind<UserDAL>().To<UserDAL>().InScope(ctx => HttpContext.Current);
            Kernel.Bind<IMapper>().ToConstant(AutoMapperServiceConfig.CreateMapper()).InSingletonScope();
            
        }

        public static void RegisterFovWebApi(System.Web.Http.HttpConfiguration config)
        {
            config.DependencyResolver = new NinjectDependencyResolverForWebApi(Kernel);
        }
    }
}
