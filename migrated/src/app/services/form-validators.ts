import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormGroup, FormArray } from '@angular/forms';
// app.directive('validateClick', ["$rootScope", function ($rootScope) {
//     return {
//         scope: {
//             validateClick: "&",
//             panel: "@"
//         },
//         link: function (scope, element, attrs) {
//             element.on("click", function () {
//                 $(".invalid_msg").text("");
//                 var inputs;
//                 var invalidMessages = [];
//                 var validations;
//                 var validationSplit = "|||";


//                 if (scope.panel != null && scope.panel != undefined)
//                     inputs = $("#" + scope.panel + " [validation]");
//                 else
//                     inputs = $("[validation]");

//                 for (var i = 0; i < inputs.length; i++) {
//                     validations = $(inputs[i]).attr("validation").split(validationSplit);
//                     fieldName = $(inputs[i]).attr("fieldName");
//                     mentionId = $(inputs[i]).attr("mentionId");
//                     value = $(inputs[i]).val();

//                     for (var j = 0; j < validations.length; j++) {
//                         validation = validations[j];
//                     }
//                 }


//                 for (var i = 0; i < invalidMessages.length; i++) {
//                     $("#" + invalidMessages[i].mentionId).text(invalidMessages[i].message);
//                 }

//                 if (invalidMessages.length == 0) {
//                     scope.validateClick();
//                     $rootScope.$apply();
//                 }
//             });
//         }
//     };
// }]);




// if (validation == "required") {
//     if (inputs[i].tagName.toLowerCase() == "select") {
//         if (inputs[i].selectedIndex == 0) {
//             invalidMessages.push({
//                 message: "请选择" + fieldName,
//                 mentionId: mentionId
//             });
//             break;
//         }
//     }
//     else {
//         if (value.trim().length == 0) {
//             invalidMessages.push({
//                 message: "请输入" + fieldName,
//                 mentionId: mentionId
//             });
//             break;
//         }
//     }
// }
export function required(allowBlank: boolean, field: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let val = control.value as string;
        //数字类型也可能使用这个验证器，所以要把内容toString后再进行验证
        if (val !== null && val !== undefined)
            val = val.toString();

        if (allowBlank)
            return (val && val.length > 0) ? null : { 'required': '请输入' + field };
        else
            return (val && val.trim().length > 0) ? null : { 'required': '请输入' + field };
    };
}

// if (value.length > 0) {
//     if (validation.indexOf("pattern" + paramSplit) == 0) {
//         regex = new RegExp(validation.split(paramSplit)[1]);

//         if (!regex.test(value)) {
//             invalidMessages.push({
//                 message: fieldName + validation.split(paramSplit)[2],
//                 mentionId: mentionId
//             });
//             break;
//         }
//     }
// }
export function pattern(reg: RegExp, msg: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const val = control.value as string;
        //only validate non-empty value, if this is a required field, please also add required validator
        if (val && val.length > 0) {
            if (!reg.test(val)) {
                return { 'pattern': msg };
            }
        }
        return null;
    };
}

// if (value.length > 0) {
//     if (validation.indexOf("minlengh" + paramSplit) == 0) {
//         minLength = parseInt(validation.split(paramSplit)[1]);
//         if (value.length < minLength) {
//             invalidMessages.push({
//                 message: fieldName + "必须大于" + minLength + "个字符",
//                 mentionId: mentionId
//             });
//             break;
//         }
//     }
// }
export function minlengh(length: number, label: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const val = control.value as string;
        //only validate non-empty value, if this is a required field, please also add required validator
        if (val && val.length > 0) {
            if (val.length < length) {
                return { 'minlengh': label + "必须大于" + length + "个字符" };
            }
        }
        return null;
    };
}

// if (value.length > 0) {
//     if (validation.indexOf("number" + paramSplit) == 0) {
//         //number:::0
//         decimal = validation.split(paramSplit)[1];

//         if (decimal == "0") {
//             if (!/^\d+$/.test(value)) {
//                 invalidMessages.push({
//                     message: fieldName + "必须是整数",
//                     mentionId: mentionId
//                 });
//                 break;
//             }
//         }
//         else {

//             //9999999, 99能过这个regex,需要research
//             regex = new RegExp("^\\d+(.\\d{1," + decimal + "}){0,1}$");
//             if (!regex.test(value)) {
//                 invalidMessages.push({
//                     message: fieldName + "必须是数字，且最多包含" + decimal + "位小数",
//                     mentionId: mentionId
//                 });
//                 break;
//             }
//         }
//     }
// }
export function number(decimal: number, field: string, symbol?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const val = control.value as string;
        //only validate non-empty value, if this is a required field, please also add required validator
        if (val && val.toString().length > 0) {
            if (decimal === 0) {
                if(symbol) {
                    if (!/^[+-]\d+$/.test(val)) {
                        return { 'number': field + '必须是带符号整数' };
                    }
                }
                else {
                    if (!/^\d+$/.test(val)) {
                        return { 'number': field + '必须是整数' };
                    }
                }
            }
            else {
                //9999999, 99能过这个regex,需要research
                if(symbol) {
                    if (!new RegExp("^[+-]\\d+(.\\d{1," + decimal + "}){0,1}$").test(val)) {
                        return { 'number': field + '必须是带符号数字，且最多包含' + decimal + '位小数' };
                    }
                }
                else {
                    if (!new RegExp("^\\d+(.\\d{1," + decimal + "}){0,1}$").test(val)) {
                        return { 'number': field + '必须是数字，且最多包含' + decimal + '位小数' };
                    }
                }
            }
        }
        return null;
    };
}

// if (value.length > 0) {
//     if (validation.indexOf("range" + paramSplit) == 0) {
//         //range:::1-150
//         min = validation.split(paramSplit)[1].split("-")[0];
//         max = validation.split(paramSplit)[1].split("-")[1];
//         min = parseFloat(min);
//         max = parseFloat(max);
//         value = parseFloat(value);

//         if (value < min || value > max) {
//             invalidMessages.push({
//                 message: fieldName + "必须在" + min + "-" + max + "之间",
//                 mentionId: mentionId
//             });
//             break;
//         }
//     }
// }
export function range(min: number, max: number, field: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const val = control.value as string;
        //only validate non-empty value, if this is a required field, please also add required validator
        if (val && val.length > 0) {
            if (parseFloat(val) < min || parseFloat(val) > max) {
                return { 'range': field + '必须在' + min + '-' + max + '之间' };
            }
        }
        return null;
    };
}

// if (validation.indexOf("compare" + paramSplit) == 0) {
//     //compare:txt_pwd:equal:true:密码
//     comparedValue = $("#" + validation.split(paramSplit)[1]).val();
//     mode = validation.split(paramSplit)[2];
//     forceCompare = validation.split(paramSplit)[3] == "true" ? true : false;
//     comparedFieldName = validation.split(paramSplit)[4];

//     if (forceCompare || value.length > 0) {
//         if (mode == "equal") {
//             if (value != comparedValue) {
//                 invalidMessages.push({
//                     message: fieldName + "和" + comparedFieldName + "必须相等",
//                     mentionId: mentionId
//                 });
//                 break;
//             }
//         }
//     }
// }
export function compare(formControlName1: string, formControlName2: string, msg: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const val1 = control.get(formControlName1).value as string;
        const val2 = control.get(formControlName2).value as string;

        if (val1 != val2) {
            return { 'compare': msg };
        }
        return null;
    };
}

// if (validation.indexOf("oneisrequired" + paramSplit) == 0) {
//     //oneisrequired:::txt_xxx:::txt_xxx2:::后衣长和xxx
//     var hasValue = false;

//     if ($(inputs[i]).attr("type") == "checkbox") {
//         hasValue = inputs[i].checked;
//     }
//     else
//         hasValue = value.trim().length > 0

//     if (!hasValue) {
//         var params = validation.split(paramSplit);
//         //k从1开始，结束在length-1, 因为数组第一个是验证器的名字oneisrequired，最后一个是要比较的其他控件对应的字段名，比如“后衣长”
//         for (var k = 1; k < params.length - 1; k++) {
//             var ele = $("#" + params[k]);

//             if (ele.attr("type") == "checkbox") {
//                 if (ele[0].checked) {
//                     hasValue = true;
//                     break;
//                 }
//             }
//             else {
//                 if (ele.val().trim().length > 0) {
//                     hasValue = true;
//                     break;
//                 }
//             }
//         }
//     }

//     if (!hasValue) {
//         invalidMessages.push({
//             message: fieldName + "和" + params[params.length - 1] + "至少填写一个",
//             mentionId: mentionId
//         });
//         break;
//     }
// }
export function oneIsRequired(formControlNames: string[], fields: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = formControlNames.find((formControlName) => {
            let val = control.get(formControlName).value as string;
            return val && val.toString().trim().length>0;
        })

        let str = '';
        if (!value) {
            fields.forEach(f => 
                str += f + '、'
            );
            str = str.substr(0, str.length - 1);
            return { 'oneisrequired': str + '至少填写一个' };
        }
        return null;
    };
}

export function requiredColorCloth(colorField: string, clothField: string): ValidatorFn {
    return (control: FormArray): ValidationErrors | null => {
        let result = {};
        if (control.length > 1) {
            for (let i = 0; i < control.controls.length; i++) {
                const color = control.controls[i].get('color');
                const cloth = control.controls[i].get('cloth');

                if (!color.value || color.value.trim().length === 0) {
                    result['requiredColor' + i] = '请输入' + colorField;
                }

                if (!cloth.value || cloth.value.trim().length === 0) {
                    result['requiredCloth' + i] = '请输入' + clothField;;
                }
            }
        }
        return Object.getOwnPropertyNames(result).length === 0 ? null : result;
    };
}

export function custom(fn: (control: AbstractControl) => { [key: string]: string }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const result = fn(control);
        return result ? result : null;
    };
}