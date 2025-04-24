import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable, of, throwError } from 'rxjs';
import { SizeListDTO, SizeDTO } from 'src/rest';
import { Router } from '@angular/router';
// app.factory('sizeAPIService', ["apiService", function (apiService) {
//   return {
//       getSizes: function () {
//           return apiService.call("get", "size");
//       },
//       getSizesPagination: function (pageNumber, pageSize) {
//           return apiService.call("get", "size/" + pageNumber + "/" + pageSize);
//       },
//       deleteSize: function (sizeId) {
//           return apiService.call("delete", "size/" + sizeId);
//       },
//       getSize: function (sizeId) {
//           return apiService.call("get", "size/" + sizeId);
//       },
//       updateSize: function (json) {
//           return apiService.call("put", "size", json);
//       },
//       createSize: function (json) {
//           return apiService.call("post", "size", json);
//       },
//       getDefaultSizeDetails: function () {
//           return apiService.call("get", "size/defaultsizedetails");
//       }
//   };
// }]);

export class SizeService extends BaseService {

	constructor(_dialog: MatDialog,
		_storageService: StorageService,
		_http: HttpClient,
		_router: Router) {
		super(_dialog, _storageService, _http, _router);
	}

	getSizes(): Observable<SizeDTO[]> {
		return super.get("size")as Observable<SizeDTO[]>;
	}
	getSizesPagination(pageNumber, pageSize): Observable<SizeListDTO> {
		return super.get("size/" + pageNumber + "/" + pageSize) as Observable<SizeListDTO>;
	}
	deleteSize(sizeId): Observable<boolean> {
		return super.delete("size/" + sizeId);
	}
	getSize(sizeId): Observable<SizeDTO> {
		return super.get("size/" + sizeId);
	}
	updateSize(dto: SizeDTO): Observable<boolean> {
		return super.put("size", dto, false);
	}
	createSize(dto: SizeDTO): Observable<number> {
		return super.post("size", dto, false);
	}
	getDefaultSizeDetails() {
		return super.get("size/defaultsizedetails");
	}

}

export class SizeServiceMock {
	getSizes(): Observable<SizeDTO[]> {
		return of([{
			sizeId: 1,
			sizeName: '男尺码',
			category: '衬衫',
			sex: 'M',
			neckScopeL: 1,
			neckScopeU: 2,
			shoulderScopeL: 3,
			shoulderScopeU: 4,
			fLengthScopeL: 5,
			fLengthScopeU: 6,
			bLengthScopeL: 7,
			bLengthScopeU: 8,
			chestScopeL: 9,
			chestScopeU: 10,
			waistScopeL: 11,
			waistScopeU: 12,
			lowerHemScopeL: 13,
			lowerHemScopeU: 14,
			lSleeveLengthScopeL: 15,
			lSleeveLengthScopeU: 16,
			lSleeveCuffScopeL: 17,
			lSleeveCuffScopeU: 18,
			sSleeveLengthScopeL: 19,
			sSleeveLengthScopeU: 20,
			sSleeveCuffScopeL: 21,
			sSleeveCuffScopeU: 22,
			isLocked: false,
			sizeDetails: [{
				sizeName: '尺码',
				sizeAlias: '尺码别名',
				neck: 1,
				shoulder: 1,
				fLength: 1,
				bLength: 1,
				chest: 1,
				waist: 1,
				lowerHem: 1,
				lSleeveLength: 1,
				lSleeveCuff: 1,
				sSleeveLength: 1,
				sSleeveCuff: 1,
				sex: 'M'
			}, {
				sizeName: '尺码',
				sizeAlias: '尺码别名',
				neck: 1,
				shoulder: 1,
				fLength: 1,
				bLength: 1,
				chest: 1,
				waist: 1,
				lowerHem: 1,
				lSleeveLength: 1,
				lSleeveCuff: 1,
				sSleeveLength: 1,
				sSleeveCuff: 1,
				sex: 'M'
			}
			]
		},{
			sizeId: 2,
			sizeName: '女尺码',
			category: '衬衫',
			sex: 'F',
			neckScopeL: 1,
			neckScopeU: 2,
			shoulderScopeL: 3,
			shoulderScopeU: 4,
			fLengthScopeL: 5,
			fLengthScopeU: 6,
			bLengthScopeL: 7,
			bLengthScopeU: 8,
			chestScopeL: 9,
			chestScopeU: 10,
			waistScopeL: 11,
			waistScopeU: 12,
			lowerHemScopeL: 13,
			lowerHemScopeU: 14,
			lSleeveLengthScopeL: 15,
			lSleeveLengthScopeU: 16,
			lSleeveCuffScopeL: 17,
			lSleeveCuffScopeU: 18,
			sSleeveLengthScopeL: 19,
			sSleeveLengthScopeU: 20,
			sSleeveCuffScopeL: 21,
			sSleeveCuffScopeU: 22,
			isLocked: true,
			sizeDetails: [{
				sizeName: '尺码',
				sizeAlias: '尺码别名',
				neck: 1,
				shoulder: 1,
				fLength: 1,
				bLength: 1,
				chest: 1,
				waist: 1,
				lowerHem: 1,
				lSleeveLength: 1,
				lSleeveCuff: 1,
				sSleeveLength: 1,
				sSleeveCuff: 1,
				sex: 'M'
			}, {
				sizeName: '尺码',
				sizeAlias: '尺码别名',
				neck: 1,
				shoulder: 1,
				fLength: 1,
				bLength: 1,
				chest: 1,
				waist: 1,
				lowerHem: 1,
				lSleeveLength: 1,
				lSleeveCuff: 1,
				sSleeveLength: 1,
				sSleeveCuff: 1,
				sex: 'M'
			}
			]
		}]);
	}

	getSizesPagination(pageNumber, pageSize): Observable<SizeListDTO> {
		const sizes: SizeDTO[] = [];
		const count = 89;
		for (let index = 0; index < pageSize; index++) {
			const sizeId = (pageNumber - 1) * pageSize + 1;
			sizes.push({
				sizeId: sizeId + index,
				sizeName: '名称' + (sizeId + index),
				category: '衬衫',
				sex: 'M',
				neckScopeL: 1,
				neckScopeU: 2,
				shoulderScopeL: 3,
				shoulderScopeU: 4,
				fLengthScopeL: 5,
				fLengthScopeU: 6,
				bLengthScopeL: 7,
				bLengthScopeU: 8,
				chestScopeL: 9,
				chestScopeU: 10,
				waistScopeL: 11,
				waistScopeU: 12,
				lowerHemScopeL: 13,
				lowerHemScopeU: 14,
				lSleeveLengthScopeL: 15,
				lSleeveLengthScopeU: 16,
				lSleeveCuffScopeL: 17,
				lSleeveCuffScopeU: 18,
				sSleeveLengthScopeL: 19,
				sSleeveLengthScopeU: 20,
				sSleeveCuffScopeL: 21,
				sSleeveCuffScopeU: 22,
				isLocked: true,
				sizeDetails: [{
					sizeName: 'L',
					sizeAlias: 'L1',
					neck: 1,
					shoulder: 2,
					fLength: 3,
					bLength: 4,
					chest: 5,
					waist: 6,
					lowerHem: 7,
					lSleeveLength: 8,
					lSleeveCuff: 9,
					sSleeveLength: 10,
					sSleeveCuff: 11,
				}, {
					sizeName: 'XL',
					sizeAlias: 'XL1',
					neck: 11,
					shoulder: 22,
					fLength: 33,
					bLength: 44,
					chest: 55,
					waist: 66,
					lowerHem: 77,
					lSleeveLength: 88,
					lSleeveCuff: 99,
					sSleeveLength: 1010,
					sSleeveCuff: 1111,
				}]
			});
		}

		return of({
			sizes: sizes,
			recordCount: count
		});
	}

	getSize(sizeId): Observable<SizeDTO> {
		return of({
			sizeId: sizeId,
			sizeName: '男尺码',
			category: '衬衫',
			sex: 'M',
			neckScopeL: 1,
			neckScopeU: 2,
			shoulderScopeL: 3,
			shoulderScopeU: 4,
			fLengthScopeL: 5,
			fLengthScopeU: 6,
			bLengthScopeL: 7,
			bLengthScopeU: 8,
			chestScopeL: 9,
			chestScopeU: 10,
			waistScopeL: 11,
			waistScopeU: 12,
			lowerHemScopeL: 13,
			lowerHemScopeU: 14,
			lSleeveLengthScopeL: 15,
			lSleeveLengthScopeU: 16,
			lSleeveCuffScopeL: 17,
			lSleeveCuffScopeU: 18,
			sSleeveLengthScopeL: 19,
			sSleeveLengthScopeU: 20,
			sSleeveCuffScopeL: 21,
			sSleeveCuffScopeU: 22,
			isLocked: false,
			sizeDetails: [{
				sizeName: 'X',
				sizeAlias: '36',
				neck: 23,
				shoulder: 24,
				fLength: 25,
				bLength: 26,
				chest: 27,
				waist: 28,
				lowerHem: 29,
				lSleeveLength: 30,
				lSleeveCuff: 31,
				sSleeveLength: 32,
				sSleeveCuff: 33,
				sex: 'M'
			}, {
				sizeName: 'L',
				sizeAlias: '37',
				neck: 34,
				shoulder: 35,
				fLength: 36,
				bLength: 37,
				chest: 38,
				waist: 39,
				lowerHem: 40,
				lSleeveLength: 41,
				lSleeveCuff: 42,
				sSleeveLength: 43,
				sSleeveCuff: 44,
				sex: 'M'
			}
			]
		});
	}

	deleteSize(sizeId): Observable<boolean> {
		return of(true)
	}

	updateSize(dto: SizeDTO): Observable<boolean> {
		console.log(dto);
		if (dto.sizeName === '1') {
			return throwError({ status: 400, error: [{ message: '尺码表名称已存在' }] });
		}
		return of(true);
	}
	createSize(dto: SizeDTO): Observable<number> {
		console.log(dto);
		if (dto.sizeName === '1') {
			return throwError({ status: 400, error: [{ message: '尺码表名称已存在' }] });
		}
		return of(1);
	}
}
