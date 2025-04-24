import { Component, OnInit } from '@angular/core';
import { BasePage } from '../base-page';
import { UserService } from 'src/app/services/user.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ValidationErrors } from '@angular/forms';
import { FieldService } from 'src/app/services/field.service';
import { required, pattern, minlengh, compare } from 'src/app/services/form-validators';
// app.controller("user_edit", ["$scope", "$stateParams", "userAPIService", "dialogService", "$rootScope", function ($scope, $stateParams, userAPIService, dialogService, $rootScope) {
//   $scope.isCreate = $stateParams.userId == "" ? true : false;
//   $scope.user = {};
//   $scope.user.userTypeId = 2;
//   $scope.userTypes = [
//       { name: "订单操作员", id: 2 },
//       { name: "系统管理员", id: 1 }
//   ];


//   $rootScope.invalidMapping = {
//       "username": "td_m_username",
//       "password": "td_m_password",
//       "usertype": "td_m_usertype",
//   };

//   if (!$scope.isCreate) {
//       userAPIService.getUser($stateParams.userId).then(function (resp) {
//           $scope.user = resp.data;
//       });
//   }



//   $scope.submit = function () {
//       if ($scope.isCreate) {
//           userAPIService.createUser($scope.user).then(function (resp) {
//               dialogService.showMention("1", "创建用户成功", "users");
//           });
//       }
//       else {
//           userAPIService.updateUser($scope.user).then(function (resp) {
//               dialogService.showMention("1", "修改用户成功", "users");
//           });
//       }
//   };

// }]);
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BasePage implements OnInit {
  public userId?: number;
  public userTypes = [
    { text: "订单操作员", value: 2 },
    { text: "系统管理员", value: 1 }
  ];
  constructor(private _userService: UserService,
    private _dialogService: DialogService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public field: FieldService
  ) {
    super();
  }

  save() {
    const errHandle = (err) => {
			if (err.status === 400) {
				this._dialogService.showMention(err.error[0].message, 1, null);
			} else {
				this._userService.defaultErrorHandle(err);
			}
		};

    if (this.userId === null) {
      this._userService.createUser(this.form.value).subscribe(resp => {
        this._dialogService.showMention("创建用户成功", 1, null, ["users"]);
      }, errHandle);
    }
    else {
      this._userService.updateUser(this.form.value).subscribe(resp => {
        this._dialogService.showMention("修改用户成功", 1, null, ["users"]);
      }, errHandle);
    }
  }

  ngOnInit() {
    this.userId = /^\d+$/.test(this._activatedRoute.snapshot.params['userId']) ? this._activatedRoute.snapshot.params['userId'] : null;

    this.form = this._fb.group({
      [this.field.F_USER_ID]: [this.userId],
      [this.field.F_USERNAME]: ['', [required(false, '用户名'), pattern(/^[a-zA-Z0-9]+$/, '只能包含字母和数字')]],//required|||pattern:::^[0-9a-zA-Z]+$:::只能包含字母和数字
      [this.field.F_PASSWORD]: ['', [minlengh(8, '密码'), pattern(/[a-zA-Z]/, '至少包含一个字母'), pattern(/[0-9]/, '至少包含一个数字')]],//{{isCreate?'required|||':''}}minlengh:::8|||pattern:::[a-zA-Z]:::至少包含一个字母|||pattern:::[0-9]:::至少包含一个数字
      [this.field.F_CONFIRM_PASSWORD]: [''],//compare:::txt_pwd:::equal:::true:::密码
      [this.field.F_USER_TYPE_ID]: [2]
    }, {
      validators: [
        this._requiredPassword(),
        compare(this.field.F_PASSWORD, this.field.F_CONFIRM_PASSWORD, '两次输入的密码不同')
      ]
    });

    if (this.userId !== null) {
      this._userService.getUser(this.userId).subscribe(resp => {
        this.form.patchValue({
          [this.field.F_USERNAME]: resp.username,
          [this.field.F_USER_TYPE_ID]: resp.userTypeId
        });
      });
    }
  }

  private _requiredPassword() {
    return (): ValidationErrors | null => {
      if (this.userId === null) {
        const val = this.getFormControlValue<string>(this.field.F_PASSWORD);
        return (val && val.toString().length > 0) ? null : { ['requiredPassword']: '请输入密码' };
      }
      return null;
    };
  }
}
