import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { OptionDTO, CompanyOptionDTO, GroupOptionDTO } from 'src/rest';
import { Router } from '@angular/router';
// app.factory('companyAPIService', ["apiService", function (apiService) {
//   return {
//       getCompanyOptions: function () {
//           return apiService.call("get", "company/options");
//       },
//       getCompanies: function () {
//           return apiService.call("get", "company");
//       }
//   };
// }]);

export class CompanyService extends BaseService {

	constructor(_dialog: MatDialog,
		_storageService: StorageService,
		_http: HttpClient,
		_router: Router) {
		super(_dialog, _storageService, _http, _router);
	}

	getGroups() :Observable<GroupOptionDTO[]> {
		return super.get('group/options');
	}
	
	getCompanies(): Observable<string[]> {
		return super.get("company");
	}
}

export class CompanyServiceMock extends CompanyService {
	getGroups() :Observable<GroupOptionDTO[]> {
		return of([
			{
				text: '集团1',
				value: '集团1',
				companies: [{
					text: '集团1-公司1',
					value: '集团1-公司1',
					departments: [{ text: '集团1-公司1-部门1', value: '集团1-公司1-部门1' },{ text: '集团1-公司1-部门2', value: '集团1-公司1-部门2' }],
					jobs: [{ text: '集团1-公司1-职位1', value: '集团1-公司1-职位1' },{ text: '集团1-公司1-职位2', value: '集团1-公司1-职位2' }]
				}, {
					text: '集团1-公司2',
					value: '集团1-公司2',
					departments: [{ text: '集团1-公司2-部门1', value: '集团1-公司2-部门1' },{ text: '集团1-公司2-部门2', value: '集团1-公司2-部门2' }],
					jobs: [{ text: '集团1-公司2-职位1', value: '集团1-公司2-职位1' },{ text: '集团1-公司2-职位2', value: '集团1-公司2-职位2' }],
				}]
			},
			{
				text: '集团2',
				value: '集团2',
				companies: [{
					text: '集团2-公司1',
					value: '集团2-公司1',
					departments: [{ text: '集团2-公司1-部门1', value: '集团2-公司1-部门1' },{ text: '集团2-公司1-部门2', value: '集团2-公司1-部门2' }],
					jobs: [{ text: '集团2-公司1-职位1', value: '集团2-公司1-职位1' },{ text: '集团2-公司1-职位2', value: '集团2-公司1-职位2' }]
				}, {
					text: '集团2-公司2',
					value: '集团2-公司2',
					departments: [{ text: '集团2-公司2-部门1', value: '集团2-公司2-部门1' },{ text: '集团2-公司2-部门2', value: '集团2-公司2-部门2' }],
					jobs: [{ text: '集团2-公司2-职位1', value: '集团2-公司2-职位1' },{ text: '集团2-公司2-职位2', value: '集团2-公司2-职位2' }],
				}]
			}
		]);
	}
	// getCompanyOptions(): Observable<CompanyOptionDTO[]> {
	// 	return of([
	// 		{
	// 			text: '公司1',
	// 			value: '公司1',
	// 			departments: [{ text: '公司1-部门1', value: '公司1-部门1' }],
	// 			jobs: [{ text: '公司1-职位1', value: '公司1-职位' }],
	// 		},
	// 		{
	// 			text: '公司2',
	// 			value: '公司2',
	// 			departments: [{ text: '公司2-部门2', value: '公司2-部门2' }],
	// 			jobs: [{ text: '公司2-职位2', value: '公司2-职位2' }],
	// 		}
	// 	]);
	// }

	getCompanies(): Observable<string[]> {
		return of(['公司1', '公司2']);
	}
}