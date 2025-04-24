import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Router } from '@angular/router';
import { PasswordDTO } from 'src/rest';
import { Observable, of, throwError } from 'rxjs';
// app.factory('passwordAPIService', ["apiService", function (apiService) {
//   return {
//       "updatePassword": function (json) {
//           return apiService.call("put", "password", json);
//       }
//   };
// }]);
@Injectable({
  providedIn: 'root'
})
export class PasswordService extends BaseService {

  constructor(_dialog: MatDialog,
    _storageService: StorageService,
    _http: HttpClient,
    _router: Router) {
    super(_dialog, _storageService, _http, _router);
  }

  updatePassword(dto: PasswordDTO): Observable<boolean> {
    return super.put("password", dto, false);
  }
}


export class PasswordServiceMock extends PasswordService {
  updatePassword(dto: PasswordDTO): Observable<boolean> {
    console.log(dto);
    if(dto.oldPassword==='1') {
      return throwError({ status: 400, error: [{ message: '旧密码不正确' }] });
    }
    return of(true);
  }
}
