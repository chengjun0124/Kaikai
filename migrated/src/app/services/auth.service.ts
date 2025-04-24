import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthDTO } from '../../rest';
import { Router } from '@angular/router';


// app.factory('authAPIService', ["apiService", function (apiService) {
//   return {
//       auth: function (userName, password) {
//           return apiService.call("get", "auth/" + userName + "/" + password);
//       }
//   };
// }]);


export class AuthService extends BaseService {

	constructor(_dialog: MatDialog,
		_storageService: StorageService,
		_http: HttpClient,
		_router: Router) {
		super(_dialog, _storageService, _http, _router);
	}

	auth(userName: string, password: string): Observable<AuthDTO> {
		return super.get<AuthDTO>("auth/" + userName + "/" + password, false) as Observable<AuthDTO>;
	}
}

export class AuthServiceMock extends AuthService {
	auth(userName: string, password: string): Observable<AuthDTO> {
		if (userName === "1") {
			return of({
				jwt: 'jwt',
				userTypeId: 1
			});
		} else {
			return throwError({ status: 400, error: [{ message: '用户名或密码错误，请重新输入' }] });
		}
	}
}
