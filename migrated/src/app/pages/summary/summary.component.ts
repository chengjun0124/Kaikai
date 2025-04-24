import { Component, OnInit } from '@angular/core';
import { BasePage } from '../base-page';
import { CompanyService } from 'src/app/services/company.service';
import { SizeService } from 'src/app/services/size.service';
import { CategoryOptionDTO } from 'src/rest';
import { FormBuilder } from '@angular/forms';
import { ExportService } from 'src/app/services/export.service';
import { required } from 'src/app/services/form-validators';
import { FieldService } from 'src/app/services/field.service';
import { CategoryService } from 'src/app/services/category.service';
// app.controller("summary", ["$scope", "companyAPIService", "sizeAPIService", "exportAPIService", "$rootScope", function ($scope, companyAPIService, sizeAPIService, exportAPIService, $rootScope) {
//   $scope.companies = null;
//   $scope.sizes = null;
//   $scope.company = "";
//   $scope.manSizeId = "";
//   $scope.womanSizeId = "";

//   $rootScope.invalidMapping = {
//       "mansize": "td_m_man",
//       "womansize": "td_m_woman"
//       //"age": "div_mention_age",
//       //"manChestEnlarge": "td_m_manChestEnlarge",
//       //"womanChestEnlarge": "td_m_womanChestEnlarge"
//   };

//   companyAPIService.getCompanies().then(function (resp) {
//       $scope.companies = resp.data;
//   });

//   sizeAPIService.getSizes().then(function (resp) {
//       $scope.sizes = resp.data;
//   });

//   $scope.export = function () {        
//       exportAPIService.export($scope.company, $scope.manSizeId, $scope.womanSizeId).then(function (resp) {
//           var blob = new Blob([resp.data], { type: resp.headers("content-type") });
//           var a = document.createElement("a");
//           document.body.appendChild(a);
//           var fileName = decodeURI(resp.headers("Content-Disposition").replace("attachment; filename=", ""));
//           fileName = fileName.replace(/\"/g, "");
//           a.download = fileName;
//           a.href = URL.createObjectURL(blob);
//           a.click();
//           document.body.removeChild(a);
//       });
//   };    
// }]);
@Component({
	selector: 'summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss']
})
export class SummaryComponent extends BasePage implements OnInit {
	public companies: string[];
	public categories: CategoryOptionDTO[];
	public selectedCategory: CategoryOptionDTO;

	constructor(private _companyService: CompanyService,
		private _fb: FormBuilder,
		private _exportService: ExportService,
		public field: FieldService,
		private _categoryService:CategoryService) {
		super();
	}

	export() {
		this._exportService.export(this.getFormControlValue(this.field.F_COMPANY), this.getFormControlValue(this.field.F_CATEGOTY), this.getFormControlValue(this.field.F_MAN_SIZE_ID), this.getFormControlValue(this.field.F_WOMAN_SIZE_ID)).subscribe(resp => {
			var blob = new Blob([resp.body], { type: resp.headers.get('content-type') });
			var a = document.createElement("a");
			document.body.appendChild(a);
			var fileName = decodeURI(resp.headers.get("Content-Disposition").replace("attachment; filename=", ""));
			fileName = fileName.replace(/\"/g, "");
			a.download = fileName;
			a.href = URL.createObjectURL(blob);
			a.click();
			document.body.removeChild(a);
		});
	};

	ngOnInit() {
		this.form = this._fb.group({
			[this.field.F_COMPANY]: ['', [required(false, this.field.COMPANY)]],
			[this.field.F_CATEGOTY]: ['', [required(false, this.field.CATEGORY)]],
			[this.field.F_MAN_SIZE_ID]: ['', [required(false, this.field.MAN_SIZE)]],
			[this.field.F_WOMAN_SIZE_ID]: ['', [required(false, this.field.WOMAN_SIZE)]]
		});

		this._companyService.getCompanies().subscribe(resp => {
			this.companies = resp;
		});

		this._categoryService.getCategories().subscribe(resp=>{
			this.categories = resp;
		});
	}

	changeCategory() {
        this.selectedCategory = null;
        this.setFormControlValue(this.field.F_MAN_SIZE_ID,'');
		this.setFormControlValue(this.field.F_WOMAN_SIZE_ID,'');

        for (var i = 0; i < this.categories.length; i++) {
            if (this.categories[i].value == this.getFormControlValue(this.field.F_CATEGOTY)) {
                this.selectedCategory = this.categories[i];
                return;
            }
        }
    }
}
