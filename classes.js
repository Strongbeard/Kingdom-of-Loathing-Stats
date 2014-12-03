//----------------------------------EQUIPMENT-----------------------------------

function Equipment (name, id, enchantments) {
	this.name = typeof name !== 'undefined' ? name : "";
	this.id = typeof id !== 'undefined' ? id : null;
	this.enchantments = typeof enchantments !== 'undefined ? enchantments : [];
	$.each( this.enchantments, function( index, ench ) {
		updateEnchantment(ench, true);
	});
}

Equipment.prototype.removeEnchantments = function () {
	$.each( this.enchantments, function( index, ench ) {
		updateEnchantment(ench, false);
	}
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
}