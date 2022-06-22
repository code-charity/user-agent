/*--------------------------------------------------------------
>>> BACKGROUND
----------------------------------------------------------------
# Global variable
# Update user agent
# Messages
# Storage
    # Get
    # On change
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GLOBAL VARIABLE
--------------------------------------------------------------*/

var extension = {};


/*--------------------------------------------------------------
# UPDATE USER AGENT
--------------------------------------------------------------*/

extension.updateUserAgent = function (string) {
	if (typeof string === 'string') {
		chrome.declarativeNetRequest.updateDynamicRules({
			addRules: [{
				'id': 1001,
				'priority': 1,
				'action': {
					'type': 'modifyHeaders',
					'requestHeaders': [{
						'header': 'User-Agent',
						'operation': 'set',
						'value': string
					}]
				},
				'condition': {
					'urlFilter': '*://*/*',
					'resourceTypes': [
						'main_frame',
						'sub_frame',
						'stylesheet',
						'script',
						'image',
						'font',
						'object',
						'xmlhttprequest',
						'ping',
						'csp_report',
						'media',
						'websocket',
						'webtransport',
						'webbundle',
						'other'
					]
				}
			}],
			removeRuleIds: [1001]
		});
	} else {
		chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: [1001]
		});
	}
};


/*--------------------------------------------------------------
# MESSAGES
--------------------------------------------------------------*/

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	var action = message.action;

	if (action === 'options-page-connected') {
		sendResponse({
			isPopup: sender.hasOwnProperty('tab') === false
		});
	}
});


/*--------------------------------------------------------------
# STORAGE
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GET
--------------------------------------------------------------*/


chrome.storage.local.get(function (items) {
	extension.updateUserAgent(items['user-agent']);
});


/*--------------------------------------------------------------
# ON CHANGE
--------------------------------------------------------------*/

chrome.storage.onChanged.addListener(function (changes) {
	for (var key in changes) {
		if (key === 'user-agent') {
			extension.updateUserAgent(changes[key].newValue);
		}
	}
});