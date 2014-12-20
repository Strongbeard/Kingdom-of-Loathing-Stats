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
	
	if( !ench_obj instanceof Ench_Object && this.ench_obj !== null ) {
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

function EnchantmentFromHtml( html_line, ench_obj ) {
	stat = getEnchNameFromHTML(html_line);
	if( stat !== null ) {
		value = getEnchValueFromHTML(html_line, stat);
		percent = (html_line.indexOf("%") !== -1) ? true : false;
		if( stat.range ) {
			return new Enchantment( stat, value[0], percent, true, value[1], ench_obj );
		}
		else {
			return new Enchantment( stat, value, percent, false, null, ench_obj );
		}
	}
	else if( ! enchNameMatchNonEnchantment( html_line ) ) {
		return new Enchantment( Stats.other, 0, false, false, null, ench_obj );
	}
	else {
		return null;
	}
}

function getEnchNameFromHTML( html_line ) {
	html_line = html_line.toLowerCase();
	var name = html_line.match(/(damage|resistance|stat|combat initiative|monster level|item drops|meat|pickpocket|regenerate|adventure|muscle|mysticality|moxie|all attributes|maximum hp|maximum mp|familiar weight)/);
	if( name !== null ) {
		switch(name[0]) {
			case "adventure":
				return Stats.adventures;
			case "all attributes":
				return Stats.randGain;
			case "combat initiative":
				return Stats.initiative;
			case "damage":
				if( html_line.indexOf("spell") ) {
					console.log( html_line );
					var spellType = html_line.match(/(cold|hot|spooky|sleaze|stench)/);
					if( spellType !== null ) {
						switch(spellType[0]) {
							case "cold":
								return Stats.coldSpellDmg;
							case "hot":
								return Stats.hotSpellDmg;
							case "spooky":
								return Stats.spookySpellDmg;
							case "sleaze":
								return Stats.sleazeSpellDmg;
							case "stench":
								return Stats.stenchSpellDmg;
							default:
								console.error("Hit default case of getStatName()'s spell damage switch statement in Enchantment.js. Never supposed to hit this line in the code.");
								return null;
						}
					}
					else {
						return Stats.spellDmg;
					}
				}
				else {
					var damageType = html_line.match(/(absorption|cold|hot|ranged|reduction|spooky|sleaze|stench)/);
					if( damageType !== null ) {
						switch(damageType[0]) {
							case "absorption":
								return Stats.damageAbsorption;
							case "cold":
								return Stats.coldWpnDmg;
							case "hot":
								return Stats.hotWpnDmg;
							case "ranged":
								return Stats.rangedDmg;
							case "reduction":
								return Stats.damageReduction;
							case "spooky":
								return Stats.spookyWpnDmg;
							case "sleaze":
								return Stats.sleazeWpnDmg;
							case "stench":
								return Stats.stenchWpnDmg;
							default:
								console.error("Hit default case of getStatName()'s weapon damage switch statement in Enchantment.js. Never supposed to hit this line in the code.");
								return null;
						}
					}
					else {
						return Stats.weaponDmg;
					}
				}
				break;
			case "familiar weight":
				return Stats.familiarWeight;
			case "item drops":
				return Stats.itemFind;
			case "maximum hp":
				return Stats.HP;
			case "meat":
				return Stats.meatFind;
			case "maximum mp":
				return Stats.MP;
			case "monster level":
				return Stats.monsterLevel;
			case "moxie":
				return Stats.mox;
			case "muscle":
				return Stats.mus;
			case "mysticality":
				return Stats.mys;
			case "pickpocket":
				return Stats.pickpocket;
			case "regenerate":
				var regenType = html_line.match(/(hp|mp)/);
				if( html_line !== null ) {
					switch(regenType[0]) {
						case "hp":
							return Stats.hpRegen;
						case "mp":
							return Stats.mpRegen;
						default:
							console.error("Hit default case of getStatName()'s regen switch statement in Enchantment.js. Never supposed to hit this line in the code.");
							return null;
					}
				}
				else {
					console.error("Hit default case of getStatName()'s regen switch statement in Enchantment.js. Never supposed to hit this line in the code.");
					return null;
				}
				break;
			case "resistance":
				var resistType = html_line.match(/(cold|hot|spooky|sleaze|stench)/);
				if( resistType !== null ) {
					switch(resistType[0]) {
						case "cold":
							return Stats.coldResist;
						case "hot":
							return Stats.hotResist;
						case "spooky":
							return Stats.spookyResist;
						case "sleaze":
							return Stats.sleazeResist;
						case "stench":
							return Stats.stenchResist;
						default:
							console.error("Hit default case of getStatName()'s resistace switch statement in Enchantment.js. Never supposed to hit this line in the code.");
							return null;
					}
				}
				else {
					console.error("Hit default case of getStatName()'s resistace switch statement in Enchantment.js. Never supposed to hit this line in the code.");
					return null;
				}
				break;
			case "stat":
				break;
			default:
				if( ! enchNameMatchNonEnchantment( html_line ) ) {
					console.warn("Enchantment not displayed: " + html_line);
				}
		}
	}
	else {
		if( ! enchNameMatchNonEnchantment( html_line ) ) {
			console.warn("Enchantment not displayed: " + html_line);
		}
	}
	return null;
}

function getEnchValueFromHTML(html_line, stat) {
	value = html_line.match(/\s*-?\s*-?\s*\d+/g);
	if( stat.range ) {
		return [
			parseInt(value[0].replace(/\s+/,""),10),
			parseInt(value[1].replace(/\s+/,"").substr(1),10)
		];
	}
	else {
		return parseInt(value[0].replace(/\s+/,""),10);
	}
}

function enchNameMatchNonEnchantment(name) {
	if( name.search(/(\(Bonus for \w+ only\))/i) ) {
		return true;
	}
	return false;
}