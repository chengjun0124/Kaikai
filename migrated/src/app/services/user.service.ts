import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable, of, throwError } from 'rxjs';
import { UserListDTO, UserDTO, UserTypeEnum } from 'src/rest';
import { Router } from '@angular/router';
// app.factory('userAPIService', ["apiService", function (apiService) {
//   return {
//       "getUser": function (userId) {
//           return apiService.call("get", "user/" + userId);
//       },
//       "createUser": function (json) {
//           return apiService.call("post", "user", json);
//       },
//       "updateUser": function (json) {
//           return apiService.call("put", "user", json);
//       },
//       "getUsers": function (pageNumber, pageSize) {
//           return apiService.call("get", "user/" + pageNumber + "/" + pageSize);
//       },
//       "deleteUser": function (id) {
//           return apiService.call("delete", "user/" + id);
//       }
//   };
// }]);
@Injectable({
	providedIn: 'root'
})
export class UserService extends BaseService {

	constructor(_dialog: MatDialog,
		_storageService: StorageService,
		_http: HttpClient,
		_router: Router) {
		super(_dialog, _storageService, _http, _router);
	}

	getUser(userId): Observable<UserDTO> {
		return super.get("user/" + userId);
	}
	createUser(dto: UserDTO): Observable<number> {
		return super.post("user", dto, false);
	}
	updateUser(dto: UserDTO): Observable<boolean> {
		return super.put("user", dto, false);
	}
	getUsers(pageNumber, pageSize): Observable<UserListDTO> {
		return super.get("user/" + pageNumber + "/" + pageSize) as Observable<UserListDTO>;
	}
	deleteUser(id): Observable<boolean> {
		return super.delete("user/" + id);
	}
}
export class UserServiceMock extends UserService {
	getUsers(pageNumber, pageSize): Observable<UserListDTO> {
		const users: UserDTO[] = [];
		const count = 89;
		for (let index = 0; index < pageSize; index++) {
			const userId = (pageNumber - 1) * pageSize + 1;
			users.push({
				userId: userId + index,
				username: '用户名' + (userId + index),
				password: '密码',
				userTypeId: UserTypeEnum.Admin
			}
			);
		}

		return of({
			users: users,
			recordCount: count
		});
	}

	getUser(userId): Observable<UserDTO> {
		return of({
			userId: userId,
			username: 'chengjun',
			password: null,
			userTypeId: 1
		});
	}

	deleteUser(id): Observable<boolean> {
		return of(true);
	}

	createUser(dto: UserDTO): Observable<number> {
		console.log(dto);
		if (dto.username === '1') {
			return throwError({ status: 400, error: [{ message: '用户名已存在' }] });
		}
		return of(1);
	}
	updateUser(dto: UserDTO): Observable<boolean> {
		console.log(dto);
		if (dto.username === '1') {
			return throwError({ status: 400, error: [{ message: '用户名已存在' }] });
		}
		return of(true);
	}
}