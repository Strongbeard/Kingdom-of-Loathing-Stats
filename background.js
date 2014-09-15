//---------------------------------- RULES -------------------------------------

// Specifies that page action icon only appears on KoL game page
var pageActionRule = {
	conditions: [
		new chrome.declarativeContent.PageStateMatcher({
			pageUrl: { urlEquals: "http://www.kingdomofloathing.com/game.php" }
		})
	],
	actions: [
		new chrome.declarativeContent.ShowPageAction()
	]
};


//------------------------ GLOBAL VARIABLES & CLASSES --------------------------


// CLASSES
/*function ITEM() {
	this.index = "";
	this.enchantments = []
}

function ITEM_LIST() {
	
}*/


// GLOBAL VARIABLES
var stats = JSON.parse(localStorage.getItem("stats"));
if( stats === null ) {
	var stats = {
		mus: [0,0],
		mys: [0,0],
		mox: [0,0],
		hp: [0,0],
		mp: [0,0],
		musGain:[0,0],
		mysGain: [0,0],
		moxGain: [0,0],
		randGain: [0,0],
		weaponDmg: [0,0],
		spellDmg: [0,0],
		rangedDmg: 0,
		cold_Wpn_Dmg: [0,0],
		cold_Spell_Dmg: [0,0],
		hot_Wpn_Dmg: [0,0],
		hot_Spell_Dmg: [0,0],
		sleaze_Wpn_Dmg: [0,0],
		sleaze_Spell_Dmg: [0,0],
		spooky_Wpn_Dmg: [0,0],
		spooky_Spell_Dmg: [0,0],
		stench_Wpn_Dmg: [0,0],
		stench_Spell_Dmg: [0,0],
		damage_absorb: 0,
		damage_resist: 0,
		cold_resist: 0,
		hot_resist: 0,
		sleaze_resist: 0,
		slime_resist: 0,
		spooky_resist: 0,
		stench_resist: 0,
		initiative: 0,
		monster_level: 0,
		item_find: 0,
		meat_find: 0,
		pickpocket: 0,
		hp_regen: [0,0],
		mp_regen: [0,0],
		adventures: 0
	}
}

var ascensions = JSON.parse(localStorage.getItem("ascensions"));

var equipment = JSON.parse(localStorage.getItem("equipment"));
if( equipment === null )
{
	equipment = new Object();
}

var active_effects = JSON.parse(localStorage.getItem("active_effects"));
if( active_effects === null )
{
	active_effects = new Object();
}

var skill_effects = JSON.parse(localStorage.getItem("skill_effects"));
if( skill_effects === null )
{
	skill_effects = new Object();
}

var passive_effects = JSON.parse(localStorage.getItem("passive_effects"));
if( passive_effects === null )
{
	passive_effects = new Object();
}

var outfit = JSON.parse(localStorage.getItem("outfit"));
if( outfit === null )
{
	outfit = new Object();
}


//---------------------------------FUNCTIONS-----------------------------------

function readAPICharacterSheet() {
	// AJAX call to get character sheet from KoL API
	$.getJSON("http://www.kingdomofloathing.com/api.php?what=status&for=Kol_Tool", function(newData, status) {
		// Makes ajax synchronous. Remove when ready to make async.
		jQuery.ajaxSetup({async:false});

		// --- EQUIPMENT ---
		
		// Loops through equipment loaded from memory
		// Removes equipment that do not exist newData.equipment
		$.each( equipment, function( equipSlotName ) {
			if(newData.equipment[equipSlotName] === undefined ) {
				$.each( equipment[equipSlotName].enchantments, function(index, enchantment) {
					updateEnchantment( enchantment, false );
				});
				equipment[equipSlotName] = { equipNum: 0, enchantments: [] };
			}
		});
		
		// Loops through equipment from KOL API call
		// Adds/changes any new/altered equipment
		$.each( newData.equipment, function( equipSlotName, equipNum) {
			// Add previously undefined equipment slots
			if( equipment[equipSlotName] === undefined ) {
				equipment[equipSlotName] = { equipNum: 0, enchantments: [] };
			}

			// If there is a difference in KOL API equipment and loaded equipment...
			if( equipment[equipSlotName].equipNum != equipNum ) {
				// remove loaded equipment if it has been unequipped
				if( equipment[equipSlotName].equipNum != 0 ) {
					$.each( equipment[equipSlotName].enchantments, function(index, enchantment) {
						updateEnchantment( enchantment, false );
					});
					equipment[equipSlotName] = { equipNum: 0, enchantments: [] };
				}
				
				// update equipment slot with the new KoL API's equipment
				if( equipNum != 0 ) {
					equipment[equipSlotName] = { equipNum: equipNum, enchantments: getEquipEnchantArray( equipNum ) };
					$.each( equipment[equipSlotName].enchantments, function(index, enchantment) {
						updateEnchantment( enchantment, true );
					});
				}
			}
		});

		
		// --- ACTIVE EFFECTS ---
		
		// Removes any "worn off" active_effects
		$.each( active_effects, function( effect_id, enchantments ) {
			if( newData.effects[effect_id] === undefined ) {
				$.each( enchantments, function( index, enchantment ) {
					updateEnchantment( enchantment, false );
				});
				delete active_effects[effect_id];
			}
		});
		
		// If new effect not in active_effects, adds it and updates enchantments
		$.each( newData.effects, function( effect_id, effect_info ) {
			console.log(effect_id);
			if( active_effects[effect_id] === undefined )
			{
				active_effects[effect_id] = getEffectDesc(effect_id);
				$.each(active_effects[effect_id], function( index, enchantment ) {
console.log(enchantment);
					updateEnchantment( enchantment, true );
				});
			}
		});
	});
}

// Takes HTML from http://www.kingdomofloathing.com/charsheet.php and extracts information about it's skills
// Passive skill effects get added
function readHTMLCharacterSheet() {
	$.get( "http://www.kingdomofloathing.com/charsheet.php", function( charsheet_html, status, xhr ) {
console.log("PASSIVE EFFECTS:");

		// --- PASSIVE EFFECTS ---

		// Trim html to get a list of skillIDs
		skill_html = charsheet_html.substring(charsheet_html.search("Skills:"));
		skill_html = skill_html.substring(skill_html.search("<a"),skill_html.search("</table>"));
		skill_html = skill_html.substring(0,skill_html.search("/a><br></td>"));
		
		// Puts skillIDs into array
		var newSkillIDs = skill_html.split("</a><br>");
		for( var i = 0; i < newSkillIDs.length; i++)
		{
			//var skill_url = skill_list[i].substring(skill_list[i].search("poop")+6,skill_list[i].search("\",\"skill\""));
			newSkillIDs[i] = newSkillIDs[i].substring(newSkillIDs[i].search("whichskill=")+11,newSkillIDs[i].search("\&self"));
		}
console.log(newSkillIDs);
		
		
		// PASSIVE EFFECTS
		// Loops through skill_effects loaded from memory
		// Removes skill_effects that do not exist newSkillIDs
		$.each( skill_effects , function( skillID ) {
			if( ! $.inArray( skillID, newSkillIDs ) ) {
				if( skill_effects[skillID].passive == true ) {
console.log(skillID);
					$.each( skill_effects[skillID].enchantments, function(index, enchantment) {
						updateEnchantment( enchantment, false );
					});
				}
				delete skill_effects[skillID];
			}
		});

		
		// Performs an ajax call on each skill to get their enchantments
		$.each(newSkillIDs, function(index, newSkill) {
			if( skill_effects[newSkill] === undefined )
			{
				skill_effects[newSkill] = { passive: false, enchantments: [] };
				$.get( "http://www.kingdomofloathing.com/desc_skill.php?whichskill=" + newSkill + "&self=true", function( data ) {
					enchantments = decipherIngameDesc( data );
					skill_effects[newSkill].enchantments = enchantments;
					if( data.match(/passive/i) )
					{
						skill_effects[newSkill].passive = true;
						$.each( skill_effects[newSkill].enchantments, function(index, enchantment) {
							updateEnchantment( enchantment, true );
						});
					}
				}, 'html');
			}
		});
console.log(skill_effects);

		// --- OUTFIT ---
		
console.log("OUTFIT");
		// Checks if character is wearing an outfit
		if( charsheet_html.search("Outfit:") != -1 ) {
			outfit_num = charsheet_html.substring(charsheet_html.search("Outfit:"));
			outfit_num = outfit_num.substring(outfit_num.search("whichoutfit=")+12);
			outfit_num = outfit_num.substring(0,outfit_num.search("\""));
			$.ajax({
				url: "http://www.kingdomofloathing.com/desc_outfit.php?whichoutfit=" + outfit_num,
				async: false
			})
			.done(function(outfit_html, status, xhr) {
				console.log(outfit_html);
			});
		}
	}, 'html');
}


function updateEnchantment(enchantment, addOrRemoveFlag) {
	// Big switch statement utilizing /matching/.test() to determine
	// what stat the enchantment modifies
	switch(true)
	{
		// ALL DAMAGES
		case /damage/i.test(enchantment):
			// SPELL DAMAGE
			if( enchantment.match(/damage to.*spells/i) )
			{
				switch(true) {
					case /cold/i.test(enchantment):
						percentOrFlat( "cold_Spell_Dmg", enchantment, addOrRemoveFlag );
						break;
					case /hot/i.test(enchantment):
						percentOrFlat( "hot_Spell_Dmg", enchantment, addOrRemoveFlag );
						break;
					case /spooky/i.test(enchantment):
						percentOrFlat( "spooky_Spell_Dmg", enchantment, addOrRemoveFlag );
						break;
					case /sleaze/i.test(enchantment):
						percentOrFlat( "sleaze_Spell_Dmg", enchantment, addOrRemoveFlag );
						break;
					case /stench/i.test(enchantment):
						percentOrFlat( "stench_Spell_Dmg", enchantment, addOrRemoveFlag );
						break;
				}
			}
			else if( enchantment.match(/spell damage/i) )
			{
				percentOrFlat( "spellDmg", enchantment, addOrRemoveFlag );
			}
			// DAMAGE ABSORBTION
			else if( enchantment.match(/absorption/i) )
			{
				stats.damage_absorb += getModifier( enchantment, addOrRemoveFlag );
			}
			// DAMAGE REDUCTION
			else if( enchantment.match(/reduction/i) )
			{
				stats.damage_resist += getModifier( enchantment, addOrRemoveFlag );
			}
			// RANGED DAMAGE
			else if( enchantment.match(/ranged damage/i) )
			{
				stats.rangedDmg += getModifier( enchantment, addOrRemoveFlag );
			}
			// WEAPON DAMAGE
			else
			{
				switch(true)
				{
					case /weapon/i.test(enchantment):
						percentOrFlat( "weaponDmg", enchantment, addOrRemoveFlag );
						break;
					case /cold/i.test(enchantment):
						percentOrFlat( "cold_Wpn_Dmg", enchantment, addOrRemoveFlag );
						break;
					case /hot/i.test(enchantment):
						percentOrFlat( "hot_Wpn_Dmg", enchantment, addOrRemoveFlag );
						break;
					case /spooky/i.test(enchantment):
						percentOrFlat( "spooky_Wpn_Dmg", enchantment, addOrRemoveFlag );
						break;
					case /sleaze/i.test(enchantment):
						percentOrFlat( "sleaze_Wpn_Dmg", enchantment, addOrRemoveFlag );
						break;
					case /stench/i.test(enchantment):
						percentOrFlat( "stench_Wpn_Dmg", enchantment, addOrRemoveFlag );
						break;
				}
			}
			break;
		// RESISTANCE
		case /resistance/i.test(enchantment):
			switch(true)
			{
				case /cold/i.test(enchantment):
					stats.cold_resist += getModifier( enchantment, addOrRemoveFlag );
					break;
				case /hot/i.test(enchantment):
					stats.hot_resist += getModifier( enchantment, addOrRemoveFlag );
					break;
				case /sleaze/i.test(enchantment):
					stats.sleaze_resist += getModifier( enchantment, addOrRemoveFlag );
					break;
				case /spooky/i.test(enchantment):
					stats.spooky_resist += getModifier( enchantment, addOrRemoveFlag );
					break;
				case /stench/i.test(enchantment):
					stats.stench_resist += getModifier( enchantment, addOrRemoveFlag );
					break;
			}
			break;
		// STAT GAINS
		case /stat\(?s\)? per fight|gains/i.test(enchantment):
		console.log(enchantment);
			switch(true)
			{
				case /muscle/i.test(enchantment):
					percentOrFlat( "musGain", enchantment, addOrRemoveFlag );
					break;
				case /mysticality/i.test(enchantment):
					percentOrFlat( "mysGain", enchantment, addOrRemoveFlag );
					break;
				case /moxie/i.test(enchantment):
					percentOrFlat( "moxGain", enchantment, addOrRemoveFlag );
					break;
				default:
					percentOrFlat( "randGain", enchantment, addOrRemoveFlag );
					break;
			}
			break;
		// COMBAT INITIATIVE
		case /combat initiative/i.test(enchantment):
			stats.initiative += getModifier( enchantment, addOrRemoveFlag );
			break;
		// MONSTER LEVEL
		case /monster level/i.test(enchantment):
			stats.monster_level += getModifier( enchantment, addOrRemoveFlag );
			break;
		// ITEM DROP RATE
		case /item drops/i.test(enchantment):
			stats.item_find += getModifier( enchantment, addOrRemoveFlag );
			break;
		// MEAT FIND RATE
		case /meat/i.test(enchantment):
			stats.meat_find += getModifier( enchantment, addOrRemoveFlag );
			break;
		case /pickpocket/i.test(enchantment):
			stats.pickpocket += getModifier( enchantment, addOrRemoveFlag);
			break;
		// HP REGENERATION
		case /regenerate .* hp per adventure/i.test(enchantment):
			rangeModifier( "hp_regen", enchantment, addOrRemoveFlag );
			break;
		// MP REGENERATION
		case /regenerate .* mp/i.test(enchantment):
			rangeModifier( "mp_regen", enchantment, addOrRemoveFlag );
			break;
		// ADVENTURES PER DAY
		case /adventure\(s\) per day/i.test(enchantment):
			stats.adventures += getModifier( enchantment, addOrRemoveFlag );
			break;
		// MUSCLE
		case /muscle/i.test(enchantment):
			percentOrFlat( "mus", enchantment, addOrRemoveFlag );
			break;
		// MYSTICALITY
		case /mysticality/i.test(enchantment):
			percentOrFlat( "mys", enchantment, addOrRemoveFlag );
			break;
		// MOXIE
		case /moxie/i.test(enchantment):
			percentOrFlat( "mox", enchantment, addOrRemoveFlag );
			break;
		// ALL ATTRIBUTES
		case /all attributes/i.test(enchantment):
			percentOrFlat( "mus", enchantment, addOrRemoveFlag );
			percentOrFlat( "mys", enchantment, addOrRemoveFlag );
			percentOrFlat( "mox", enchantment, addOrRemoveFlag );
			break;
		// HP
		case /maximum hp/i.test(enchantment):
			percentOrFlat( "hp", enchantment, addOrRemoveFlag );
			break;
		// MP
		case /maximum mp/i.test(enchantment):
			percentOrFlat( "mp", enchantment, addOrRemoveFlag );
			break;
		default:
			console.log("ENCHANTMENT NOT DISPLAYED: " + enchantment);
			break;
	}
}

function getEquipEnchantArray( equipNum ) {
console.log("EQUIPNUM: " + equipNum);
	var array;
	if( equipNum > 0 )
	{
		// AJAX call to KoL API for inventory item description
		$.ajax({
			dataType: "json",
			url:	"http://www.kingdomofloathing.com/api.php?what=item&for=Kol_Tool&id=" + equipNum,
			async:	false,
			success: function(result) {
				return $.ajax({
					url:	"http://www.kingdomofloathing.com/desc_item.php?whichitem=" + result.descid,
					async:	false,
					success: function(result) {
						array =  decipherIngameDesc(result);
					}
				});
			}
		});
	}
	else
	{
		return new Array();
	}
	return array;
}


// 
function decipherIngameDesc(data) {
	// Enchantment data will come after the html blockquote tag
	if( data.match(/<blockquote[^>]*>/i) )
	{
		var ench_data = data.slice(data.indexOf("<blockquote"));
		
		// Enchantment data will come after the html center tag
		if( ench_data.match("<center>") )
		{
			ench_data = ench_data.slice(ench_data.indexOf("<center>")+8,ench_data.indexOf("</center>"));

			// Enchantment data will be within the html font color=blue tag
			if( ench_data.match("<font color=blue"))
			{
				ench_data = ench_data.slice(ench_data.indexOf("<font color=blue"),ench_data.lastIndexOf("</font>"));
				ench_data = ench_data.slice(ench_data.indexOf(">")+1);
				/*if( ench_data.match( "<b>" ) )
				{
					ench_data = ench_data.slice(ench_data.indexOf("<b>")+3,ench_data.lastIndexOf("</b>"));
				}*/

				// split data on <br> tag to array. Remove all other html tags from data.
				var ench_list = ench_data.split( "<br>" );
				for( var i = 0; i < ench_list.length; i++) {
					ench_list[i] = ench_list[i].replace(/<[^>]*>/g,"");
				}
				
				// Removes empty parts of arrays & returns array
				ench_list = ench_list.filter(function(n){return n});
				return ench_list;
/*				for(var i = 0; i < ench_list.length; i++)
				{
					if( ench_list[i] != "" )
					{
						addEnchantment( ench_list[i].toLowerCase() );
					}
				}*/
			}
		}
	}
	// Return empty array if could not find enchantments
	return new Array();
}

function getEffectDesc(effect_id) {
	var array;
	$.ajax({
		url: "http://www.kingdomofloathing.com/desc_effect.php?whicheffect=" + effect_id,
		success: function(result) { array = decipherIngameDesc(result); },
		async:false
	});
	return array;
}


// Checks if the modifier is a percentage or flat value & adds it
// Takes the modifier size 2 array & enchantment string
function percentOrFlat( statName, enchantment, addOrRemoveFlag )
{
	if( ! enchantment.match("%") )
	{
		stats[statName][0] += getModifier(enchantment, addOrRemoveFlag);
	}
	else
	{
		stats[statName][1] += getModifier(enchantment, addOrRemoveFlag);
	}
}

// Gets the high and low numbers of a range in an enchantment
function rangeModifier( statName, enchantment, addOrRemoveFlag)
{
	if( enchantment.match(/\d+\-\d+/) )
	{
		if( addOrRemoveFlag )
		{
			stats[statName][0] += parseInt( enchantment.match(/\d+/g)[0] );
			stats[statName][1] += parseInt( enchantment.match(/\d+/g)[1] );
		}
		else
		{
			stats[statName][0] -= parseInt( enchantment.match(/\d+/g)[0] );
			stats[statName][1] -= parseInt( enchantment.match(/\d+/g)[1] );
		}
	}
	else
	{
		console.log("ERROR: rangeModifier(mod, enchantment) can't find range for: \"" + enchantment + "\"");
	}
}

// Extracts the numerical modifier from the enchantment string
// & casts it to an int
function getModifier( enchantment, addOrRemoveFlag )
{
	var num = parseInt( enchantment.match(/\+?\-?\d+/) );
	if( ! isNaN(num) ) {
		if( addOrRemoveFlag )
		{
			return parseInt( enchantment.match(/\+?\-?\d+/) );
		}
		else
		{
			return parseInt( - enchantment.match(/\+?\-?\d+/) );
		}
	}
	else {
		console.log("ENCHANTMENT NOT DISPLAYED: " + enchantment);
		return 0;
	}
}





// 

// Show's this extention's page_action icon if url is
// http://www.kingdomofloathing.com/game.php
/*chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.url === "http://www.kingdomofloathing.com/game.php"){
		chrome.pageAction.show(tabId);
	}
});*/


//----------------------------------EVENTS-------------------------------------

// Adds page action rule on install
chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([pageActionRule]);
	});
});

// Makes clicking on page action button open a popup window
chrome.pageAction.onClicked.addListener( function() {
	chrome.windows.create({
		"url": "popup.html",
		"type": "popup",
		"width": 450,
		"height": 500
	});
});

chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
	if( changeInfo.status !== undefined && changeInfo.status == "complete" && tab.url == "http://www.kingdomofloathing.com/game.php" ) {
		readAPICharacterSheet();
		readHTMLCharacterSheet();
		chrome.runtime.sendMessage("PRINT");
	}
});

/*chrome.webRequest.onCompleted.addListener(function(request) {
	console.log(request);
	if( request.url == "http://www.kingdomofloathing.com/charpane.php") {
		readAPICharacterSheet();
		chrome.runtime.sendMessage("PRINT");
	}
	
},{urls:["http://www.kingdomofloathing.com/*\.php"], types: ["sub_frame"]},[]);
*/

/*chrome.runtime.onStartup.addListener(function() {
});*/

//chrome.webNavigation.onCompleted.addListener(function(request){
//	if( request.url.match(/http:\/\/www.kingdomofloathing.com\/*/i)) {
//		console.log(request.url);
//	}
//});