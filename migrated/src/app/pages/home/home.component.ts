import { Component, OnInit, forwardRef } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { UpgradeAdapter } from '@angular/upgrade';
import { AppModule } from 'src/app/app.module';
// app.controller("home", ["$scope", "storageService", function ($scope, storageService) {

//   $scope.userTypeId = storageService.getSession("userTypeId");



// }]);
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userTypeId: number;
  constructor(private _storageService: StorageService) { }





  ngOnInit() {
    this.userTypeId = parseInt(this._storageService.getSession("userTypeId"));
  }

}

// const upgradeAdapter = new UpgradeAdapter(forwardRef(() => AppModule));
// app.directive('home', upgradeAdapter.downgradeNg2Component(HomeComponent));