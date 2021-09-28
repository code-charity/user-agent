/*--------------------------------------------------------------
>>> BACKGROUND
--------------------------------------------------------------*/

var ext_storage = {};

chrome.storage.local.get(function(items) {
    ext_storage = items;
    
    function requestListener(request) {
        if (typeof request.requestHeaders === 'object') {
            for (var header of request.requestHeaders) {
                if (header.name.toLowerCase() === 'user-agent') {
                    if (ext_storage['user-agent'] && ext_storage['user-agent'] !== '') {
                        header.value = ext_storage['user-agent'];
                    }
                }
            }
        }

        return {
            requestHeaders: request.requestHeaders
        };
    }

    chrome.webRequest.onBeforeSendHeaders.addListener(
        requestListener, {
            urls: ['<all_urls>']
        }, ['blocking', 'requestHeaders']
    );

    chrome.storage.onChanged.addListener(function(changes) {
        for (var key in changes) {
            var value = changes[key].newValue;

            ext_storage[key] = changes[key].newValue;
        }

        chrome.webRequest.onBeforeSendHeaders.removeListener(
            requestListener, {
                urls: ['<all_urls>']
            }, ['blocking', 'requestHeaders']
        );

        chrome.webRequest.onBeforeSendHeaders.addListener(
            requestListener, {
                urls: ['<all_urls>']
            }, ['blocking', 'requestHeaders']
        );
    });
});

chrome.storage.onChanged.addListener(function (changes) {
    for (var key in changes) {
        ext_storage[key] = changes[key].newValue;
    }
});