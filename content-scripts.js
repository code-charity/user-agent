chrome.storage.local.get(function(items) {
	var ext_storage = items;

	/*function createUserAgent() {
		var string = 'Mozilla/5.0 (',
				os = {
					'Windows 10': 'Windows NT 10.0; Win64; x64',
					'Windows 7': 'Windows NT 6.1',
					'Windows 8.1': 'Windows NT 6.3',
					'Windows 8': 'Windows NT 6.2',
					'Windows XP': 'Windows NT 5.1',
					'Linux': 'Linux',
					'Ubuntu': 'X11; Ubuntu;',
					'Chrome OS': 'X11; CrOS x86_64'
				},
				browser = {
					'Chrome': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.16 Safari/537.36',
					'Safari': 'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15/9xaIHXt7-27',
					'Firefox': 'Gecko/20100101 Firefox/77.0',
					'Edge': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.0 Safari/537.36 Edg/85.0.564.0',
					'IE': 'Trident/7.0; MATBJS; MSAppHost/2.0; rv:11.0) like Gecko',
					'Opera': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36 OPR/72A9BD85A030',
					'Samsung Internet': 'AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.2 Chrome/71.0.3578.99 Mobile Safari/537.36',
					'UC Browser': 'AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.9.7.1153 Mobile Safari/537.36'
				};

		string += os[ext_storage.os] + ' ';
		string += browser[ext_storage.browser];

		return string;
	}

	var script = document.createElement('script');

	script.innerText = '(' + function() {
		  Object.defineProperties(Navigator.prototype, {
		      userAgent: {
		          value: createUserAgent(),
		          configurable: false,
		          enumerable: true,
		          writable: false
		      },
		      appVersion: {
		          value: navigator.userAgent.replace(/Chromium/g, 'Chrome'),
		          configurable: false,
		          enumerable: true,
		          writable: false
		      },
		      platform: {
		          value: 'Win32',
		          configurable: false,
		          enumerable: true,
		          writable: false
		      }
		  });
	} + ')();';

	document.documentElement.appendChild(script);*/
});