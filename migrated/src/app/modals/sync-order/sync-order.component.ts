import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, ValidatorFn, ValidationErrors, PatternValidator } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { oneIsRequired, pattern, required, number, requiredColorCloth } from 'src/app/services/form-validators';
import { OrderDTO } from 'src/rest';
import { BasePage } from 'src/app/pages/base-page';


// showSycnOrderDetail: function (orders) {
//   var sycnOrderDetailHandler = ngDialog.open({
//       template: $rootScope.dialogSyncOrderDetailTemplate,
//       plain: false,
//       showClose: false,
//       closeByEscape: false,
//       overlay: true,
//       className: "ngdialog-theme-syncorderdetail",
//       closeByDocument: true,
//       controller:["$scope", function ($scope) {
//           $scope.order = {};
//           $scope.order.hasLongSleeve = true;
//           $scope.order.hasShortSleeve = false;
//           $scope.order.orderDetails = [];
//           $scope.order.orderDetails.push({
//               "color": "",
//               "cloth": "",
//               "amount": "1",
//               "isLongSleeve": true
//           });
//           $scope.order.orderDetails.push({
//               "color": "",
//               "cloth": "",
//               "amount": "1",
//               "isLongSleeve": false
//           });

//           $scope.addDetail = function (isLongSleeve, enable) {
//               if (!enable)
//                   return;

//               $scope.order.orderDetails.push({
//                   "color": "",
//                   "cloth": "",
//                   "amount": "1",
//                   "isLongSleeve": isLongSleeve
//               });
//           };

//           $scope.isShowDelete = function (isLongSleeve) {
//               var count = 0;
//               for (var i = 0; i < $scope.order.orderDetails.length; i++) {
//                   if ($scope.order.orderDetails[i].isLongSleeve == isLongSleeve)
//                       count++;

//                   if (count == 2)
//                       return true;
//               }

//           };

//           $scope.deleteDetail = function (enable, detail) {
//               if (!enable)
//                   return;

//               var index = $scope.order.orderDetails.indexOf(detail);
//               $scope.order.orderDetails.splice(index, 1);
//           };

//           $scope.isOrderDetailRequired = function (isLongSleeve) {
//               var count = 0;
//               for (var i = 0; i < $scope.order.orderDetails.length; i++) {
//                   if ($scope.order.orderDetails[i].isLongSleeve == isLongSleeve)
//                       count++;

//                   if (count == 2)
//                       return true;
//               }
//               return false;
//           };

//           $scope.sync = function () {
//               for (var i = 0; i < orders.length; i++) {
//                   orders[i].hasLongSleeve = $scope.order.hasLongSleeve;
//                   orders[i].hasShortSleeve = $scope.order.hasShortSleeve;
//                   orders[i].orderDetails = clone($scope.order.orderDetails);
//               }
//               sycnOrderDetailHandler.close();
//           };
//       }]
//   });
// }

export interface SyncOrderData {
	orders: OrderDTO[];
}

@Component({
	selector: 'sync-order',
	templateUrl: './sync-order.component.html',
	styleUrls: ['./sync-order.component.scss']
})
export class SyncOrderComponent extends BasePage implements OnInit {
	constructor(private _fb: FormBuilder,
		private _dialogRef: MatDialogRef<SyncOrderComponent>,
		@Inject(MAT_DIALOG_DATA) private _data: SyncOrderData) { 
			super();
		}

	ngOnInit() {
		this.form = this._fb.group({
			longSleeveIsEnabled: [true],
			shortSleeveIsEnabled: [false],
			longSleeves: this._fb.array([], [requiredColorCloth('颜色', '布料')]),
			shortSleeves: this._fb.array([], [requiredColorCloth('颜色', '布料')])
		}, { validators: [oneIsRequired(['hasLongSleeve', 'hasShortSleeve'], ['长袖', '短袖'])] });

		this.addDetail(true, '', '', 1);
		this.addDetail(false, '', '', 1);
	}

	addDetail(isLongSleeve, color, cloth, amount) {
		const formControlName = isLongSleeve ? 'longSleeves' : 'shortSleeves';
		this.getFormArray(formControlName).push(this._fb.group({
			color: [color, [pattern(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, '颜色只能包含字母，数字和中文')]],//validation="{{isOrderDetailRequired(isLongSleeve)?'required|||':''}}pattern:::^[a-zA-Z0-9\u4e00-\u9fa5]+$:::只能包含字母，数字和中文"
			cloth: [cloth, [pattern(/^[a-zA-Z0-9/\-()~$]+$/, '布料只能包含字母,数字和/-()~')]],//validation="{{isOrderDetailRequired(isLongSleeve)?'required|||':''}}pattern:::^[a-zA-Z0-9/\-()~$]+$:::只能包含字母,数字和/-()~"
			amount: [amount, [required(false, '数量'), number(0,'数量')]],//validation="required|||number:::0"
			isLongSleeve: [isLongSleeve]
		}));
	};

	isShowDelete(isLongSleeve) {
		const formControlName = isLongSleeve ? 'longSleeves' : 'shortSleeves';
		return (<FormArray>this.form.get(formControlName)).length > 1;
	};

	deleteDetail(isLongSleeve: boolean, index: number) {
		const formControlName = isLongSleeve ? 'longSleeves' : 'shortSleeves';
		this.getFormArray(formControlName).controls.splice(index, 1);
		this.getFormControl(formControlName).updateValueAndValidity();
	};

	sync() {
		for (var i = 0; i < this._data.orders.length; i++) {
			this._data.orders[i].longSleeveIsEnabled = this.form.value.longSleeveIsEnabled;
			this._data.orders[i].shortSleeveIsEnabled = this.form.value.shortSleeveIsEnabled;
			this._data.orders[i].longSleeves = this.form.value.longSleeves;
			this._data.orders[i].shortSleeves = this.form.value.shortSleeves;
			// this._data.orders[i].orderDetails = (<FormArray>this.form.get('longSleeves')).controls.concat((<FormArray>this.form.get('shortSleeves')).controls).map(control => {
			// 	return {
			// 		color: control.value.color,
			// 		cloth: control.value.cloth,
			// 		amount: control.value.amount,
			// 		isLongSleeve: control.value.isLongSleeve
			// 	};
			// });
		}
		this._dialogRef.close();
	};
}
