function Stat( name, percent, range ) {
	this.name = name;
	this.value = 0;
	this.percent = (typeof(percent) !== "undefined") ? percent : false;;
	this.range = (typeof(range) !== "undefined") ? range : false;;
	this.minValue = 0;
	this.maxValue = 0;
	this.ench_list = {
		equipment: {},
		skills: {},
		buffs: {},
		outfit: {},
		sign: {}
	};
	
	if( typeof(this.name) !== "string" ) {
		throw new TypeError("Stat => name should be a string. Stat = " + this.print());
	}
	
	if( typeof(this.percent) !== "boolean" ) {
		throw new TypeError("Stat => percent should be a boolean. Stat = " + this.print());
	}
	
	if( typeof(this.range) !== "boolean" ) {
		throw new TypeError("Stat => range should be a boolean. Stat = " + this.print());
	}
}

Stat.prototype.addEnchantment = function( enchantment ) {
	if( ! enchantment instanceof Enchantment ) {
		throw new TypeError("Stat => enchantment should be an Enchantment object. Enchantment = " + enchantment);
	}
	
	ench_list[enchantment.ench_obj.name.toLowerCase()].push(enchantment);
	if( range ) {
		this.minValue += enchantment.minValue;
		this.maxValue += enchantment.maxValue;
	}
	else {
		this.value += enchantment.value;
	}
}