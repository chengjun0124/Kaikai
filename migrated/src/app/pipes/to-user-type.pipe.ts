import { Pipe, PipeTransform } from '@angular/core';
import { UserTypeEnum } from 'src/rest';
// app.filter("toUserType", [function () {
//   return function (input) {

//       if (input == 1)
//           return "系统管理员";

//       if (input == 2)
//           return "订单操作员";

//   };
// }]);
@Pipe({
	name: 'toUserType'
})
export class ToUserTypePipe implements PipeTransform {

	transform(userType: UserTypeEnum, ...args: any[]): string {
		if (userType == UserTypeEnum.Admin)
			return "系统管理员";

		if (userType == UserTypeEnum.Operator)
			return "订单操作员";
	}

}
