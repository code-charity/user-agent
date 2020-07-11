var script = document.createElement('script');

script.innerText = '(' + function() {
    Object.defineProperties(Navigator.prototype, {
        userAgent: {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.47 Safari/537.36',
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

document.documentElement.appendChild(script);