import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormArray, ValidatorFn, ValidationErrors, FormControl } from '@angular/forms';
import { BasePage } from '../base-page';
import { pattern, required, number, range, oneIsRequired, requiredColorCloth } from 'src/app/services/form-validators';
import { OrderService } from 'src/app/services/order.service';
import { DialogService } from 'src/app/services/dialog.service';
import { FieldService } from 'src/app/services/field.service';
import { OrderDTO } from 'src/rest';

@Component({
	selector: 'order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BasePage implements OnInit {
	private _orderId?: number;
	//each new category should add specific fields in _clearFields and ngOnInit and save
	private _clearFields = [
		{
			category: this.field.F_SHIRT,
			fields: [
				this.field.F_NECK,
				this.field.F_SHOULDER,
				this.field.F_FLENGTH,
				this.field.F_BLENGTH,
				this.field.F_CHEST,
				this.field.F_WAIST,
				this.field.F_LOWERHEM,
				this.field.F_LSLEEVELENGTH,
				this.field.F_LSLEEVECUFF,
				this.field.F_SSLEEVELENGTH,
				this.field.F_SSLEEVECUFF,
				this.field.F_CHESTENLARGE,
				this.field.F_WAISTENLARGE,
				this.field.F_LOWERHEMENLARGE
			],
			enlargeFields: [
				this.field.F_CHESTENLARGE,
				this.field.F_WAISTENLARGE,
				this.field.F_LOWERHEMENLARGE
			],
			sizeNames: [
				this.field.F_SIZENAME
			],
			others: [
				{
					name: this.field.F_PRESIZE,
					value: 'B'
				},
				this.field.F_LPRICE,
				this.field.F_SPRICE,
				this.field.F_MEMO
			]
		},
		{
			category: this.field.F_SUIT,
			fields: {
				suit: [
					this.field.F_FLENGTH,
					this.field.F_SLEEVE_LENGTH,
					this.field.F_SHOULDER,
					this.field.F_CHEST,
					this.field.F_MID_WAIST,
					this.field.F_LOWERHEM,
					this.field.F_SLEEVE_CUFF,
				],
				trousers: [
					this.field.F_WAIST,
					this.field.F_HIP,
					this.field.F_WAIST_FORK,
					this.field.F_LATERAL_FORK,
					this.field.F_TROUSERS_LENGTH,
					this.field.F_HEM_HEIGHT,
					this.field.F_WOMAN_WAIST,
					this.field.F_FORK,
					this.field.F_MID_FORK,
				],
				skirt: [
					this.field.F_SKIRT_WAIST,
					this.field.F_SKIRT_HIP,
					this.field.F_SKIRT_LENGTH
				]
			},
			sizeNames: {
				suit: [
					this.field.F_MODEL,
					this.field.F_SPEC,
				],
				trousers: [
					this.field.F_TROUSERS_MODEL,
				],
				skirt: [
					this.field.F_SKIRT_MODEL
				]
			}
		},
		{
			category: this.field.F_COAT,
			fields: [
				this.field.F_FLENGTH,
				this.field.F_SLEEVE_LENGTH,
				this.field.F_SHOULDER,
				this.field.F_CHEST,
				this.field.F_MID_WAIST,
				this.field.F_LOWERHEM
			],
			sizeNames: [
				this.field.F_MODEL,
				this.field.F_SPEC
			]
		},
		{
			category: this.field.F_WAISTCOAT,
			fields: [
				this.field.F_FLENGTH,
				this.field.F_BLENGTH,
				this.field.F_SHOULDER,
				this.field.F_CHEST,
				this.field.F_MID_WAIST,
				this.field.F_LOWERHEM
			],
			sizeNames: [
				this.field.F_MODEL,
				this.field.F_SPEC
			]
		}
	];

	constructor(private _activatedRoute: ActivatedRoute,
		private _fb: FormBuilder,
		private _orderService: OrderService,
		private _dialogService: DialogService,
		public field: FieldService) {
		super();
	}

	clearAll() {
		this._clearFields.forEach(cate => {
			if (Array.isArray(cate.sizeNames)) {
				cate.sizeNames.forEach(field => this.setFormControlValue([cate.category, field], ''));
			} else {
				Object.keys(cate.sizeNames).forEach(p => {
					cate.sizeNames[p].forEach(field => this.setFormControlValue([cate.category, field], ''));
				});
			}

			if (Array.isArray(cate.fields)) {
				cate.fields.forEach(field => this.setFormControlValue([cate.category, field], ''));
			} else {
				Object.keys(cate.fields).forEach(p => {
					cate.fields[p].forEach(field => this.setFormControlValue([cate.category, field], ''));
				});
			}

			if (cate.enlargeFields) {
				cate.enlargeFields.forEach(field => this.setFormControlValue([cate.category, field], this.getFormControlValue<string>(this.field.F_SEX) === 'M' ? '15' : '10'));
			}
		});
	};

	clearSize(categoryName: string, part?: string) {
		const category = this._clearFields.find(v => v.category === categoryName);
		let sizeNames = category.sizeNames;
		if (part) {
			sizeNames = category.sizeNames[part];
		}
		(<Array<string>>sizeNames).forEach(field => {
			this.setFormControlValue([categoryName, field], '');
		});

		if (category.enlargeFields) {
			category.enlargeFields.forEach(field => {
				if (!this.getFormControlValue<string>([categoryName, field])) {
					this.setFormControlValue([categoryName, field], this.getFormControlValue<string>(this.field.F_SEX) === 'M' ? '15' : '10');
				}
			});
		}
	}

	clearFields(category: string, part?: string) {
		let fields = this._clearFields.find(v => v.category === category).fields;
		if (part) {
			fields = fields[part];
		}
		(<Array<string>>fields).forEach(field => this.setFormControlValue([category, field], ''))
	};

	save() {
		let order: OrderDTO = {
			orderId: this._orderId,
			group: this.getFormControlValue(this.field.F_GROUP),
			company: this.getFormControlValue(this.field.F_COMPANY),
			department: this.getFormControlValue(this.field.F_DEPARTMENT),
			job: this.getFormControlValue(this.field.F_JOB),
			employeeCode: this.getFormControlValue(this.field.F_EMPLOYEE_CODE),
			name: this.getFormControlValue(this.field.F_NAME),
			age: this.getFormControlValue(this.field.F_AGE),
			sex: this.getFormControlValue(this.field.F_SEX),
			height: this.getFormControlValue(this.field.F_HEIGHT),
			weight: this.getFormControlValue(this.field.F_WEIGHT),
			//shirt
			shirtSizeName: this.getFormControlValue([this.field.F_SHIRT,this.field.F_SIZENAME]),
			shirtNeck: this.getFormControlValue([this.field.F_SHIRT,this.field.F_NECK]),
			shirtShoulder: this.getFormControlValue([this.field.F_SHIRT,this.field.F_SHOULDER]),
			shirtChest: this.getFormControlValue([this.field.F_SHIRT,this.field.F_CHEST]),
			shirtFLength: this.getFormControlValue([this.field.F_SHIRT,this.field.F_FLENGTH]),
			shirtBLength: this.getFormControlValue([this.field.F_SHIRT,this.field.F_BLENGTH]),
			shirtWaist: this.getFormControlValue([this.field.F_SHIRT,this.field.F_WAIST]),
			shirtLowerHem: this.getFormControlValue([this.field.F_SHIRT,this.field.F_LOWERHEM]),
			shirtLSleeveLength: this.getFormControlValue([this.field.F_SHIRT,this.field.F_LSLEEVELENGTH]),
			shirtLSleeveCuff: this.getFormControlValue([this.field.F_SHIRT,this.field.F_LSLEEVECUFF]),
			shirtLPrice: this.getFormControlValue([this.field.F_SHIRT,this.field.F_LPRICE]),
			shirtSSleeveLength: this.getFormControlValue([this.field.F_SHIRT,this.field.F_SSLEEVELENGTH]),
			shirtSSleeveCuff: this.getFormControlValue([this.field.F_SHIRT,this.field.F_SSLEEVECUFF]),
			shirtSPrice: this.getFormControlValue([this.field.F_SHIRT,this.field.F_SPRICE]),
			shirtChestEnlarge: this.getFormControlValue([this.field.F_SHIRT,this.field.F_CHESTENLARGE]),
			shirtWaistEnlarge: this.getFormControlValue([this.field.F_SHIRT,this.field.F_WAISTENLARGE]),
			shirtLowerHemEnlarge: this.getFormControlValue([this.field.F_SHIRT,this.field.F_LOWERHEMENLARGE]),
			shirtMemo: this.getFormControlValue([this.field.F_SHIRT,this.field.F_MEMO]),
			shirtPreSize: this.getFormControlValue([this.field.F_SHIRT,this.field.F_PRESIZE]),
			longSleeveIsEnabled: this.getFormControlValue([this.field.F_SHIRT,this.field.F_L_SLEEVE_IS_ENABLED]),
			shortSleeveIsEnabled: this.getFormControlValue([this.field.F_SHIRT,this.field.F_S_SLEEVE_IS_ENABLED]),
			longSleeves: this.getFormControlValue([this.field.F_SHIRT,this.field.F_LONG_SLEEVES]), 
			shortSleeves: this.getFormControlValue([this.field.F_SHIRT, this.field.F_SHORT_SLEEVES]),
			//suit
			suitModel: this.getFormControlValue([this.field.F_SUIT,this.field.F_MODEL]),
			suitSpec: this.getFormControlValue([this.field.F_SUIT,this.field.F_SPEC]),
			suitFLength: this.getFormControlValue([this.field.F_SUIT,this.field.F_FLENGTH]),
			suitSleeveLength: this.getFormControlValue([this.field.F_SUIT,this.field.F_SLEEVE_LENGTH]),
			suitShoulder: this.getFormControlValue([this.field.F_SUIT,this.field.F_SHOULDER]),
			suitChest: this.getFormControlValue([this.field.F_SUIT,this.field.F_CHEST]),
			suitMidWaist: this.getFormControlValue([this.field.F_SUIT,this.field.F_MID_WAIST]),
			suitLowerhem: this.getFormControlValue([this.field.F_SUIT,this.field.F_LOWERHEM]),
			suitSleeveCuff: this.getFormControlValue([this.field.F_SUIT,this.field.F_SLEEVE_CUFF]),
			suitTrousersModel: this.getFormControlValue([this.field.F_SUIT,this.field.F_TROUSERS_MODEL]),
			suitWaist: this.getFormControlValue([this.field.F_SUIT,this.field.F_WAIST]),
			suitHip: this.getFormControlValue([this.field.F_SUIT,this.field.F_HIP]),
			suitWaistFork: this.getFormControlValue([this.field.F_SUIT,this.field.F_WAIST_FORK]),
			suitLateralFork: this.getFormControlValue([this.field.F_SUIT,this.field.F_LATERAL_FORK]),
			suitTrousersLength: this.getFormControlValue([this.field.F_SUIT,this.field.F_TROUSERS_LENGTH]),
			suitHemHeight: this.getFormControlValue([this.field.F_SUIT,this.field.F_HEM_HEIGHT]),
			suitWomanWaist: this.getFormControlValue([this.field.F_SUIT,this.field.F_WOMAN_WAIST]),
			suitFork: this.getFormControlValue([this.field.F_SUIT,this.field.F_FORK]),
			suitMidFork: this.getFormControlValue([this.field.F_SUIT,this.field.F_MID_FORK]),
			suitSkirtModel: this.getFormControlValue([this.field.F_SUIT,this.field.F_SKIRT_MODEL]),
			suitSkirtWaist: this.getFormControlValue([this.field.F_SUIT,this.field.F_SKIRT_WAIST]),
			suitSkirtHip: this.getFormControlValue([this.field.F_SUIT,this.field.F_SKIRT_HIP]),
			suitSkirtLength: this.getFormControlValue([this.field.F_SUIT,this.field.F_SKIRT_LENGTH]),
			suitFLengthVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_FLENGTH_VAR]),
			suitSleeveLengthVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_SLEEVE_LENGTH_VAR]),
			suitShoulderVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_SHOULDER_VAR]),
			suitChestVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_CHEST_VAR]),
			suitMidWaistVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_MID_WAIST_VAR]),
			suitLowerhemVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_LOWERHEM_VAR]),
			suitSleeveCuffVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_SLEEVE_CUFF_VAR]),
			suitWaistVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_WAIST_VAR]),
			suitWaistForkVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_WAIST_FORK_VAR]),
			suitHipVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_HIP_VAR]),
			suitLateralForkVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_LATERAL_FORK_VAR]),
			suitTrousersLengthVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_TROUSERS_LENGTH_VAR]),
			suitHemHeightVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_HEM_HEIGHT_VAR]),
			suitWomanWaistVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_WOMAN_WAIST_VAR]),
			suitForkVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_FORK_VAR]),
			suitMidForkVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_MID_FORK_VAR]),
			suitSkirtWaistVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_SKIRT_WAIST_VAR]),
			suitSkirtHipVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_SKIRT_HIP_VAR]),
			suitSkirtLengthVar: this.getFormControlValue([this.field.F_SUIT,this.field.F_SKIRT_LENGTH_VAR]),
			suitMemo: this.getFormControlValue([this.field.F_SUIT,this.field.F_MEMO]),
			suitIsEnabled: this.getFormControlValue([this.field.F_SUIT,this.field.F_ISENABLED]),
			suits: this.getFormControlValue([this.field.F_SUIT, this.field.F_DETAILS]),
			//coat
			coatModel: this.getFormControlValue([this.field.F_COAT,this.field.F_MODEL]),
			coatSpec: this.getFormControlValue([this.field.F_COAT,this.field.F_SPEC]),
			coatFLength: this.getFormControlValue([this.field.F_COAT,this.field.F_FLENGTH]),
			coatSleeveLength: this.getFormControlValue([this.field.F_COAT,this.field.F_SLEEVE_LENGTH]),
			coatShoulder: this.getFormControlValue([this.field.F_COAT,this.field.F_SHOULDER]),
			coatChest: this.getFormControlValue([this.field.F_COAT,this.field.F_CHEST]),
			coatMidWaist: this.getFormControlValue([this.field.F_COAT,this.field.F_MID_WAIST]),
			coatLowerhem: this.getFormControlValue([this.field.F_COAT,this.field.F_LOWERHEM]),
			coatFLengthVar: this.getFormControlValue([this.field.F_COAT,this.field.F_FLENGTH_VAR]),
			coatSleeveLengthVar: this.getFormControlValue([this.field.F_COAT,this.field.F_SLEEVE_LENGTH_VAR]),
			coatShoulderVar: this.getFormControlValue([this.field.F_COAT,this.field.F_SHOULDER_VAR]),
			coatChestVar: this.getFormControlValue([this.field.F_COAT,this.field.F_CHEST_VAR]),
			coatMidWaistVar: this.getFormControlValue([this.field.F_COAT,this.field.F_MID_WAIST_VAR]),
			coatLowerhemVar: this.getFormControlValue([this.field.F_COAT,this.field.F_LOWERHEM_VAR]),
			coatMemo: this.getFormControlValue([this.field.F_COAT,this.field.F_MEMO]),
			coatIsEnabled: this.getFormControlValue([this.field.F_COAT,this.field.F_ISENABLED]),
			coats: this.getFormControlValue([this.field.F_COAT, this.field.F_DETAILS]),
			//waistcoat
			waistcoatModel: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_MODEL]),
			waistcoatSpec: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_SPEC]),
			waistcoatFLength: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_FLENGTH]),
			waistcoatBLength: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_BLENGTH]),
			waistcoatShoulder: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_SHOULDER]),
			waistcoatChest: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_CHEST]),
			waistcoatMidWaist: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_MID_WAIST]),
			waistcoatLowerhem: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_LOWERHEM]),
			waistcoatFLengthVar: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_FLENGTH_VAR]),
			waistcoatBLengthVar: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_BLENGTH_VAR]),
			waistcoatShoulderVar: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_SHOULDER_VAR]),
			waistcoatChestVar: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_CHEST_VAR]),
			waistcoatMidWaistVar: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_MID_WAIST_VAR]),
			waistcoatLowerhemVar: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_LOWERHEM_VAR]),
			waistcoatMemo: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_MEMO]),
			waistcoatIsEnabled: this.getFormControlValue([this.field.F_WAISTCOAT,this.field.F_ISENABLED]),
			waistcoats: this.getFormControlValue([this.field.F_WAISTCOAT, this.field.F_DETAILS]),
			//accessory
			accessoryIsEnabled: this.getFormControlValue([this.field.F_ACCESSORY,this.field.F_ISENABLED]),
			accessories: this.getFormControlValue([this.field.F_ACCESSORY, this.field.F_DETAILS]),
		};

		if (this._orderId === null) {
			this._orderService.createOrder(order).subscribe(resp => {
				this._dialogService.showMention('创建订单成功，可继续创建订单', 1);
				this.setFormControlValue(this.field.F_EMPLOYEE_CODE, '');
				this.setFormControlValue(this.field.F_NAME, '');
				this.setFormControlValue(this.field.F_AGE, '');
				this.setFormControlValue(this.field.F_HEIGHT, '');
				this.setFormControlValue(this.field.F_WEIGHT, '');

				this._clearFields.forEach(cate => {
					if (Array.isArray(cate.fields)) {
						cate.fields.forEach(field => this.setFormControlValue([cate.category, field], ''));
					} else {
						Object.keys(cate.fields).forEach(p => {
							cate.fields[p].forEach(field => this.setFormControlValue([cate.category, field], ''));
						});
					}

					if (Array.isArray(cate.sizeNames)) {
						cate.sizeNames.forEach(field => this.setFormControlValue([cate.category, field], ''));
					} else {
						Object.keys(cate.sizeNames).forEach(p => {
							cate.sizeNames[p].forEach(field => this.setFormControlValue([cate.category, field], ''));
						});
					}

					if (cate.enlargeFields) {
						cate.enlargeFields.forEach(field => this.setFormControlValue([cate.category, field], this.getFormControlValue<string>(this.field.F_SEX) === 'M' ? '15' : '10'));
					}
					if (cate.others) {
						cate.others.forEach(field => {
							if (typeof field === 'string') {
								this.setFormControlValue([cate.category, field], '');
							} else {
								this.setFormControlValue([cate.category, field.name], field.value);
							}
						});
					}
				});
			});
		}
		else {
			this._orderService.updateOrder(order).subscribe(resp => {
				if (opener && opener.refreshOrders) {
					opener.refreshOrders();
				}
				window.close();
			});
		}
	};

	addDetail(formArray, color, cloth, amount, subCategory, price, sizeName?) {
		formArray.push(this._fb.group({
			color: [color, [pattern(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, this.field.COLOR + '只能包含字母，数字和中文')]],
			cloth: [cloth, [pattern(/^[a-zA-Z0-9/\-()~$]+$/, this.field.CLOTH + '只能包含字母,数字和/-()~')]],
			amount: [amount, [number(0, this.field.AMOUNT)]],
			price: [price, [number(2, this.field.PRICE), range(1, 9999999.99, this.field.PRICE)]],
			subCategory: [subCategory, [pattern(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, this.field.SUB_CATEGORY + '只能包含字母，数字和中文')]],
			sizeName: [sizeName]
		}));
	};

	addShirtDetail(isLongSleeve, color, cloth, amount) {
		const formControlName = [this.field.F_SHIRT, isLongSleeve ? this.field.F_LONG_SLEEVES : this.field.F_SHORT_SLEEVES];
		this.getFormArray(formControlName).push(this._fb.group({
			color: [color, [pattern(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, this.field.COLOR + '只能包含字母，数字和中文')]],
			cloth: [cloth, [pattern(/^[a-zA-Z0-9/\-()~$]+$/, this.field.CLOTH + '只能包含字母,数字和/-()~')]],
			amount: [amount, [required(false, this.field.AMOUNT), number(0, this.field.AMOUNT)]],
			subCategory: [isLongSleeve ? this.field.L_SLEEVE : this.field.S_SLEEVE]
		}));
	};

	isShowDelete(isLongSleeve) {
		const formControlName = [this.field.F_SHIRT, isLongSleeve ? this.field.F_LONG_SLEEVES : this.field.F_SHORT_SLEEVES];
		return (<FormArray>this.form.get(formControlName)).length > 1;
	};

	deleteDetail(formArray: FormArray, index: number) {
		formArray.removeAt(index);
	};

	ngOnInit() {
		this._orderId = /^\d+$/.test(this._activatedRoute.snapshot.params['orderId']) ? this._activatedRoute.snapshot.params['orderId'] : null;
		this.form = this._fb.group({
			[this.field.F_GROUP]: ['', [required(false, this.field.GROUP), pattern(/^[^\\/:*?"<>|]+$/, this.field.GROUP + '不能包含\\/:*?"<>|')]],
			[this.field.F_COMPANY]: ['', [required(false, this.field.COMPANY), pattern(/^[^\\/:*?"<>|]+$/, this.field.COMPANY + '不能包含\\/:*?"<>|')]],
			[this.field.F_DEPARTMENT]: ['', [required(false, this.field.DEPARTMENT)]],
			[this.field.F_JOB]: [''],
			[this.field.F_EMPLOYEE_CODE]: ['', [pattern(/^[a-zA-Z0-9]+$/, this.field.EMPLOYEE_CODE + '只能包含字母和数字')]],
			[this.field.F_NAME]: ['', [required(false, this.field.NAME)]],
			[this.field.F_AGE]: ['', [number(0, this.field.AGE), range(1, 150, this.field.AGE)]],
			[this.field.F_SEX]: ['M'],
			[this.field.F_HEIGHT]: ['', [number(1, this.field.HEIGHT), range(1, 999.9, this.field.HEIGHT)]],
			[this.field.F_WEIGHT]: ['', [number(1, this.field.WEIGHT), range(1, 999.9, this.field.WEIGHT)]],
			//shirt
			[this.field.F_SHIRT]: this._fb.group({
				[this.field.F_SIZENAME]: [''],
				[this.field.F_NECK]: ['', [number(1, this.field.NECK), range(1, 999.9, this.field.NECK)]],
				[this.field.F_SHOULDER]: ['', [number(1, this.field.SHOULDER), range(1, 999.9, this.field.SHOULDER)]],
				[this.field.F_CHEST]: ['', [number(0, this.field.CHEST), range(1, 999, this.field.CHEST)]],
				[this.field.F_FLENGTH]: ['', [number(1, this.field.F_LENGTH), range(1, 999.9, this.field.F_LENGTH)]],
				[this.field.F_BLENGTH]: ['', [number(1, this.field.B_LENGTH), range(1, 999.9, this.field.B_LENGTH)]],
				[this.field.F_WAIST]: ['', [number(1, this.field.WAIST), range(1, 999.9, this.field.WAIST)]],
				[this.field.F_LOWERHEM]: ['', [number(1, this.field.LOWER_HEM), range(1, 999.9, this.field.LOWER_HEM)]],
				[this.field.F_LSLEEVELENGTH]: ['', [number(1, this.field.L_SLEEVE_LENGTH), range(1, 999.9, this.field.L_SLEEVE_LENGTH)]],
				[this.field.F_LSLEEVECUFF]: ['', [number(1, this.field.L_SLEEVE_CUFF), range(1, 999.9, this.field.L_SLEEVE_CUFF)]],
				[this.field.F_LPRICE]: ['', [number(2, this.field.L_PRICE), range(1, 9999999.99, this.field.L_PRICE)]],
				[this.field.F_SSLEEVELENGTH]: ['', [number(1, this.field.S_SLEEVE_LENGTH), range(1, 999.9, this.field.S_SLEEVE_LENGTH)]],
				[this.field.F_SSLEEVECUFF]: ['', [number(1, this.field.S_SLEEVE_CUFF), range(1, 999.9, this.field.S_SLEEVE_CUFF)]],
				[this.field.F_SPRICE]: ['', [number(2, this.field.S_PRICE), range(1, 9999999.99, this.field.S_PRICE)]],
				[this.field.F_CHESTENLARGE]: ['15', [number(0, this.field.CHEST_ENLARGE), range(0, 50, this.field.CHEST_ENLARGE)]],
				[this.field.F_WAISTENLARGE]: ['15', [number(0, this.field.WAIST_ENLARGE), range(0, 50, this.field.WAIST_ENLARGE)]],
				[this.field.F_LOWERHEMENLARGE]: ['15', [number(0, this.field.LOWER_HEM_ENLARGE), range(0, 50, this.field.LOWER_HEM_ENLARGE)]],
				[this.field.F_MEMO]: [''],
				[this.field.F_PRESIZE]: ['B'],
				[this.field.F_L_SLEEVE_IS_ENABLED]: [true],
				[this.field.F_S_SLEEVE_IS_ENABLED]: [false],
				[this.field.F_LONG_SLEEVES]: this._fb.array([], [requiredColorCloth(this.field.COLOR, this.field.CLOTH)]),
				[this.field.F_SHORT_SLEEVES]: this._fb.array([], [requiredColorCloth(this.field.COLOR, this.field.CLOTH)]),
			}, {
				validators: [
					this._requiredIfNoSize(this.field.F_SHIRT, this.field.F_NECK, [this.field.F_SIZENAME], this.field.NECK),
					this._requiredIfNoSize(this.field.F_SHIRT, this.field.F_SHOULDER, [this.field.F_SIZENAME], this.field.SHOULDER),
					this._requiredIfNoSize(this.field.F_SHIRT, this.field.F_CHEST, [this.field.F_SIZENAME], this.field.CHEST),
					this._requiredSleeveIfNoSize(true),
					this._requiredSleeveIfNoSize(false),
					oneIsRequired([this.field.F_L_SLEEVE_IS_ENABLED, this.field.F_S_SLEEVE_IS_ENABLED], [this.field.L_SLEEVE, this.field.S_SLEEVE]),
					this._oneIsRequiredIfNoSize(),
				]
			}),
			//suit
			[this.field.F_SUIT]: this._fb.group({
				[this.field.F_MODEL]: [''],
				[this.field.F_SPEC]: [''],
				[this.field.F_FLENGTH]: ['', [number(1, this.field.F_LENGTH), range(1, 999.9, this.field.F_LENGTH)]],
				[this.field.F_SLEEVE_LENGTH]: ['', [number(1, this.field.SLEEVE_LENGTH), range(1, 999.9, this.field.SLEEVE_LENGTH)]],
				[this.field.F_SHOULDER]: ['', [number(1, this.field.SHOULDER), range(1, 999.9, this.field.SHOULDER)]],
				[this.field.F_CHEST]: ['', [number(1, this.field.CHEST), range(1, 999.9, this.field.CHEST)]],
				[this.field.F_MID_WAIST]: ['', [number(1, this.field.MID_WAIST), range(1, 999.9, this.field.MID_WAIST)]],
				[this.field.F_LOWERHEM]: ['', [number(1, this.field.LOWER_HEM), range(1, 999.9, this.field.LOWER_HEM)]],
				[this.field.F_SLEEVE_CUFF]: ['', [number(1, this.field.SLEEVE_CUFF), range(1, 999.9, this.field.SLEEVE_CUFF)]],
				[this.field.F_TROUSERS_MODEL]: [''],
				[this.field.F_WAIST]: ['', [number(1, this.field.WAIST), range(1, 999.9, this.field.WAIST)]],
				[this.field.F_HIP]: ['', [number(1, this.field.HIP), range(1, 999.9, this.field.HIP)]],
				[this.field.F_WAIST_FORK]: ['', [number(1, this.field.WAIST_FORK), range(1, 999.9, this.field.WAIST_FORK)]],
				[this.field.F_LATERAL_FORK]: ['', [number(1, this.field.LATERAL_FORK), range(1, 999.9, this.field.LATERAL_FORK)]],
				[this.field.F_TROUSERS_LENGTH]: ['', [number(1, this.field.TROUSERS_LENGTH), range(1, 999.9, this.field.TROUSERS_LENGTH)]],
				[this.field.F_HEM_HEIGHT]: ['', [number(1, this.field.HEM_HEIGHT), range(1, 999.9, this.field.HEM_HEIGHT)]],
				[this.field.F_WOMAN_WAIST]: ['', [number(1, this.field.WOMAN_WAIST), range(1, 999.9, this.field.WOMAN_WAIST)]],
				[this.field.F_FORK]: ['', [number(1, this.field.FORK), range(1, 999.9, this.field.FORK)]],
				[this.field.F_MID_FORK]: ['', [number(1, this.field.MID_FORK), range(1, 999.9, this.field.MID_FORK)]],
				[this.field.F_SKIRT_MODEL]: [''],
				[this.field.F_SKIRT_WAIST]: ['', [number(1, this.field.SKIRT_WAIST), range(1, 999.9, this.field.SKIRT_WAIST)]],
				[this.field.F_SKIRT_HIP]: ['', [number(1, this.field.SKIRT_HIP), range(1, 999.9, this.field.SKIRT_HIP)]],
				[this.field.F_SKIRT_LENGTH]: ['', [number(1, this.field.SKIRT_LENGTH), range(1, 999.9, this.field.SKIRT_LENGTH)]],
				[this.field.F_FLENGTH_VAR]: ['', [number(1, this.field.FLENGTH_VAR, true), range(-99.9, 99.9, this.field.FLENGTH_VAR)]],
				[this.field.F_SLEEVE_LENGTH_VAR]: ['', [number(1, this.field.SLEEVE_LENGTH_VAR, true), range(-99.9, 99.9, this.field.SLEEVE_LENGTH_VAR)]],
				[this.field.F_SHOULDER_VAR]: ['', [number(1, this.field.SHOULDER_VAR, true), range(-99.9, 99.9, this.field.SHOULDER_VAR)]],
				[this.field.F_CHEST_VAR]: ['', [number(1, this.field.CHEST_VAR, true), range(-99.9, 99.9, this.field.CHEST_VAR)]],
				[this.field.F_MID_WAIST_VAR]: ['', [number(1, this.field.MID_WAIST_VAR, true), range(-99.9, 99.9, this.field.MID_WAIST_VAR)]],
				[this.field.F_LOWERHEM_VAR]: ['', [number(1, this.field.LOWERHEM_VAR, true), range(-99.9, 99.9, this.field.LOWERHEM_VAR)]],
				[this.field.F_SLEEVE_CUFF_VAR]: ['', [number(1, this.field.SLEEVE_CUFF_VAR, true), range(-99.9, 99.9, this.field.SLEEVE_CUFF_VAR)]],
				[this.field.F_WAIST_VAR]: ['', [number(1, this.field.WAIST_VAR, true), range(-99.9, 99.9, this.field.WAIST_VAR)]],
				[this.field.F_WAIST_FORK_VAR]: ['', [number(1, this.field.WAIST_FORK_VAR, true), range(-99.9, 99.9, this.field.WAIST_FORK_VAR)]],
				[this.field.F_HIP_VAR]: ['', [number(1, this.field.HIP_VAR, true), range(-99.9, 99.9, this.field.HIP_VAR)]],
				[this.field.F_LATERAL_FORK_VAR]: ['', [number(1, this.field.LATERAL_FORK_VAR, true), range(-99.9, 99.9, this.field.LATERAL_FORK_VAR)]],
				[this.field.F_TROUSERS_LENGTH_VAR]: ['', [number(1, this.field.TROUSERS_LENGTH_VAR, true), range(-99.9, 99.9, this.field.TROUSERS_LENGTH_VAR)]],
				[this.field.F_HEM_HEIGHT_VAR]: ['', [number(1, this.field.HEM_HEIGHT_VAR, true), range(-99.9, 99.9, this.field.HEM_HEIGHT_VAR)]],
				[this.field.F_WOMAN_WAIST_VAR]: ['', [number(1, this.field.WOMAN_WAIST_VAR, true), range(-99.9, 99.9, this.field.WOMAN_WAIST_VAR)]],
				[this.field.F_FORK_VAR]: ['', [number(1, this.field.FORK_VAR, true), range(-99.9, 99.9, this.field.FORK_VAR)]],
				[this.field.F_MID_FORK_VAR]: ['', [number(1, this.field.MID_FORK_VAR, true), range(-99.9, 99.9, this.field.MID_FORK_VAR)]],
				[this.field.F_SKIRT_WAIST_VAR]: ['', [number(1, this.field.SKIRT_WAIST_VAR, true), range(-99.9, 99.9, this.field.SKIRT_WAIST_VAR)]],
				[this.field.F_SKIRT_HIP_VAR]: ['', [number(1, this.field.SKIRT_HIP_VAR, true), range(-99.9, 99.9, this.field.SKIRT_HIP_VAR)]],
				[this.field.F_SKIRT_LENGTH_VAR]: ['', [number(1, this.field.SKIRT_LENGTH_VAR, true), range(-99.9, 99.9, this.field.SKIRT_LENGTH_VAR)]],
				[this.field.F_MEMO]: [''],
				[this.field.F_ISENABLED]: [false],
				[this.field.F_DETAILS]: this._fb.array([])
			}, {
				validators: [
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_FLENGTH, [this.field.F_MODEL, this.field.F_SPEC], this.field.F_LENGTH, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_SLEEVE_LENGTH, [this.field.F_MODEL, this.field.F_SPEC], this.field.SLEEVE_LENGTH, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_SHOULDER, [this.field.F_MODEL, this.field.F_SPEC], this.field.SHOULDER, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_CHEST, [this.field.F_MODEL, this.field.F_SPEC], this.field.CHEST, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_MID_WAIST, [this.field.F_MODEL, this.field.F_SPEC], this.field.MID_WAIST, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_LOWERHEM, [this.field.F_MODEL, this.field.F_SPEC], this.field.LOWER_HEM, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_SLEEVE_CUFF, [this.field.F_MODEL, this.field.F_SPEC], this.field.SLEEVE_CUFF, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_WAIST, [this.field.F_TROUSERS_MODEL], this.field.WAIST, this.field.F_ISENABLED, 'M'),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_HIP, [this.field.F_TROUSERS_MODEL], this.field.HIP, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_WAIST_FORK, [this.field.F_TROUSERS_MODEL], this.field.WAIST_FORK, this.field.F_ISENABLED, 'M'),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_LATERAL_FORK, [this.field.F_TROUSERS_MODEL], this.field.LATERAL_FORK, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_TROUSERS_LENGTH, [this.field.F_TROUSERS_MODEL], this.field.TROUSERS_LENGTH, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_HEM_HEIGHT, [this.field.F_TROUSERS_MODEL], this.field.HEM_HEIGHT, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_WOMAN_WAIST, [this.field.F_TROUSERS_MODEL], this.field.WOMAN_WAIST, this.field.F_ISENABLED, 'F'),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_FORK, [this.field.F_TROUSERS_MODEL], this.field.FORK, this.field.F_ISENABLED, 'F'),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_MID_FORK, [this.field.F_TROUSERS_MODEL], this.field.MID_FORK, this.field.F_ISENABLED, 'F'),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_SKIRT_WAIST, [this.field.F_SKIRT_MODEL], this.field.SKIRT_WAIST, this.field.F_ISENABLED, 'F'),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_SKIRT_HIP, [this.field.F_SKIRT_MODEL], this.field.SKIRT_HIP, this.field.F_ISENABLED, 'F'),
					this._requiredIfNoSize(this.field.F_SUIT, this.field.F_SKIRT_LENGTH, [this.field.F_SKIRT_MODEL], this.field.SKIRT_LENGTH, this.field.F_ISENABLED, 'F'),
					this._requiredDetails(this.field.F_SUIT, this.field.F_ISENABLED, this.field.F_DETAILS, this.field.SUIT),
					this._requiredAll(this.field.F_SUIT, [this.field.F_MODEL, this.field.F_SPEC], [this.field.MODEL, this.field.SPEC]),
					this._requiredDetailFields(this.field.F_SUIT)
				]
			}),
			[this.field.F_COAT]: this._fb.group({
				[this.field.F_MODEL]: [''],
				[this.field.F_SPEC]: [''],
				[this.field.F_FLENGTH]: ['', [number(1, this.field.F_LENGTH), range(1, 999.9, this.field.F_LENGTH)]],
				[this.field.F_SLEEVE_LENGTH]: ['', [number(1, this.field.SLEEVE_LENGTH), range(1, 999.9, this.field.SLEEVE_LENGTH)]],
				[this.field.F_SHOULDER]: ['', [number(1, this.field.SHOULDER), range(1, 999.9, this.field.SHOULDER)]],
				[this.field.F_CHEST]: ['', [number(1, this.field.CHEST), range(1, 999.9, this.field.CHEST)]],
				[this.field.F_MID_WAIST]: ['', [number(1, this.field.MID_WAIST), range(1, 999.9, this.field.MID_WAIST)]],
				[this.field.F_LOWERHEM]: ['', [number(1, this.field.LOWER_HEM), range(1, 999.9, this.field.LOWER_HEM)]],
				[this.field.F_FLENGTH_VAR]: ['', [number(1, this.field.FLENGTH_VAR, true), range(-99.9, 99.9, this.field.FLENGTH_VAR)]],
				[this.field.F_SLEEVE_LENGTH_VAR]: ['', [number(1, this.field.SLEEVE_LENGTH_VAR, true), range(-99.9, 99.9, this.field.SLEEVE_LENGTH_VAR)]],
				[this.field.F_SHOULDER_VAR]: ['', [number(1, this.field.SHOULDER_VAR, true), range(-99.9, 99.9, this.field.SHOULDER_VAR)]],
				[this.field.F_CHEST_VAR]: ['', [number(1, this.field.CHEST_VAR, true), range(-99.9, 99.9, this.field.CHEST_VAR)]],
				[this.field.F_MID_WAIST_VAR]: ['', [number(1, this.field.MID_WAIST_VAR, true), range(-99.9, 99.9, this.field.MID_WAIST_VAR)]],
				[this.field.F_LOWERHEM_VAR]: ['', [number(1, this.field.LOWERHEM_VAR, true), range(-99.9, 99.9, this.field.LOWERHEM_VAR)]],
				[this.field.F_MEMO]: [''],
				[this.field.F_ISENABLED]: [false],
				[this.field.F_DETAILS]: this._fb.array([])
			}, {
				validators: [
					this._requiredIfNoSize(this.field.F_COAT, this.field.F_FLENGTH, [this.field.F_MODEL, this.field.F_SPEC], this.field.F_LENGTH, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_COAT, this.field.F_SLEEVE_LENGTH, [this.field.F_MODEL, this.field.F_SPEC], this.field.SLEEVE_LENGTH, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_COAT, this.field.F_SHOULDER, [this.field.F_MODEL, this.field.F_SPEC], this.field.SHOULDER, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_COAT, this.field.F_CHEST, [this.field.F_MODEL, this.field.F_SPEC], this.field.CHEST, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_COAT, this.field.F_MID_WAIST, [this.field.F_MODEL, this.field.F_SPEC], this.field.MID_WAIST, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_COAT, this.field.F_LOWERHEM, [this.field.F_MODEL,this.field.F_SPEC], this.field.LOWER_HEM, this.field.F_ISENABLED),
					this._requiredAll(this.field.F_COAT, [this.field.F_MODEL, this.field.F_SPEC], [this.field.MODEL, this.field.SPEC]),
					this._requiredDetails(this.field.F_COAT, this.field.F_ISENABLED, this.field.F_DETAILS, this.field.COAT),
					this._requiredDetailFields(this.field.F_COAT)
				]
			}),
			[this.field.F_WAISTCOAT]: this._fb.group({
				[this.field.F_MODEL]: [''],
				[this.field.F_SPEC]: [''],
				[this.field.F_FLENGTH]: ['', [number(1, this.field.F_LENGTH), range(1, 999.9, this.field.F_LENGTH)]],
				[this.field.F_BLENGTH]: ['', [number(1, this.field.B_LENGTH), range(1, 999.9, this.field.B_LENGTH)]],
				[this.field.F_SHOULDER]: ['', [number(1, this.field.SHOULDER), range(1, 999.9, this.field.SHOULDER)]],
				[this.field.F_CHEST]: ['', [number(1, this.field.CHEST), range(1, 999.9, this.field.CHEST)]],
				[this.field.F_MID_WAIST]: ['', [number(1, this.field.MID_WAIST), range(1, 999.9, this.field.MID_WAIST)]],
				[this.field.F_LOWERHEM]: ['', [number(1, this.field.LOWER_HEM), range(1, 999.9, this.field.LOWER_HEM)]],
				[this.field.F_FLENGTH_VAR]: ['', [number(1, this.field.FLENGTH_VAR, true), range(-99.9, 99.9, this.field.FLENGTH_VAR)]],
				[this.field.F_BLENGTH_VAR]: ['', [number(1, this.field.BLENGTH_VAR, true), range(-99.9, 99.9, this.field.BLENGTH_VAR)]],
				[this.field.F_SHOULDER_VAR]: ['', [number(1, this.field.SHOULDER_VAR, true), range(-99.9, 99.9, this.field.SHOULDER_VAR)]],
				[this.field.F_CHEST_VAR]: ['', [number(1, this.field.CHEST_VAR, true), range(-99.9, 99.9, this.field.CHEST_VAR)]],
				[this.field.F_MID_WAIST_VAR]: ['', [number(1, this.field.MID_WAIST_VAR, true), range(-99.9, 99.9, this.field.MID_WAIST_VAR)]],
				[this.field.F_LOWERHEM_VAR]: ['', [number(1, this.field.LOWERHEM_VAR, true), range(-99.9, 99.9, this.field.LOWERHEM_VAR)]],
				[this.field.F_MEMO]: [''],
				[this.field.F_ISENABLED]: [false],
				[this.field.F_DETAILS]: this._fb.array([])
			}, {
				validators: [
					this._requiredIfNoSize(this.field.F_WAISTCOAT, this.field.F_FLENGTH, [this.field.F_MODEL, this.field.F_SPEC], this.field.F_LENGTH, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_WAISTCOAT, this.field.F_BLENGTH, [this.field.F_MODEL, this.field.F_SPEC], this.field.B_LENGTH, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_WAISTCOAT, this.field.F_SHOULDER, [this.field.F_MODEL, this.field.F_SPEC], this.field.SHOULDER, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_WAISTCOAT, this.field.F_CHEST, [this.field.F_MODEL, this.field.F_SPEC], this.field.CHEST, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_WAISTCOAT, this.field.F_MID_WAIST, [this.field.F_MODEL, this.field.F_SPEC], this.field.MID_WAIST, this.field.F_ISENABLED),
					this._requiredIfNoSize(this.field.F_WAISTCOAT, this.field.F_LOWERHEM, [this.field.F_MODEL, this.field.F_SPEC], this.field.LOWER_HEM, this.field.F_ISENABLED),
					this._requiredAll(this.field.F_WAISTCOAT, [this.field.F_MODEL, this.field.F_SPEC], [this.field.MODEL, this.field.SPEC]),
					this._requiredDetails(this.field.F_WAISTCOAT, this.field.F_ISENABLED, this.field.F_DETAILS, this.field.WAISTCOAT),
					this._requiredDetailFields(this.field.F_WAISTCOAT)
				]
			}),
			//accessory
			[this.field.F_ACCESSORY]: this._fb.group({
				[this.field.F_ISENABLED]: [false],
				[this.field.F_DETAILS]: this._fb.array([])
			}, {
				validators: [
					this._requiredDetails(this.field.F_ACCESSORY, this.field.F_ISENABLED, this.field.F_DETAILS, this.field.ACCESSORY),
					this._requiredDetailFields(this.field.F_ACCESSORY)
				]
			})
		});

		if (this._orderId !== null) {
			this._orderService.getOrder(this._orderId).subscribe(resp => {
				this.form.patchValue({
					[this.field.F_GROUP]: resp.group,
					[this.field.F_COMPANY]: resp.company,
					[this.field.F_DEPARTMENT]: resp.department,
					[this.field.F_JOB]: resp.job,
					[this.field.F_EMPLOYEE_CODE]: resp.employeeCode,
					[this.field.F_NAME]: resp.name,
					[this.field.F_AGE]: resp.age,
					[this.field.F_SEX]: resp.sex,
					[this.field.F_HEIGHT]: resp.height,
					[this.field.F_WEIGHT]: resp.weight,
					//shirt
					[this.field.F_SHIRT]: {
						[this.field.F_SIZENAME]: resp.shirtSizeName,
						[this.field.F_NECK]: resp.shirtNeck,
						[this.field.F_SHOULDER]: resp.shirtShoulder,
						[this.field.F_CHEST]: resp.shirtChest,
						[this.field.F_FLENGTH]: resp.shirtFLength,
						[this.field.F_BLENGTH]: resp.shirtBLength,
						[this.field.F_WAIST]: resp.shirtWaist,
						[this.field.F_LOWERHEM]: resp.shirtLowerHem,
						[this.field.F_LSLEEVELENGTH]: resp.shirtLSleeveLength,
						[this.field.F_LSLEEVECUFF]: resp.shirtLSleeveCuff,
						[this.field.F_LPRICE]: resp.shirtLPrice,
						[this.field.F_SSLEEVELENGTH]: resp.shirtSSleeveLength,
						[this.field.F_SSLEEVECUFF]: resp.shirtSSleeveCuff,
						[this.field.F_SPRICE]: resp.shirtSPrice,
						[this.field.F_CHESTENLARGE]: resp.shirtChestEnlarge,
						[this.field.F_WAISTENLARGE]: resp.shirtWaistEnlarge,
						[this.field.F_LOWERHEMENLARGE]: resp.shirtLowerHemEnlarge,
						[this.field.F_MEMO]: resp.shirtMemo,
						[this.field.F_PRESIZE]: resp.shirtPreSize,
						[this.field.F_L_SLEEVE_IS_ENABLED]: resp.longSleeveIsEnabled,
						[this.field.F_S_SLEEVE_IS_ENABLED]: resp.shortSleeveIsEnabled,
					},
					//suit
					[this.field.F_SUIT]: {
						[this.field.F_MODEL]: resp.suitModel,
						[this.field.F_SPEC]: resp.suitSpec,
						[this.field.F_FLENGTH]: resp.suitFLength,
						[this.field.F_SLEEVE_LENGTH]: resp.suitSleeveLength,
						[this.field.F_SHOULDER]: resp.suitShoulder,
						[this.field.F_CHEST]: resp.suitChest,
						[this.field.F_MID_WAIST]: resp.suitMidWaist,
						[this.field.F_LOWERHEM]: resp.suitLowerhem,
						[this.field.F_SLEEVE_CUFF]: resp.suitSleeveCuff,
						[this.field.F_TROUSERS_MODEL]: resp.suitTrousersModel,
						[this.field.F_WAIST]: resp.suitWaist,
						[this.field.F_HIP]: resp.suitHip,
						[this.field.F_WAIST_FORK]: resp.suitWaistFork,
						[this.field.F_LATERAL_FORK]: resp.suitLateralFork,
						[this.field.F_TROUSERS_LENGTH]: resp.suitTrousersLength,
						[this.field.F_HEM_HEIGHT]: resp.suitHemHeight,
						[this.field.F_WOMAN_WAIST]: resp.suitWomanWaist,
						[this.field.F_FORK]: resp.suitFork,
						[this.field.F_MID_FORK]: resp.suitMidFork,
						[this.field.F_SKIRT_MODEL]: resp.suitSkirtModel,
						[this.field.F_SKIRT_WAIST]: resp.suitSkirtWaist,
						[this.field.F_SKIRT_HIP]: resp.suitSkirtHip,
						[this.field.F_SKIRT_LENGTH]: resp.suitSkirtLength,
						[this.field.F_FLENGTH_VAR]: this._formatVar(resp.suitFLengthVar),
						[this.field.F_SLEEVE_LENGTH_VAR]: this._formatVar(resp.suitSleeveLengthVar),
						[this.field.F_SHOULDER_VAR]: this._formatVar(resp.suitShoulderVar),
						[this.field.F_CHEST_VAR]: this._formatVar(resp.suitChestVar),
						[this.field.F_MID_WAIST_VAR]: this._formatVar(resp.suitMidWaistVar),
						[this.field.F_LOWERHEM_VAR]: this._formatVar(resp.suitLowerhemVar),
						[this.field.F_SLEEVE_CUFF_VAR]: this._formatVar(resp.suitSleeveCuffVar),
						[this.field.F_WAIST_VAR]: this._formatVar(resp.suitWaistVar),
						[this.field.F_WAIST_FORK_VAR]: this._formatVar(resp.suitWaistForkVar),
						[this.field.F_HIP_VAR]: this._formatVar(resp.suitHipVar),
						[this.field.F_LATERAL_FORK_VAR]: this._formatVar(resp.suitLateralForkVar),
						[this.field.F_TROUSERS_LENGTH_VAR]: this._formatVar(resp.suitTrousersLengthVar),
						[this.field.F_HEM_HEIGHT_VAR]: this._formatVar(resp.suitHemHeightVar),
						[this.field.F_WOMAN_WAIST_VAR]: this._formatVar(resp.suitWomanWaistVar),
						[this.field.F_FORK_VAR]: this._formatVar(resp.suitForkVar),
						[this.field.F_MID_FORK_VAR]: this._formatVar(resp.suitMidForkVar),
						[this.field.F_SKIRT_WAIST_VAR]: this._formatVar(resp.suitSkirtWaistVar),
						[this.field.F_SKIRT_HIP_VAR]: this._formatVar(resp.suitSkirtHipVar),
						[this.field.F_SKIRT_LENGTH_VAR]: this._formatVar(resp.suitSkirtLengthVar),
						[this.field.F_MEMO]: resp.suitMemo,
						[this.field.F_ISENABLED]: resp.suitIsEnabled,
					},
					//coat
					[this.field.F_COAT]: {
						[this.field.F_MODEL]: resp.coatModel,
						[this.field.F_SPEC]: resp.coatSpec,
						[this.field.F_FLENGTH]: resp.coatFLength,
						[this.field.F_SLEEVE_LENGTH]: resp.coatSleeveLength,
						[this.field.F_SHOULDER]: resp.coatShoulder,
						[this.field.F_CHEST]: resp.coatChest,
						[this.field.F_MID_WAIST]: resp.coatMidWaist,
						[this.field.F_LOWERHEM]: resp.coatLowerhem,
						[this.field.F_FLENGTH_VAR]: this._formatVar(resp.coatFLengthVar),
						[this.field.F_SLEEVE_LENGTH_VAR]: this._formatVar(resp.coatSleeveLengthVar),
						[this.field.F_SHOULDER_VAR]: this._formatVar(resp.coatShoulderVar),
						[this.field.F_CHEST_VAR]: this._formatVar(resp.coatChestVar),
						[this.field.F_MID_WAIST_VAR]: this._formatVar(resp.coatMidWaistVar),
						[this.field.F_LOWERHEM_VAR]: this._formatVar(resp.coatLowerhemVar),
						[this.field.F_MEMO]: resp.coatMemo,
						[this.field.F_ISENABLED]: resp.coatIsEnabled,
					},
					//waistcoat
					[this.field.F_WAISTCOAT]: {
						[this.field.F_MODEL]: resp.waistcoatModel,
						[this.field.F_SPEC]: resp.waistcoatSpec,
						[this.field.F_FLENGTH]: resp.waistcoatFLength,
						[this.field.F_BLENGTH]: resp.waistcoatBLength,
						[this.field.F_SHOULDER]: resp.waistcoatShoulder,
						[this.field.F_CHEST]: resp.waistcoatChest,
						[this.field.F_MID_WAIST]: resp.waistcoatMidWaist,
						[this.field.F_LOWERHEM]: resp.waistcoatLowerhem,
						[this.field.F_FLENGTH_VAR]: this._formatVar(resp.waistcoatFLengthVar),
						[this.field.F_BLENGTH_VAR]: this._formatVar(resp.waistcoatBLengthVar),
						[this.field.F_SHOULDER_VAR]: this._formatVar(resp.waistcoatShoulderVar),
						[this.field.F_CHEST_VAR]: this._formatVar(resp.waistcoatChestVar),
						[this.field.F_MID_WAIST_VAR]: this._formatVar(resp.waistcoatMidWaistVar),
						[this.field.F_LOWERHEM_VAR]: this._formatVar(resp.waistcoatLowerhemVar),
						[this.field.F_MEMO]: resp.waistcoatMemo,
						[this.field.F_ISENABLED]: resp.waistcoatIsEnabled,
					},
					//accessory
					[this.field.F_ACCESSORY]: {
						[this.field.F_ISENABLED]: resp.accessoryIsEnabled
					}
				});

				resp.longSleeves.forEach(d => {
					this.addShirtDetail(true, d.color, d.cloth, d.amount);
				});
				resp.shortSleeves.forEach(d => {
					this.addShirtDetail(false, d.color, d.cloth, d.amount);
				});
				resp.suits.forEach(d => {
					this.addDetail(this.getFormArray([this.field.F_SUIT, this.field.F_DETAILS]), d.color, d.cloth, d.amount, d.subCategory, d.price);
				});
				resp.coats.forEach(d => {
					this.addDetail(this.getFormArray([this.field.F_COAT, this.field.F_DETAILS]), d.color, d.cloth, d.amount, d.subCategory, d.price);
				});
				resp.waistcoats.forEach(d => {
					this.addDetail(this.getFormArray([this.field.F_WAISTCOAT, this.field.F_DETAILS]), d.color, d.cloth, d.amount, d.subCategory, d.price);
				});
				resp.accessories.forEach(d => {
					this.addDetail(this.getFormArray([this.field.F_ACCESSORY, this.field.F_DETAILS]), d.color, d.cloth, d.amount, d.subCategory, d.price, d.sizeName);
				});
			});
		} else {
			this.addShirtDetail(true, '', '', 1);
			this.addShirtDetail(false, '', '', 1);
		}
	}

	private _formatVar(n: number): string {
		if (n === null)
			return '';
		return n > 0 ? ("+" + n) : n.toString();
	}

	private _requiredDetails(category: string, isEnabled: string, categoryDetails: string, label: string): ValidatorFn {
		return (): ValidationErrors | null => {
			if (this.getFormControlValue<boolean>([category,isEnabled])) {
				const details = this.getFormArray([category, categoryDetails]);
				return details.length > 0 ? null : { 'requiredDetails': '请至少添加一条' + label };
			}
			return null;
		};
	}

	/**
	 * 
	 * if specify isEnabled, only validate required field when isEnabled is true
	 * if not specify isEnabled, always validate
	 * if specify sex, only validate required field when sex equals getFormControlValue(F_SEX)
	 * if not specify sex, always validate
	 */
	private _requiredIfNoSize(caregory: string, formControlName: string, sizeNames: Array<string>, label: string, isEnabled?: string, sex?: string): ValidatorFn {
		return (): ValidationErrors | null => {
			if (!isEnabled || this.getFormControlValue<boolean>([caregory, isEnabled])) {
				if (!sex || sex === this.getFormControlValue<string>(this.field.F_SEX)) {
					if (!sizeNames.find(sizeName => this.getFormControlValue<string>([caregory, sizeName]) ? true : false)) {
						const val = this.getFormControlValue<string>([caregory, formControlName]);
						return (val && val.toString().trim().length > 0) ? null : { ['required' + formControlName]: '请输入' + label };
					}
				}
			}
			return null;
		};
	}

	private _requiredSleeveIfNoSize(isLongSleeve: boolean): ValidatorFn {
		return (): ValidationErrors | null => {
			if (!this.getFormControlValue<string>([this.field.F_SHIRT, this.field.F_SIZENAME]) || this.getFormControlValue<string>([this.field.F_SHIRT, this.field.F_SIZENAME]).trim().length === 0) {
				if (this.getFormControlValue<Boolean>([this.field.F_SHIRT, isLongSleeve ? this.field.F_L_SLEEVE_IS_ENABLED : this.field.F_S_SLEEVE_IS_ENABLED])) {
					const formControlName = [this.field.F_SHIRT, isLongSleeve ? this.field.F_LSLEEVELENGTH : this.field.F_SSLEEVELENGTH];
					const val = this.getFormControlValue<number>(formControlName);
					return (val && val.toString().trim().length > 0) ? null : { ['required' + (isLongSleeve ? this.field.F_LSLEEVELENGTH : this.field.F_SSLEEVELENGTH)]: '请输入' + (isLongSleeve ? this.field.L_SLEEVE_LENGTH : this.field.S_SLEEVE_LENGTH) };
				}
			}
			return null;
		};
	}

	private _oneIsRequiredIfNoSize(): ValidatorFn {
		return (): ValidationErrors | null => {
			if (!this.getFormControlValue<string>([this.field.F_SHIRT, this.field.F_SIZENAME]) || this.getFormControlValue<string>([this.field.F_SHIRT, this.field.F_SIZENAME]).trim().length === 0) {
				if (!this.getFormControlValue<number>([this.field.F_SHIRT, this.field.F_FLENGTH]) || this.getFormControlValue<number>([this.field.F_SHIRT, this.field.F_FLENGTH]).toString().trim().length === 0) {
					if (!this.getFormControlValue<number>([this.field.F_SHIRT, this.field.F_BLENGTH]) || this.getFormControlValue<number>([this.field.F_SHIRT, this.field.F_BLENGTH]).toString().trim().length === 0) {
						return { 'requiredFBLength': '前衣长和后衣长至少填写一个' };
					}
				}
			}
			return null;
		};
	}
	
	private _requiredDetailFields(category: string): ValidatorFn {
		return (): ValidationErrors | null => {
			let result = {};
			const control = this.getFormArray([category, this.field.F_DETAILS]);
			if (control && control.length > 0 && this.getFormControlValue<boolean>([category, this.field.F_ISENABLED])) {
				for (let i = 0; i < control.controls.length; i++) {
					const color = control.controls[i].get(this.field.F_COLOR);
					const cloth = control.controls[i].get(this.field.F_CLOTH);
					const subCategory = control.controls[i].get(this.field.F_SUBCATEGORY);
					const amount = control.controls[i].get(this.field.F_AMOUNT);
					const sizeName = control.controls[i].get(this.field.F_SIZENAME);

					if (!color.value || color.value.trim().length === 0) {
						result['required' + this.field.F_COLOR + i] = '请输入' + this.field.COLOR;
					}

					if (!subCategory.value || subCategory.value.trim().length === 0) {
						result['required' + this.field.F_SUBCATEGORY + i] = '请输入' + this.field.SUB_CATEGORY;
					}
					if (!amount.value || amount.value.toString().trim().length === 0) {
						result['required' + this.field.F_AMOUNT + i] = '请输入' + this.field.AMOUNT;
					}
					if (category === this.field.F_ACCESSORY) {
						if (!sizeName.value || sizeName.value.trim().length === 0) {
							result['required' + this.field.F_SIZENAME + i] = '请输入' + this.field.SIZENAME;
						}
					}
					if (category !== this.field.F_ACCESSORY) {
						if (!cloth.value || cloth.value.trim().length === 0) {
							result['required' + this.field.F_CLOTH + i] = '请输入' + this.field.CLOTH;
						}
					}
				}
			}
			return Object.getOwnPropertyNames(result).length === 0 ? null : result;
		};
	}

	private _requiredAll(category: string, formControlNames: Array<string>, labels: Array<string>): ValidatorFn {
		return (): ValidationErrors | null => {
			if (this.getFormControlValue<boolean>([category, this.field.F_ISENABLED])) {
				let formControlName = formControlNames.find(name =>
					this.getFormControlValue<string>([category, name]) ? true : false
				);
				if (formControlName) {
					const empty = formControlNames.filter(name =>
						this.getFormControlValue<string>([category, name]) ? false : true
					);

					if (empty.length > 0) {
						let reVal = {};
						empty.forEach(v => {
							reVal['required' + v] = '请输入' + labels[formControlNames.indexOf(v)];
						});
						return reVal;
					}
				}
			}
			return null;
		};
	}
}