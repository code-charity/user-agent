function requestListener(request) {
    if (typeof request.requestHeaders === 'object') {
        for (var header of request.requestHeaders) {
            if (header.name.toLowerCase() === 'user-agent') {
                header.value = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.47 Safari/537.36';
                console.log(header.value);
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