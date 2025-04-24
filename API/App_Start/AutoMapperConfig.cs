using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using AutoMapper;
using KaiKai.Model.DTO;
using KaiKai.Model;
using KaiKai.Common;
using KaiKai.Model.Enum;
using Ninject.Modules;

namespace KaiKai.API
{
    public class AutoMapperServiceConfig
    {
        public static IMapper CreateMapper()
        {
            var config = new MapperConfiguration(cfg =>
            {
                CreateMapsModelToDto(cfg);
                CreateMapsDtoToModel(cfg);
            });
            return config.CreateMapper();
        }


        private static void CreateMapsModelToDto(IMapperConfiguration cfg)
        {
            cfg.CreateMap<User, UserDTO>()
                .ForMember(dto => dto.PassWord, opt => opt.Ignore());

            cfg.CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.LongSleeves, opt => opt.MapFrom(src => src.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "长袖").OrderBy(od=>od.Seq)))
                .ForMember(dest => dest.ShortSleeves, opt => opt.MapFrom(src => src.OrderDetails.Where(od => od.Category == "衬衫" && od.SubCategory == "短袖").OrderBy(od => od.Seq)))
                .ForMember(dest => dest.Suits, opt => opt.MapFrom(src => src.OrderDetails.Where(od => od.Category == "西装").OrderBy(od => od.Seq)))
                .ForMember(dest => dest.Coats, opt => opt.MapFrom(src => src.OrderDetails.Where(od => od.Category == "大衣").OrderBy(od => od.Seq)))
                .ForMember(dest => dest.Waistcoats, opt => opt.MapFrom(src => src.OrderDetails.Where(od => od.Category == "背心").OrderBy(od => od.Seq)))
                .ForMember(dest => dest.Accessories, opt => opt.MapFrom(src => src.OrderDetails.Where(od => od.Category == "配件").OrderBy(od => od.Seq)));
            cfg.CreateMap<OrderDetail, OrderDetailDTO>()
                .ForMember(dest => dest.Seq, opt => opt.Ignore())
                .ForMember(dest => dest.SubCategory, opt => opt.MapFrom(src => src.Category == "衬衫" ? null : src.SubCategory));
                //.ForMember(dto => dto.Cloth, opt => opt.MapFrom(e => e.Cloth == null ? "" : e.Cloth))
                //.ForMember(dto => dto.Color, opt => opt.MapFrom(e => e.Color == null ? "" : e.Color));
            cfg.CreateMap<Size, SizeDTO>();
            cfg.CreateMap<SizeDetail, SizeDetailDTO>()
                .ForMember(dto => dto.Sex, opt => opt.MapFrom(e => e.Size.Sex));
        }

        private static void CreateMapsDtoToModel(IMapperConfiguration cfg)
        {
            cfg.CreateMap<UserDTO, User>();
            cfg.CreateMap<OrderDetailDTO, OrderDetail>();

            cfg.CreateMap<OrderDTO, Order>()
                //去除中间和2边的空格, name和memo只需要去2边的空格
                .ForMember(dest => dest.Group, opt => opt.MapFrom(src => CommonLogic.TrimAll(src.Group)))
                .ForMember(dest => dest.Company, opt => opt.MapFrom(src => CommonLogic.TrimAll(src.Company)))
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => CommonLogic.TrimAll(src.Department)))
                .ForMember(dest => dest.Job, opt => opt.MapFrom(src => CommonLogic.TrimAll(src.Job)))
                .ForMember(dest => dest.EmployeeCode, opt => opt.MapFrom(src => CommonLogic.TrimAll(src.EmployeeCode)))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => CommonLogic.Trim(src.Name)))
                .ForMember(dest => dest.ShirtMemo, opt => opt.MapFrom(src => CommonLogic.Trim(src.ShirtMemo)))
                .ForMember(dest => dest.SuitMemo, opt => opt.MapFrom(src => CommonLogic.Trim(src.SuitMemo)))
                .ForMember(dest => dest.CoatMemo, opt => opt.MapFrom(src => CommonLogic.Trim(src.CoatMemo)))
                .ForMember(dest => dest.WaistcoatMemo, opt => opt.MapFrom(src => CommonLogic.Trim(src.WaistcoatMemo)))
                .ForMember(dest => dest.SuitModel, opt => opt.MapFrom(src => CommonLogic.Trim(src.SuitModel)))
                .ForMember(dest => dest.SuitSpec, opt => opt.MapFrom(src => CommonLogic.Trim(src.SuitSpec)))
                .ForMember(dest => dest.SuitTrousersModel, opt => opt.MapFrom(src => CommonLogic.Trim(src.SuitTrousersModel)))
                .ForMember(dest => dest.SuitSkirtModel, opt => opt.MapFrom(src => CommonLogic.Trim(src.SuitSkirtModel)))
                .ForMember(dest => dest.CoatModel, opt => opt.MapFrom(src => CommonLogic.Trim(src.CoatModel)))
                .ForMember(dest => dest.CoatSpec, opt => opt.MapFrom(src => CommonLogic.Trim(src.CoatSpec)))
                .ForMember(dest => dest.WaistcoatModel, opt => opt.MapFrom(src => CommonLogic.Trim(src.WaistcoatModel)))
                .ForMember(dest => dest.WaistcoatSpec, opt => opt.MapFrom(src => CommonLogic.Trim(src.WaistcoatSpec)))
                .ForMember(des => des.OrderDetails, opt => opt.MapFrom(src => GetOrderDetails(src)));
            cfg.CreateMap<SizeDTO, Size>();
            cfg.CreateMap<SizeDetailDTO, SizeDetail>();
        }

        private static OrderDetailDTO CreateOrderDetail(string Category, string SubCategory, string Color, string Cloth, int Amount, string SizeName, int Seq, decimal? Price = null)
        {
            return new OrderDetailDTO()
            {
                Category = Category,
                SubCategory = SubCategory,
                Color = Color,
                Cloth = Cloth,
                Amount = Amount,
                SizeName = SizeName,
                Price = Price,
                Seq = Seq
            };
        }

        private static IList<OrderDetailDTO> GetOrderDetails(OrderDTO dto)
        {
            List<OrderDetailDTO> details = new List<OrderDetailDTO>();
            int i = 1;
            if (dto.LongSleeves != null)
            {
                details.AddRange(dto.LongSleeves.Select(od => CreateOrderDetail("衬衫", "长袖", od.Color, od.Cloth, od.Amount, null, i++, null)));
            }

            if (dto.ShortSleeves != null)
            {
                details.AddRange(dto.ShortSleeves.Select(od => CreateOrderDetail("衬衫", "短袖", od.Color, od.Cloth, od.Amount, null, i++, null)));
            }

            if (dto.Suits != null)
            {
                i = 1;
                details.AddRange(dto.Suits.Select(od => CreateOrderDetail("西装", od.SubCategory, od.Color, od.Cloth, od.Amount, null, i++, od.Price)));
            }

            if (dto.Coats != null)
            {
                i = 1;
                details.AddRange(dto.Coats.Select(od => CreateOrderDetail("大衣", od.SubCategory, od.Color, od.Cloth, od.Amount, null, i++, od.Price)));
            }

            if (dto.Waistcoats != null)
            {
                i = 1;
                details.AddRange(dto.Waistcoats.Select(od => CreateOrderDetail("背心", od.SubCategory, od.Color, od.Cloth, od.Amount, null, i++, od.Price)));
            }

            if (dto.Accessories != null)
            {
                i = 1;
                details.AddRange(dto.Accessories.Select(od => CreateOrderDetail("配件", od.SubCategory, od.Color, od.Cloth, od.Amount, od.SizeName, i++, od.Price)));
            }
            return details;
        }
    }
}