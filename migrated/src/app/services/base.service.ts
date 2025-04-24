import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoadingComponent } from '../modals/loading/loading.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

// app.factory('apiService', ["$http", "routeService", "ngDialog", "storageService", "locationEx", "dialogService", "$rootScope", function ($http, routeService, ngDialog, storageService, locationEx, dialogService, $rootScope) {
//   var callAPICount = 0;
//   var ngDialogHandle = null;

//   function defaultAPIErrorHandler(error) {
//       if (error.status == 500)
//           routeService.goParams("error");
//       else if (error.status == 404)
//           routeService.goParams("error", { msg: encodeURIComponent("您请求的数据不存在，请返回首页重新浏览") });
//       else if (error.status == 400) {
//           $(".invalid_msg").text("");

//           for (var i = 0; i < error.data.length; i++) {
//               var domId;

//               var m = error.data[i].id.match(/^(.+_)(\d+)$/);
//               if (m != null) {
//                   domId = $rootScope.invalidMapping[m[1]];
//                   domId = domId + m[2];
//               }
//               else
//                   domId = $rootScope.invalidMapping[error.data[i].id];

//               $("#" + domId).text(error.data[i].message);
//           }
//       }
//       else if (error.status == 401)
//           routeService.goParams("login");
//       else
//           routeService.goParams("error");
//       return false;
//   };


//   function promiseWrapper(p) {
//       this.promise = p;

//       this.then = function (success, customError) {
//           var p = this.promise.then(function (resp) {
//               if (!resp) return false;

//               callAPICount--;
//               if (callAPICount == 0) {
//                   ngDialogHandle.close();
//               }

//               var o = null;
//               if (success)
//                   o = success(resp);

//               if (o instanceof promiseWrapper)
//                   return o.promise;
//               else
//                   return o;
//           },
//           function (error) {
//               callAPICount = 0;
//               ngDialogHandle.close();

//               if (customError == null)
//                   defaultAPIErrorHandler(error);
//               else {
//                   var o = customError(error);

//                   if (o instanceof promiseWrapper)
//                       return o.promise;
//                   else
//                       return o;
//               }
//           }
//           );
//           return new promiseWrapper(p);
//       };
//   };

//   return {
//       call: function (method, path, params, responseType) {
//           if (callAPICount == 0) {
//               ngDialogHandle = ngDialog.open({
//                   template: "<div class=\"sk-circle\">" +
//                                       "<div class=\"sk-circle1 sk-child\"></div>" +
//                                       "<div class=\"sk-circle2 sk-child\"></div>" +
//                                       "<div class=\"sk-circle3 sk-child\"></div>" +
//                                       "<div class=\"sk-circle4 sk-child\"></div>" +
//                                       "<div class=\"sk-circle5 sk-child\"></div>" +
//                                       "<div class=\"sk-circle6 sk-child\"></div>" +
//                                       "<div class=\"sk-circle7 sk-child\"></div>" +
//                                       "<div class=\"sk-circle8 sk-child\"></div>" +
//                                       "<div class=\"sk-circle9 sk-child\"></div>" +
//                                       "<div class=\"sk-circle10 sk-child\"></div>" +
//                                       "<div class=\"sk-circle11 sk-child\"></div>" +
//                                       "<div class=\"sk-circle12 sk-child\"></div>" +
//                                   "</div>",
//                   className: "ngdialog-theme-loading",
//                   plain: true,
//                   showClose: false,
//                   closeByEscape: false,
//                   closeByDocument: false
//               });
//           }
//           callAPICount++;

//           var token = storageService.getSession("jwt");
//           var headers = {};
//           if (token != null)
//               headers.Authorization = token;



//           if (responseType == undefined)
//               responseType = "";

//           var promise = $http({ url: $rootScope.APIURL + path, method: method, data: params, headers: headers, responseType: responseType });
//           return new promiseWrapper(promise);
//       }
//   };
// }]);


export class BaseService {
	static callAPICount = 0;
	static matDialogRef: MatDialogRef<LoadingComponent>;
	private _apiUrl: string;

	constructor(private _dialog: MatDialog,
		private _storageService: StorageService,
		private _http: HttpClient,
		private _router: Router) {
	}

	// private _defaultAPIErrorHandler(error) {
	// 	if (error.status == 500)
	// 		routeService.goParams("error");
	// 	else if (error.status == 404)
	// 		routeService.goParams("error", { msg: encodeURIComponent("您请求的数据不存在，请返回首页重新浏览") });
	// 	else if (error.status == 400) {
	// 		$(".invalid_msg").text("");

	// 		for (var i = 0; i < error.data.length; i++) {
	// 			var domId;

	// 			var m = error.data[i].id.match(/^(.+_)(\d+)$/);
	// 			if (m != null) {
	// 				domId = $rootScope.invalidMapping[m[1]];
	// 				domId = domId + m[2];
	// 			}
	// 			else
	// 				domId = $rootScope.invalidMapping[error.data[i].id];

	// 			$("#" + domId).text(error.data[i].message);
	// 		}
	// 	}
	// 	else if (error.status == 401)
	// 		routeService.goParams("login");
	// 	else
	// 		routeService.goParams("error");
	// 	return false;
	// };

	private closeLoading() {
		BaseService.callAPICount--;
		if (BaseService.callAPICount == 0) {
			BaseService.matDialogRef.close();
		}
	}

	public defaultErrorHandle(err) {
		if (err.status == 500)
			this._router.navigate(['/error']);
		else if (err.status == 404)
			this._router.navigate(['/error'], { queryParams: { msg: encodeURIComponent("您请求的数据不存在，请返回首页重新浏览") } });
		else if (err.status == 400)
			this._router.navigate(['/error'], { queryParams: { msg: encodeURIComponent("请输入正确的数据") } });
		else if (err.status == 401)
			this._router.navigate(['/login']);
		else
			this._router.navigate(['/error']);
	}

	private _request<T>(method: 'get' | 'put' | 'post' | 'delete', path: string, body?, responseType: 'json' | 'blob' = 'json', isUseDefaultErrHandler: boolean = true): Observable<T | HttpResponse<Blob>> {
		if (BaseService.callAPICount === 0) {
			BaseService.matDialogRef = this._dialog.open<LoadingComponent>(LoadingComponent, {
				disableClose: true,
				panelClass: 'loaing'
			});
		}

		BaseService.callAPICount++;

		var token = this._storageService.getSession("jwt");
		var headers = {};
		if (token != null)
			headers['Authorization'] = token;

		let observable: Observable<T | HttpResponse<Blob>>;
		if (responseType === 'json') {
			observable = this._http.request<T>(method, environment.apiUrl + path, {
				headers: headers,
				body: body,
				responseType: 'json',
				observe: 'body'
			});
		} else {
			observable = this._http.request(method, environment.apiUrl + path, {
				headers: headers,
				body: body,
				responseType: 'blob',
				observe: 'response'
			});
		}
		return observable.pipe(map(v => {
			this.closeLoading();
			return v;
		}), catchError(err => {
			this.closeLoading();
			if (isUseDefaultErrHandler) {
				this.defaultErrorHandle(err);
			}
			throw err;
		}));
	}

	get<T>(path: string, isUseDefaultErrHandler?: boolean): Observable<T> {
		return this._request<T>('get', path, null, undefined, isUseDefaultErrHandler) as Observable<T>;
	}

	download(path, isUseDefaultErrHandler?: boolean): Observable<HttpResponse<Blob>> {
		return this._request('get', path, null, 'blob', isUseDefaultErrHandler) as Observable<HttpResponse<Blob>>;
	}


	put<T>(path, body?, isUseDefaultErrHandler?: boolean): Observable<T> {
		return this._request<T>('put', path, body, undefined, isUseDefaultErrHandler) as Observable<T>;
	}

	post<T>(path, body?, isUseDefaultErrHandler?: boolean): Observable<T> {
		return this._request<T>('post', path, body, undefined, isUseDefaultErrHandler) as Observable<T>;
	}

	delete<T>(path, body?, isUseDefaultErrHandler?: boolean): Observable<T> {
		return this._request<T>('delete', path, body, undefined, isUseDefaultErrHandler) as Observable<T>;
	}
}
