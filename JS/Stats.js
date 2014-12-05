function Stat( name ) {
	this.name = name;
	this.value = 0;
	this.ench_list = {
		equipment: {},
		skills: {},
		buffs: {},
		outfit: {},
		sign: {}
	};
	
	if( typeof(this.name) !== "string" ) {
		throw new TypeError("Stat => name should be a string. Enchantment = " + this.print());
	}
}

Stat.prototype.addEnchantment( enchantment ) {
	if( ! enchantment instanceof Enchantment ) {
		throw new TypeError("Stat => enchantment should be an Enchantment object. Enchantment = " + enchantment);
	}
	
	
}