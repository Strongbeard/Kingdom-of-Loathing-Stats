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
//	printStat( "mus", GLOBAL.Stats.mus, "Muscle Mod" );
//	printStat( "mys", GLOBAL.Stats.mys, "Mysticality Mod");
//	printStat( "mox", GLOBAL.Stats.mox, "Moxie Mod");
//	printStat( "HP", GLOBAL.Stats.hp, "HP Mod");
//	printStat( "MP", GLOBAL.Stats.mp, "MP Mod");
	$("#mus").html( "Muscle Mod: " + (GLOBAL.Stats.mus.value + GLOBAL.Stats.allAttributes.value) + " (" + (GLOBAL.Stats.mus.percentValue + GLOBAL.Stats.allAttributes.percentValue) + "%)" );
	$("#mys").html( "Mysticality Mod: " + (GLOBAL.Stats.mys.value + GLOBAL.Stats.allAttributes.value) + " (" + (GLOBAL.Stats.mys.percentValue + GLOBAL.Stats.allAttributes.percentValue) + "%)" );
	$("#mox").html( "Moxie Mod: " + (GLOBAL.Stats.mox.value + GLOBAL.Stats.allAttributes.value) + " (" + (GLOBAL.Stats.mox.percentValue + GLOBAL.Stats.allAttributes.percentValue) + "%)" );
	$("#HP").html( "HP Mod: " + GLOBAL.Stats.HP.value + " (" + GLOBAL.Stats.HP.percentValue + "%)" );
	$("#MP").html( "MP Mod: " + GLOBAL.Stats.MP.value + " (" + GLOBAL.Stats.MP.percentValue + "%)" );
	$("#WDmg").html( "WeaponDmg Mod: <b>" + GLOBAL.Stats.weaponDmg.value + " (" + GLOBAL.Stats.weaponDmg.percentValue + "%) " +
		"<span class=\"spooky\">" + GLOBAL.Stats.spookyWpnDmg.value + " (" + GLOBAL.Stats.spookyWpnDmg.percentValue + "%)</span> " +
		"<span class=\"stench\">" + GLOBAL.Stats.stenchWpnDmg.value + " (" + GLOBAL.Stats.stenchWpnDmg.percentValue + "%)</span> " +
		"<span class=\"cold\">" + GLOBAL.Stats.coldWpnDmg.value + " (" + GLOBAL.Stats.coldWpnDmg.percentValue + "%)</span> " +
		"<span class=\"hot\">" + GLOBAL.Stats.hotWpnDmg.value + " (" + GLOBAL.Stats.hotWpnDmg.percentValue + "%)</span> " + 
		"<span class=\"sleaze\">" + GLOBAL.Stats.sleazeWpnDmg.value + " (" + GLOBAL.Stats.sleazeWpnDmg.percentValue + "%)</span></b> "
	);
	$("#SDmg").html( "SpellDmg Mod: <b>" + GLOBAL.Stats.spellDmg.value + " (" + GLOBAL.Stats.spellDmg.percentValue + "%) " +
		"<span class=\"spooky\">" + GLOBAL.Stats.spookySpellDmg.value + " (" + GLOBAL.Stats.spookySpellDmg.percentValue + "%)</span> " +
		"<span class=\"stench\">" + GLOBAL.Stats.stenchSpellDmg.value + " (" + GLOBAL.Stats.stenchSpellDmg.percentValue + "%)</span> " +
		"<span class=\"cold\">" + GLOBAL.Stats.coldSpellDmg.value + " (" + GLOBAL.Stats.coldSpellDmg.percentValue + "%)</span> " +
		"<span class=\"hot\">" + GLOBAL.Stats.hotSpellDmg.value + " (" + GLOBAL.Stats.hotSpellDmg.percentValue + "%)</span> " + 
		"<span class=\"sleaze\">" + GLOBAL.Stats.sleazeSpellDmg.value + " (" + GLOBAL.Stats.sleazeSpellDmg.percentValue + "%)</span></b> "
	);
	$("#RangedDmg").html( "RangedDmg Mod: <b>" + GLOBAL.Stats.rangedDmg.value + "</b>" );
	$("#init").html( "Combat Initiative: " + GLOBAL.Stats.initiative.percentValue + "%" );
	$("#DA").html( "Damage Absorbtion Bonus: " + GLOBAL.Stats.damageAbsorption.value );
	$("#DR").html( "Damage Reduction Bonus: " + GLOBAL.Stats.damageReduction.value );
	$("#cold_resist").html( "<span class=\"cold\">Cold Resist: " + (GLOBAL.Stats.coldResist.value + GLOBAL.Stats.allResist.value) + "</span>" );
	$("#hot_resist").html( "<span class=\"hot\">Hot Resist: " + (GLOBAL.Stats.hotResist.value + GLOBAL.Stats.allResist.value) + "</span>");
	$("#sleaze_resist").html( "<span class=\"sleaze\">Sleaze Resist: " + (GLOBAL.Stats.sleazeResist.value + GLOBAL.Stats.allResist.value) + "</span>" );
	$("#slime_resist").html( "<span class=\"slime\">Slime Resist: " + GLOBAL.Stats.slimeResist.value + "</span>" );
	$("#spooky_resist").html( "<span class=\"spooky\">Spooky Resist: " + (GLOBAL.Stats.spookyResist.value + GLOBAL.Stats.allResist.value) + "</span>");
	$("#stench_resist").html( "<span class=\"stench\">Stench Resist: " + (GLOBAL.Stats.stenchResist.value + GLOBAL.Stats.allResist.value) + "</span>" );
	$("#musGain").html( "Muscle Gain: " + GLOBAL.Stats.musGain.value + " (" + GLOBAL.Stats.musGain.percentValue + "%)" );
	$("#mysGain").html( "Mysticality Gain: " + GLOBAL.Stats.mysGain.value + " (" + GLOBAL.Stats.mysGain.percentValue + "%)" );
	$("#moxGain").html( "Moxie Gain: " + GLOBAL.Stats.moxGain.value + " (" + GLOBAL.Stats.moxGain.percentValue + "%)" );
	$("#mosterLevel").html( "Monster Level: " + GLOBAL.Stats.monsterLevel.value );
	$("#itemFind").html( "Item Find: " + GLOBAL.Stats.itemFind.percentValue + "%" );
	$("#meatFind").html( "Meat Find: " + GLOBAL.Stats.meatFind.percentValue + "%" );
	$("#pickpocket").html( "Pickpocket: " + GLOBAL.Stats.pickpocket.percentValue + "%" );
	$("#HP_Regen").html( "HP Regen: " + GLOBAL.Stats.hpRegen.minValue + "-" + GLOBAL.Stats.hpRegen.maxValue );
	$("#MP_Regen").html( "MP Regen: " + GLOBAL.Stats.mpRegen.minValue + "-" + GLOBAL.Stats.mpRegen.maxValue );
	$("#Adventures").html( "Extra Rollover Adventures: " + GLOBAL.Stats.adventures.value );
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

// Prints a stat only if one of it's values in non-zero.
// NOT CURRENTLY USED!!!
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