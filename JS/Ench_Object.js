//----------------------------------ENCH_OBJECT-----------------------------------
function Ench_Object( name, id, enchantments ) {
	this.name = name;
	this.id = id;
	this.enchantments = (typeof enchantments !== 'undefined') ? enchantments : [];
	
	if(typeof(this.name) !== "string") {
		throw new TypeError(this.constructor.name + " => name should be a string. " + this.constructor.name + " = " + this);
	}
	
	if(typeof(this.id) !== "number") {
		throw new TypeError(this.constructor.name + " => id should be a number. " + this.constructor.name + " = " + this);
	}
	
	if( ! (this.enchantments.constructor === Array) ) {
		throw new TypeError(this.constructor.name + " => enchantments should be an array. " + this.constructor.name + " = " + this);
	}
}

Ench_Object.prototype.addEnchantment( enchantment ) {
	if( enchantment.constructor !== Enchantment ) {
		throw new TypeError( "Equipment::addEnchantment() => enchantment should be a string. enchantment = " + enchantment);
	}
	
	enchantment.ench_obj = this;
	this.enchantments.push(enchantment);
}

Ench_Object.prototype.toString = function() {
	return JSON.stringify(this);
}

//----------------------------------EQUIPMENT-----------------------------------

// --- CONSTRUCTORS ---

function Equipment( name, id, enchantments ) {
	this.type = "Equipment";
	Ench_Object.call(this, name, id, enchantments);
}
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;


// --- MODIFIERS ---

/*Equipment.prototype.addEnchantment( enchantment ) {
	if( enchantment.constructor !== Enchantment ) {
		throw new TypeError( "Equipment::addEnchantment() => enchantment should be a string. enchantment = " + enchantment);
	}
	
	enchantment.ench_obj = this;
	this.enchantments.push(enchantment);
}*/

/*//----------------------------------EQUIPMENT-----------------------------------

function Equipment (name, id, enchantments) {
	this.name = (typeof name !== 'undefined') ? name : "";
	this.id = (typeof id !== 'undefined') ? id : null;
	this.enchantments = (typeof enchantments !== 'undefined') ? enchantments : [];
	$.each( this.enchantments, function( index, ench ) {
		updateEnchantment(ench, true);
	});
}

Equipment.prototype.removeEnchantments = function () {
	$.each( this.enchantments, function( index, ench ) {
		updateEnchantment(ench, false);
	});
}

//------------------------------------OUTFIT------------------------------------

var outfit = {
	name: "",
	id: null,
	enchantments: [],
	removeOutfit: function () {
		this.name = "";
		this.id = null;
		$.each(this.enchantments, function(index, ench) {
			updateEnchantment(ench, false);
		});
		this.enchantments = [];
	},
	addOutfit: function(name, id, enchantments) {
		this.name = name;
		this.id = id;
		this.enchantments = enchantments;
		$.each( this.enchantments, function( index, ench) {
			updateEnchantment(ench, true);
		});
	},
	updateOutfit: function (name, id, enchantments) {
		this.removeOutfit();
		this.addOutfit( name, id, enchantments );
	},
	toString: function () {
		return "{\"name\":\"" + this.name + "\",\"id\":" + this.id + ",\"enchantments\":" + JSON.stringify(this.enchantments) + "}";
	},
	writeToLocalStorage: function () {
		localStorage.setItem( "outfit", JSON.stringify({
			"name": this.name,
			"id": this.id,
			"enchantments": this.enchantments
		}));
	},
	readFromLocalStorage: function () {
		var storedOutfit = localStorage.getItem("outfit");
		if( storedOutfit ) {
			storedOutfit = JSON.parse( storedOutfit );
		}
		if( storedOutfit ) {
			this.addOutfit( storedOutfit.name, storedOutfit.id, storedOutfit.enchantments );
		}
	}
}*/