import { Component, OnInit } from '@angular/core';
import { BasePage } from '../base-page';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { custom, required, range, number, pattern } from 'src/app/services/form-validators';
import { SizeDetailDTO, CategoryOptionDTO } from 'src/rest';
import { SizeService } from 'src/app/services/size.service';
import { FieldService } from 'src/app/services/field.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CategoryService } from 'src/app/services/category.service';
// app.controller("size_edit", ["$scope", "$stateParams", "sizeAPIService", "dialogService", "$rootScope", function ($scope, $stateParams, sizeAPIService, dialogService, $rootScope) {
//   $scope.isCreate = $stateParams.sizeId == "" ? true : false;
//   $scope.size = {};


//   $rootScope.invalidMapping = {
//       "sizename": "td_m_sizename",
//       "sex": "td_m_sex",
//       "neckscopel": "td_m_neckscopel",
//       "neckscopeu": "td_m_neckscopeu",
//       "shoulderscopel": "td_m_shoulderscopel",
//       "shoulderscopeu": "td_m_shoulderscopeu",
//       "flengthscopel": "td_m_flengthscopel",
//       "flengthscopeu": "td_m_flengthscopeu",
//       "blengthscopel": "td_m_blengthscopel",
//       "blengthscopeu": "td_m_blengthscopeu",
//       "chestscopel": "td_m_chestscopel",
//       "chestscopeu": "td_m_chestscopeu",
//       "waistscopel": "td_m_waistscopel",
//       "waistscopeu": "td_m_waistscopeu",
//       "lowerhemscopel": "td_m_lowerhemscopel",
//       "lowerhemscopeu": "td_m_lowerhemscopeu",
//       "lsleevelengthscopel": "td_m_lsleevelengthscopel",
//       "lsleevelengthscopeu": "td_m_lsleevelengthscopeu",
//       "lsleevecuffscopel": "td_m_lsleevecuffscopel",
//       "lsleevecuffscopeu": "td_m_lsleevecuffscopeu",
//       "ssleevelengthscopel": "td_m_ssleevelengthscopel",
//       "ssleevelengthscopeu": "td_m_ssleevelengthscopeu",
//       "ssleevecuffscopel": "td_m_ssleevecuffscopel",
//       "ssleevecuffscopeu": "td_m_ssleevecuffscopeu",
//       "sizedetails": "td_m_sizedetails",
//       "sizename_": "td_m_sizename_",
//       "sizealias_": "td_m_sizealias_",
//       "neck_": "td_m_neck_",
//       "shoulder_": "td_m_shoulder_",
//       "flength_": "td_m_flength_",
//       "blength_": "td_m_blength_",
//       "chest_": "td_m_chest_",
//       "waist_": "td_m_waist_",
//       "lowerhem_": "td_m_lowerhem_",
//       "lsleevelength_": "td_m_lsleevelength_",
//       "lsleevecuff_": "td_m_lsleevecuff_",
//       "ssleevelength_": "td_m_ssleevelength_",
//       "ssleevecuff_": "td_m_ssleevecuff_"
//   };

//   if (!$scope.isCreate) {
//       sizeAPIService.getSize($stateParams.sizeId).then(function (resp) {
//           $scope.size = resp.data;
//       });
//   }
//   else {
//       $scope.size.sex = "M";
//       $scope.size.sizeDetails = [];
//       $scope.size.sizeDetails.push({
//           "sizeName": "",
//           "sizeAlias": "",
//           "neck": "",
//           "shoulder": "",
//           "fLength": "",
//           "bLength": "",
//           "chest": "",
//           "waist": "",
//           "lowerHem": "",
//           "lSleeveLength": "",
//           "lSleeveCuff": "",
//           "sSleeveLength": "",
//           "sSleeveCuff": ""
//       });
//   }



//   $scope.submit = function () {
//       if ($scope.isCreate) {
//           sizeAPIService.createSize($scope.size).then(function (resp) {
//               dialogService.showMention("1", "创建尺码成功", "sizes");
//           });
//       }
//       else {
//           sizeAPIService.updateSize($scope.size).then(function (resp) {
//               dialogService.showMention("1", "修改尺码成功", "sizes");
//           });
//       }
//   }


//   $scope.addDetail = function () {
//       $scope.size.sizeDetails.push({
//           "sizeName": "",
//           "sizeAlias": "",
//           "neck": "",
//           "shoulder": "",
//           "fLength": "",
//           "bLength": "",
//           "chest": "",
//           "waist": "",
//           "lowerHem": "",
//           "lSleeveLength": "",
//           "lSleeveCuff": "",
//           "sSleeveLength": "",
//           "sSleeveCuff": ""
//       });
//   };

//   $scope.deleteDetail = function (detail) {
//       var index = $scope.size.sizeDetails.indexOf(detail);
//       $scope.size.sizeDetails.splice(index, 1);
//   };

// }]);
@Component({
	selector: 'size',
	templateUrl: './size.component.html',
	styleUrls: ['./size.component.scss']
})
export class SizeComponent extends BasePage implements OnInit {
	private _sizeId?: number;
	isLock = false;
	public categories: CategoryOptionDTO[];

	constructor(private _activatedRoute: ActivatedRoute,
		private _fb: FormBuilder,
		private _sizeService: SizeService,
		public field: FieldService,
		private _dialogService: DialogService,
		private _categoryService:CategoryService) {
		super();
	}

	save() {
		const errHandle = (err) => {
			if (err.status === 400) {
				this._dialogService.showMention(err.error[0].message, 1, null);
			} else {
				this._sizeService.defaultErrorHandle(err);
			}
		};

		if (this._sizeId === null) {
			this._sizeService.createSize(this.form.value).subscribe(resp => {
				this._dialogService.showMention("创建尺码成功", 1, null, ["sizes"]);
			}, errHandle);
		}
		else {
			this._sizeService.updateSize(this.form.value).subscribe(resp => {
				this._dialogService.showMention("修改尺码成功", 1, null, ["sizes"]);
			}, errHandle);
		}
	}

	addDetail(d?: SizeDetailDTO) {
		if(!d) {
			d = <SizeDetailDTO>{
				sizeName: '',
				sizeAlias: '',
				neck: null,
				shoulder: null,
				fLength: null,
				bLength: null,
				chest: null,
				waist: null,
				lowerHem: null,
				lSleeveLength: null,
				lSleeveCuff: null,
				sSleeveLength: null,
				sSleeveCuff: null
			};
		}
		this.getFormArray(this.field.F_SIZEDETAILS).push(this._fb.group({
			[this.field.F_SIZENAME]: [d.sizeName, [required(false, this.field.SIZENAME), pattern(/^[0-9a-zA-Z/]+$/, this.field.SIZENAME + '只能包含字母，数字，/')]],
			[this.field.F_SIZE_ALIAS]: [d.sizeAlias, [required(false, this.field.SIZE_ALIAS), pattern(/^[0-9a-zA-Z/]+$/, this.field.SIZE_ALIAS + '只能包含字母，数字，/')]],
			[this.field.F_NECK]: [d.neck, [required(false, this.field.NECK), number(1, this.field.NECK), range(1, 999.9, this.field.NECK)]],
			[this.field.F_SHOULDER]: [d.shoulder, [required(false, this.field.SHOULDER), number(1, this.field.SHOULDER), range(1, 999.9, this.field.SHOULDER)]],
			[this.field.F_FLENGTH]: [d.fLength, [required(false, this.field.F_LENGTH), number(1, this.field.F_LENGTH), range(1, 999.9, this.field.F_LENGTH)]],
			[this.field.F_BLENGTH]: [d.bLength, [required(false, this.field.B_LENGTH), number(1, this.field.B_LENGTH), range(1, 999.9, this.field.B_LENGTH)]],
			[this.field.F_CHEST]: [d.chest, [required(false, this.field.CHEST), number(0, this.field.CHEST), range(1, 999, this.field.CHEST)]],
			[this.field.F_WAIST]: [d.waist, [required(false, this.field.WAIST), number(1, this.field.WAIST), range(1, 999.9, this.field.WAIST)]],
			[this.field.F_LOWERHEM]: [d.lowerHem, [required(false, this.field.LOWER_HEM), number(1, this.field.LOWER_HEM), range(1, 999.9, this.field.LOWER_HEM)]],
			[this.field.F_LSLEEVELENGTH]: [d.lSleeveLength, [required(false, this.field.L_SLEEVE_LENGTH), number(1, this.field.L_SLEEVE_LENGTH), range(1, 999.9, this.field.L_SLEEVE_LENGTH)]],
			[this.field.F_LSLEEVECUFF]: [d.lSleeveCuff, [required(false, this.field.L_SLEEVE_CUFF), number(1, this.field.L_SLEEVE_CUFF), range(1, 999.9, this.field.L_SLEEVE_CUFF)]],
			[this.field.F_SSLEEVELENGTH]: [d.sSleeveLength, [required(false, this.field.S_SLEEVE_LENGTH), number(1, this.field.S_SLEEVE_LENGTH), range(1, 999.9, this.field.S_SLEEVE_LENGTH)]],
			[this.field.F_SSLEEVECUFF]: [d.sSleeveCuff, [required(false, this.field.S_SLEEVE_CUFF), number(1, this.field.S_SLEEVE_CUFF), range(1, 999.9, this.field.S_SLEEVE_CUFF)]]
		}));
	};

	deleteDetail(index: number) {
		this.getFormArray(this.field.F_SIZEDETAILS).controls.splice(index, 1);
	};


	ngOnInit() {
		this._sizeId = /^\d+$/.test(this._activatedRoute.snapshot.params['sizeId']) ? this._activatedRoute.snapshot.params['sizeId'] : null;
		this.form = this._fb.group({
			[this.field.F_SIZE_ID]: [this._sizeId],
			[this.field.F_SIZENAME]: ['', [required(false, this.field.SIZE_TABLE_NAME)]],
			[this.field.F_CATEGOTY]: ['', [required(false, this.field.CATEGORY)]],
			[this.field.F_SEX]: ['M'],
			[this.field.F_NECK_SCOPE_L]: ['', [required(false, this.field.NECK_SCOPE_L), number(1, this.field.NECK_SCOPE_L), range(0.1, 999.9, this.field.NECK_SCOPE_L)]],
			[this.field.F_NECK_SCOPE_U]: ['', [required(false, this.field.NECK_SCOPE_U), number(1, this.field.NECK_SCOPE_U), range(0.1, 999.9, this.field.NECK_SCOPE_U)]],
			[this.field.F_SHOULDER_SCOPE_L]: ['', [required(false, this.field.SHOULDER_SCOPE_L), number(1, this.field.SHOULDER_SCOPE_L), range(0.1, 999.9, this.field.SHOULDER_SCOPE_L)]],
			[this.field.F_SHOULDER_SCOPE_U]: ['', [required(false, this.field.SHOULDER_SCOPE_U), number(1, this.field.SHOULDER_SCOPE_U), range(0.1, 999.9, this.field.SHOULDER_SCOPE_U)]],
			[this.field.F_FLENGTH_SCOPE_L]: ['', [required(false, this.field.FLENGTH_SCOPE_L), number(1, this.field.FLENGTH_SCOPE_L), range(0.1, 999.9, this.field.FLENGTH_SCOPE_L)]],
			[this.field.F_FLENGTH_SCOPE_U]: ['', [required(false, this.field.FLENGTH_SCOPE_U), number(1, this.field.FLENGTH_SCOPE_U), range(0.1, 999.9, this.field.FLENGTH_SCOPE_U)]],
			[this.field.F_BLENGTH_SCOPE_L]: ['', [required(false, this.field.BLENGTH_SCOPE_L), number(1, this.field.BLENGTH_SCOPE_L), range(0.1, 999.9, this.field.BLENGTH_SCOPE_L)]],
			[this.field.F_BLENGTH_SCOPE_U]: ['', [required(false, this.field.BLENGTH_SCOPE_U), number(1, this.field.BLENGTH_SCOPE_U), range(0.1, 999.9, this.field.BLENGTH_SCOPE_U)]],
			[this.field.F_CHEST_SCOPE_L]: ['', [required(false, this.field.CHEST_SCOPE_L), number(0, this.field.CHEST_SCOPE_L), range(1, 999, this.field.CHEST_SCOPE_L)]],
			[this.field.F_CHEST_SCOPE_U]: ['', [required(false, this.field.CHEST_SCOPE_U), number(0, this.field.CHEST_SCOPE_U), range(1, 999, this.field.CHEST_SCOPE_U)]],
			[this.field.F_WAIST_SCOPE_L]: ['', [required(false, this.field.WAIST_SCOPE_L), number(1, this.field.WAIST_SCOPE_L), range(0.1, 999.9, this.field.WAIST_SCOPE_L)]],
			[this.field.F_WAIST_SCOPE_U]: ['', [required(false, this.field.WAIST_SCOPE_U), number(1, this.field.WAIST_SCOPE_U), range(0.1, 999.9, this.field.WAIST_SCOPE_U)]],
			[this.field.F_LOWERHEM_SCOPE_L]: ['', [required(false, this.field.LOWERHEM_SCOPE_L), number(1, this.field.LOWERHEM_SCOPE_L), range(0.1, 999.9, this.field.LOWERHEM_SCOPE_L)]],
			[this.field.F_LOWERHEM_SCOPE_U]: ['', [required(false, this.field.LOWERHEM_SCOPE_U), number(1, this.field.LOWERHEM_SCOPE_U), range(0.1, 999.9, this.field.LOWERHEM_SCOPE_U)]],
			[this.field.F_LSLEEVE_LENGTH_SCOPE_L]: ['', [required(false, this.field.LSLEEVE_LENGTH_SCOPE_L), number(1, this.field.LSLEEVE_LENGTH_SCOPE_L), range(0.1, 999.9, this.field.LSLEEVE_LENGTH_SCOPE_L)]],
			[this.field.F_LSLEEVE_LENGTH_SCOPE_U]: ['', [required(false, this.field.LSLEEVE_LENGTH_SCOPE_U), number(1, this.field.LSLEEVE_LENGTH_SCOPE_U), range(0.1, 999.9, this.field.LSLEEVE_LENGTH_SCOPE_U)]],
			[this.field.F_LSLEEVE_CUFF_SCOPE_L]: ['', [required(false, this.field.LSLEEVE_CUFF_SCOPE_L), number(1, this.field.LSLEEVE_CUFF_SCOPE_L), range(0.1, 999.9, this.field.LSLEEVE_CUFF_SCOPE_L)]],
			[this.field.F_LSLEEVE_CUFF_SCOPE_U]: ['', [required(false, this.field.LSLEEVE_CUFF_SCOPE_U), number(1, this.field.LSLEEVE_CUFF_SCOPE_U), range(0.1, 999.9, this.field.LSLEEVE_CUFF_SCOPE_U)]],
			[this.field.F_SSLEEVE_LENGTH_SCOPE_L]: ['', [required(false, this.field.SSLEEVE_LENGTH_SCOPE_L), number(1, this.field.SSLEEVE_LENGTH_SCOPE_L), range(0.1, 999.9, this.field.SSLEEVE_LENGTH_SCOPE_L)]],
			[this.field.F_SSLEEVE_LENGTH_SCOPE_U]: ['', [required(false, this.field.SSLEEVE_LENGTH_SCOPE_U), number(1, this.field.SSLEEVE_LENGTH_SCOPE_U), range(0.1, 999.9, this.field.SSLEEVE_LENGTH_SCOPE_U)]],
			[this.field.F_SSLEEVE_CUFF_SCOPE_L]: ['', [required(false, this.field.SSLEEVE_CUFF_SCOPE_L), number(1, this.field.SSLEEVE_CUFF_SCOPE_L), range(0.1, 999.9, this.field.SSLEEVE_CUFF_SCOPE_L)]],
			[this.field.F_SSLEEVE_CUFF_SCOPE_U]: ['', [required(false, this.field.SSLEEVE_CUFF_SCOPE_U), number(1, this.field.SSLEEVE_CUFF_SCOPE_U), range(0.1, 999.9, this.field.SSLEEVE_CUFF_SCOPE_U)]],
			[this.field.F_SIZEDETAILS]: this._fb.array([], [custom(control => {
				const details = control.value as SizeDetailDTO[];
				let result = {};
				for (let i = 0; i < details.length; i++) {
					if (details.filter(detail => detail.sizeName === details[i].sizeName).length > 1) {
						result['custom' + i] = '尺码必须唯一';
					}
				}
				return Object.getOwnPropertyNames(result).length === 0 ? null : result;
			})])
		});
		this._categoryService.getCategories().subscribe(cates => {
			this.categories = cates;

			if (this._sizeId !== null) {	
				this._sizeService.getSize(this._sizeId).subscribe(resp => {
					this.form.patchValue({
						[this.field.F_SIZENAME]: resp.sizeName,
						[this.field.F_CATEGOTY]: resp.category,
						[this.field.F_SEX]: resp.sex,
						[this.field.F_NECK_SCOPE_L]: resp.neckScopeL,
						[this.field.F_NECK_SCOPE_U]: resp.neckScopeU,
						[this.field.F_SHOULDER_SCOPE_L]: resp.shoulderScopeL,
						[this.field.F_SHOULDER_SCOPE_U]: resp.shoulderScopeU,
						[this.field.F_FLENGTH_SCOPE_L]: resp.fLengthScopeL,
						[this.field.F_FLENGTH_SCOPE_U]: resp.fLengthScopeU,
						[this.field.F_BLENGTH_SCOPE_L]: resp.bLengthScopeL,
						[this.field.F_BLENGTH_SCOPE_U]: resp.bLengthScopeU,
						[this.field.F_CHEST_SCOPE_L]: resp.chestScopeL,
						[this.field.F_CHEST_SCOPE_U]: resp.chestScopeU,
						[this.field.F_WAIST_SCOPE_L]: resp.waistScopeL,
						[this.field.F_WAIST_SCOPE_U]: resp.waistScopeU,
						[this.field.F_LOWERHEM_SCOPE_L]: resp.lowerHemScopeL,
						[this.field.F_LOWERHEM_SCOPE_U]: resp.lowerHemScopeU,
						[this.field.F_LSLEEVE_LENGTH_SCOPE_L]: resp.lSleeveLengthScopeL,
						[this.field.F_LSLEEVE_LENGTH_SCOPE_U]: resp.lSleeveLengthScopeU,
						[this.field.F_LSLEEVE_CUFF_SCOPE_L]: resp.lSleeveCuffScopeL,
						[this.field.F_LSLEEVE_CUFF_SCOPE_U]: resp.lSleeveCuffScopeU,
						[this.field.F_SSLEEVE_LENGTH_SCOPE_L]: resp.sSleeveLengthScopeL,
						[this.field.F_SSLEEVE_LENGTH_SCOPE_U]: resp.sSleeveLengthScopeU,
						[this.field.F_SSLEEVE_CUFF_SCOPE_L]: resp.sSleeveCuffScopeL,
						[this.field.F_SSLEEVE_CUFF_SCOPE_U]: resp.sSleeveCuffScopeU
					});
					
					resp.sizeDetails.forEach(d => {
						this.addDetail(d);
					});
					this.isLock = resp.isLocked;
				});
			} else {
				this.addDetail();
			}
		});
	}
}
