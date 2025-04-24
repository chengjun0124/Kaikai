import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { OrderDTO, OrderListDTO } from 'src/rest';
import { Router } from '@angular/router';
// app.factory('orderAPIService', ["apiService", function (apiService) {
//   return {
//       getOrder: function (orderId) {
//           return apiService.call("get", "order/" + orderId);
//       },
//       getOrders: function (pageNumber, pageSize, json) {
//           return apiService.call("put", "order/" + pageNumber + "/" + pageSize, json);

//       },
//       updateOrder: function (json) {
//           return apiService.call("put", "order", json);
//       },
//       createOrder: function (json) {
//           return apiService.call("post", "order", json);
//       },
//       deleteOrders: function (ids) {
//           return apiService.call("put", "order/delete", ids);
//       },
//       updateOrderDetailsBatch: function (orders) {
//           return apiService.call("put", "order/updateorderdetailsbatch", orders);
//       }
//   };
// }]);
export class OrderService extends BaseService {

	constructor(_dialog: MatDialog,
		_storageService: StorageService,
		_http: HttpClient,
		_router: Router) {
		super(_dialog, _storageService, _http, _router);
	}

	getOrder(orderId: number): Observable<OrderDTO> {
		return super.get<OrderDTO>("order/" + orderId);
	}

	getOrders(pageNumber: number, pageSize: number, json): Observable<OrderListDTO> {
		return super.put("order/" + pageNumber + "/" + pageSize, json);
	}

	updateOrder(order: OrderDTO): Observable<boolean> {
		return super.put("order", order);
	}

	createOrder(order: OrderDTO): Observable<number> {
		return super.post("order", order);
	}

	deleteOrders(ids): Observable<boolean> {
		return super.delete("order", ids);
	}

	updateOrderDetailsBatch(orders) {
		return super.put("order/updateorderdetailsbatch", orders);
	}
}
export class OrderServiceMock extends OrderService {
	getOrders(pageNumber: number, pageSize: number, json): Observable<OrderListDTO> {
		const orders: OrderDTO[] = [];
		const count = 89;
		for (let index = 0; index < pageSize; index++) {
			const orderId = (pageNumber - 1) * pageSize + 1;
			orders.push(<OrderDTO>{
				orderId: orderId + index,
				group: '集团',
				company: '公司' + (orderId + index),
				department: '部门',
				job: '职位',
				employeeCode: '员工号',
				name: '姓名',
				age: 18,
				sex: '男',
				height: 175,
				weight: 80,
				shirtNeck: 32,
				shirtShoulder: 33,
				shirtFLength: 34,
				shirtBLength: 35,
				shirtChest: 36,
				shirtWaist: 37,
				shirtLowerHem: 38,
				shirtLSleeveLength: 39,
				shirtLSleeveCuff: 40,
				shirtLPrice: 41,
				shirtSSleeveLength: 42,
				shirtSSleeveCuff: 43,
				shirtSPrice: 44,
				shirtPreSize: '偏大',
				shirtMemo: '备注',
				longSleeveIsEnabled: true,
				shortSleeveIsEnabled: true,
				shirtSizeName: '尺码',
				shirtChestEnlarge: 45,
				shirtWaistEnlarge: 46,
				shirtLowerHemEnlarge: 47,
				longSleeves: [
					{
						color: '长袖颜色',
						cloth: '面料',
						amount: 3,
					}
				],
				shortSleeves: [
					{
						color: '短袖颜色',
						cloth: '面料',
						amount: 4,
					}
				]
			});

		}

		return of({
			orders: orders,
			recordCount: count
		});
	}

	getOrder(orderId: number): Observable<OrderDTO> {
		return of({
			orderId: orderId,
			group: '集团',
			company: '公司' + orderId,
			department: '部门',
			job: '职位',
			employeeCode: '00'+orderId,
			name: '姓名',
			age: 18,
			sex: 'F',
			height: 175,
			weight: 80,
			shirtNeck: 32,
			shirtShoulder: 33,
			shirtFLength: 34,
			shirtBLength: 35,
			shirtChest: 36,
			shirtWaist: 37,
			shirtLowerHem: 38,
			shirtLSleeveLength: 39,
			shirtLSleeveCuff: 40,
			shirtLPrice: 41,
			shirtSSleeveLength: 42,
			shirtSSleeveCuff: 43,
			shirtSPrice: 44,
			shirtPreSize: 'B',
			shirtMemo: '备注',
			longSleeveIsEnabled: true,
			shortSleeveIsEnabled: true,
			shirtSizeName: '尺码',
			shirtChestEnlarge: 45,
			shirtWaistEnlarge: 46,
			shirtLowerHemEnlarge: 47,
			longSleeves: [
				{
					color: '长袖颜色',
					cloth: 'ML/-()~1',
					amount: 31
				},
				{
					color: '长袖颜色2',
					cloth: 'ML/-()~12',
					amount: 32
				}
			],
			shortSleeves: [
				{
					color: '短袖颜色',
					cloth: 'ML/-()~2',
					amount: 4,
					subCategory: null
				},
				{
					color: '短袖颜色2',
					cloth: 'ML/-()~2',
					amount: 4,
					subCategory: null
				}
			],
			suitModel: '1',
			suitSpec: '2',
			suitFLength: 3,
			suitSleeveLength: 4,
			suitShoulder: 5,
			suitChest: 6,
			suitMidWaist: 7,
			suitLowerhem: 8,
			suitSleeveCuff: 9,
			suitTrousersModel: '10',
			suitWaist: 11,
			suitHip: 12,
			suitWaistFork: 13,
			suitLateralFork: 14,
			suitTrousersLength: 15,
			suitHemHeight: 16,
			suitWomanWaist: 17,
			suitFork: 18,
			suitMidFork: 19,
			suitSkirtModel: '20',
			suitSkirtWaist: 21,
			suitSkirtHip: 22,
			suitSkirtLength: 23,
			suitFLengthVar: 24,
			suitSleeveLengthVar: 25,
			suitShoulderVar: 26,
			suitChestVar: 27,
			suitMidWaistVar: 28,
			suitLowerhemVar: 29,
			suitSleeveCuffVar: 30,
			suitWaistVar: 31,
			suitHipVar: 32,
			suitWaistForkVar: 33,
			suitLateralForkVar: 34,
			suitTrousersLengthVar: 35,
			suitHemHeightVar: 36,
			suitWomanWaistVar: 37,
			suitForkVar: 38,
			suitMidForkVar: 39,
			suitSkirtWaistVar: 40,
			suitSkirtHipVar: 41,
			suitSkirtLengthVar: 42,
			suitMemo: 'suitMemo',
			suitIsEnabled: true,
			suits:[
				{
					color: '黑色',
					cloth: 'Cloth01',
					amount: 342,
					subCategory:'修身西装',
					price: 102
				},
				{
					color: '白色',
					cloth: 'Cloth02',
					amount: 44,
					subCategory:'宽松西装',
					price: 26
				}
			],

			coatModel: '1',
			coatSpec: '2',
			coatFLength: 3,
			coatSleeveLength: 4,
			coatShoulder: 5,
			coatChest: 6,
			coatMidWaist: 7,
			coatLowerhem: 8,
			coatFLengthVar: 9,
			coatSleeveLengthVar: 10,
			coatShoulderVar: 11,
			coatChestVar: 12,
			coatMidWaistVar: 13,
			coatLowerhemVar: 14,
			coatMemo: 'coatMemo',
			coatIsEnabled: true,
			coats:[
				{
					color: '黑色',
					cloth: 'Cloth01',
					amount: 342,
					subCategory:'大衣',
					price: 102,
				},
				{
					color: '白色',
					cloth: 'Cloth02',
					amount: 44,
					subCategory:'羊毛大衣',
					price: 26
				}
			],

			waistcoatModel: '1',
			waistcoatSpec: '2',
			waistcoatFLength: 3,
			waistcoatBLength: 4,
			waistcoatShoulder: 5,
			waistcoatChest: 6,
			waistcoatMidWaist: 7,
			waistcoatLowerhem: 8,
			waistcoatFLengthVar: 9,
			waistcoatBLengthVar: 10,
			waistcoatShoulderVar: 11,
			waistcoatChestVar: 12,
			waistcoatMidWaistVar: 13,
			waistcoatLowerhemVar: 14,
			waistcoatMemo: 'waistcoatMemo',
			waistcoatIsEnabled: true,
			waistcoats:[
				{
					color: '黑色',
					cloth: 'Cloth01',
					amount: 342,
					subCategory:'背心',
					price: 102
				},
				{
					color: '白色',
					cloth: 'Cloth02',
					amount: 44,
					subCategory:'羊毛背心',
					price: 26
				}
			],
			
			accessoryIsEnabled: true,
			accessories: [
				{
					color: '黑色',
					cloth: 'Cloth01',
					amount: 2,
					subCategory:'皮带',
					price: 100,
					sizeName: 'S',
				},
				{
					color: '红色',
					cloth: 'Cloth02',
					amount: 35,
					subCategory:'帽子',
					price: 39,
					sizeName: 'M',
				}
			],
		});
	}

	deleteOrders(ids): Observable<boolean> {
		return of(true);
	}

	updateOrderDetailsBatch(orders): Observable<null> {
		return of(null);
	}

	createOrder(order: OrderDTO): Observable<number> {
		return of(1);
	}

	updateOrder(order: OrderDTO): Observable<boolean> {
		return of(true);
	}
}
