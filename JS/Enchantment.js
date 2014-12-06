function Enchantment( stat, value, percent, range, maxValue, ench_obj ) {
	this.stat = stat;	// Stat Added to the enchantment
	this.value = value;	// Value of enchantment (or min range value)
	this.percent = (typeof(percent) !== "undefined") ? percent : false;	// Value(s) are percentages if true.
	this.range = (typeof(range) !== "undefined") ? range : false;	// Enchantment is a range.
	this.maxValue = (typeof(maxValue) !== "undefined") ? maxValue : null;
	this.minValue = (range) ? value : null;
	this.ench_obj = (typeof(ench_obj) !== "undefined") ? ench_obj : null;	// Pointer to parent enchantment object
	
	if( stat.constructor !== Stat ) {
		throw new TypeError("Enchantment => stat should be a Stat object. Enchantment = " + this);
	}

	if( typeof(this.value) !== "number" ) {
		throw new TypeError("Enchantment => value should be a number. Enchantment = " + this);
	}
	
	if( typeof(this.percent) !== "boolean" ) {
		throw new TypeError("Enchantment => percent should be a boolean. Enchantment = " + this);
	}
	
	if( typeof(this.range) !== "boolean" ) {
		throw new TypeError("Enchantment => range should be a boolean. Enchantment = " + this);
	}
	
	if( typeof(this.maxValue) !== "number" && this.maxValue !== null ) {
		throw new TypeError("Enchantment => maxValue should be a number. Enchantment = " + this);
	}
	
	if( ench_obj instanceof Ench_Object && this.ench_obj !== null ) {
		throw new TypeError("Enchantment => ench_obj should be an Ench_Object object. Enchantment = " + this);
	}
}

Enchantment.prototype.toString = function() {
	return "{\"stat\":\"" + this.stat.name +
	       "\",\"value\":" + this.value +
	       ",\"percent\":" + this.percent +
	       ",\"range\":" + this.range +
		   ",\"minValue\":" + this.minValue + 
		   ",\"maxValue\":" + this.maxValue + 
		   ",\"ench_obj\":\"" + this.ench_obj.name +
	       "\"}";
}