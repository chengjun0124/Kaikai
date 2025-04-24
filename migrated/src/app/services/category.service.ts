import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CategoryOptionDTO } from 'src/rest';

@Injectable({
	providedIn: 'root'
})
export class CategoryService extends BaseService {
	constructor(_dialog: MatDialog,
		_storageService: StorageService,
		_http: HttpClient,
		_router: Router) {
		super(_dialog, _storageService, _http, _router);
	}

	getCategories(): Observable<CategoryOptionDTO[]> {
		return super.get('category');
	}
}

export class CategoryServiceMock extends CategoryService {	
	getCategories(): Observable<CategoryOptionDTO[]> {
		return of([
			{ text: '衬衫', value: '衬衫', manSizes: [{ text: '男衬衫尺码表', value: "1" }], womanSizes: [{ text: '女衬衫尺码表', value: "2" }] },
			{ text: '西装', value: '西装', manSizes: [{ text: '男西装尺码表', value: "3" }], womanSizes: [{ text: '女西装尺码表', value: "4" }] },
			{ text: '大衣', value: '大衣', manSizes: [{ text: '男大衣尺码表', value: "5" }], womanSizes: [{ text: '女大衣尺码表', value: "6" }] },
			{ text: '背心', value: '背心', manSizes: [{ text: '男背心尺码表', value: "7" }], womanSizes: [{ text: '女背心尺码表', value: "8" }] },
		]);
	}
}