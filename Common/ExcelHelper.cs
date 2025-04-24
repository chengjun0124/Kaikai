using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using NPOI.SS.UserModel;

namespace KaiKai.Common
{
    public class ExcelHelper
    {
        public static ICell CreateCell(IRow row, int cellIndex, string text, ICellStyle style)
        {
            ICell cell = CreateCellInner(row, cellIndex, style);
            cell.SetCellValue(text);
            return cell;
        }

        public static ICell CreateCell(IRow row, int cellIndex, double? text, ICellStyle style)
        {
            ICell cell = CreateCellInner(row, cellIndex, style);
            if (text.HasValue)
                cell.SetCellValue(text.Value);
            return cell;
        }

        public static ICell CreateCell(IRow row, int cellIndex, int? text, ICellStyle style)
        {
            ICell cell = CreateCellInner(row, cellIndex, style);
            if (text.HasValue)
                cell.SetCellValue(text.Value);
            return cell;
        }

        public static ICell CreateCell(IRow row, int cellIndex, decimal? text, ICellStyle style)
        {
            ICell cell = CreateCellInner(row, cellIndex, style);
            if (text.HasValue)
                cell.SetCellValue((double)text.Value);
            return cell;
        }

        private static ICell CreateCellInner(IRow row, int cellIndex, ICellStyle style)
        {
            ICell cell = row.CreateCell(cellIndex);
            if (style != null)
                cell.CellStyle = style;
            return cell;
        }


        public static IRow CreateRowAndCell(ISheet sheet, int rowIndex, int cellIndex, double text, ICellStyle style)
        {
            IRow row = sheet.CreateRow(rowIndex);
            ICell cell = CreateCell(row, cellIndex, text, style);
            return row;
        }

        public static IRow CreateRowAndCell(ISheet sheet, int rowIndex, int cellIndex, string text, ICellStyle style)
        {
            IRow row = sheet.CreateRow(rowIndex);
            ICell cell = CreateCell(row, cellIndex, text, style);
            return row;
        }
    }
}
