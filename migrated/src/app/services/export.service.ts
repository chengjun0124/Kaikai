import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './storage.service';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
// app.factory('exportAPIService', ["apiService", function (apiService) {
//   return {
//       "export": function (company, manSizeId, womanSizeId) {
//           return apiService.call("get", "export/" + company + "/" + manSizeId + "/" + womanSizeId, null, "arraybuffer");
//       }
//   };
// }]);
@Injectable({
	providedIn: 'root'
})
export class ExportService extends BaseService {
	constructor(_dialog: MatDialog,
		_storageService: StorageService,
		_http: HttpClient,
		_router: Router) {
		super(_dialog, _storageService, _http, _router);
	}
	export(company: string, category: string, manSizeId: number, womanSizeId: number): Observable<HttpResponse<Blob>> {
		return super.download("export/" + company + "/" + category + "/" + manSizeId + "/" + womanSizeId);
	}
}

export class ExportServiceMock extends ExportService {
	export(company: string, category: string, manSizeId: number, womanSizeId: number): Observable<HttpResponse<Blob>> {
		console.log(company + ' ' + category + ' ' + manSizeId + ' ' + womanSizeId);
		var headers = { 'content-type': 'application/vnd.ms-excel', 'Content-Disposition': 'attachment; filename=%e5%b8%82%e6%94%bf%e6%80%bb%e6%89%bf%e5%8c%85--2018-6-15%e6%96%b0%e5%a2%9e2019-07-30.xls' };
		return of({
			headers:headers as any,
			body: new Blob(['123']),
			status: 200,
			statusText: 'ok',
			ok: true,
			type: 4,
			clone: null,
			url: ''
		} as HttpResponse<Blob>);
	}
}