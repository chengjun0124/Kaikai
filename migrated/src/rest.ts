export interface AuthDTO {
	jwt: string
	userTypeId: number;
}

export interface OrderDTO {
	orderId: number;
	group: string;
	company: string;
	department: string;
	job: string;
	employeeCode: string;
	name: string;
	age?: number;
	sex: string;
	height?: number;
	weight?: number;

	shirtNeck?: number;
	shirtShoulder?: number
	shirtFLength?: number
	shirtBLength?: number
	shirtChest?: number
	shirtWaist?: number
	shirtLowerHem?: number
	shirtLSleeveLength?: number
	shirtLSleeveCuff?: number
	shirtLPrice?: number;
	shirtSSleeveLength?: number;
	shirtSSleeveCuff?: number;
	shirtSPrice?: number;
	shirtPreSize: string;
	shirtMemo: string;
	longSleeveIsEnabled: boolean;
	shortSleeveIsEnabled: boolean;
	shirtSizeName: string;
	shirtChestEnlarge?: number;
	shirtWaistEnlarge?: number;
	shirtLowerHemEnlarge?: number;
	longSleeves: OrderDetailDTO[];
	shortSleeves: OrderDetailDTO[];

	suitModel: string,
	suitSpec: string,
	suitFLength?: number;
	suitSleeveLength?: number;
	suitShoulder?: number;
	suitChest?: number;
	suitMidWaist?: number;
	suitLowerhem?: number;
	suitSleeveCuff?: number;
	suitTrousersModel: string,
	suitWaist?: number;
	suitHip?: number;
	suitWaistFork?: number;
	suitLateralFork?: number;
	suitTrousersLength?: number;
	suitHemHeight?: number;
	suitWomanWaist?: number;
	suitFork?: number;
	suitMidFork?: number;
	suitSkirtModel: string,
	suitSkirtWaist?: number;
	suitSkirtHip?: number;
	suitSkirtLength?: number;
	suitFLengthVar?: number;
	suitSleeveLengthVar?: number;
	suitShoulderVar?: number;
	suitChestVar?: number;
	suitMidWaistVar?: number;
	suitLowerhemVar?: number;
	suitSleeveCuffVar?: number;
	suitWaistVar?: number;
	suitHipVar?: number;
	suitWaistForkVar?: number;
	suitLateralForkVar?: number;
	suitTrousersLengthVar?: number;
	suitHemHeightVar?: number;
	suitWomanWaistVar?: number;
	suitForkVar?: number;
	suitMidForkVar?: number;
	suitSkirtWaistVar?: number;
	suitSkirtHipVar?: number;
	suitSkirtLengthVar?: number;
	suitMemo: string,
	suitIsEnabled: boolean;
	suits: OrderDetailDTO[];

	coatModel: string,
	coatSpec: string,
	coatFLength?: number;
	coatSleeveLength?: number;
	coatShoulder?: number;
	coatChest?: number;
	coatMidWaist?: number;
	coatLowerhem?: number;
	coatFLengthVar?: number;
	coatSleeveLengthVar?: number;
	coatShoulderVar?: number;
	coatChestVar?: number;
	coatMidWaistVar?: number;
	coatLowerhemVar?: number;
	coatMemo: string,
	coatIsEnabled: boolean;
	coats: OrderDetailDTO[];

	waistcoatModel: string,
	waistcoatSpec: string,
	waistcoatFLength?: number;
	waistcoatBLength?: number;
	waistcoatShoulder?: number;
	waistcoatChest?: number;
	waistcoatMidWaist?: number;
	waistcoatLowerhem?: number;
	waistcoatFLengthVar?: number;
	waistcoatBLengthVar?: number;
	waistcoatShoulderVar?: number;
	waistcoatChestVar?: number;
	waistcoatMidWaistVar?: number;
	waistcoatLowerhemVar?: number;
	waistcoatMemo: string,
	waistcoatIsEnabled: boolean;
	waistcoats: OrderDetailDTO[];

	accessoryIsEnabled: boolean;
	accessories: OrderDetailDTO[];
}

export class OrderDetailDTO {
	color: string;
	cloth?: string;
	amount: number;
	subCategory?: string;
	price?: number;
	sizeName?: string
}

export interface OrderListDTO {
	orders: OrderDTO[];
	recordCount: number;
}


export interface OptionDTO {
	text: string;
	value: string;
}

export interface GroupOptionDTO extends OptionDTO {
	companies: CompanyOptionDTO[];
}

export interface CompanyOptionDTO extends OptionDTO {
	departments: OptionDTO[];
	jobs: OptionDTO[];
}

export interface CategoryOptionDTO extends OptionDTO {
	manSizes: OptionDTO[];
	womanSizes: OptionDTO[];
}

export interface SizeDTO {
	sizeId: number;
	sizeName: string;
	category: string;
	sex: string;
	neckScopeL?: number;
	neckScopeU?: number;
	shoulderScopeL?: number;
	shoulderScopeU?: number;
	fLengthScopeL?: number;
	fLengthScopeU?: number;
	bLengthScopeL?: number;
	bLengthScopeU?: number;
	chestScopeL?: number;
	chestScopeU?: number;
	waistScopeL?: number;
	waistScopeU?: number;
	lowerHemScopeL?: number;
	lowerHemScopeU?: number;
	lSleeveLengthScopeL?: number;
	lSleeveLengthScopeU?: number;
	lSleeveCuffScopeL?: number;
	lSleeveCuffScopeU?: number;
	sSleeveLengthScopeL?: number;
	sSleeveLengthScopeU?: number;
	sSleeveCuffScopeL?: number;
	sSleeveCuffScopeU?: number;
	isLocked: boolean;
	sizeDetails: SizeDetailDTO[];
}

export interface SizeDetailDTO {
	sizeName: string;
	sizeAlias: string;
	neck: number;
	shoulder: number;
	fLength: number;
	bLength: number;
	chest: number;
	waist: number;
	lowerHem: number;
	lSleeveLength: number;
	lSleeveCuff: number;
	sSleeveLength: number;
	sSleeveCuff: number;
}

export interface SizeListDTO {
	sizes: SizeDTO[];
	recordCount: number;
}

export interface UserListDTO {
	users: UserDTO[];
	recordCount: number;
}

export enum UserTypeEnum {
	Admin = 1,
	Operator = 2
}
export interface UserDTO {
	userId: number,
	username: string,
	password: string,
	userTypeId: UserTypeEnum
}
export interface PasswordDTO {
	oldPassword: string;
	newPassword: string;
}