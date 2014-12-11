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

	this.scrapeData = function ( finishedFlags, new_equipment_flags ) {
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
				console.log(doc);
/*				try {*/
					// Scrape equipment name & enchantment text from html
					equip.name = $( "#description>center>b", doc )[0].innerText;
					enchantments = $("blockquote>center>b>font", doc);
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
/*				}
				catch( err ) {
					if( err instanceof TypeError && err.message === "" ) {
						console.error("Equipment id " + equip.id + " unable to read response equipment html");
					}
					else {
						throw err;
					}
				}*/
				
				// --- All Finished Call Attempt ---
				// Set this equipment id to finished (true)
				new_equipment_flags[equip.id] = true;
				
				// Check if all new equipment is finished processing
				setFinishedFlag = true;
				$.each(new_equipment_flags, function(id, value) {
					if( !value ) {
						setFinishedFlag = false;
					}
				});
				
				// Attempt to call process to run after all AJAX finished
				if( setFinishedFlag ) {
					finishedFlags.Equipment = true;
					afterCharacterSheets(finishedFlags);
				}
			}).fail( function( jqXHR, textStatus, errorThrown ) {
				console.error(errorThrown);
			});
		}).fail( function( jqXHR, textStatus, errorThrown ) {
			console.error(errorThrown);
		});
	};
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};


//################################# SKILL ##################################

// --- CONSTRUCTORS ---

function Skill( id, name, enchantments ) {
	Ench_Object.call(this, id, name, enchantments);
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;


//################################# BUFF ##################################

// --- CONSTRUCTORS ---

function Buff( id, name, enchantments ) {
	Ench_Object.call(this, id, name, enchantments);
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;


//################################# OUTFIT ##################################

// --- CONSTRUCTORS ---

function Outfit( id, name, enchantments ) {
	Ench_Object.call(this, id, name, enchantments);
	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;


//################################# SIGN ##################################

// --- CONSTRUCTORS ---

function Sign( id, name, enchantments ) {
	Ench_Object.call(this, id, name, enchantments);

	
	// Add self to Ench_Objects to enable tracking of this object
	Ench_Objects.addObject(this);
};
Equipment.prototype = Object.create(Ench_Object.prototype);
Equipment.prototype.constructor = Equipment;


//################################# ENCH_OBJECTS ##################################

// Enchanted objects global storage object.
Ench_Objects = {
	equipment: {},
	skill: {},
	buff: {},
	outfit: null,
	sign: null,
	addObject : function( ench_obj ) {
		// Argument Type Error Checking
		if( ! this instanceof Ench_Object) {
			throw new TypeError("Ench_Objects::addObject() => ench_obj must inherit from the Ench_Object class.");
		}

		// Add object to proper list
		this[ench_obj.constructor.name.toLowerCase()][ench_obj.id] = ench_obj;
	},
	removeObject : function( type, id ) {
		// Argument Type Error Checking
		if( typeof(type) === "undefined" || ( type !== "equipment" && type !== "skill" && type !== "buff" && type !== "outfit" && type !== "sign" ) ) {
			throw new TypeError("Ench_Objects::removeObject() => type must be one of the following strings: \"equipment\", \"skills\", \"buffs\", \"outfit\", or \"sign\"");
		}
		
		if( typeof(id) === "string" ) {
			id = parseInt(id,10);
		}
		if( typeof(id) !== "number" ) {
			throw new TypeError("Ench_Objects::removeObject() => id must be a number.");
		}
		
		// Remove enchantments from the object (& stats variable)
		this[type][id].removeAllEnchantments();
		
		// Remove the object from 
		delete this[type][id];
	}
};