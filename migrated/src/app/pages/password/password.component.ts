import { Component, OnInit } from '@angular/core';
import { BasePage } from '../base-page';
import { FormBuilder } from '@angular/forms';
import { FieldService } from 'src/app/services/field.service';
import { required, minlengh, pattern, compare } from 'src/app/services/form-validators';
import { PasswordService } from 'src/app/services/password.service';
import { DialogService } from 'src/app/services/dialog.service';
// app.controller("password", ["$scope", "passwordAPIService", "dialogService", "$rootScope", function ($scope, passwordAPIService, dialogService, $rootScope) {
//   $scope.pwd = {};

//   $rootScope.invalidMapping = {
//       "oldpassword": "td_m_old",
//       "newpassword": "td_m_new"
//   };


//   $scope.submit = function () {
//       passwordAPIService.updatePassword($scope.pwd).then(function (resp) {
//           $scope.pwd.oldPassword = "";
//           $scope.pwd.newPassword = "";
//           $scope.pwd.confirmPassword = "";
//           dialogService.showMention("1", "修改密码成功");
//       });
//   };

// }]);
@Component({
	selector: 'app-password',
	templateUrl: './password.component.html',
	styleUrls: ['./password.component.scss']
})
export class PasswordComponent extends BasePage implements OnInit {

	constructor(private _fb: FormBuilder,
		public field: FieldService,
		private _passwordService: PasswordService,
		private _dialogService:DialogService) {
		super();
	}

	ngOnInit() {
		this.form = this._fb.group({
			[this.field.F_OLD_PASSWORD]: ['', [required(true, '旧密码')]],//required
			[this.field.F_NEW_PASSWORD]: ['', [required(true, '新密码'), minlengh(8, '新密码'), pattern(/[a-zA-Z]/, '至少包含一个字母'), pattern(/[0-9]/, '至少包含一个数字')]],//required|||minlengh:::8|||pattern:::[a-zA-Z]:::至少包含一个字母|||pattern:::[0-9]:::至少包含一个数字
			[this.field.F_CONFIRM_PASSWORD]: ['']//required|||compare:::txt_pwd:::equal:::true:::密码
			//确认密码没必要是必填的，所以在升级至angular2时，移除了required
		}, {
			validators: [
				compare(this.field.F_NEW_PASSWORD, this.field.F_CONFIRM_PASSWORD, '两次输入的密码不同')
			]
		});
	}

	save() {
		this._passwordService.updatePassword(this.form.value).subscribe(resp => {
			// this.setFormControlValue(this.field.F_OLD_PASSWORD, '');
			// this.setFormControlValue(this.field.F_NEW_PASSWORD, '');
			// this.setFormControlValue(this.field.F_CONFIRM_PASSWORD, '');
			this._dialogService.showMention("修改密码成功", 1);
		}, err => {
			if (err.status === 400 && err.error.length === 1 && err.error[0].message === '旧密码不正确') {
				this._dialogService.showMention("旧密码不正确", 1, null);
			} else {
				this._passwordService.defaultErrorHandle(err);
			}
		});
	}
}
