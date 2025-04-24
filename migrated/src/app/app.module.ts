import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { MentionComponent } from './modals/mention/mention.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SyncOrderComponent } from './modals/sync-order/sync-order.component';
import { EnterDirective } from './directives/enter.directive';
import { LoadingComponent } from './modals/loading/loading.component'
import { StorageService } from './services/storage.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { HeadComponent } from './components/head/head.component';
import { RouterModule, Routes, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { ErrorComponent } from './pages/error/error.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CompanyService, CompanyServiceMock } from './services/company.service';
import { AuthService, AuthServiceMock } from './services/auth.service';
import { OrderService, OrderServiceMock } from './services/order.service';
import {MatPaginatorModule, MatPaginatorIntl} from '@angular/material/paginator';
import { SizesComponent } from './pages/sizes/sizes.component';
import { SizeService, SizeServiceMock } from './services/size.service';
import { UsersComponent } from './pages/users/users.component';
import { UserService, UserServiceMock } from './services/user.service';
import { ToUserTypePipe } from './pipes/to-user-type.pipe';
import { SummaryComponent } from './pages/summary/summary.component';
import { ExportServiceMock, ExportService } from './services/export.service';
import { OrderComponent } from './pages/order/order.component';
import { SizeComponent } from './pages/size/size.component';
import { CategoryService, CategoryServiceMock } from './services/category.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ValidationDirective } from './directives/validation.directive';
import {MatButtonModule} from '@angular/material/button';
import { FieldService } from './services/field.service';
import { environment } from 'src/environments/environment';
import { MatPaginatorIntlCro } from './services/mat-paginator-intl-cro.service';
import { UserComponent } from './pages/user/user.component';
import { PasswordComponent } from './pages/password/password.component';
import { PasswordService, PasswordServiceMock } from './services/password.service';


export class GuardJWT implements CanActivate {
    constructor(private _router: Router, private _storageService: StorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(!this._storageService.getSession("jwt")) {
            this._router.navigate(['login']);
            return false;
        }
        return true;
    }

}
const routes: Routes = [    
    {path: 'login', component: LoginComponent},
    {path: 'error', component: ErrorComponent},
    {path: 'home', component: HomeComponent, canActivate:[GuardJWT]},
    {path: 'orders', component: OrdersComponent, canActivate:[GuardJWT]},
    {path: 'order/:orderId', component: OrderComponent, canActivate:[GuardJWT]},
    {path: 'order', component: OrderComponent, canActivate:[GuardJWT]},
    {path: 'sizes', component: SizesComponent, canActivate:[GuardJWT]},
    {path: 'size/:sizeId', component: SizeComponent, canActivate:[GuardJWT]},
    {path: 'size', component: SizeComponent, canActivate:[GuardJWT]},
    {path: 'users', component: UsersComponent, canActivate:[GuardJWT]},
    {path: 'user/:userId', component: UserComponent, canActivate:[GuardJWT]},
    {path: 'user', component: UserComponent, canActivate:[GuardJWT]},
    {path: 'summary', component: SummaryComponent, canActivate:[GuardJWT]},
    {path: 'password', component: PasswordComponent, canActivate:[GuardJWT]},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        ReactiveFormsModule,
        FormsModule,
        OverlayModule,
        MatDialogModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        MatPaginatorModule,
        MatTabsModule,
        MatButtonModule
    ],
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        LoginComponent,
        MentionComponent,
        SyncOrderComponent,
        EnterDirective,
        LoadingComponent,
        HomeComponent,
        HeadComponent,
        ErrorComponent,
        OrdersComponent,
        SizesComponent,
        UsersComponent,
        ToUserTypePipe,
        SummaryComponent,
        OrderComponent,
        SizeComponent,
        ValidationDirective,
        UserComponent,
        PasswordComponent
    ],
        providers:[
            StorageService,
            FieldService,
            GuardJWT,
            { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro},
            // { provide: CompanyService, useClass: environment.production ? CompanyService : CompanyServiceMock },
            // { provide: AuthService, useClass: environment.production ? AuthService : AuthServiceMock },
            // { provide: OrderService, useClass: environment.production ? OrderService : OrderServiceMock },
            // { provide: SizeService, useClass: environment.production ? SizeService : SizeServiceMock },
            // { provide: UserService, useClass: environment.production ? UserService : UserServiceMock },
            // { provide: ExportService, useClass: environment.production ? ExportService : ExportServiceMock },
            // { provide: CategoryService, useClass: environment.production ? CategoryService : CategoryServiceMock },
            // { provide: PasswordService, useClass: environment.production ? PasswordService : PasswordServiceMock },
            CompanyService,
            AuthService,
            OrderService,
            SizeService,
            UserService,
            ExportService,
            CategoryService,
            PasswordService
        ],
    entryComponents: [
        LoginComponent,
        MentionComponent,
        LoadingComponent,
        HomeComponent,
        SyncOrderComponent
    ]
})

export class AppModule {
    ngDoBootstrap() { }
}