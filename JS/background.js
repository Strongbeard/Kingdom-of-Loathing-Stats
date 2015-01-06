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
		console.log("----- START -----");
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
		
		// ##### EQUIPMENT #####
		
		// Build constant time lookup list for new equipment
		new_equipment_ids = {};
		$.each( charsheet_json.equipment, function( equip_slot, id ) {
			if( id !== 0 ) {
				new_equipment_ids[parseInt(id, 10)] = false;
			}
		});
//		console.log(new_equipment_ids);
		
		// Remove old Equipment from Ench_Objects
		$.each( Ench_Objects.equipment, function( id, equip ) {
			if( new_equipment_ids[id] === undefined ) {
				Ench_Objects.removeObject( "equipment", id );
			}
		});
		
		// Remove equipment already in Ench_Objects from lookup queue
		$.each( new_equipment_ids, function ( id ) {
			if( Ench_Objects.equipment[id] !== undefined ) {
				delete new_equipment_ids[id];
			}
		});
		
//		console.log( new_equipment_ids );
		// Add all new equipment. Check equipment finished flag and attempt to
		// run final function when done.
		if( !$.isEmptyObject(new_equipment_ids) ) {
			$.each( new_equipment_ids, function (id) {
				if( typeof(id) === "string" ) {
					id = parseInt(id,10);
				}
				var equip = new Equipment(id);
				equip.scrapeData( finishedFlags, new_equipment_ids );
			});
		}
		else {
			// If no new equipment, check finished flag...
			finishedFlags.Equipment = true;
			// ...and attempt to run final function.
			afterCharacterSheets(finishedFlags);
		}

		// ##### BUFFS #####
		
//		console.log("DELETE BUFFS");
		// Remove old buffs from Ench_Objects
		$.each( Ench_Objects.buff, function( id, buff ) {
			if( charsheet_json.effects[buff.descId] === undefined ) {
//				console.log( buff );
				Ench_Objects.removeObject( "buff", id );
			}
		});

//		console.log("ADD BUFFS");
		// Build queue of new buffs
		new_buff_flags = {};
		$.each( charsheet_json.effects, function( id, buff_array ) {
			if( Ench_Objects.buff[parseInt(buff_array[4],10)] === undefined  ) {
				new_buff_flags[id] = false;
			}
		});
//		console.log( new_buff_flags );

		// Add all new buffs. Check buff flag & attempt to run final
		// function when each buff is finished.
		if( !$.isEmptyObject(new_buff_flags) ) {
			$.each( new_buff_flags, function( id ) {
				var buff = new Buff(parseInt(charsheet_json.effects[id][4],10), charsheet_json.effects[id][0], [], id);
				buff.scrapeData( finishedFlags, new_buff_flags );
//				console.log(buff);
			});
		}
		else {
			// If no new equipment, check finished flag...
			finishedFlags.Buffs = true;
			// ...and attempt to run final function.
			afterCharacterSheets(finishedFlags);
		}

		// ##### SIGN #####

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

		// ##### SKILLS #####

		// Set finished flags and try to run post ajax script
		finishedFlags.Skills = true;
		
		// ##### OUTFIT #####
		
		var outfit_selector = $("body>center>table>tbody>tr>td>center>table>tbody>tr>td>center>center>table>tbody>tr", doc);
		//>table>tbody>tr>td>center>table>tbody>tr>td>center>center>table>tbody>tr
		console.log("OUTFIT SELECTOR:");
		console.log(outfit_selector);
		if( outfit_selector.length > 0 && outfit_selector[outfit_selector.length-2].innerText.indexOf("Outfit:") !== -1 ) {
			console.log( outfit_selector[outfit_selector.length-2] );
			console.log($("tr>td>b>span", outfit_selector[outfit_selector.length-2] ));
		}
		
		finishedFlags.Outfit = true;
		
		afterCharacterSheets(finishedFlags);
	}).fail( function( jqHHR, textStatus, errorThrown ) {
		console.error(errorThrown);
	});
}

function afterCharacterSheets(finishedFlags) {
	console.log(finishedFlags);
	var allFinished = true;
	$.each(finishedFlags, function(key, value) {
		if( !value ) {
			allFinished = false;
		}
	});
	
	if( allFinished ) {
		chrome.runtime.sendMessage("PRINT");
		console.log("ENCH_OBJECTS:");
		console.log( Ench_Objects );
		console.log("STATS:");
		console.log( Stats );
		console.log("----- DONE -----");
	}
}