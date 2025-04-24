import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderDTO, CompanyOptionDTO, GroupOptionDTO } from 'src/rest';
import { CompanyService } from 'src/app/services/company.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { BasePage } from '../base-page';
import { FieldService } from 'src/app/services/field.service';


@Component({
    selector: 'orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends BasePage implements OnInit {
    recordCount: number;
    orders: OrderDTO[];
    groups: GroupOptionDTO[] = [];
    companies: CompanyOptionDTO[] = [];
    selectedGroup: GroupOptionDTO;
    selectedCompany: CompanyOptionDTO;
    @ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;
    searchParam;

    constructor(private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _orderService: OrderService,
        private _companyService: CompanyService,
        private _zone: NgZone,
        public field: FieldService) {
        super();
    }

    private _getOrders() {
        let pageNumer = 1;
        let pageSize = 20;
        if (this.matPaginator) {
            pageNumer = this.matPaginator.pageIndex + 1;
            pageSize = this.matPaginator.pageSize;
        }
        
        this._orderService.getOrders(pageNumer, pageSize, this.searchParam).subscribe((resp) => {
            this.recordCount = resp.recordCount;
            this.orders = resp.orders;

            this.getFormArray('selectedOrders').clear();
            this.orders.forEach(o => this.getFormArray('selectedOrders').push(this._fb.control(false)));
        });
    }

    search() {
        this.setFormControlValue(this.field.F_IS_SELECTED_ALL, false);
        this.searchParam = {
            group: this.getFormControlValue<string>(this.field.F_GROUP),
            company: this.getFormControlValue<string>(this.field.F_COMPANY),
            department: this.getFormControlValue<string>(this.field.F_DEPARTMENT),
            job: this.getFormControlValue<string>(this.field.F_JOB),
            employeeCode: this.getFormControlValue<string>(this.field.F_EMPLOYEE_CODE),
            name: this.getFormControlValue<string>(this.field.F_NAME)
        };
        if (this.matPaginator)
            this.matPaginator.firstPage();

        this._getOrders();
    };

    delete() {
        var ids: number[] = [];
        this.getFormControlValue<boolean[]>('selectedOrders').forEach((value, index) => {
            if (value) {
                ids.push(this.orders[index].orderId);
            }
        });

        if (ids.length == 0) {
            this._dialogService.showMention('请勾选要删除的订单', 1);
            return;
        }

        this._dialogService.showMention('确定要删除选中的订单吗？', 2, () => {
            this._orderService.deleteOrders(ids).subscribe(() => {
                this.setFormControlValue(this.field.F_IS_SELECTED_ALL, false);
                this._getOrders();
            });
        });
    };

    sync() {
        var selectedOrders = [];
        this.getFormControlValue<boolean[]>('selectedOrders').forEach((value, index) => {
            if (value) {
                selectedOrders.push(this.orders[index]);
            }
        });

        if (selectedOrders.length == 0) {
            this._dialogService.showMention("请勾选要同步的订单", 1);
            return;
        }
        this._dialogService.showSycnOrderDetail(selectedOrders);
    }


    updatebatch() {
        var selectedOrders = [];
        this.getFormControlValue<boolean[]>('selectedOrders').forEach((value, index) => {
            if (value) {
                selectedOrders.push(this.orders[index]);
            }
        });

        if (selectedOrders.length == 0) {
            this._dialogService.showMention("请勾选要保存的订单", 1);
            return;
        }
        this._dialogService.showMention("确定要保存选中的订单吗？", 2, () => {
            this._orderService.updateOrderDetailsBatch(selectedOrders).subscribe(() => {
                this._dialogService.showMention("保存明细成功", 1);
            });
        });
    }

    detail(id) {
        window.open('order/'+id);
    }

    changeCompany() {
        this.selectedCompany = null;
        this.setFormControlValue('department','');
        this.setFormControlValue('job','');
        for (var i = 0; i < this.selectedGroup.companies.length; i++) {
            if (this.selectedGroup.companies[i].value == this.getFormControlValue('company')) {
                this.selectedCompany = this.selectedGroup.companies[i];
                return;
            }
        }
    }

    changeGroup() {
        this.selectedCompany = null;
        this.selectedGroup = null;
        this.companies = null;
        this.setFormControlValue('company','');
        this.setFormControlValue('department','');
        this.setFormControlValue('job','');
        for (var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].value == this.getFormControlValue('group')) {
                this.selectedGroup = this.groups[i];
                this.companies = this.selectedGroup.companies;
                return;
            }
        }
    }

    onPageChange(e: PageEvent) {
        this._getOrders();
    }

    ngOnInit() {
        //为了让window.open的订单编辑页能刷新这个页面里的订单列表
        window['refreshOrders'] = () => {
            this._zone.run(() => {
                this._getOrders();
            });
        };

        this.form = this._fb.group({
            [this.field.F_GROUP]: [''],
            [this.field.F_COMPANY]: [''],
            [this.field.F_DEPARTMENT]: [''],
            [this.field.F_JOB]: [''],
            [this.field.F_EMPLOYEE_CODE]: [''],
            [this.field.F_NAME]: [''],
            [this.field.F_SELECTED_ORDERS]: this._fb.array([]),
            [this.field.F_IS_SELECTED_ALL]: [false]
        });

        this.getFormControl(this.field.F_IS_SELECTED_ALL).valueChanges.subscribe(v => {
            this.getFormArray(this.field.F_SELECTED_ORDERS).controls.forEach(selectedOrders => {
                selectedOrders.setValue(v);
            });
        });
        
        this._companyService.getGroups().subscribe((resp) => {
            this.groups = resp;
        });
    }
}