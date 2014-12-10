// --- CONSTRUCTORS ---

function Stat( name, percent, range ) {
	this.name = name;
	this.value = 0;
	this.percentValue = 0;
	this.percent = (typeof(percent) !== "undefined") ? percent : false;;
	this.range = (typeof(range) !== "undefined") ? range : false;;
	this.minValue = 0;
	this.maxValue = 0;
	this.ench_list = {
		equipment: {},
		skills: {},
		buffs: {},
		outfit: null,
		sign: null
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

// --- MODIFIERS ---

// Adds an enchantment's value(s) to this Stat's value(s) and adds the
// enchantment to the ench_list
Stat.prototype.addEnchantment = function( enchantment ) {
	// Argument Type Error Checking
	if( ! enchantment instanceof Enchantment ) {
		throw new TypeError("Stat => enchantment should be an Enchantment object. Enchantment = " + enchantment);
	}
	
	// Add enchantment's value(s) to stat's value(s)
	if( enchantment.range ) {
		if( this.range ) {
			this.minValue += enchantment.minValue;
			this.maxValue += enchantment.maxValue;
		}
		else {
			throw new Error("Stat::addEnchantment() => Cannot add a range enchantment to a non-range stat. Stat = " + this + ", Enchantment = " + enchantment );
		}
	}
	else if( enchantment.percent ) {
		if( this.percent ) {
			this.percentValue += enchantment.value;
		}
		else {
			throw new Error("Stat::addEnchantment() => Cannot add a percent enchantment to a non-percent stat. Stat = " + this + ", Enchantment = " + enchantment);
		}
	}
	else {
		if( this.range ) {
			throw new Error("Stat::addEnchantment() => Cannot add a non-range enchantment to a range stat. Stat = " + this + ", Enchantment = " + enchantment );
		}
		else {
			this.value += enchantment.value;
		}
	}
	
	// Add enchantment to the appropriate associative array using it's
	// ench_obj id as a key
	this.ench_list[enchantment.ench_obj.constructor.name.toLowerCase()][enchantment.ench_obj.id] = enchantment;
}

Stat.prototype.removeEnchantment = function( enchantment ) {
	// Argument Type Error Checking
	if( ! enchantment.constructor === Enchantment ) {
		throw new TypeError("Stat::removeEnchantment() => enchantment should be an Enchantment object. Enchantment = " + enchantment);
	}
	
	if( enchantment.stat.name !== this.name ) {
		throw new TypeError("Stat::removeEnchantment() => enchantment stat doesn't match this stat. Stat = " + this + ", Enchantment = " + enchantment);
	}
	
	// Remove enchantment's value(s) from this stat's value(s)
	if( enchantment.range ) {
		if( this.range ) {
			this.minValue -= enchantment.minValue;
			this.maxValue -= enchantment.maxValue;
		}
		else {
			throw new Error("Stat::removeEnchantment() => Cannot remove a range enchantment from a non-range stat. Stat = " + this + ", Enchantment = " + enchantment );
		}
	}
	else if( enchantment.percent ) {
		if( this.percent ) {
			this.percentValue -= enchantment.value;
		}
		else {
			throw new Error("Stat::removeEnchantment() => Cannot remove a percent enchantment from a non-percent stat. Stat = " + this + ", Enchantment = " + enchantment);
		}
	}
	else {
		if( this.range ) {
			throw new Error("Stat::removeEnchantment() => Cannot remove a non-range enchantment from a range stat. Stat = " + this + ", Enchantment = " + enchantment );
		}
		else {
			this.value -= enchantment.value;
		}
	}
	
	delete this.ench_list[enchantment.ench_obj.constructor.name.toLowerCase()][enchantment.ench_obj.id];
}

// --- ACCESSORS ---

/* Print a psudo-JSON representation of this Stat. ench_list cannot be fully
 * displayed due to circular class references between Stats, Enchantment, and
 * Ench_Object.*/
Stat.prototype.toString = function() {
	return "{\"name\":\"" + this.name +
	       ",\"percent\":" + this.percent +
	       ",\"range\":" + this.range +
	       "\",\"value\":" + this.value +
	       "\",\"percentValue\":" + this.percentValue +
	       ",\"minValue\":" + this.minValue + 
	       ",\"maxValue\":" + this.maxValue + 
	       ",\"ench_list\":{}" +
	       "}";
}


// #############################################################################

// Stats global object. Contains all Stat objects.
Stats = {
	"adventures" : new Stat("adventures"),
	"boozeFind" : new Stat("boozeFind"),
	"candyFind" : new Stat("candyFind"),
	"coldResist" : new Stat("coldResist"),
	"coldSpellDmg" : new Stat("coldSpellDmg", true),
	"coldWpnDmg" : new Stat("coldWpnDmg", true),
	"damageAbsorption" : new Stat("damageAbsorption"),
	"damageReduction" : new Stat("damageReduction"),
	"foodFind" : new Stat("foodFind"),
	"familiarWeight" : new Stat("familiarWeight"),
	"hotResist" : new Stat("hotResist"),
	"hotSpellDmg" : new Stat("hotSpellDmg", true),
	"hotWpnDmg" : new Stat("hotWpnDmg", true),
	"HP" : new Stat("HP", true),
	"hpRegen" : new Stat("hpRegen", false, true ),
	"initiative" : new Stat("initiative", true),
	"itemFind" : new Stat("itemFind", true),
	"meatFind" : new Stat("meatFind", true),
	"monsterLevel" : new Stat("monsterLevel"),
	"mox" : new Stat("mox", true),
	"moxGain" : new Stat("moxGain", true),
	"MP" : new Stat("MP", true),
	"mpRegen" : new Stat("mpRegen", false, true ),
	"mus" : new Stat("mus", true),
	"musGain" : new Stat("musGain", true),
	"mys" : new Stat("mys", true),
	"mysGain" : new Stat("mysGain", true),
	"other" : new Stat("other"),
	"pickpocket" : new Stat("pickpocket"),
	"randGain" : new Stat("randGain", true),
	"rangedDmg" : new Stat("rangedDmg", true),
	"sleazeResist" : new Stat("sleazeResist"),
	"sleazeSpellDmg" : new Stat("sleazeSpellDmg", true),
	"sleazeWpnDmg" : new Stat("sleazeWpnDmg", true),
	"slimeResist" : new Stat("slimeResist"),
	"spellDmg" : new Stat("spellDmg", true),
	"spookyResist" : new Stat("spookyResist"),
	"spookySpellDmg" : new Stat("spookySpellDmg", true),
	"spookyWpnDmg" : new Stat("spookyWpnDmg", true),
	"stenchResist" : new Stat("stenchResist"),
	"stenchSpellDmg" : new Stat("stenchSpellDmg", true),
	"stenchWpnDmg" : new Stat("stenchWpnDmg", true),
	"weaponDmg" : new Stat("weaponDmg", true)
}