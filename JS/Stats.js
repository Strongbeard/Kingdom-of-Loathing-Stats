// --- CONSTRUCTORS ---

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
	
	// Add enchantment's value(s) to this stat's value(s)
	if( this.range && enchantment.range) {
		this.minValue += enchantment.minValue;
		this.maxValue += enchantment.maxValue;
	}
	else if( !this.range && !enchantment.range ) {
		this.value += enchantment.value;
	}
	else {
		// Throw error if Enchantment's & Stat's range booleans don't match
		throw new Error("Stats::addEnchantment() => range boolean does not match between enchantment and stat. Stat = " + this + ", Enchantment = " + enchantment );
	}
	
	// Add enchantment to the appropriate associative array using it's
	// ench_obj id as a key
	this.ench_list[enchantment.ench_obj.type.toLowerCase()][enchantment.ench_obj.id] = (enchantment);
}

// --- ACCESSORS ---

/* Print a psudo-JSON representation of this Stat. ench_list cannot be fully
 * displayed due to circular class references between Stats, Enchantment, and
 * Ench_Object.*/
Stat.prototype.toString = function() {
	return "{\"stat\":\"" + this.name +
	       "\",\"value\":" + this.value +
	       ",\"percent\":" + this.percent +
	       ",\"range\":" + this.range +
	       ",\"minValue\":" + this.minValue + 
	       ",\"maxValue\":" + this.maxValue + 
	       ",\"ench_list\":{}" +
	       "}";
}


// #############################################################################

// Stats global object. Contains all Stat objects.
Stats = {
	"mus" : new Stat("mus", true),
	"mys" : new Stat("mys", true),
	"mox" : new Stat("mox", true),
	"HP" : new Stat("HP", true),
	"MP" : new Stat("MP", true),
	"musGain" : new Stat("musGain", true),
	"mysGain" : new Stat("mysGain", true),
	"moxGain" : new Stat("moxGain", true),
	"randGain" : new Stat("randGain", true),
	"weaponDmg" : new Stat("weaponDmg", true),
	"coldWpnDmg" : new Stat("coldWpnDmg", true),
	"hotWpnDmg" : new Stat("hotWpnDmg", true),
	"sleazeWpnDmg" : new Stat("sleazeWpnDmg", true),
	"spookyWpnDmg" : new Stat("spookyWpnDmg", true),
	"stenchWpnDmg" : new Stat("stenchWpnDmg", true),
	"spellDmg" : new Stat("spellDmg", true),
	"coldSpellDmg" : new Stat("coldSpellDmg", true),
	"hotSpellDmg" : new Stat("hotSpellDmg", true),
	"sleazeSpellDmg" : new Stat("sleazeSpellDmg", true),
	"spookySpellDmg" : new Stat("spookySpellDmg", true),
	"stenchSpellDmg" : new Stat("stenchSpellDmg", true),
	"rangedDmg" : new Stat("rangedDmg", true),
	"damageAbsorb" : new Stat("damageAbsorb"),
	"damageResist" : new Stat("damageResist"),
	"coldResist" : new Stat("coldResist"),
	"hotResist" : new Stat("hotResist"),
	"sleazeResist" : new Stat("sleazeResist"),
	"slimeResist" : new Stat("slimeResist"),
	"spookyResist" : new Stat("spookyResist"),
	"stenchResist" : new Stat("stenchResist"),
	"initiative" : new Stat("initiative"),
	"itemFind" : new Stat("itemFind"),
	"meadFind" : new Stat("meadFind"),
	"boozeFind" : new Stat("boozeFind"),
	"foodFind" : new Stat("foodFind"),
	"pickpocket" : new Stat("pickpocket"),
	"hpRegen" : new Stat("hpRegen", false, true ),
	"mpRegen" : new Stat("mpRegen", false, true ),
	"adventures" : new Stat("adventures")
}