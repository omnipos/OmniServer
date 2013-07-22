var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var parentMod = require('./ParentOmniSchema');
var Entities = {
	kProduct : "_ProductSchema",
	kCustomer : "_CustomerSchema",
	kUserInfo : "_UserInfoSchema",
	kSoldItem : "_SoldItemSchema",
	kUserShift : "_UserShiftSchema",
	kSaleInfo : "_SaleInfoSchema",
	kKitchen : "_KitchenSchema",
	kProductOptions : "_ProductOptionsSchema",
	kRestaurantTable : "_RestaurantTableSchema",
	kRestaurantInfo : "_RestaurantInfoSchema",
	kSubMenu : "_SubMenuSchema",
	kTaxInfo : "_TaxInfoSchema",
	kToppings : "_ToppingsSchema",
	kReservation : "_ReservationSchema",
	kCookingOptions : "_CookingOptionsSchema",
	kCourse : "_CourseSchema",
	kUserSale : "_UserSaleSchema",
	kPrinter : "_PrinterSchema",
	kNote: "_NoteSchema",
	kRestaurntInfo : "_RestaurantInfoSchema",
	kPosDevice : "_PosDevice"
};

function OmniSchemas(){
	
		var _RestaurantInfoSchema = new Schema({
		            isLocked: Boolean,
		            abn: String,
		            addLineBetweenItems: Boolean,
		            address1: String,
		            address2: String,
		            autoPromptTip: Boolean,
		            city: String,
		            currencySymbol: String,
		            deleteOrderAfterSent: Boolean,
		            email: String,
		            kvTimeOutInterval: Number,
		            location: String,
		            name: String,
		            phone: String,
		            printDeletedOrdersOnKP: Boolean,
		            printMergedOrdersOnKP: Boolean,
		            printOrderModOnKP: Boolean,
		            printOrderModOnKV: Boolean,
		            printOrdersTo: Boolean,
		            printVoidedItemsOnKP: Boolean,
		            quickServiceTitle: String,
		            receiptFooter1: String,
		            receiptFooter2: String,
		            shouldAutoReceiptPrint: Boolean,
		            shouldLockTableLayout: Boolean,
		            shouldShowControlsOnReport: Boolean,
		            shouldUseTableLayout: Boolean,
		            sortItemsBy: String,
		            sortKitchenItemsBy: String,
		            sortProductsBy: String,
		            sortSubMenusBy: String,
		            state: String,
		            tableLayoutType: String,
		            taxInclusive: Boolean,
		            taxInvoice: String,
		            voidItemsAfterSent: Boolean,
		            website: String,
		            zip: String
		        });
	
		var _NoteSchema = new Schema({
            isLocked: Boolean,
            noteId: String,
            noteName: String
        });
			
		var _PosDevice = new Schema({
            isLocked:Boolean,
            attachedPrinterId: String,
            attachedPrinterName: String,
            deviceName: String,
            posDeviceId: String
        });

		var _PrinterSchemachema = new Schema({
            isLocked: Boolean,
            cashDrawerAmount: Number,
            cashDrawerType: String,
            noOfCopies: Number,
            printerID: String,
            printerIP: String,
            printerName: String,
            printerType: String,
            reroutePrinterID: String,
            reroutePrinterIP: String,
            shouldReroute: Boolean,
            triggerCashdrawer: Boolean,
            products: [String]
        });

		var _ProductSchema = new Schema({
				tax_1: Number,
				productPrice: Number,	
				productKitchen: String,	
				color: String,	
				productID: Number,	
				productName2: String,	
				productTag: Number,	
				tax_5: Number,	
				productName: String,
				isExtraItem: Boolean,
				quantitySold: Number,	
				quantity: Number,	
				gst: Number,	
				courseName: String,	
				tax_4: Number,	
				tax_3: Number,	
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
			sortOrder: Number,
			products: [String]
		});

		var _CourseSchema = new Schema({
			isLocked: Boolean,
			courseName: String,
			sortOrder: Number,
			courseId: String
		});

		var _ReservationSchema = new Schema({
			noOfGuest: Number,	
			isLocked: Boolean,	
			reservationId: String,	
			name: String,	
			notes: String,	
			date: Date,	
			dateOnly: Date
		});

		var _CustomerSchema = new Schema({
			isLocked: Boolean,	
			address: String,	
			lastName: String,	
			firstName: String,	
			phone: Number,	
			customerId: String,	
			email: String,		
			note: String,	
			reservations: [String]
		});

		var _UserInfoSchema = new Schema({
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
			kitchens:[String],
			cardSale: Number,	
			phone: String,	
			userID: String,	
			userShifts:[String]
		});

		var _SoldItemSchema = new Schema({
			actualItemId:String,
			itemId:String,
			itemName:String,
			price:Number,
			qty:Number,
			type:Number,
			wasVoided:Boolean
		});


		var _UserSaleSchema = new Schema({
			cardSale:Number,
			cashSale:Number,
			saleInfoId:String,
			tips:Number,
			userId:String,
			userSaleId:String,
			voucherSale:Number,
			userShifts:[String]});
	
		var _UserShiftSchema = new Schema({
			clockedIn:Date,
			clockedOut:Date,
			duration:Number,
			isClosed:Boolean,
			userShiftId:String,
			userInfo:{
				type:Schema.ObjectId,
				ref:'_UserInfoSchema'
				},
			userSale:{
				type:Schema.ObjectId,
				ref: '_UserSaleSchema'
				}
			});

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
		    netSale: Number,
		    isLocked: Boolean,
		    tax1Amt: Number,
		    saleInfoType: String,
		    tipAmount: Number,
		    updatedAt: Date,
		    grossSale: Number,
		    dateOnlyString: String,
		    totalSurcharge: Number,
		    soldItems: [{
				type:Schema.ObjectId,
				ref:'_SoldItemSchema'
				}],
		    createdAt: Date,
		    tax5Amt: Number
		});

		var _KitchenSchema = new Schema({
			isLocked:Boolean,
			kitchenID:String,
			kitchenName:String,
			products:[String],
			users:[String]	
		});

		var _ProductOptionsSchema = new Schema({
			isLocked:Boolean,
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
			isBarService:Boolean,
			isClosed:Boolean,
			isPredefined:Boolean,
			isRoundTable:Boolean,
			isTableLayout:Boolean,
			numberOfGuest:Number,
			openedAt:Date,
			sessionID:String,
			tabBarService:String,
			tableId:String,
			tableName:String,
			tlBoxIndex:Number,
			childTables:[String]
		});

		var _SubMenuSchema = new Schema({
			isLocked:Boolean,
			sortOrder:Number,
			subMenuID:String,
			subMenuName:String,
			subMenuName2:String,
			menus:[String],
			products:[String]
		});

		var _TaxInfoSchema = new Schema({
			isLocked:Boolean,
			taxInfoId:String,
			taxLiteral:String,
			taxRate:Number
		});

		var _Toppings = new Schema({
			isLocked:Boolean,
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
		
		var _schemas = {};
		
		this.getModel = function(modelName){
			
			if(_schemas[modelName])
				return _schemas[modelName];
			else{
				var objIdentifier,theSchema;
				if(modelName == Entities.kRestaurntInfo){
					objIdentifier = 'RestaurantInfo';
					theSchema = _RestaurantInfoSchema;
				}
				else if(modelName == Entities.kNote){
					objIdentifier = 'Note';
					theSchema = _NoteSchema;
				}
				else if(modelName == Entities.kPosDevice){
					objIdentifier = 'Posdevice';
					theSchema = _ProductSchema;
				}
				else if(modelName == Entities.kProduct){
					objIdentifier = 'Product';
					theSchema = _ProductSchema;					
				}
				else if(modelName == Entities.kCustomer){
					objIdentifier = 'Customer';
					theSchema = _CustomerSchema;
					
				}
				else if(modelName == Entities.kUserInfo){
					objIdentifier = 'UserInfo';
					theSchema = _UserInfoSchema;
					
				}
				else if(modelName == Entities.kSoldItem){
					objIdentifier = 'SoldItem';
					theSchema = _SoldItemSchema;
					
				}
				else if(modelName == Entities.kUserShift){
					objIdentifier = 'UserShift';
					theSchema = _UserShiftSchema;
					
				}
				else if(modelName == Entities.kUserSale){
					objIdentifier = 'UserSale';
					theSchema = _UserSaleSchema;
					
				}
				else if(modelName == Entities.kSaleInfo){
					theSchema = _SaleInfoSchema;
					objIdentifier = 'SaleInfo';
					
				}
				else if(modelName == Entities.kKitchen){
					objIdentifier = 'Kitchen';
					theSchema = _KitchenSchema;
					
				}
				else if(modelName == Entities.kProductOptions){
					objIdentifier = 'ProductOptions';
					theSchema = _ProductOptionsSchema;
					
				}						
				else if(modelName == Entities.kRestaurantTable){
					objIdentifier = 'RestaurantTable';
					theSchema = _RestaurantTableSchema;
					
				}
				else if(modelName == Entities.kSubMenu){
					objIdentifier = 'SubMenu';
					theSchema = _SubMenuSchema;
					
				}
				else if(modelName == Entities.kTaxInfo){
					objIdentifier = 'TaxInfo';
					theSchema = _TaxInfoSchema;
					
				}
				else if(modelName == Entities.kToppings){
					objIdentifier = 'Toppings';
					theSchema = _ToppingsSchema;
					
				}													
				else if(modelName == Entities.kReservation){
					objIdentifier = 'Reservation';
					theSchema = _ReservationSchema;
					
				}
				else if(modelName == Entities.kCookingOptions){
					objIdentifier = 'CookingOptions';
					theSchema = _CookingOptionsSchema;
					
				}
				else if(modelName == Entities.kCourse){
					objIdentifier = 'Course';
					theSchema = _CourseSchema;
					
				}	
				else{
					return null;
				}
				// add extra common fields for all schema...
				theSchema.plugin(parentMod);
				// compile the the schema
				mongoose.model(objIdentifier, theSchema);
				// get the model object and return it
				var reqModel = mongoose.model(objIdentifier);											
				_schemas[modelName] = reqModel;
				return reqModel;
			}
		};
}

module.exports = OmniSchemas;
module.exports = mongoose;
