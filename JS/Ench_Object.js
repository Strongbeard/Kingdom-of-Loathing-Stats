//################################ ENCH_OBJECT #################################

// --- CONSTRUCTORS ---
function Ench_Object( name, id, enchantments ) {
	// Set variables
	this.name = name;
	this.id = id;
	this.enchantments = (typeof enchantments !== 'undefined') ? enchantments : [];
	this.type = "Ench_Object";
	
	// Error Checking
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

// --- MODIFIERS ---

// Adds an enchantment to the list and sets the enchantment's ench_obj pointer
// to this Ench_Object
Ench_Object.prototype.addEnchantment = function( enchantment ) {
	if( enchantment.constructor !== Enchantment ) {
		throw new TypeError( this.constructor + "::addEnchantment() => enchantment should be a string. enchantment = " + enchantment);
	}
	
	enchantment.ench_obj = this;
	this.enchantments.push(enchantment);
	enchantment.stat.addEnchantment(enchantment);
}

// --- ACCESSORS ---

// Print psudo-JSON representation of object.
Ench_Object.prototype.toString = function() {
	return "{\"name\":\"" + this.name +
	       "\",\"id\":" + this.id + 
	       ",\"type\":\"" + this.type + 
	       "\",\"enchantments\":[]}";
}


//################################# EQUIPMENT ##################################

// --- CONSTRUCTORS ---

function Equipment( name, id, enchantments ) {
	Ench_Object.call(this, name, id, enchantments);
	this.type = "Equipment";
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
}
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;

//Equipment.prototype.


//################################# SKILL ##################################

// --- CONSTRUCTORS ---

function Skill( name, id, enchantments ) {
	Ench_Object.call(this, name, id, enchantments);
	this.type = "Skill";
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
}
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;


//################################# BUFF ##################################

// --- CONSTRUCTORS ---

function Buff( name, id, enchantments ) {
	Ench_Object.call(this, name, id, enchantments);
	this.type = "Buff";
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
}
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;


//################################# OUTFIT ##################################

// --- CONSTRUCTORS ---

function Outfit( name, id, enchantments ) {
	Ench_Object.call(this, name, id, enchantments);
	this.type = "Outfit";
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
}
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;


//################################# SIGN ##################################

// --- CONSTRUCTORS ---

function Sign( name, id, enchantments ) {
	Ench_Object.call(this, name, id, enchantments);
	this.type = "Sign";
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
}
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;


//################################# ENCH_OBJECTS ##################################

// Enchanted objects global storage object.
Ench_Objects = {
	equipment: {},
	skills: {},
	buffs: {},
	outfit: null,
	sign: null,
	addObject : function( ench_obj ) {
		if( ! this instanceof Ench_Object) {
			throw new TypeError("Ench_Objects => ench_obj must inherit from the Ench_Object class.");
		}

		this[ench_obj.type.toLowerCase()][ench_obj.id] = ench_obj;
	}
}