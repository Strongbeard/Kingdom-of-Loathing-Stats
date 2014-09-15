// Global variable allowing access to the background page.
var GLOBAL = chrome.extension.getBackgroundPage();

// Prints out the stats once the page loads
$(document).ready(function(){
	$('.dropdownPlusMinus a').click(function(){
		$(this).toggleClass('plusButton');
		$(this).toggleClass('minusButton');
		$(this).parent().children("ul").toggle();
	});
	
	printStats();
});

// Reprints the stats when notified that the stats have changes by background.js
chrome.runtime.onMessage.addListener(function() {
	console.log("RECIEVED MESSAGE");
	printStats();
});









//-------------------------------------------------------------------------------------

function printStats() {
//	printStat( "mus", GLOBAL.stats.mus, "Muscle Mod" );
//	printStat( "mys", GLOBAL.stats.mys, "Mysticality Mod");
//	printStat( "mox", GLOBAL.stats.mox, "Moxie Mod");
//	printStat( "HP", GLOBAL.stats.hp, "HP Mod");
//	printStat( "MP", GLOBAL.stats.mp, "MP Mod");
	$("#mus").html( "Muscle Mod: " + GLOBAL.stats.mus[0] + " (" + GLOBAL.stats.mus[1] + "%)" );
	$("#mys").html( "Mysticality Mod: " + GLOBAL.stats.mys[0] + " (" + GLOBAL.stats.mys[1] + "%)" );
	$("#mox").html( "Moxie Mod: " + GLOBAL.stats.mox[0] + " (" + GLOBAL.stats.mox[1] + "%)" );
	$("#HP").html( "HP Mod: " + GLOBAL.stats.hp[0] + " (" + GLOBAL.stats.hp[1] + "%)" );
	$("#MP").html( "MP Mod: " + GLOBAL.stats.mp[0] + " (" + GLOBAL.stats.mp[1] + "%)" );
	$("#WDmg").html( "WeaponDmg Mod: <b>" + GLOBAL.stats.weaponDmg[0] + " (" + GLOBAL.stats.weaponDmg[1] + "%) " +
		"<span class=\"spooky\">" + GLOBAL.stats.spooky_Wpn_Dmg[0] + " (" + GLOBAL.stats.spooky_Wpn_Dmg[1] + "%)</span> " +
		"<span class=\"stench\">" + GLOBAL.stats.stench_Wpn_Dmg[0] + " (" + GLOBAL.stats.stench_Wpn_Dmg[1] + "%)</span> " +
		"<span class=\"cold\">" + GLOBAL.stats.cold_Wpn_Dmg[0] + " (" + GLOBAL.stats.cold_Wpn_Dmg[1] + "%)</span> " +
		"<span class=\"hot\">" + GLOBAL.stats.hot_Wpn_Dmg[0] + " (" + GLOBAL.stats.hot_Wpn_Dmg[1] + "%)</span> " + 
		"<span class=\"sleaze\">" + GLOBAL.stats.sleaze_Wpn_Dmg[0] + " (" + GLOBAL.stats.sleaze_Wpn_Dmg[1] + "%)</span></b> "
	);
	$("#SDmg").html( "SpellDmg Mod: <b>" + GLOBAL.stats.spellDmg[0] + " (" + GLOBAL.stats.spellDmg[1] + "%) " +
		"<span class=\"spooky\">" + GLOBAL.stats.spooky_Spell_Dmg[0] + " (" + GLOBAL.stats.spooky_Spell_Dmg[1] + "%)</span> " +
		"<span class=\"stench\">" + GLOBAL.stats.stench_Spell_Dmg[0] + " (" + GLOBAL.stats.stench_Spell_Dmg[1] + "%)</span> " +
		"<span class=\"cold\">" + GLOBAL.stats.cold_Spell_Dmg[0] + " (" + GLOBAL.stats.cold_Spell_Dmg[1] + "%)</span> " +
		"<span class=\"hot\">" + GLOBAL.stats.hot_Spell_Dmg[0] + " (" + GLOBAL.stats.hot_Spell_Dmg[1] + "%)</span> " + 
		"<span class=\"sleaze\">" + GLOBAL.stats.sleaze_Spell_Dmg[0] + " (" + GLOBAL.stats.sleaze_Spell_Dmg[1] + "%)</span></b> "
	);
	$("#RangedDmg").html( "RangedDmg Mod: <b>" + GLOBAL.stats.rangedDmg + "</b>" );
	$("#init").html( "Combat Initiative: " + GLOBAL.stats.initiative + "%" );
	$("#DA").html( "Damage Absorbtion Bonus: " + GLOBAL.stats.damage_absorb );
	$("#DR").html( "Damage Reduction Bonus: " + GLOBAL.stats.damage_resist );
	$("#cold_resist").html( "<span class=\"cold\">Cold Resist: " + GLOBAL.stats.cold_resist + "</span>" );
	$("#hot_resist").html( "<span class=\"hot\">Hot Resist: " + GLOBAL.stats.hot_resist + "</span>");
	$("#sleaze_resist").html( "<span class=\"sleaze\">Sleaze Resist: " + GLOBAL.stats.sleaze_resist + "</span>" );
	$("#slime_resist").html( "<span class=\"slime\">Slime Resist: " + GLOBAL.stats.slime_resist + "</span>" );
	$("#spooky_resist").html( "<span class=\"spooky\">Spooky Resist: " + GLOBAL.stats.spooky_resist + "</span>");
	$("#stench_resist").html( "<span class=\"stench\">Stench Resist: " + GLOBAL.stats.stench_resist + "</span>" );
	$("#musGain").html( "Muscle Gain: " + GLOBAL.stats.musGain[0] + " (" + GLOBAL.stats.musGain[1] + "%)" );
	$("#mysGain").html( "Mysticality Gain: " + GLOBAL.stats.mysGain[0] + " (" + GLOBAL.stats.mysGain[1] + "%)" );
	$("#moxGain").html( "Moxie Gain: " + GLOBAL.stats.moxGain[0] + " (" + GLOBAL.stats.moxGain[1] + "%)" );
	$("#mosterLevel").html( "Monster Level: " + GLOBAL.stats.monster_level );
	$("#itemFind").html( "Item Find: " + GLOBAL.stats.item_find + "%" );
	$("#meatFind").html( "Meat Find: " + GLOBAL.stats.meat_find + "%" );
	$("#pickpocket").html( "Pickpocket: " + GLOBAL.stats.pickpocket + "%" );
	$("#HP_Regen").html( "HP Regen: " + GLOBAL.stats.hp_regen[0] + "-" + GLOBAL.stats.hp_regen[1] );
	$("#MP_Regen").html( "MP Regen: " + GLOBAL.stats.mp_regen[0] + "-" + GLOBAL.stats.mp_regen[1] );
	$("#Adventures").html( "Extra Rollover Adventures: " + GLOBAL.stats.adventures );
	$("#FamWt").html(  );
	$("#RangedDmg").html(  );
	$("#WeaponCrit").html(  );
	$("#SpellCrit").html(  );
	$("#Fumble").html(  );
	$("#Stun").html(  );
	$("#PassDmg").html(  );
	$("#MPCost").html(  );
	$("#combat").html(  );
	$("#hobo").html(  );
}

// 
function printStat( htmlID, value, text, percent_flag, range_flag, span_class ) {
console.log(htmlID);
console.log(value);
	// Parameter Defaults
	percent_flag = percent_flag || false;
	range_flag = range_flag || false;
	span_class = span_class || null;
	htmlText = "";
	
	// Add span if span_class present
	if( span_class !== null ) {
		htmlText = "<span class=\"" + span_class + "\">";
	}
	
	// Name of the stat being shown added.
	htmlText += text + ": ";
	
	// Values of the stat added. Can be a range, a percent, a flat, or a percent and flat number.
	if( value[1] !== undefined && range_flag ) {
		htmlText += value[0] + "-" + value[1];
console.log(1);
	}
	else if( value[1] !== undefined ) {
		htmlText += value[0] + " (" + value[1] + "%)";
console.log(2);
	}
	else if( percent_flag ) {
		htmlText += value + "%";
console.log(3);
	}
	else {
console.log(4);
		htmlText += value;
	}
	
	// Add span closing tag
	if( span_class !== null ) {
		htmlText += "</span>";
	}

	// Show variables if value is non-zero. Otherwise, hide.
	if( value[1] !== undefined ) {
		if( value[0] == 0 && value[1] == 0 ) {
			$("#" + htmlID).hide(0);
		}
		else {
			$("#" + htmlID).html(htmlText);
			$("#" + htmlID).show(0);
		}
	}
	else {
		if( value == 0 ) {
			$("#" + htmlID).hide(0);
		}
		else {
			$("#" + htmlID).html(htmlText);
			$("#" + htmlID).show(0);
		}
	}
}