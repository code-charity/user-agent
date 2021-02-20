chrome.storage.local.get(function(items) {
    var ext_storage = items,
        user_agent = navigator.userAgent,
        os = '',
        browser = '',
        user_agents = {
            'Chrome': ''
        };

    if (navigator.appVersion.indexOf('Win') !== -1) {
        if (navigator.appVersion.match(/(Windows 10.0|Windows NT 10.0)/)) {
            os = 'Windows 10';
        } else if (navigator.appVersion.match(/(Windows 8.1|Windows NT 6.3)/)) {
            os = 'Windows 8.1';
        } else if (navigator.appVersion.match(/(Windows 8|Windows NT 6.2)/)) {
            os = 'Windows 8';
        } else if (navigator.appVersion.match(/(Windows 7|Windows NT 6.1)/)) {
            os = 'Windows 7';
        } else if (navigator.appVersion.match(/(Windows NT 6.0)/)) {
            os = 'Windows Vista';
        } else if (navigator.appVersion.match(/(Windows NT 5.1|Windows XP)/)) {
            os = 'Windows XP';
        } else {
            os = 'Windows';
        }
    } else if (navigator.appVersion.indexOf('(iPhone|iPad|iPod)') !== -1) {
        os = 'iOS';
    } else if (navigator.appVersion.indexOf('Mac') !== -1) {
        os = 'macOS';
    } else if (navigator.appVersion.indexOf('Android') !== -1) {
        os = 'Android';
    } else if (navigator.appVersion.indexOf('OpenBSD') !== -1) {
        os = 'OpenBSD';
    } else if (navigator.appVersion.indexOf('SunOS') !== -1) {
        os = 'SunOS';
    } else if (navigator.appVersion.indexOf('Linux') !== -1) {
        os = 'Linux';
    } else if (navigator.appVersion.indexOf('X11') !== -1) {
        os = 'UNIX';
    }

    if (user_agent.indexOf('Opera') !== -1) {
        browser = 'Opera';
    } else if (user_agent.indexOf('Vivaldi') !== -1) {
        browser = 'Vivaldi';
    } else if (user_agent.indexOf('Edge') !== -1) {
        browser = 'Edge';
    } else if (user_agent.indexOf('Chrome') !== -1) {
        browser = 'Chrome';
    } else if (user_agent.indexOf('Safari') !== -1) {
        browser = 'Safari';
    } else if (user_agent.indexOf('Firefox') !== -1) {
        browser = 'Firefox';
    } else if (user_agent.indexOf('MSIE') !== -1) {
        browser = 'IE';
    }

    document.querySelector('#os').value = ext_storage.os || '';
    document.querySelector('#os').onchange = function() {
        ext_storage.os = this.value;
        ext_storage.custom = '';
        
        document.querySelector('#custom').value = '';

        chrome.storage.local.set(ext_storage);
    };
    document.querySelector('#os').onfocus = function() {
        var value = this.value;

        this.value = '';

        this.onblur = function() {
            if (this.value === '') {
                this.value = value;
            }
        };
    };

    document.querySelector('#browser').value = ext_storage.browser || '';
    document.querySelector('#browser').onchange = function() {
        ext_storage.browser = this.value;
        ext_storage.custom = '';
        
        document.querySelector('#custom').value = '';

        chrome.storage.local.set(ext_storage);
    };
    document.querySelector('#browser').onfocus = function() {
        var value = this.value;

        this.value = '';

        this.onblur = function() {
            if (this.value === '') {
                this.value = value;
            }
        };
    };
    
    document.querySelector('#custom').value = ext_storage.custom || '';
    document.querySelector('#custom').oninput = function() {
        document.querySelector('#os').value = '';
        document.querySelector('#browser').value = '';
        
        ext_storage.os = '';
        ext_storage.browser = '';
        ext_storage.custom = this.value;

        chrome.storage.local.set(ext_storage);
    };
});
