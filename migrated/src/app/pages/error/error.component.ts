import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// app.controller("error", ["$scope", "$stateParams", function ($scope, $stateParams) {
//   if ($stateParams.msg == null || $stateParams.msg.length == 0)
//       $stateParams.msg = "服务器错误，请联系管理员";

//   $scope.msg = decodeURIComponent($stateParams.msg);
// }]);
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  msg: string;
  constructor(private _activatedRoute: ActivatedRoute) { }



  ngOnInit() {
    if (this._activatedRoute.snapshot.queryParams == null || !this._activatedRoute.snapshot.queryParams['msg'])
      this.msg = "服务器错误，请联系管理员";
    else
      this.msg = decodeURIComponent(this._activatedRoute.snapshot.queryParams['msg']);
  }

}
