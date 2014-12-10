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

// Check for change in any Ench_Objects on KoL page reload/update
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
	if( changeInfo.status !== undefined && changeInfo.status == "complete" && tab.url == "http://www.kingdomofloathing.com/game.php" ) {
		// Flags represent completion of each Ench_Object set task
		var finishedFlags = {
			"Equipment" : false,
			"Skills" : false,
			"Buffs" : false,
			"Outfit" : false,
			"Sign" : false
		}
		
		APICharacterSheet(finishedFlags);
		HTMLCharacterSheet(finishedFlags);
	}
});


function APICharacterSheet(finishedFlags) {
	$.ajax({
		asycn: true,
		dataType: "json",
		type: "GET",
		url: "http://www.kingdomofloathing.com/api.php?what=status&for=Kingdom-of-Loathing-Stats_Chrome_Extension"
	}).done( function( charsheet_json, status, xhr ) {

		console.log( charsheet_json);
		
		// Build constant time lookup list for new equipment
		new_equipment_ids = {};
		$.each( charsheet_json.equipment, function( equip_slot, id ) {
			if( id !== 0 ) {
				new_equipment_ids[parseInt(id, 10)] = null;
			}
		});
		console.log(new_equipment_ids);
		
		// Remove old Ench_Object
		$.each( Ench_Objects.equipment, function( id, equip ) {
			if( typeof(new_equipment_ids[id]) === "undefined" ) {
				Ench_Objects.removeObject( "equipment", id );
			}
		});
		
		// Add new equipment to lookup queue
		new_equipment_flags = {};
		$.each( new_equipment_ids, function ( id ) {
			if( typeof( Ench_Objects.equipment[id] ) === "undefined" ) {
				new_equipment_flags[id] = false;
			}
		});
		
		console.log( new_equipment_flags );
		$.each( new_equipment_flags, function (id) {
			if( typeof(id) === "string" ) {
				id = parseInt(id,10);
			}
			equip = new Equipment(id);
			equip.scrapeData( finishedFlags, new_equipment_flags );
		});

		// Set finished flags and try to run post ajax script
//		finishedFlags.Equipment = true;
		
		
		
		
		finishedFlags.Buffs = true;
		finishedFlags.Outfit = true;
		finishedFlags.Sign = true;
		afterCharacterSheets(finishedFlags);
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		console.error(errorThrown);
	});
}

function HTMLCharacterSheet(finishedFlags) {
	$.ajax({
		asycn: true,
		dataType: "html",
		type: "GET",
		url: "http://www.kingdomofloathing.com/charsheet.php"
	}).done( function( charsheet_html, status, xhr ) {
		// Parse the html string into a DOM object for easier scraping
		var parser = new DOMParser();
		var doc = parser.parseFromString(charsheet_html,"text/html");
		console.log( doc );


		// Set finished flags and try to run post ajax script
		finishedFlags.Skills = true;
		afterCharacterSheets(finishedFlags);
	}).fail( function( jqHHR, textStatus, errorThrown ) {
		console.error(errorThrown);
	});
}

function afterCharacterSheets(finishedFlags) {
	var allFinished = true;
	$.each(finishedFlags, function(key, value) {
		if( !value ) {
			allFinished = false;
		}
	});
	
	if( allFinished ) {
		console.log("DONE");
		console.log( Ench_Objects );
		console.log( Stats );
	}
}