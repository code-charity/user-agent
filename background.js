chrome.storage.local.get(function(items) {
    var ext_storage = items;

    function createUserAgent() {
        var string = '',
            os = {
                'Windows': 'Windows NT 10.0; Win64; x64',
                'Windows 7': 'Windows NT 6.1',
                'Windows 8.1': 'Windows NT 6.3',
                'Windows 8': 'Windows NT 6.2',
                'Windows XP': 'Windows NT 5.1',
                'Windows Vista': 'Windows NT 6.0',
                'Windows ME': 'Windows ME',
                'Windows 2000': 'Windows NT 5.0',
                'Windows 98': 'Windows 98',
                'macOS': 'Macintosh; Intel Mac OS X 10_15_5',
                'Linux': 'Linux',
                'Ubuntu': 'X11; Ubuntu;',
                'Chrome OS': 'X11; CrOS x86_64',
                'Android': 'Android 10',
                'iOS': 'iPhone; CPU OS 13_5_1 like Mac OS X',
                'Google Bot': 'compatible; Googlebot/2.1; +http://www.google.com/bot.html'
            },
            browser = {
                'Chrome': 'Chrome/85.0.4183.16',
                'Safari': 'Version/13.1.1 Safari/605.1.15/9xaIHXt7-27',
                'Firefox': 'Gecko/20100101 Firefox/77.0',
                'Edge': 'Chrome/85.0.4183.0 Safari/537.36 Edg/85.0.564.0',
                'IE': 'Trident/7.0)',
                'Opera': 'Presto/2.12 Version/12.16',
                'Samsung Internet': 'SamsungBrowser/10.2 Chrome/71.0.3578.99 Mobile Safari/537.36',
                'UC Browser': 'Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.9.7.1153 Mobile Safari/537.36'
            };

        if (ext_storage.browser === 'Opera') {
            string += 'Opera/9.80 (';
        } else {
            string += 'Mozilla/5.0 (';
        }

        string += os[ext_storage.os] + ') ';

        if (ext_storage.browser === 'Chrome') {
            string += 'AppleWebKit/537.36 (KHTML, like Gecko) ';
        } else if (ext_storage.browser === 'Safari') {
            string += 'AppleWebKit/605.1.15 (KHTML, like Gecko) ';
        } else if (ext_storage.browser === 'Edge') {
            string += 'AppleWebKit/537.36 (KHTML, like Gecko) ';
        } else if (ext_storage.browser === 'Opera') {
            string += 'AppleWebKit/537.36 (KHTML, like Gecko) ';
        } else if (ext_storage.browser === 'Samsung Internet') {
            string += 'AppleWebKit/537.36 (KHTML, like Gecko) ';
        } else if (ext_storage.browser === 'UC Browser') {
            string += 'AppleWebKit/537.36 (KHTML, like Gecko) ';
        }

        if (ext_storage.os === 'iOS') {
            string += ' (iPad8,3; iOS 13_5_1) ';
        }

        string += browser[ext_storage.browser];

        return string;
    }

    function requestListener(request) {
        if (ext_storage.hasOwnProperty('os') && ext_storage.hasOwnProperty('browser')) {
            if (typeof request.requestHeaders === 'object') {
                for (var header of request.requestHeaders) {
                    if (header.name.toLowerCase() === 'user-agent') {
                        if (ext_storage.custom && ext_storage.custom !== '') {
                            header.value = ext_storage.custom;
                        } else {
                            header.value = createUserAgent();
                        }
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