//################################ ENCH_OBJECT #################################

// --- CONSTRUCTORS ---
function Ench_Object( id, name, enchantments ) {
	// Set variables
	this.id = id;
	this.name = (typeof name !== "undefined") ? name : "";
	enchantments = (typeof enchantments !== 'undefined') ? enchantments : [];
	this.enchantments = new Array();
	
	// Error Checking
	if(typeof(this.name) !== "string") {
		throw new TypeError(this.constructor.name + " => name should be a string. " + this.constructor.name + " = " + this);
	}
	
	if(typeof(this.id) !== "number") {
		throw new TypeError(this.constructor.name + " => id should be a number. " + this.constructor.name + " = " + this);
	}
	
	if( ! (enchantments.constructor === Array) ) {
		throw new TypeError(this.constructor.name + " => enchantments should be an array. " + this.constructor.name + " = " + this);
	}
	
	enchantments.forEach(function(enchantment, index, array) {
		if( enchantment.constructor !== Enchantment ) {
			throw new TypeError( this.constructor + " => enchantment should be an Enchantment object. enchantment = " + enchantment);
		}
	
		enchantment.ench_obj = this;
		this.enchantments.push(enchantment);
		enchantment.stat.addEnchantment(enchantment);
	}, this );
};

// --- MODIFIERS ---

// Adds an enchantment to the list and sets the enchantment's ench_obj pointer
// to this Ench_Object
Ench_Object.prototype.addEnchantment = function( enchantment ) {
	if( enchantment.constructor !== Enchantment ) {
		throw new TypeError( this.constructor + "::addEnchantment() => enchantment should be an Enchantment object. enchantment = " + enchantment);
	}
	
	enchantment.ench_obj = this;
	this.enchantments.push(enchantment);
	enchantment.stat.addEnchantment(enchantment);
};

Ench_Object.prototype.removeAllEnchantments = function() {
	this.enchantments.forEach( function(enchantment, index, array) {
		enchantment.stat.removeEnchantment(enchantment);
	}, this );
	this.enchantments = new Array();
};

Ench_Object.prototype.finishedCall = function(new_ench_obj_flags, finishedFlags, id) {
	console.log("start finishedCall: " + this.constructor.name);
	// --- All Finished Call Attempt ---
	// Set this equipment id to finished (true)
	new_ench_obj_flags[id] = true;
	
	// Check if all new equipment is finished processing
	setFinishedFlag = true;
	$.each(new_ench_obj_flags, function(id, value) {
		if( !value ) {
			setFinishedFlag = false;
		}
	});
	
//	if( this.constructor.name === "Buff" ) {
	console.log( new_ench_obj_flags );
//	}
	// Attempt to call process to run after all AJAX finished
	if( setFinishedFlag ) {
		finishedFlags[this.constructor.name] = true;
		console.log( "end finishedCall: " + this.constructor.name);
		afterCharacterSheets(finishedFlags);
	}
};

// --- ACCESSORS ---

// Print psudo-JSON representation of object.
Ench_Object.prototype.toString = function() {
	return "{\"name\":\"" + this.name +
	       "\",\"id\":" + this.id + 
	       ",\"type\":\"" + this.constructor.name + 
	       "\",\"enchantments\":[]}";
};


//################################# EQUIPMENT ##################################

// --- CONSTRUCTORS ---

function Equipment( id, name, enchantments ) {
	// Call Parent Constructor Ench_Object
	Ench_Object.call(this, id, name, enchantments);
//	this.category = "Equipment";
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;

// --- FUNCTIONS ---

Equipment.prototype.scrapeData = function( finishedFlags, new_equipment_flags ) {
	var equip = this;
	$.ajax({
		async: true,
		dataType: "json",
		type: "GET",
		url: "http://www.kingdomofloathing.com/api.php?what=item&for=Kol_Tool&id=" + equip.id
	}).done( function( equipmentIdJSON, status, xhr ) {
		$.ajax({
			async: true,
			dataType: "html",
			type: "GET",
			url: "http://www.kingdomofloathing.com/desc_item.php?whichitem=" + equipmentIdJSON.descid
		}).done( function( equipment_html, status, xhr ) {
			// --- Equipment HTML Scrape ---
			var doc = new DOMParser().parseFromString( equipment_html, "text/html");
			// Scrape equipment name & enchantment text from html
			equip.name = $( "#description>center>b", doc )[0].innerText;
			var enchantments = $("blockquote>center>b>font", doc);
			if( enchantments.length > 0 ) {
				// Loop through all enchantment text lines
				enchantments = enchantments[0].innerText.split(/\n+/);
				enchantments.forEach( function(enchantment_text, index, array) {
					if( enchantment_text !== "" ) {
						// Create enchantment
						ench = EnchantmentFromHtml(enchantment_text, equip);
						if( ench !== null ) {
							this.addEnchantment( ench );
						}
					}
				}, equip);
			}
		}).fail( function( jqXHR, textStatus, errorThrown ) {
			console.error(errorThrown);
		}).always( function() {
			equip.finishedCall(new_equipment_flags, finishedFlags, equip.id);
		});
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		equip.finishedCall(new_equipment_flags, finishedFlags, equip.id);
	});
};


//################################# SKILL ##################################

// --- CONSTRUCTORS ---

function Skill( id, name, enchantments ) {
	Ench_Object.call(this, id, name, enchantments);
//	this.category = "Skills";
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};
Skill.prototype = Object.create(Ench_Object.prototype);
Skill.prototype.constructor = Skill;

Skill.prototype.scrapeData = function( finishedFlags, new_skill_flags ) {
	var skill = this;
};


//################################# BUFF ##################################

// --- CONSTRUCTORS ---

function Buff( id, name, enchantments, descId ) {
	Ench_Object.call(this, id, name, enchantments);
//	this.category = "Buffs";
	this.descId = descId;
	
	if(typeof(this.descId) !== "string") {
		throw new TypeError(this.constructor.name + " => descId should be a string. " + this.constructor.name + " = " + this);
	}
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};
Buff.prototype = Object.create(Ench_Object.prototype);
Buff.prototype.constructor = Buff;

// --- FUNCTIONS ---

Buff.prototype.scrapeData = function( finishedFlags, new_buff_flags ) {
	var buff = this;
	$.ajax({
		async: true,
		dataType: "html",
		type: "GET",
		url: "http://www.kingdomofloathing.com/desc_effect.php?whicheffect=" + buff.descId
	}).done( function( buff_html, status, xhr ) {
		// ### WORK HERE ###
		var doc = new DOMParser().parseFromString( buff_html, "text/html");
		var enchantments = $("#description>font>center>font>b", doc);
		if( enchantments.length > 0 ) {
				// Loop through all enchantment text lines
				enchantments = enchantments[0].innerText.split(/\n+/);
				enchantments.forEach( function(enchantment_text, index, array) {
					if( enchantment_text !== "" ) {
						// Create enchantment
						var ench = EnchantmentFromHtml(enchantment_text, buff);
						if( ench !== null ) {
						console.log(ench);
							this.addEnchantment( ench );
						}
					}
				}, buff);
			}
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		console.error(errorThrown);
	}).always( function() {
		console.log("HERE");
		buff.finishedCall(new_buff_flags, finishedFlags, buff.descId);
	});
};


//################################# OUTFIT ##################################

// --- CONSTRUCTORS ---

function Outfit( id, name, enchantments ) {
	Ench_Object.call(this, id, name, enchantments);
//	this.category = "Outfit";
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};
Outfit.prototype = Object.create(Ench_Object.prototype);
Outfit.prototype.constructor = Outfit;

// --- FUNCTIONS ---
Outfit.prototype.scrapeData = function( finishedFlags, new_outfit_flags ) {
	var outfit = this;
	$.ajax({
		async: true,
		dataType: "html",
		type: "GET",
		url: "http://www.kingdomofloathing.com/desc_outfit.php?whichoutfit=" + outfit.id
	}).done( function( outfit_html, status, xhr ) {
		var doc = new DOMParser().parseFromString( outfit_html, "text/html" );
		outfit.name = $("#description>center>font>b", doc)[0].innerText;
		var enchantments = $("#description>center>p>font>b>font", doc);
		console.log( enchantments );
		// Loop through all enchantment text lines
		enchantments = enchantments[0].innerText.split(/\n+/);
		enchantments.forEach( function(enchantment_text, index, array) {
			if( enchantment_text !== "" ) {
				// Create enchantment
				var ench = EnchantmentFromHtml(enchantment_text, outfit);
				if( ench !== null ) {
				console.log(ench);
					this.addEnchantment( ench );
				}
			}
		}, outfit);
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		console.error(errorThrown);
	}).always( function() {
		console.log("OUTFIT DONE");
		finishedFlags.Outfit = true;
		afterCharacterSheets(finishedFlags);
	});
};


//################################# SIGN ##################################

// --- CONSTRUCTORS ---

function Sign( id ) {
	var enchantmentArray = new Array();
	switch( id ) {
		case "The Mongoose":
			enchantmentArray.push(new Enchantment(Stats.musGain,10,true,false,10,this));
			break;
		case "The Wallaby":
			break;
		case "The Vole":
			break;
		case "The Platypus":
			break;
		case "The Opossum":
			break;
		case "The Marmot":
			break;
		case "The Wombat":
			break;
		case "The Blender":
			break;
		case "The Packrat":
			break;
		case "":
		default:
			break;
	}
	Ench_Object.call(this, id, id, []);
//	this.category = "Sign";

	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};
Sign.prototype = Object.create(Ench_Object.prototype);
Sign.prototype.constructor = Sign;


//################################# ENCH_OBJECTS ##################################

// Enchanted objects global storage object.
Ench_Objects = {
	Equipment: {},
	Skill: {},
	Buff: {},
	Outfit: null,
	Sign: null,
	addObject : function( ench_obj ) {
		// Argument Type Error Checking
		if( ! this instanceof Ench_Object) {
			throw new TypeError("Ench_Objects::addObject() => ench_obj must inherit from the Ench_Object class.");
		}

		// Add object to proper list/category in Ench_Objects
//		var ench_obj_type = ench_obj.constructor.name.toLowerCase();
		var ench_obj_type = ench_obj.constructor.name;
		if( this[ench_obj_type] === null || this[ench_obj_type] instanceof Ench_Object ) {
			this[ench_obj_type] = ench_obj;
		}
		else {
			this[ench_obj_type][ench_obj.id] = ench_obj;
		}
	},
	removeObject : function( type, id ) {
		// Argument Type Error Checking
		if( typeof(type) === "undefined" || ( type !== "Equipment" && type !== "Skill" && type !== "Buff" && type !== "Outfit" && type !== "Sign" ) ) {
			if( typeof(type) === "undefined" ) {
				type = "undefined";
			}
			throw new TypeError("Ench_Objects::removeObject() => type must be one of the following strings: \"Equipment\", \"Skills\", \"Buffs\", \"Outfit\", or \"Sign\". type == " + type);
		}
		
		if( typeof(id) !== "undefined" ) {
			if( typeof(id) === "string" ) {
				id = parseInt(id,10);
			}
			if( typeof(id) !== "number" ) {
				throw new TypeError("Ench_Objects::removeObject() => id must be a number.");
			}
		}
		
		// Remove enchantments from the object (& stats variable) and then
		// Remove the object itself from Ench_Objects
		console.log(id);
		if( typeof(id) !== "undefined" ) {
			this[type][id].removeAllEnchantments();
			delete this[type][id];
		}
		else if( this[type] !== null ) {
			this[type].removeAllEnchantments();
			this[type][id] = null;
		}
	}
};