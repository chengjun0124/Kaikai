using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace KaiKai.Model.DTO
{
    public class BaseDTO
    {
        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            PropertyInfo[] properties = this.GetType().GetProperties();
            for (int i = 0; i < properties.Length; i++)
            {
                if (properties[i].PropertyType.FullName.IndexOf("System.Collections.Generic.ICollection") == 0)
                {
                    IList v1 = (IList)properties[i].GetValue(this);
                    IList v2 = (IList)properties[i].GetValue(obj);

                    if (v1 == null)
                        v1 = new List<BaseDTO>();
                    if (v2 == null)
                        v2 = new List<BaseDTO>();

                    if (v1.Count != v2.Count)
                        return false;

                    for (int j = 0; j < v1.Count; j++)
                    {
                        if (!v1[j].Equals(v2[j]))
                            return false;
                    }
                }
                else
                {
                    var v1 = properties[i].GetValue(this);
                    var v2 = properties[i].GetValue(obj);
                    if (v1 == null)
                    {
                        if (v2 != null)
                            return false;
                    }
                    else
                    {
                        if (!v1.Equals(v2))
                            return false;
                    }
                }
            }
            return true;
        }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
