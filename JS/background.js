//---------------------------------- GLOBAL VARIABLES -------------------------------------
//var APICharacterSheetFlag = false;
//var HTMLCharacterSheetFlag = false;

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

chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
	if( changeInfo.status !== undefined && changeInfo.status == "complete" && tab.url == "http://www.kingdomofloathing.com/game.php" ) {
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
		// Loop through all charsheet equipment & get array of all ids

		// Set finished flags and try to run post ajax script
		finishedFlags.Equipment = true;
		finishedFlags.Buffs = true;
		finishedFlags.Outfit = true;
		finishedFlags.Sign = true;
		afterCharacterSheets(finishedFlags);
	}).fail( function( jqHHR, textStatus, errorThrown ) {
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
	}
}