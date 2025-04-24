import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDTO } from 'src/rest';
import { BasePage } from '../base-page';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
// app.controller("users", ["$scope", "userAPIService", "routeService", "dialogService", function ($scope, userAPIService, routeService, dialogService) {
//   $scope.paginationConf = {
//       currentPage: 1,
//       itemsPerPage: 20
//   };
//   $scope.users = null;

//   function getUsers() {
//       userAPIService.getUsers($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage).then(function (resp) {
//           $scope.paginationConf.totalItems = resp.data.recordCount;
//           $scope.users = resp.data.users;
//       });
//   }

//   $scope.delete = function (userId) {
//       userAPIService.deleteUser(userId).then(function (resp) {
//           getUsers();
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

//   $scope.detail = function (id) {
//       routeService.goParams("user_edit", { userId: id });
//   };

//   $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function () {
//       if ($scope.paginationConf.currentPage == 0)
//           return;
//       getUsers();
//   });

// }]);
@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BasePage implements OnInit {
	users: UserDTO[];
	recordCount: number;
	@ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;
	constructor(private _userService: UserService,
		private _router: Router,
		private _dialogService: DialogService) {
		super();
	}

	private _getUsers() {
		let pageNumer = 1;
		let pageSize = 20;
		if (this.matPaginator) {
			pageNumer = this.matPaginator.pageIndex + 1;
			pageSize = this.matPaginator.pageSize;
		}

		this._userService.getUsers(pageNumer, pageSize).subscribe(resp => {
			this.recordCount = resp.recordCount;
			this.users = resp.users;
		});
	}

	delete(userId) {
		this._dialogService.showMention('确定要删除该用户吗？', 2, () => {
			this._userService.deleteUser(userId).subscribe(resp => {
				this._dialogService.showMention('删除用户成功', 1);
				this._getUsers();
			});
		});
	}

	detail(id) {
		this._router.navigate(['/user/' + id]);
	}

	create() {
		this._router.navigate(['user']);
	}

	ngOnInit() {
		this._getUsers();
	}

	onPageChange(e: PageEvent) {
		this._getUsers();
	}
}
