import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { required } from 'src/app/services/form-validators';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { BasePage } from '../base-page';
import { FieldService } from 'src/app/services/field.service';


//app.controller("login", ["$scope", "authAPIService", "storageService", "routeService", "dialogService", function ($scope, authAPIService, storageService, routeService, dialogService) {

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BasePage implements OnInit {
	// form: FormGroup;

	constructor(private _fb: FormBuilder,
		private _dialogService:DialogService,
		private _authService: AuthService,
		private _storageService: StorageService,
		private _router:Router,
		public field: FieldService) {
		super();
	}

	ngOnInit() {
		this.form = this._fb.group({
			[this.field.F_USERNAME]: ['', [required(true, '用户名')]],
			[this.field.F_PASSWORD]: ['', [required(true, '密码')]]
		}, { updateOn: 'submit' });

		// var height = $(window).height();
		// $("body").css("height", height);
	}

	submit() {
		if (this.form.valid) {
			this.login();
		} else {
			this._dialogService.showMention(this.getFormControl(this.field.F_USERNAME).getError('required') || this.getFormControl(this.field.F_PASSWORD).getError('required'), 1);
		}
	}

	login() {
		this._authService.auth(this.getFormControlValue(this.field.F_USERNAME), this.getFormControlValue(this.field.F_PASSWORD)).subscribe(resp => {
			this._storageService.setSession("jwt", resp.jwt);
			this._storageService.setSession("userTypeId", resp.userTypeId);
			this._router.navigate(['/home']);
		}, error => {
			if (error.status == 400) {
				this._dialogService.showMention(error.error[0].message, 1);
			} else {
				this._authService.defaultErrorHandle(error);
			}
		});
	};

}

// const upgradeAdapter = new UpgradeAdapter(forwardRef(() => AppModule));
// app.directive('login', upgradeAdapter.downgradeNg2Component(LoginComponent));