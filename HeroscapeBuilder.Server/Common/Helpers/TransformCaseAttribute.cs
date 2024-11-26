using System;
using System.Globalization;
using System.Linq;
using System.Reflection;

namespace HeroscapeBuilder.Server.Common.Helpers
{
    [AttributeUsage(AttributeTargets.Property)]
    public class TransformCaseAttribute : Attribute
    {
        public string Case { get; set; } = "None";

        public string Transform(string value)
        {
            return Case.ToLower() switch
            {
                "upper" => value?.ToUpper(),
                "lower" => value?.ToLower(),
                "capitalize" => string.IsNullOrEmpty(value) ? value : char.ToUpper(value[0]) + value.Substring(1).ToLower(),
                "title" => CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value.ToLower()),
                _ => value
            };
        }
    }

    public static class TransformCaseHelper
    {
        public static T ApplyTransformations<T>(T instance)
        {
            if (instance == null) throw new ArgumentNullException(nameof(instance));

            var properties = instance.GetType()
                .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(prop => prop.IsDefined(typeof(TransformCaseAttribute), false));

            foreach (var property in properties)
            {
                var attribute = property.GetCustomAttribute<TransformCaseAttribute>();
                if (attribute == null) continue;

                if (property.PropertyType == typeof(string) && property.CanRead && property.CanWrite)
                {
                    var value = (string?)property.GetValue(instance);
                    if (value != null)
                    {
                        var transformedValue = attribute.Transform(value);
                        property.SetValue(instance, transformedValue);
                    }
                }
            }

            return instance;
        }
    }
}
