var Models = {
	Product : "_ProductSchema"
};

function OmniSchemas(){

		var _ProductSchema = new Schema({
				tax_1: Number,
				productPrice: Number,	
				productKitchen: String	
				color: String,	
				productID: Number,	
				productName2: String,	
				productTag: Number	
				tax_5: Number,	
				lastSyncedAt: Date,	
				productName: String,
				isExtraItem: Boolean,
				quantitySold: Number,	
				quantity: Number,	
				gst: Number,	
				courseName: String,	
				tax_4: Number,	
				tax_3: Number,	
				lastUpdatedAt: Date,	
				courseSortOrder: Number,	
				isLocked: Boolean,	
				canChangePrice:	Boolean,
				sortOrder: Number,	
				tax_2: Number,	
				stockOnHand: Number,	
				price2: Number,	
				hasOpenPrice: Boolean,	
				courseId: Number,
				productOptions:[String],
				submenus:[String]
				});

		var _CookingOptionsSchema = new Schema({
			cookingOpName: String,
			cookingOpName2: String,	
			isLocked: Boolean,
			cookingOpId: Number,
			lastSyncedAt: Date,
			sortOrder: Number,
			lastUpdatedAt: Date
			products: [String]
		});

		var _CourseSchema = new Schema({
			lastSyncedAt: Date,
			isLocked: Boolean,
			courseName: String,
			sortOrder: Number,
			lastUpdatedAt: Date,
			courseId: Number
		});

		var _ReservationSchema = new Schema({
			noOfGuest: Number,	
			isLocked: Boolean,	
			reservationId: Number,	
			name: String,	
			notes: String,	
			date: Date,	
			lastSyncedAt: Date,	
			dateOnly: Date,	
			lastUpdatedAt: Date	
		});

		var _CustomerSchema = new Schema({
			isLocked: Boolean,	
			address: String,	
			lastName: String,	
			firstName: String,	
			phone: Number,	
			customerId: Number,	
			email: String,	
			lastSyncedAt: Date,	
			lastUpdatedAt: Date,	
			note: String,	
			reservations: [Number]
		});

		var _UserInfoSchema = new Schema({
			lastUpdatedAt: Date,	
			voucherSale: Number,	
			lastName: String,	
			userType: String,	
			firstName: String,	
			loginPin: String,	
			isLocked: Boolean,	
			cashSale: Number,	
			tips: Number,	
			startDate: Date,	
			email: String,	
			kitchens:[0]
			cardSale: Number,	
			phone: String,	
			userID: String	
			lastSyncedAt: Date,	
			userShifts:[String]
		});

		var _SoldItemSchema = new Schema({
			actualItemId:String,
			itemId:String,
			itemName:String.
			price:Number,
			qty:Number,
			type:Number,
			wasVoided:Boolean
		});


		var _UserSaleSchema = new Schema({
			cardSale:Number,
			cashSale:Number,
			saleInfoId:String
			tips:Number,
			userId:String
			userSaleId:String
			voucherSale:Number,
			userShifts:[String]});
	
		var _UserShiftSchema = new Schema({
			clockedIn:Date,
			clockedOut:Date,
			duration:Number,
			isClosed:Boolean,
			userShiftId:String,
			userInfo:UserInfo,
			userSale:UserSale});

		var _SaleInfoSchema = new Schema({
			saleId: String,
		    tax4Amt: Number,
		    totalRefund: Number,
		    floatAmount: Number,
		    isClosed: Boolean,
		    voucherSale: Number,
		    userSales: [String],
		    totalDiscount: Number,
		    totalTax: Number,
		    tax3Amt: Number,
		    totalPayout: Number,
		    tax2Amt: Number,
		    cardSale: Number,
		    cashSale: Number,
		    lastUpdatedAt: Date,
		    netSale: Number,
		    isLocked: Boolean,
		    tax1Amt: Number,
		    saleInfoType: String,
		    tipAmount: Number,
		    updatedAt: Date,
		    grossSale: Number,
		    dateOnlyString: String,
		    totalSurcharge: Number,
		    soldItems: [SoldItemSchema],
		    createdAt: Date,
		    tax5Amt: Number
		});

		var _KitchenSchema = new Schema({
			isLocked:Boolean,
			lastSyncedAt:Date,
			lastUpdatedAt:Date,
			kitchenID:String,
			kitchenName:String,
			products:[String],
			users:[String]	
		});

		var _ProductOptionsSchema = new Schema({
			isLocked:Boolean,
			lastSyncedAt:Date,
			lastUpdatedAt:Date,
			gst:Number,
			price:Number,
			price2:Number,
			productOpId:String,
			productOpName:String,
			productOpName2:String,
			quantity:Number,
			sortOrder:Number,
			tax_1:Number,
			tax_2:Number,
			tax_3:Number,
			tax_4:Number,
			tax_5:Number,
			products:[String]	
		});

		var _RestaurantTableSchema = new Schema(
		{
			isLocked:Boolean,
			lastSyncedAt:Date,
			lastUpdatedAt:Date,
			isBarService:Boolean,
			isClosed:Boolean,
			isPredefined:Boolean,
			isRoundTable:Boolean,
			isTableLayout:Boolean,
			numberOfGuest:Number,
			openedAt:Date,
			sessionID:Number,
			tabBarService:String,
			tableId:String,
			tableName:String,
			tlBoxIndex:Number,
			childTables:[String]
		});

		var _SubMenuSchema = new Schema({
			isLocked:Boolean,
			lastSyncedAt:Date,
			lastUpdatedAt:Date,
			sortOrder:Number,
			subMenuID:String,
			subMenuName:String,
			subMenuName2:String,
			menus:[String],
			products:[String]
		});

		var _TaxInfoSchema = new Schema({
			isLocked:Boolean,
			lastSyncedAt:Date,
			lastUpdatedAt:Date,
			taxInfoId:String,
			taxLiteral:String,
			taxRate:Number
		});

		var _Toppings = new Schema({
			isLocked:Boolean,
			lastSyncedAt:Date,
			lastUpdatedAt:Date,
			gst:Number,
			price:Number,
			price2:Number,
			quantity:Number,
			sortOrder:Number,
			tax_1:Number,
			tax_2:Number,
			tax_3:Number,
			tax_4:Number,
			tax_5:Number,
			toppingsId:Number,
			toppingsName:String,
			toppingsName2:String,
			products:[String]
		});

		getModel : function(){
			
		}
}

module.exports = OmniSchemas;
mongoose.model('Product', ProductSchema);
var Product = mongoose.model('Product');
module.exports = Product;

mongoose.model('Customer',CustomerSchema);
var Customer = mongoose.model('Customer');
module.exports = Customer;

mongoose.model('UserInfo',UserInfoSchema);
var UserInfo = mongoose.model('UserInfo');
module.exports = UserInfo

mongoose.model('SoldItem',SoldItemSchema);
var SoldItem = mongoose.model('SoldItem');
module.exports = SoldItem;

mongoose.model('UserSale',UserSaleSchema);
var UserSale = mongoose.model('UserSale');
module.exports = UserSale;

mongoose.model('UserShift',UserShiftSchema);
var UserShift = mongoose.model('UserShift');
module.exports = UserShift;

mongoose.model('SaleInfo',SaleInfoSchema);
var SaleInfo = mongoose.model('SaleInfo');
module.exports = SaleInfo;

mongoose.model('Kitchen',KitchenSchema);
var Kitchen = mongoose.model('Kitchen');
module.exports = Kitchen;

mongoose.model('ProductOptions',ProductOptionsSchema);
var ProductOptions = mongoose.model('ProductOptions');
module.exports = ProductOptions;

mongoose.model('RestaurantTable',RestaurantTableSchema);
var RestaurantTable = mongoose.model('RestaurantTable');
module.exports = RestaurantTable;

mongoose.model('SubMenu',SubMenuSchema);
var SubMenu = mongoose.model('SubMenu');
module.exports = SubMenu;

mongoose.model('TaxInfo',TaxInfoSchema);
var TaxInfo = mongoose.model('TaxInfo');
module.exports = TaxInfo;

mongoose.model('Toppings',ToppingsSchema);
var Toppings = mongoose.model('Toppings');
module.exports = Toppings;

mongoose.model('Reservation',ReservationSchema);
var Reservation = mongoose.model('Reservation');
module.exports = Reservation;

mongoose.model('CookingOptions', CookingOptionsSchema);
var CookingOptions = mongoose.model('CookingOptions');
module.exports = CookingOptions;

mongoose.model('Course', CourseSchema);
var Course = mongoose.model('Course');
module.exports = Course;