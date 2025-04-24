import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
// app.controller("head", ["$scope", "storageService", function ($scope, storageService) {

//   $scope.logout = function () {
//       storageService.removeSession("jwt");
//       storageService.removeSession("userTypeId");
//   };

// }]);
@Component({
  selector: 'head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

  constructor(private _storageService: StorageService,
    private _router: Router) { }


  logout() {
    this._storageService.removeSession("jwt");
    this._storageService.removeSession("userTypeId");
    this._router.navigate(['/login']);
  }

  ngOnInit() {
  }

}
