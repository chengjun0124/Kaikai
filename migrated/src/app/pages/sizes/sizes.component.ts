import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '../base-page';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { SizeService } from 'src/app/services/size.service';
import { SizeDTO } from 'src/rest';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
// app.controller("sizes", ["$scope", "sizeAPIService", "routeService", "dialogService", function ($scope, sizeAPIService, routeService, dialogService) {
//   $scope.paginationConf = {
//       currentPage: 1,
//       itemsPerPage: 20
//   };
//   $scope.sizes = null;


//   function getSizes() {
//       sizeAPIService.getSizesPagination($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage).then(function (resp) {
//           $scope.paginationConf.totalItems = resp.data.recordCount;
//           $scope.sizes = resp.data.sizes;
//       });
//   }

//   $scope.detail = function (id) {
//       routeService.goParams("size_edit", { sizeId: id });
//   };

//   $scope.delete = function (sizeId) {
//       sizeAPIService.deleteSize(sizeId).then(function (resp) {
//           getSizes();
//       },
//       function (error) {
//           if (error.status == 500)
//               routeService.goParams("error");
//           else if (error.status == 404)
//               routeService.goParams("error", { msg: encodeURIComponent("您请求的数据不存在，请返回首页重新浏览") });
//           else if (error.status == 400) {
//               dialogService.showMention(1, error.data[0].message);
//           }
//           else if (error.status == 401)
//               routeService.goParams("login");
//           else
//               routeService.goParams("error");
//       });
//   };


//   $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function () {
//       if ($scope.paginationConf.currentPage == 0)
//           return;
//       getSizes();
//   });


// }]);
@Component({
	selector: 'sizes',
	templateUrl: './sizes.component.html',
	styleUrls: ['./sizes.component.scss']
})
export class SizesComponent extends BasePage implements OnInit {
	recordCount: number;
	sizes: SizeDTO[];
	@ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;
	constructor(private _sizeService: SizeService,
		private _router: Router,
		private _dialogService: DialogService) {
		super();
	}

	private _getSizes() {
		let pageNumer = 1;
		let pageSize = 20;
		if (this.matPaginator) {
			pageNumer = this.matPaginator.pageIndex + 1;
			pageSize = this.matPaginator.pageSize;
		}

		this._sizeService.getSizesPagination(pageNumer, pageSize).subscribe(resp => {
			this.recordCount = resp.recordCount;
			this.sizes = resp.sizes;
		});
	}

	detail(id) {
		this._router.navigate(['/size/' + id]);
	};

	delete(sizeId) {
		this._dialogService.showMention('确定要删除该尺码表吗？', 2, () => {
			this._sizeService.deleteSize(sizeId).subscribe(resp => {
				this._dialogService.showMention('删除尺码表成功', 1);
				this._getSizes();
			});	
		});
	};

	create() {
		this._router.navigate(['size']);
	}

	onPageChange(e: PageEvent) {
		this._getSizes();
	}

	ngOnInit() {
		this._getSizes();
	}
}
