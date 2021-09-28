
/*--------------------------------------------------------------
>>> CORE:
----------------------------------------------------------------
# Global variable
# Functions
# Render
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GLOBAL VARIABLE
--------------------------------------------------------------*/

var satus = {
    components: {},
    events: {},
    locale: {
        strings: {}
    },
    storage: {
        attributes: {},
        data: {}
    }
};


/*--------------------------------------------------------------
# FUNCTIONS
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# APPEND
--------------------------------------------------------------*/

satus.append = function (element, container) {
    (container || document.body).appendChild(element);
};


/*--------------------------------------------------------------
# ANIMATION DURATION
--------------------------------------------------------------*/

satus.getAnimationDuration = function (element) {
    return Number(window.getComputedStyle(element).getPropertyValue('animation-duration').replace(/[^0-9.]/g, '')) * 1000;
};


/*--------------------------------------------------------------
# APPEND
--------------------------------------------------------------*/

satus.attr = function (element, attributes) {
    if (attributes) {
        for (var key in attributes) {
            if (element.is_svg) {
                element.setAttributeNS(null, key, attributes[key]);
            } else {
                var value = attributes[key];

                if (['placeholder', 'title'].indexOf(key) !== -1) {
                    value = satus.locale.get(value);
                }

                element.setAttribute(key, value);
            }
        }
    }
};

satus.elementIndex = function (element) {
    return Array.prototype.slice.call(element.parentNode.children).indexOf(element);
};


/*--------------------------------------------------------------
# DATA
--------------------------------------------------------------*/

satus.data = function (element, data) {
    if (data) {
        for (var key in data) {
            element.dataset[key] = data[key];
        }
    }
};


/*--------------------------------------------------------------
# PROPERTIES
--------------------------------------------------------------*/

satus.properties = function (element, properties) {
    if (properties) {
        for (var key in properties) {
            element[key] = properties[key];
        }
    }
};


/*--------------------------------------------------------------
# CAMELIZE
--------------------------------------------------------------*/

satus.camelize = function (string) {
    var result = '';

    for (var i = 0, l = string.length; i < l; i++) {
        var character = string[i];

        if (character === '-') {
            i++;

            result += string[i].toUpperCase();
        } else {
            result += character;
        }
    }

    return result;
};


/*--------------------------------------------------------------
# SNAKELIZE
--------------------------------------------------------------*/

satus.snakelize = function (string) {
    return string.replace(/([A-Z])/g, '-$1').toLowerCase();
};


/*--------------------------------------------------------------
# CLASS
--------------------------------------------------------------*/

satus.class = function (element, string) {
    if (string) {
        element.className += ' ' + string;
    }
};


/*--------------------------------------------------------------
# EMPTY
--------------------------------------------------------------*/

satus.empty = function (element) {
    for (var i = element.childNodes.length - 1; i > -1; i--) {
        element.childNodes[i].remove();
    }
};


/*--------------------------------------------------------------
# EVENTS
--------------------------------------------------------------*/

Object.defineProperty(satus.events, 'add', {
    value: function (type, listener) {
        if (this.hasOwnProperty(type) === false) {
            this[type] = [];
        }

        this[type].push(listener);
    }
});


/*--------------------------------------------------------------
# ISSET
--------------------------------------------------------------*/

satus.isset = function (variable) {
    if (variable === null || variable === undefined) {
        return false;
    }

    return true;
};


/*--------------------------------------------------------------
# FETCH
--------------------------------------------------------------*/

satus.fetch = function (url, success, error) {
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(success);
        } else {
            error();
        }
    });
};


/*--------------------------------------------------------------
# AJAX
--------------------------------------------------------------*/

satus.ajax = function (url, success, error) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        success(this.response);
    };
    xhr.onerror = function () {
        error(success);
    };

    xhr.open('GET', url, true);
    xhr.send();
};


/*--------------------------------------------------------------
# STORAGE
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GET
--------------------------------------------------------------*/

satus.storage.get = function (name) {
    var target = satus.storage.data;

    if (satus.isset(name) === false) {
        return;
    }

    name = name.split('/').filter(function (value) {
        return value != '';
    });

    for (var i = 0, l = name.length; i < l; i++) {
        if (satus.isset(target[name[i]])) {
            target = target[name[i]];
        } else {
            return undefined;
        }
    }

    return target;
};


/*--------------------------------------------------------------
# SET
--------------------------------------------------------------*/

satus.storage.set = function (name, value) {
    var items = {},
        target = satus.storage.data;

    if (satus.isset(name) === false) {
        return;
    }

    name = name.split('/').filter(function (value) {
        return value != '';
    });

    for (var i = 0, l = name.length; i < l; i++) {
        var item = name[i];

        if (i < l - 1) {

            if (target[item]) {
                target = target[item];
            } else {
                target[item] = {};

                target = target[item];
            }
        } else {
            target[item] = value;
        }
    }

    for (var key in this.data) {
        if (typeof this.data[key] !== 'function') {
            items[key] = this.data[key];
        }
    }

    if (satus.storage.attributes[name]) {
        document.body.setAttribute(name, value);
    }

    chrome.storage.local.set(items);
};


/*--------------------------------------------------------------
# IMPORT
--------------------------------------------------------------*/

satus.storage.import = function (callback) {
    chrome.storage.local.get(function (items) {
        for (var key in items) {
            if (satus.storage.attributes[key]) {
                document.body.setAttribute(key, items[key]);
            }

            satus.storage.data[key] = items[key];
        }

        if (callback) {
            callback(items);
        }
    });
};


/*--------------------------------------------------------------
# CLEAR
--------------------------------------------------------------*/

satus.storage.clear = function (callback) {
    chrome.storage.local.clear(callback);
};


/*--------------------------------------------------------------
# LOCALIZATION
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GET
--------------------------------------------------------------*/

satus.locale.get = function (string) {
    return this.strings[string] || string;
};


/*--------------------------------------------------------------
# ON
--------------------------------------------------------------*/

satus.on = function (element, events) {
    if (this.isset(events) && typeof events === 'object') {
        for (var selector in events) {
            var type = typeof events[selector];

            if (type === 'function') {
                element.addEventListener(selector, events[selector]);
            } else if (type === 'object') {
                element.addEventListener(selector, function (event) {
                    this.skeleton.on[event.type].parent = this.skeleton;
                    
                    if (this.skeleton.on[event.type].component !== 'modal' && this.base && this.base.layers) {
                        this.base.layers.open(this.skeleton.on[event.type]);
                    } else {
                        satus.render(this.skeleton.on[event.type], this.base);
                    }
                });
            } else if (type === 'string') {
                element.addEventListener(selector, function () {
                    var match = this.skeleton.on[event.type].match(/(["'`].+["'`]|[^.()]+)/g),
                        target = this.base;

                    for (var i = 0, l = match.length; i < l; i++) {
                        var key = match[i];

                        if (target.skeleton[key]) {
                            target = target.skeleton[key];
                        } else {
                            if (typeof target[key] === 'function') {
                                target[key]();
                            } else {
                                target = target[key];
                            }
                        }

                        if (target.rendered) {
                            target = target.rendered;
                        }
                    }
                });
            }
        }
    }
};


/*--------------------------------------------------------------
# STYLE
--------------------------------------------------------------*/

satus.style = function (component, object) {
    for (var key in object) {
        component.style[key] = object[key];
    }
};


/*--------------------------------------------------------------
# SEARCH
--------------------------------------------------------------*/

satus.search = function (query, object, callback, categories) {
    var threads = 0,
        folder = '',
        results = {};

    query = query.toLowerCase();

    function parse(items) {
        threads++;

        for (var key in items) {
            if (key !== 'rendered' && key !== 'base' && key !== 'parent') {
                var item = items[key];

                if (['switch', 'select', 'slider', 'shortcut'].indexOf(item.component) !== -1 && key.indexOf(query) !== -1) {
                    if (categories === true) {
                        if (!results[folder]) {
                            results[folder] = {};
                        }

                        results[folder][key] = item;
                    } else {
                        results[key] = item;
                    }
                }

                if (typeof item === 'object') {
                    parse(item);
                }
            }
        }

        threads--;

        if (threads === 0) {
            callback(results);
        }
    }

    parse(object);
};


/*--------------------------------------------------------------
# TEXT
--------------------------------------------------------------*/

satus.text = function (component, string) {
    if (string) {
        component.appendChild(document.createTextNode(this.locale.get(string)));
    }
};


/*--------------------------------------------------------------
# RENDER
--------------------------------------------------------------*/

satus.render = function (skeleton, container, skip, property) {
    if (skeleton.hasOwnProperty('component') && skip !== true) {
        var component,
            name = skeleton.component,
            camelized_name = this.camelize(name);

        if (skeleton.on && skeleton.on.beforerender) {
            skeleton.on.beforerender(skeleton);
        }

        if (this.components[camelized_name]) {
            component = this.components[camelized_name](skeleton);

            if (this.isset(component.inner) === false) {
                component.inner = component;
            }
        } else if (name === 'svg' || container && container.is_svg) {
            component = document.createElementNS('http://www.w3.org/2000/svg', name);

            component.is_svg = true;

            component.inner = component;
        } else {
            component = document.createElement(skeleton.component);

            component.inner = component;
        }

        if (component.inner.hasOwnProperty('base') === false && container) {
            component.inner.base = container.base;
        }

        if (component.inner.base && name === 'layers') {
            component.inner.base.layers = component;
        }

        skeleton.rendered = component;
        component.skeleton = skeleton;

        if (skeleton.hasOwnProperty('storage')) {
            component.storage = skeleton.storage;
        } else if (property) {
            component.storage = property;
        }

        component.className = (component.className + ' satus-' + skeleton.component).trim();

        component.change = function (value) {
            satus.storage.set(this.storage, value);
        };

        if (skeleton.variant) {
            component.className += ' satus-' + skeleton.component + '--' + skeleton.variant;
        }

        this.append(component, container);

        container = component.inner || component;
        
        this.class(component, skeleton.class);
        this.style(component, skeleton.style);
        this.attr(component, skeleton.attr);
        this.data(component, skeleton.data);
        this.properties(component, skeleton.properties);
        this.on(component, skeleton.on);
        this.text(container, skeleton.text);

        component.dispatchEvent(new CustomEvent('render'));

        if (this.events.hasOwnProperty('render')) {
            for (var i = 0, l = this.events['render'].length; i < l; i++) {
                this.events['render'][i](component, skeleton);
            }
        }
    }

    if (!component || component.render_children !== false) {
        for (var key in skeleton) {
            if (key !== 'parent' && skeleton[key] && skeleton[key].hasOwnProperty('component')) {
                skeleton[key].parent = skeleton;

                this.render(skeleton[key], container, false, key);
            }
        }
    }
};
/*--------------------------------------------------------------
>>> COLOR PICKER
--------------------------------------------------------------*/

satus.components.colorPicker = function (skeleton) {
    var component = document.createElement('button'),
        component_value = document.createElement('span');

    component.className = 'satus-button';
    component_value.className = 'satus-color-picker__value';

    component.valueElement = component_value;

    component.addEventListener('render', function () {
        var data = satus.storage.get(this.storage) || this.skeleton.value || {
            rgb: [0, 0, 0]
        };

        this.valueElement.style.backgroundColor = 'rgb(' + data.rgb[0] + ',' + data.rgb[1] + ',' + data.rgb[2] + ')';
    });

    component.addEventListener('click', function () {
        satus.render({
            component: 'modal',
            class: 'satus-modal--color-picker',
            properties: {
                parentComponent: this
            },

            canvas: {
                component: 'canvas',
                on: {
                    render: function () {
                        var data = satus.storage.get(this.parentNode.parentNode.parentComponent.storage) || this.parentNode.parentNode.parentComponent.skeleton.value || {
                                rgb: [0, 0, 0]
                            },
                            ctx = this.getContext('2d'),
                            image = new Image();

                        this.parentNode.data = data;

                        image.addEventListener('load', function () {
                            ctx.drawImage(this, 0, 0);
                        });

                        image.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMTMzIiBjbGFzcz0iSXJvV2hlZWxIdWUiPjxwYXRoIHN0cm9rZT0iaHNsKDI0MCwgMTAwJSwgNTAlKSIgZD0iTTIwMS40NzcgMTM2Ljc0YTY2LjUgNjYuNSAwIDAwLjAyMy0xLjc0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjQxLCAxMDAlLCA1MCUpIiBkPSJNMjAxLjQzNyAxMzcuOWE2Ni41IDY2LjUgMCAwMC4wNTMtMS43NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDI0MiwgMTAwJSwgNTAlKSIgZD0iTTIwMS4zNzYgMTM5LjA2YTY2LjUgNjYuNSAwIDAwLjA4My0xLjc0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjQzLCAxMDAlLCA1MCUpIiBkPSJNMjAxLjI5NSAxNDAuMjE4YTY2LjUgNjYuNSAwIDAwLjExNC0xLjczOCIvPjxwYXRoIHN0cm9rZT0iaHNsKDI0NCwgMTAwJSwgNTAlKSIgZD0iTTIwMS4xOTQgMTQxLjM3NGE2Ni41IDY2LjUgMCAwMC4xNDQtMS43MzUiLz48cGF0aCBzdHJva2U9ImhzbCgyNDUsIDEwMCUsIDUwJSkiIGQ9Ik0yMDEuMDczIDE0Mi41MjhhNjYuNSA2Ni41IDAgMDAuMTc0LTEuNzMyIi8+PHBhdGggc3Ryb2tlPSJoc2woMjQ2LCAxMDAlLCA1MCUpIiBkPSJNMjAwLjkzMSAxNDMuNjhhNjYuNSA2Ni41IDAgMDAuMjA1LTEuNzI5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjQ3LCAxMDAlLCA1MCUpIiBkPSJNMjAwLjc3IDE0NC44M2E2Ni41IDY2LjUgMCAwMC4yMzQtMS43MjYiLz48cGF0aCBzdHJva2U9ImhzbCgyNDgsIDEwMCUsIDUwJSkiIGQ9Ik0yMDAuNTg4IDE0NS45NzZhNjYuNSA2Ni41IDAgMDAuMjY1LTEuNzIxIi8+PHBhdGggc3Ryb2tlPSJoc2woMjQ5LCAxMDAlLCA1MCUpIiBkPSJNMjAwLjM4NiAxNDcuMTE5YTY2LjUgNjYuNSAwIDAwLjI5NS0xLjcxNiIvPjxwYXRoIHN0cm9rZT0iaHNsKDI1MCwgMTAwJSwgNTAlKSIgZD0iTTIwMC4xNjUgMTQ4LjI1OGE2Ni41IDY2LjUgMCAwMC4zMjUtMS43MSIvPjxwYXRoIHN0cm9rZT0iaHNsKDI1MSwgMTAwJSwgNTAlKSIgZD0iTTE5OS45MjQgMTQ5LjM5M2E2Ni41IDY2LjUgMCAwMC4zNTQtMS43MDQiLz48cGF0aCBzdHJva2U9ImhzbCgyNTIsIDEwMCUsIDUwJSkiIGQ9Ik0xOTkuNjYzIDE1MC41MjRhNjYuNSA2Ni41IDAgMDAuMzg0LTEuNjk4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjUzLCAxMDAlLCA1MCUpIiBkPSJNMTk5LjM4MiAxNTEuNjVhNjYuNSA2Ni41IDAgMDAuNDE0LTEuNjkiLz48cGF0aCBzdHJva2U9ImhzbCgyNTQsIDEwMCUsIDUwJSkiIGQ9Ik0xOTkuMDgxIDE1Mi43NzFhNjYuNSA2Ni41IDAgMDAuNDQ0LTEuNjgzIi8+PHBhdGggc3Ryb2tlPSJoc2woMjU1LCAxMDAlLCA1MCUpIiBkPSJNMTk4Ljc2MiAxNTMuODg3YTY2LjUgNjYuNSAwIDAwLjQ3Mi0xLjY3NiIvPjxwYXRoIHN0cm9rZT0iaHNsKDI1NiwgMTAwJSwgNTAlKSIgZD0iTTE5OC40MjIgMTU0Ljk5N2E2Ni41IDY2LjUgMCAwMC41MDItMS42NjciLz48cGF0aCBzdHJva2U9ImhzbCgyNTcsIDEwMCUsIDUwJSkiIGQ9Ik0xOTguMDY0IDE1Ni4xYTY2LjUgNjYuNSAwIDAwLjUzLTEuNjU3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjU4LCAxMDAlLCA1MCUpIiBkPSJNMTk3LjY4NiAxNTcuMTk4YTY2LjUgNjYuNSAwIDAwLjU2LTEuNjQ4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjU5LCAxMDAlLCA1MCUpIiBkPSJNMTk3LjI4OSAxNTguMjg5YTY2LjUgNjYuNSAwIDAwLjU4OC0xLjYzOSIvPjxwYXRoIHN0cm9rZT0iaHNsKDI2MCwgMTAwJSwgNTAlKSIgZD0iTTE5Ni44NzMgMTU5LjM3MmE2Ni41IDY2LjUgMCAwMC42MTctMS42MjgiLz48cGF0aCBzdHJva2U9ImhzbCgyNjEsIDEwMCUsIDUwJSkiIGQ9Ik0xOTYuNDM4IDE2MC40NDhhNjYuNSA2Ni41IDAgMDAuNjQ1LTEuNjE3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjYyLCAxMDAlLCA1MCUpIiBkPSJNMTk1Ljk4NCAxNjEuNTE3YTY2LjUgNjYuNSAwIDAwLjY3NC0xLjYwNiIvPjxwYXRoIHN0cm9rZT0iaHNsKDI2MywgMTAwJSwgNTAlKSIgZD0iTTE5NS41MTIgMTYyLjU3N2E2Ni41IDY2LjUgMCAwMC43MDItMS41OTMiLz48cGF0aCBzdHJva2U9ImhzbCgyNjQsIDEwMCUsIDUwJSkiIGQ9Ik0xOTUuMDIyIDE2My42MjlhNjYuNSA2Ni41IDAgMDAuNzI5LTEuNTgxIi8+PHBhdGggc3Ryb2tlPSJoc2woMjY1LCAxMDAlLCA1MCUpIiBkPSJNMTk0LjUxMyAxNjQuNjcyYTY2LjUgNjYuNSAwIDAwLjc1Ni0xLjU2OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDI2NiwgMTAwJSwgNTAlKSIgZD0iTTE5My45ODYgMTY1LjcwNmE2Ni41IDY2LjUgMCAwMC43ODQtMS41NTQiLz48cGF0aCBzdHJva2U9ImhzbCgyNjcsIDEwMCUsIDUwJSkiIGQ9Ik0xOTMuNDQxIDE2Ni43MzFhNjYuNSA2Ni41IDAgMDAuODEtMS41NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDI2OCwgMTAwJSwgNTAlKSIgZD0iTTE5Mi44NzkgMTY3Ljc0NmE2Ni41IDY2LjUgMCAwMC44MzctMS41MjYiLz48cGF0aCBzdHJva2U9ImhzbCgyNjksIDEwMCUsIDUwJSkiIGQ9Ik0xOTIuMjk4IDE2OC43NTFhNjYuNSA2Ni41IDAgMDAuODY0LTEuNTExIi8+PHBhdGggc3Ryb2tlPSJoc2woMjcwLCAxMDAlLCA1MCUpIiBkPSJNMTkxLjcgMTY5Ljc0NmE2Ni41IDY2LjUgMCAwMC44OS0xLjQ5NiIvPjxwYXRoIHN0cm9rZT0iaHNsKDI3MSwgMTAwJSwgNTAlKSIgZD0iTTE5MS4wODYgMTcwLjczYTY2LjUgNjYuNSAwIDAwLjkxNi0xLjQ4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjcyLCAxMDAlLCA1MCUpIiBkPSJNMTkwLjQ1MyAxNzEuNzA0YTY2LjUgNjYuNSAwIDAwLjk0Mi0xLjQ2NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDI3MywgMTAwJSwgNTAlKSIgZD0iTTE4OS44MDQgMTcyLjY2NmE2Ni41IDY2LjUgMCAwMC45NjgtMS40NDgiLz48cGF0aCBzdHJva2U9ImhzbCgyNzQsIDEwMCUsIDUwJSkiIGQ9Ik0xODkuMTM5IDE3My42MTdhNjYuNSA2Ni41IDAgMDAuOTkyLTEuNDMiLz48cGF0aCBzdHJva2U9ImhzbCgyNzUsIDEwMCUsIDUwJSkiIGQ9Ik0xODguNDU2IDE3NC41NTZhNjYuNSA2Ni41IDAgMDAxLjAxOC0xLjQxMyIvPjxwYXRoIHN0cm9rZT0iaHNsKDI3NiwgMTAwJSwgNTAlKSIgZD0iTTE4Ny43NTggMTc1LjQ4M2E2Ni41IDY2LjUgMCAwMDEuMDQyLTEuMzk1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjc3LCAxMDAlLCA1MCUpIiBkPSJNMTg3LjA0MyAxNzYuMzk3YTY2LjUgNjYuNSAwIDAwMS4wNjYtMS4zNzYiLz48cGF0aCBzdHJva2U9ImhzbCgyNzgsIDEwMCUsIDUwJSkiIGQ9Ik0xODYuMzEzIDE3Ny4zYTY2LjUgNjYuNSAwIDAwMS4wOS0xLjM1OSIvPjxwYXRoIHN0cm9rZT0iaHNsKDI3OSwgMTAwJSwgNTAlKSIgZD0iTTE4NS41NjcgMTc4LjE4OGE2Ni41IDY2LjUgMCAwMDEuMTEzLTEuMzM4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjgwLCAxMDAlLCA1MCUpIiBkPSJNMTg0LjgwNiAxNzkuMDY0YTY2LjUgNjYuNSAwIDAwMS4xMzYtMS4zMTkiLz48cGF0aCBzdHJva2U9ImhzbCgyODEsIDEwMCUsIDUwJSkiIGQ9Ik0xODQuMDI5IDE3OS45MjdhNjYuNSA2Ni41IDAgMDAxLjE2LTEuMyIvPjxwYXRoIHN0cm9rZT0iaHNsKDI4MiwgMTAwJSwgNTAlKSIgZD0iTTE4My4yMzcgMTgwLjc3NmE2Ni41IDY2LjUgMCAwMDEuMTgyLTEuMjc5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjgzLCAxMDAlLCA1MCUpIiBkPSJNMTgyLjQzMSAxODEuNjFhNjYuNSA2Ni41IDAgMDAxLjIwNC0xLjI1NyIvPjxwYXRoIHN0cm9rZT0iaHNsKDI4NCwgMTAwJSwgNTAlKSIgZD0iTTE4MS42MSAxODIuNDMxYTY2LjUgNjYuNSAwIDAwMS4yMjYtMS4yMzYiLz48cGF0aCBzdHJva2U9ImhzbCgyODUsIDEwMCUsIDUwJSkiIGQ9Ik0xODAuNzc2IDE4My4yMzdhNjYuNSA2Ni41IDAgMDAxLjI0Ny0xLjIxNCIvPjxwYXRoIHN0cm9rZT0iaHNsKDI4NiwgMTAwJSwgNTAlKSIgZD0iTTE3OS45MjcgMTg0LjAyOWE2Ni41IDY2LjUgMCAwMDEuMjY4LTEuMTkzIi8+PHBhdGggc3Ryb2tlPSJoc2woMjg3LCAxMDAlLCA1MCUpIiBkPSJNMTc5LjA2NCAxODQuODA2YTY2LjUgNjYuNSAwIDAwMS4yODktMS4xNzEiLz48cGF0aCBzdHJva2U9ImhzbCgyODgsIDEwMCUsIDUwJSkiIGQ9Ik0xNzguMTg4IDE4NS41NjdhNjYuNSA2Ni41IDAgMDAxLjMxLTEuMTQ4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjg5LCAxMDAlLCA1MCUpIiBkPSJNMTc3LjMgMTg2LjMxM2E2Ni41IDY2LjUgMCAwMDEuMzI4LTEuMTI1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjkwLCAxMDAlLCA1MCUpIiBkPSJNMTc2LjM5NyAxODcuMDQzYTY2LjUgNjYuNSAwIDAwMS4zNDgtMS4xMDEiLz48cGF0aCBzdHJva2U9ImhzbCgyOTEsIDEwMCUsIDUwJSkiIGQ9Ik0xNzUuNDgzIDE4Ny43NThhNjYuNSA2Ni41IDAgMDAxLjM2Ny0xLjA3OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDI5MiwgMTAwJSwgNTAlKSIgZD0iTTE3NC41NTYgMTg4LjQ1NmE2Ni41IDY2LjUgMCAwMDEuMzg1LTEuMDUzIi8+PHBhdGggc3Ryb2tlPSJoc2woMjkzLCAxMDAlLCA1MCUpIiBkPSJNMTczLjYxNyAxODkuMTM5YTY2LjUgNjYuNSAwIDAwMS40MDQtMS4wMyIvPjxwYXRoIHN0cm9rZT0iaHNsKDI5NCwgMTAwJSwgNTAlKSIgZD0iTTE3Mi42NjYgMTg5LjgwNGE2Ni41IDY2LjUgMCAwMDEuNDIyLTEuMDA0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjk1LCAxMDAlLCA1MCUpIiBkPSJNMTcxLjcwNCAxOTAuNDUzYTY2LjUgNjYuNSAwIDAwMS40MzktLjk4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjk2LCAxMDAlLCA1MCUpIiBkPSJNMTcwLjczIDE5MS4wODZhNjYuNSA2Ni41IDAgMDAxLjQ1Ni0uOTU1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjk3LCAxMDAlLCA1MCUpIiBkPSJNMTY5Ljc0NiAxOTEuN2E2Ni41IDY2LjUgMCAwMDEuNDcyLS45MjgiLz48cGF0aCBzdHJva2U9ImhzbCgyOTgsIDEwMCUsIDUwJSkiIGQ9Ik0xNjguNzUxIDE5Mi4yOThhNjYuNSA2Ni41IDAgMDAxLjQ4OS0uOTAzIi8+PHBhdGggc3Ryb2tlPSJoc2woMjk5LCAxMDAlLCA1MCUpIiBkPSJNMTY3Ljc0NiAxOTIuODc5YTY2LjUgNjYuNSAwIDAwMS41MDQtLjg3NyIvPjxwYXRoIHN0cm9rZT0iaHNsKDMwMCwgMTAwJSwgNTAlKSIgZD0iTTE2Ni43MzEgMTkzLjQ0MWE2Ni41IDY2LjUgMCAwMDEuNTE5LS44NSIvPjxwYXRoIHN0cm9rZT0iaHNsKDMwMSwgMTAwJSwgNTAlKSIgZD0iTTE2NS43MDYgMTkzLjk4NmE2Ni41IDY2LjUgMCAwMDEuNTM0LS44MjQiLz48cGF0aCBzdHJva2U9ImhzbCgzMDIsIDEwMCUsIDUwJSkiIGQ9Ik0xNjQuNjcyIDE5NC41MTNhNjYuNSA2Ni41IDAgMDAxLjU0OC0uNzk3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzAzLCAxMDAlLCA1MCUpIiBkPSJNMTYzLjYyOSAxOTUuMDIyYTY2LjUgNjYuNSAwIDAwMS41NjEtLjc3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzA0LCAxMDAlLCA1MCUpIiBkPSJNMTYyLjU3NyAxOTUuNTEyYTY2LjUgNjYuNSAwIDAwMS41NzUtLjc0MiIvPjxwYXRoIHN0cm9rZT0iaHNsKDMwNSwgMTAwJSwgNTAlKSIgZD0iTTE2MS41MTcgMTk1Ljk4NGE2Ni41IDY2LjUgMCAwMDEuNTg3LS43MTUiLz48cGF0aCBzdHJva2U9ImhzbCgzMDYsIDEwMCUsIDUwJSkiIGQ9Ik0xNjAuNDQ4IDE5Ni40MzhhNjYuNSA2Ni41IDAgMDAxLjYtLjY4NyIvPjxwYXRoIHN0cm9rZT0iaHNsKDMwNywgMTAwJSwgNTAlKSIgZD0iTTE1OS4zNzIgMTk2Ljg3M2E2Ni41IDY2LjUgMCAwMDEuNjEyLS42NiIvPjxwYXRoIHN0cm9rZT0iaHNsKDMwOCwgMTAwJSwgNTAlKSIgZD0iTTE1OC4yODkgMTk3LjI4OWE2Ni41IDY2LjUgMCAwMDEuNjIyLS42MzEiLz48cGF0aCBzdHJva2U9ImhzbCgzMDksIDEwMCUsIDUwJSkiIGQ9Ik0xNTcuMTk4IDE5Ny42ODZhNjYuNSA2Ni41IDAgMDAxLjYzMy0uNjAzIi8+PHBhdGggc3Ryb2tlPSJoc2woMzEwLCAxMDAlLCA1MCUpIiBkPSJNMTU2LjEgMTk4LjA2NGE2Ni41IDY2LjUgMCAwMDEuNjQ0LS41NzQiLz48cGF0aCBzdHJva2U9ImhzbCgzMTEsIDEwMCUsIDUwJSkiIGQ9Ik0xNTQuOTk3IDE5OC40MjJhNjYuNSA2Ni41IDAgMDAxLjY1My0uNTQ1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzEyLCAxMDAlLCA1MCUpIiBkPSJNMTUzLjg4NyAxOTguNzYyYTY2LjUgNjYuNSAwIDAwMS42NjMtLjUxNyIvPjxwYXRoIHN0cm9rZT0iaHNsKDMxMywgMTAwJSwgNTAlKSIgZD0iTTE1Mi43NzEgMTk5LjA4MWE2Ni41IDY2LjUgMCAwMDEuNjcyLS40ODciLz48cGF0aCBzdHJva2U9ImhzbCgzMTQsIDEwMCUsIDUwJSkiIGQ9Ik0xNTEuNjUgMTk5LjM4MmE2Ni41IDY2LjUgMCAwMDEuNjgtLjQ1OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDMxNSwgMTAwJSwgNTAlKSIgZD0iTTE1MC41MjQgMTk5LjY2M2E2Ni41IDY2LjUgMCAwMDEuNjg3LS40MjkiLz48cGF0aCBzdHJva2U9ImhzbCgzMTYsIDEwMCUsIDUwJSkiIGQ9Ik0xNDkuMzkzIDE5OS45MjRhNjYuNSA2Ni41IDAgMDAxLjY5NS0uNCIvPjxwYXRoIHN0cm9rZT0iaHNsKDMxNywgMTAwJSwgNTAlKSIgZD0iTTE0OC4yNTggMjAwLjE2NWE2Ni41IDY2LjUgMCAwMDEuNzAxLS4zNyIvPjxwYXRoIHN0cm9rZT0iaHNsKDMxOCwgMTAwJSwgNTAlKSIgZD0iTTE0Ny4xMTkgMjAwLjM4NmE2Ni41IDY2LjUgMCAwMDEuNzA3LS4zNCIvPjxwYXRoIHN0cm9rZT0iaHNsKDMxOSwgMTAwJSwgNTAlKSIgZD0iTTE0NS45NzYgMjAwLjU4OGE2Ni41IDY2LjUgMCAwMDEuNzEzLS4zMSIvPjxwYXRoIHN0cm9rZT0iaHNsKDMyMCwgMTAwJSwgNTAlKSIgZD0iTTE0NC44MyAyMDAuNzdhNjYuNSA2Ni41IDAgMDAxLjcxOC0uMjgiLz48cGF0aCBzdHJva2U9ImhzbCgzMjEsIDEwMCUsIDUwJSkiIGQ9Ik0xNDMuNjggMjAwLjkzMWE2Ni41IDY2LjUgMCAwMDEuNzIzLS4yNSIvPjxwYXRoIHN0cm9rZT0iaHNsKDMyMiwgMTAwJSwgNTAlKSIgZD0iTTE0Mi41MjggMjAxLjA3M2E2Ni41IDY2LjUgMCAwMDEuNzI3LS4yMiIvPjxwYXRoIHN0cm9rZT0iaHNsKDMyMywgMTAwJSwgNTAlKSIgZD0iTTE0MS4zNzQgMjAxLjE5NGE2Ni41IDY2LjUgMCAwMDEuNzMtLjE5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzI0LCAxMDAlLCA1MCUpIiBkPSJNMTQwLjIxOCAyMDEuMjk1YTY2LjUgNjYuNSAwIDAwMS43MzMtLjE2Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzI1LCAxMDAlLCA1MCUpIiBkPSJNMTM5LjA2IDIwMS4zNzZhNjYuNSA2Ni41IDAgMDAxLjczNi0uMTMiLz48cGF0aCBzdHJva2U9ImhzbCgzMjYsIDEwMCUsIDUwJSkiIGQ9Ik0xMzcuOSAyMDEuNDM3YTY2LjUgNjYuNSAwIDAwMS43MzktLjA5OSIvPjxwYXRoIHN0cm9rZT0iaHNsKDMyNywgMTAwJSwgNTAlKSIgZD0iTTEzNi43NCAyMDEuNDc3YTY2LjUgNjYuNSAwIDAwMS43NC0uMDY4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzI4LCAxMDAlLCA1MCUpIiBkPSJNMTM1LjU4IDIwMS40OTdhNjYuNSA2Ni41IDAgMDAxLjc0LS4wMzgiLz48cGF0aCBzdHJva2U9ImhzbCgzMjksIDEwMCUsIDUwJSkiIGQ9Ik0xMzQuNDIgMjAxLjQ5N2E2Ni41IDY2LjUgMCAwMDEuNzQtLjAwNyIvPjxwYXRoIHN0cm9rZT0iaHNsKDMzMCwgMTAwJSwgNTAlKSIgZD0iTTEzMy4yNiAyMDEuNDc3YTY2LjUgNjYuNSAwIDAwMS43NC4wMjMiLz48cGF0aCBzdHJva2U9ImhzbCgzMzEsIDEwMCUsIDUwJSkiIGQ9Ik0xMzIuMSAyMDEuNDM3YTY2LjUgNjYuNSAwIDAwMS43NC4wNTMiLz48cGF0aCBzdHJva2U9ImhzbCgzMzIsIDEwMCUsIDUwJSkiIGQ9Ik0xMzAuOTQgMjAxLjM3NmE2Ni41IDY2LjUgMCAwMDEuNzQuMDgzIi8+PHBhdGggc3Ryb2tlPSJoc2woMzMzLCAxMDAlLCA1MCUpIiBkPSJNMTI5Ljc4MiAyMDEuMjk1YTY2LjUgNjYuNSAwIDAwMS43MzguMTE0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzM0LCAxMDAlLCA1MCUpIiBkPSJNMTI4LjYyNiAyMDEuMTk0YTY2LjUgNjYuNSAwIDAwMS43MzUuMTQ0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzM1LCAxMDAlLCA1MCUpIiBkPSJNMTI3LjQ3MiAyMDEuMDczYTY2LjUgNjYuNSAwIDAwMS43MzIuMTc0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzM2LCAxMDAlLCA1MCUpIiBkPSJNMTI2LjMyIDIwMC45MzFhNjYuNSA2Ni41IDAgMDAxLjcyOS4yMDUiLz48cGF0aCBzdHJva2U9ImhzbCgzMzcsIDEwMCUsIDUwJSkiIGQ9Ik0xMjUuMTcgMjAwLjc3YTY2LjUgNjYuNSAwIDAwMS43MjYuMjM0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzM4LCAxMDAlLCA1MCUpIiBkPSJNMTI0LjAyNCAyMDAuNTg4YTY2LjUgNjYuNSAwIDAwMS43MjEuMjY1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzM5LCAxMDAlLCA1MCUpIiBkPSJNMTIyLjg4MSAyMDAuMzg2YTY2LjUgNjYuNSAwIDAwMS43MTYuMjk1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzQwLCAxMDAlLCA1MCUpIiBkPSJNMTIxLjc0MiAyMDAuMTY1YTY2LjUgNjYuNSAwIDAwMS43MS4zMjUiLz48cGF0aCBzdHJva2U9ImhzbCgzNDEsIDEwMCUsIDUwJSkiIGQ9Ik0xMjAuNjA3IDE5OS45MjRhNjYuNSA2Ni41IDAgMDAxLjcwNC4zNTQiLz48cGF0aCBzdHJva2U9ImhzbCgzNDIsIDEwMCUsIDUwJSkiIGQ9Ik0xMTkuNDc2IDE5OS42NjNhNjYuNSA2Ni41IDAgMDAxLjY5OC4zODQiLz48cGF0aCBzdHJva2U9ImhzbCgzNDMsIDEwMCUsIDUwJSkiIGQ9Ik0xMTguMzUgMTk5LjM4MmE2Ni41IDY2LjUgMCAwMDEuNjkuNDE0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzQ0LCAxMDAlLCA1MCUpIiBkPSJNMTE3LjIyOSAxOTkuMDgxYTY2LjUgNjYuNSAwIDAwMS42ODMuNDQ0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzQ1LCAxMDAlLCA1MCUpIiBkPSJNMTE2LjExMyAxOTguNzYyYTY2LjUgNjYuNSAwIDAwMS42NzYuNDcyIi8+PHBhdGggc3Ryb2tlPSJoc2woMzQ2LCAxMDAlLCA1MCUpIiBkPSJNMTE1LjAwMyAxOTguNDIyYTY2LjUgNjYuNSAwIDAwMS42NjcuNTAyIi8+PHBhdGggc3Ryb2tlPSJoc2woMzQ3LCAxMDAlLCA1MCUpIiBkPSJNMTEzLjkgMTk4LjA2NGE2Ni41IDY2LjUgMCAwMDEuNjU3LjUzIi8+PHBhdGggc3Ryb2tlPSJoc2woMzQ4LCAxMDAlLCA1MCUpIiBkPSJNMTEyLjgwMiAxOTcuNjg2YTY2LjUgNjYuNSAwIDAwMS42NDguNTYiLz48cGF0aCBzdHJva2U9ImhzbCgzNDksIDEwMCUsIDUwJSkiIGQ9Ik0xMTEuNzExIDE5Ny4yODlhNjYuNSA2Ni41IDAgMDAxLjYzOS41ODgiLz48cGF0aCBzdHJva2U9ImhzbCgzNTAsIDEwMCUsIDUwJSkiIGQ9Ik0xMTAuNjI4IDE5Ni44NzNhNjYuNSA2Ni41IDAgMDAxLjYyOC42MTciLz48cGF0aCBzdHJva2U9ImhzbCgzNTEsIDEwMCUsIDUwJSkiIGQ9Ik0xMDkuNTUyIDE5Ni40MzhhNjYuNSA2Ni41IDAgMDAxLjYxNy42NDUiLz48cGF0aCBzdHJva2U9ImhzbCgzNTIsIDEwMCUsIDUwJSkiIGQ9Ik0xMDguNDgzIDE5NS45ODRhNjYuNSA2Ni41IDAgMDAxLjYwNi42NzQiLz48cGF0aCBzdHJva2U9ImhzbCgzNTMsIDEwMCUsIDUwJSkiIGQ9Ik0xMDcuNDIzIDE5NS41MTJhNjYuNSA2Ni41IDAgMDAxLjU5My43MDIiLz48cGF0aCBzdHJva2U9ImhzbCgzNTQsIDEwMCUsIDUwJSkiIGQ9Ik0xMDYuMzcxIDE5NS4wMjJhNjYuNSA2Ni41IDAgMDAxLjU4MS43MjkiLz48cGF0aCBzdHJva2U9ImhzbCgzNTUsIDEwMCUsIDUwJSkiIGQ9Ik0xMDUuMzI4IDE5NC41MTNhNjYuNSA2Ni41IDAgMDAxLjU2OC43NTYiLz48cGF0aCBzdHJva2U9ImhzbCgzNTYsIDEwMCUsIDUwJSkiIGQ9Ik0xMDQuMjk0IDE5My45ODZhNjYuNSA2Ni41IDAgMDAxLjU1NC43ODQiLz48cGF0aCBzdHJva2U9ImhzbCgzNTcsIDEwMCUsIDUwJSkiIGQ9Ik0xMDMuMjY5IDE5My40NDFhNjYuNSA2Ni41IDAgMDAxLjU0LjgxIi8+PHBhdGggc3Ryb2tlPSJoc2woMzU4LCAxMDAlLCA1MCUpIiBkPSJNMTAyLjI1NCAxOTIuODc5YTY2LjUgNjYuNSAwIDAwMS41MjYuODM3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzU5LCAxMDAlLCA1MCUpIiBkPSJNMTAxLjI0OSAxOTIuMjk4YTY2LjUgNjYuNSAwIDAwMS41MTEuODY0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMCwgMTAwJSwgNTAlKSIgZD0iTTEwMC4yNTQgMTkxLjdhNjYuNSA2Ni41IDAgMDAxLjQ5Ni44OSIvPjxwYXRoIHN0cm9rZT0iaHNsKDEsIDEwMCUsIDUwJSkiIGQ9Ik05OS4yNyAxOTEuMDg2YTY2LjUgNjYuNSAwIDAwMS40OC45MTYiLz48cGF0aCBzdHJva2U9ImhzbCgyLCAxMDAlLCA1MCUpIiBkPSJNOTguMjk2IDE5MC40NTNhNjYuNSA2Ni41IDAgMDAxLjQ2NC45NDIiLz48cGF0aCBzdHJva2U9ImhzbCgzLCAxMDAlLCA1MCUpIiBkPSJNOTcuMzM0IDE4OS44MDRhNjYuNSA2Ni41IDAgMDAxLjQ0OC45NjgiLz48cGF0aCBzdHJva2U9ImhzbCg0LCAxMDAlLCA1MCUpIiBkPSJNOTYuMzgzIDE4OS4xMzlhNjYuNSA2Ni41IDAgMDAxLjQzLjk5MiIvPjxwYXRoIHN0cm9rZT0iaHNsKDUsIDEwMCUsIDUwJSkiIGQ9Ik05NS40NDQgMTg4LjQ1NmE2Ni41IDY2LjUgMCAwMDEuNDEzIDEuMDE4Ii8+PHBhdGggc3Ryb2tlPSJoc2woNiwgMTAwJSwgNTAlKSIgZD0iTTk0LjUxNyAxODcuNzU4YTY2LjUgNjYuNSAwIDAwMS4zOTUgMS4wNDIiLz48cGF0aCBzdHJva2U9ImhzbCg3LCAxMDAlLCA1MCUpIiBkPSJNOTMuNjAzIDE4Ny4wNDNhNjYuNSA2Ni41IDAgMDAxLjM3NiAxLjA2NiIvPjxwYXRoIHN0cm9rZT0iaHNsKDgsIDEwMCUsIDUwJSkiIGQ9Ik05Mi43IDE4Ni4zMTNhNjYuNSA2Ni41IDAgMDAxLjM1OSAxLjA5Ii8+PHBhdGggc3Ryb2tlPSJoc2woOSwgMTAwJSwgNTAlKSIgZD0iTTkxLjgxMiAxODUuNTY3YTY2LjUgNjYuNSAwIDAwMS4zMzggMS4xMTMiLz48cGF0aCBzdHJva2U9ImhzbCgxMCwgMTAwJSwgNTAlKSIgZD0iTTkwLjkzNiAxODQuODA2YTY2LjUgNjYuNSAwIDAwMS4zMTkgMS4xMzYiLz48cGF0aCBzdHJva2U9ImhzbCgxMSwgMTAwJSwgNTAlKSIgZD0iTTkwLjA3MyAxODQuMDI5YTY2LjUgNjYuNSAwIDAwMS4zIDEuMTYiLz48cGF0aCBzdHJva2U9ImhzbCgxMiwgMTAwJSwgNTAlKSIgZD0iTTg5LjIyNCAxODMuMjM3YTY2LjUgNjYuNSAwIDAwMS4yNzkgMS4xODIiLz48cGF0aCBzdHJva2U9ImhzbCgxMywgMTAwJSwgNTAlKSIgZD0iTTg4LjM5IDE4Mi40MzFhNjYuNSA2Ni41IDAgMDAxLjI1NyAxLjIwNCIvPjxwYXRoIHN0cm9rZT0iaHNsKDE0LCAxMDAlLCA1MCUpIiBkPSJNODcuNTY5IDE4MS42MWE2Ni41IDY2LjUgMCAwMDEuMjM2IDEuMjI2Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTUsIDEwMCUsIDUwJSkiIGQ9Ik04Ni43NjMgMTgwLjc3NmE2Ni41IDY2LjUgMCAwMDEuMjE0IDEuMjQ3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTYsIDEwMCUsIDUwJSkiIGQ9Ik04NS45NzEgMTc5LjkyN2E2Ni41IDY2LjUgMCAwMDEuMTkzIDEuMjY4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTcsIDEwMCUsIDUwJSkiIGQ9Ik04NS4xOTQgMTc5LjA2NGE2Ni41IDY2LjUgMCAwMDEuMTcxIDEuMjg5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTgsIDEwMCUsIDUwJSkiIGQ9Ik04NC40MzMgMTc4LjE4OGE2Ni41IDY2LjUgMCAwMDEuMTQ4IDEuMzEiLz48cGF0aCBzdHJva2U9ImhzbCgxOSwgMTAwJSwgNTAlKSIgZD0iTTgzLjY4NyAxNzcuM2E2Ni41IDY2LjUgMCAwMDEuMTI1IDEuMzI4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjAsIDEwMCUsIDUwJSkiIGQ9Ik04Mi45NTcgMTc2LjM5N2E2Ni41IDY2LjUgMCAwMDEuMTAxIDEuMzQ4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjEsIDEwMCUsIDUwJSkiIGQ9Ik04Mi4yNDIgMTc1LjQ4M2E2Ni41IDY2LjUgMCAwMDEuMDc4IDEuMzY3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjIsIDEwMCUsIDUwJSkiIGQ9Ik04MS41NDQgMTc0LjU1NmE2Ni41IDY2LjUgMCAwMDEuMDUzIDEuMzg1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjMsIDEwMCUsIDUwJSkiIGQ9Ik04MC44NjEgMTczLjYxN2E2Ni41IDY2LjUgMCAwMDEuMDMgMS40MDQiLz48cGF0aCBzdHJva2U9ImhzbCgyNCwgMTAwJSwgNTAlKSIgZD0iTTgwLjE5NiAxNzIuNjY2YTY2LjUgNjYuNSAwIDAwMS4wMDQgMS40MjIiLz48cGF0aCBzdHJva2U9ImhzbCgyNSwgMTAwJSwgNTAlKSIgZD0iTTc5LjU0NyAxNzEuNzA0YTY2LjUgNjYuNSAwIDAwLjk4IDEuNDM5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjYsIDEwMCUsIDUwJSkiIGQ9Ik03OC45MTQgMTcwLjczYTY2LjUgNjYuNSAwIDAwLjk1NSAxLjQ1NiIvPjxwYXRoIHN0cm9rZT0iaHNsKDI3LCAxMDAlLCA1MCUpIiBkPSJNNzguMyAxNjkuNzQ2YTY2LjUgNjYuNSAwIDAwLjkyOCAxLjQ3MiIvPjxwYXRoIHN0cm9rZT0iaHNsKDI4LCAxMDAlLCA1MCUpIiBkPSJNNzcuNzAyIDE2OC43NTFhNjYuNSA2Ni41IDAgMDAuOTAzIDEuNDg5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjksIDEwMCUsIDUwJSkiIGQ9Ik03Ny4xMjEgMTY3Ljc0NmE2Ni41IDY2LjUgMCAwMC44NzcgMS41MDQiLz48cGF0aCBzdHJva2U9ImhzbCgzMCwgMTAwJSwgNTAlKSIgZD0iTTc2LjU1OSAxNjYuNzMxYTY2LjUgNjYuNSAwIDAwLjg1IDEuNTE5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzEsIDEwMCUsIDUwJSkiIGQ9Ik03Ni4wMTQgMTY1LjcwNmE2Ni41IDY2LjUgMCAwMC44MjQgMS41MzQiLz48cGF0aCBzdHJva2U9ImhzbCgzMiwgMTAwJSwgNTAlKSIgZD0iTTc1LjQ4NyAxNjQuNjcyYTY2LjUgNjYuNSAwIDAwLjc5NyAxLjU0OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDMzLCAxMDAlLCA1MCUpIiBkPSJNNzQuOTc4IDE2My42MjlhNjYuNSA2Ni41IDAgMDAuNzcgMS41NjEiLz48cGF0aCBzdHJva2U9ImhzbCgzNCwgMTAwJSwgNTAlKSIgZD0iTTc0LjQ4OCAxNjIuNTc3YTY2LjUgNjYuNSAwIDAwLjc0MiAxLjU3NSIvPjxwYXRoIHN0cm9rZT0iaHNsKDM1LCAxMDAlLCA1MCUpIiBkPSJNNzQuMDE2IDE2MS41MTdhNjYuNSA2Ni41IDAgMDAuNzE1IDEuNTg3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzYsIDEwMCUsIDUwJSkiIGQ9Ik03My41NjIgMTYwLjQ0OGE2Ni41IDY2LjUgMCAwMC42ODcgMS42Ii8+PHBhdGggc3Ryb2tlPSJoc2woMzcsIDEwMCUsIDUwJSkiIGQ9Ik03My4xMjcgMTU5LjM3MmE2Ni41IDY2LjUgMCAwMC42NiAxLjYxMiIvPjxwYXRoIHN0cm9rZT0iaHNsKDM4LCAxMDAlLCA1MCUpIiBkPSJNNzIuNzExIDE1OC4yODlhNjYuNSA2Ni41IDAgMDAuNjMxIDEuNjIyIi8+PHBhdGggc3Ryb2tlPSJoc2woMzksIDEwMCUsIDUwJSkiIGQ9Ik03Mi4zMTQgMTU3LjE5OGE2Ni41IDY2LjUgMCAwMC42MDMgMS42MzMiLz48cGF0aCBzdHJva2U9ImhzbCg0MCwgMTAwJSwgNTAlKSIgZD0iTTcxLjkzNiAxNTYuMWE2Ni41IDY2LjUgMCAwMC41NzQgMS42NDQiLz48cGF0aCBzdHJva2U9ImhzbCg0MSwgMTAwJSwgNTAlKSIgZD0iTTcxLjU3OCAxNTQuOTk3YTY2LjUgNjYuNSAwIDAwLjU0NSAxLjY1MyIvPjxwYXRoIHN0cm9rZT0iaHNsKDQyLCAxMDAlLCA1MCUpIiBkPSJNNzEuMjM4IDE1My44ODdhNjYuNSA2Ni41IDAgMDAuNTE3IDEuNjYzIi8+PHBhdGggc3Ryb2tlPSJoc2woNDMsIDEwMCUsIDUwJSkiIGQ9Ik03MC45MTkgMTUyLjc3MWE2Ni41IDY2LjUgMCAwMC40ODcgMS42NzIiLz48cGF0aCBzdHJva2U9ImhzbCg0NCwgMTAwJSwgNTAlKSIgZD0iTTcwLjYxOCAxNTEuNjVhNjYuNSA2Ni41IDAgMDAuNDU4IDEuNjgiLz48cGF0aCBzdHJva2U9ImhzbCg0NSwgMTAwJSwgNTAlKSIgZD0iTTcwLjMzNyAxNTAuNTI0YTY2LjUgNjYuNSAwIDAwLjQyOSAxLjY4NyIvPjxwYXRoIHN0cm9rZT0iaHNsKDQ2LCAxMDAlLCA1MCUpIiBkPSJNNzAuMDc2IDE0OS4zOTNhNjYuNSA2Ni41IDAgMDAuNCAxLjY5NSIvPjxwYXRoIHN0cm9rZT0iaHNsKDQ3LCAxMDAlLCA1MCUpIiBkPSJNNjkuODM1IDE0OC4yNThhNjYuNSA2Ni41IDAgMDAuMzcgMS43MDEiLz48cGF0aCBzdHJva2U9ImhzbCg0OCwgMTAwJSwgNTAlKSIgZD0iTTY5LjYxNCAxNDcuMTE5YTY2LjUgNjYuNSAwIDAwLjM0IDEuNzA3Ii8+PHBhdGggc3Ryb2tlPSJoc2woNDksIDEwMCUsIDUwJSkiIGQ9Ik02OS40MTIgMTQ1Ljk3NmE2Ni41IDY2LjUgMCAwMC4zMSAxLjcxMyIvPjxwYXRoIHN0cm9rZT0iaHNsKDUwLCAxMDAlLCA1MCUpIiBkPSJNNjkuMjMgMTQ0LjgzYTY2LjUgNjYuNSAwIDAwLjI4IDEuNzE4Ii8+PHBhdGggc3Ryb2tlPSJoc2woNTEsIDEwMCUsIDUwJSkiIGQ9Ik02OS4wNjkgMTQzLjY4YTY2LjUgNjYuNSAwIDAwLjI1IDEuNzIzIi8+PHBhdGggc3Ryb2tlPSJoc2woNTIsIDEwMCUsIDUwJSkiIGQ9Ik02OC45MjcgMTQyLjUyOGE2Ni41IDY2LjUgMCAwMC4yMiAxLjcyNyIvPjxwYXRoIHN0cm9rZT0iaHNsKDUzLCAxMDAlLCA1MCUpIiBkPSJNNjguODA2IDE0MS4zNzRhNjYuNSA2Ni41IDAgMDAuMTkgMS43MyIvPjxwYXRoIHN0cm9rZT0iaHNsKDU0LCAxMDAlLCA1MCUpIiBkPSJNNjguNzA1IDE0MC4yMThhNjYuNSA2Ni41IDAgMDAuMTYgMS43MzMiLz48cGF0aCBzdHJva2U9ImhzbCg1NSwgMTAwJSwgNTAlKSIgZD0iTTY4LjYyNCAxMzkuMDZhNjYuNSA2Ni41IDAgMDAuMTMgMS43MzYiLz48cGF0aCBzdHJva2U9ImhzbCg1NiwgMTAwJSwgNTAlKSIgZD0iTTY4LjU2MyAxMzcuOWE2Ni41IDY2LjUgMCAwMC4wOTkgMS43MzkiLz48cGF0aCBzdHJva2U9ImhzbCg1NywgMTAwJSwgNTAlKSIgZD0iTTY4LjUyMyAxMzYuNzRhNjYuNSA2Ni41IDAgMDAuMDY4IDEuNzQiLz48cGF0aCBzdHJva2U9ImhzbCg1OCwgMTAwJSwgNTAlKSIgZD0iTTY4LjUwMyAxMzUuNThhNjYuNSA2Ni41IDAgMDAuMDM4IDEuNzQiLz48cGF0aCBzdHJva2U9ImhzbCg1OSwgMTAwJSwgNTAlKSIgZD0iTTY4LjUwMyAxMzQuNDJhNjYuNSA2Ni41IDAgMDAuMDA3IDEuNzQiLz48cGF0aCBzdHJva2U9ImhzbCg2MCwgMTAwJSwgNTAlKSIgZD0iTTY4LjUyMyAxMzMuMjZBNjYuNSA2Ni41IDAgMDA2OC41IDEzNSIvPjxwYXRoIHN0cm9rZT0iaHNsKDYxLCAxMDAlLCA1MCUpIiBkPSJNNjguNTYzIDEzMi4xYTY2LjUgNjYuNSAwIDAwLS4wNTMgMS43NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDYyLCAxMDAlLCA1MCUpIiBkPSJNNjguNjI0IDEzMC45NGE2Ni41IDY2LjUgMCAwMC0uMDgzIDEuNzQiLz48cGF0aCBzdHJva2U9ImhzbCg2MywgMTAwJSwgNTAlKSIgZD0iTTY4LjcwNSAxMjkuNzgyYTY2LjUgNjYuNSAwIDAwLS4xMTQgMS43MzgiLz48cGF0aCBzdHJva2U9ImhzbCg2NCwgMTAwJSwgNTAlKSIgZD0iTTY4LjgwNiAxMjguNjI2YTY2LjUgNjYuNSAwIDAwLS4xNDQgMS43MzUiLz48cGF0aCBzdHJva2U9ImhzbCg2NSwgMTAwJSwgNTAlKSIgZD0iTTY4LjkyNyAxMjcuNDcyYTY2LjUgNjYuNSAwIDAwLS4xNzQgMS43MzIiLz48cGF0aCBzdHJva2U9ImhzbCg2NiwgMTAwJSwgNTAlKSIgZD0iTTY5LjA2OSAxMjYuMzJhNjYuNSA2Ni41IDAgMDAtLjIwNSAxLjcyOSIvPjxwYXRoIHN0cm9rZT0iaHNsKDY3LCAxMDAlLCA1MCUpIiBkPSJNNjkuMjMgMTI1LjE3YTY2LjUgNjYuNSAwIDAwLS4yMzQgMS43MjYiLz48cGF0aCBzdHJva2U9ImhzbCg2OCwgMTAwJSwgNTAlKSIgZD0iTTY5LjQxMiAxMjQuMDI0YTY2LjUgNjYuNSAwIDAwLS4yNjUgMS43MjEiLz48cGF0aCBzdHJva2U9ImhzbCg2OSwgMTAwJSwgNTAlKSIgZD0iTTY5LjYxNCAxMjIuODgxYTY2LjUgNjYuNSAwIDAwLS4yOTUgMS43MTYiLz48cGF0aCBzdHJva2U9ImhzbCg3MCwgMTAwJSwgNTAlKSIgZD0iTTY5LjgzNSAxMjEuNzQyYTY2LjUgNjYuNSAwIDAwLS4zMjUgMS43MSIvPjxwYXRoIHN0cm9rZT0iaHNsKDcxLCAxMDAlLCA1MCUpIiBkPSJNNzAuMDc2IDEyMC42MDdhNjYuNSA2Ni41IDAgMDAtLjM1NCAxLjcwNCIvPjxwYXRoIHN0cm9rZT0iaHNsKDcyLCAxMDAlLCA1MCUpIiBkPSJNNzAuMzM3IDExOS40NzZhNjYuNSA2Ni41IDAgMDAtLjM4NCAxLjY5OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDczLCAxMDAlLCA1MCUpIiBkPSJNNzAuNjE4IDExOC4zNWE2Ni41IDY2LjUgMCAwMC0uNDE0IDEuNjkiLz48cGF0aCBzdHJva2U9ImhzbCg3NCwgMTAwJSwgNTAlKSIgZD0iTTcwLjkxOSAxMTcuMjI5YTY2LjUgNjYuNSAwIDAwLS40NDQgMS42ODMiLz48cGF0aCBzdHJva2U9ImhzbCg3NSwgMTAwJSwgNTAlKSIgZD0iTTcxLjIzOCAxMTYuMTEzYTY2LjUgNjYuNSAwIDAwLS40NzIgMS42NzYiLz48cGF0aCBzdHJva2U9ImhzbCg3NiwgMTAwJSwgNTAlKSIgZD0iTTcxLjU3OCAxMTUuMDAzYTY2LjUgNjYuNSAwIDAwLS41MDIgMS42NjciLz48cGF0aCBzdHJva2U9ImhzbCg3NywgMTAwJSwgNTAlKSIgZD0iTTcxLjkzNiAxMTMuOWE2Ni41IDY2LjUgMCAwMC0uNTMgMS42NTciLz48cGF0aCBzdHJva2U9ImhzbCg3OCwgMTAwJSwgNTAlKSIgZD0iTTcyLjMxNCAxMTIuODAyYTY2LjUgNjYuNSAwIDAwLS41NiAxLjY0OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDc5LCAxMDAlLCA1MCUpIiBkPSJNNzIuNzExIDExMS43MTFhNjYuNSA2Ni41IDAgMDAtLjU4OCAxLjYzOSIvPjxwYXRoIHN0cm9rZT0iaHNsKDgwLCAxMDAlLCA1MCUpIiBkPSJNNzMuMTI3IDExMC42MjhhNjYuNSA2Ni41IDAgMDAtLjYxNyAxLjYyOCIvPjxwYXRoIHN0cm9rZT0iaHNsKDgxLCAxMDAlLCA1MCUpIiBkPSJNNzMuNTYyIDEwOS41NTJhNjYuNSA2Ni41IDAgMDAtLjY0NSAxLjYxNyIvPjxwYXRoIHN0cm9rZT0iaHNsKDgyLCAxMDAlLCA1MCUpIiBkPSJNNzQuMDE2IDEwOC40ODNhNjYuNSA2Ni41IDAgMDAtLjY3NCAxLjYwNiIvPjxwYXRoIHN0cm9rZT0iaHNsKDgzLCAxMDAlLCA1MCUpIiBkPSJNNzQuNDg4IDEwNy40MjNhNjYuNSA2Ni41IDAgMDAtLjcwMiAxLjU5MyIvPjxwYXRoIHN0cm9rZT0iaHNsKDg0LCAxMDAlLCA1MCUpIiBkPSJNNzQuOTc4IDEwNi4zNzFhNjYuNSA2Ni41IDAgMDAtLjcyOSAxLjU4MSIvPjxwYXRoIHN0cm9rZT0iaHNsKDg1LCAxMDAlLCA1MCUpIiBkPSJNNzUuNDg3IDEwNS4zMjhhNjYuNSA2Ni41IDAgMDAtLjc1NiAxLjU2OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDg2LCAxMDAlLCA1MCUpIiBkPSJNNzYuMDE0IDEwNC4yOTRhNjYuNSA2Ni41IDAgMDAtLjc4NCAxLjU1NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDg3LCAxMDAlLCA1MCUpIiBkPSJNNzYuNTU5IDEwMy4yNjlhNjYuNSA2Ni41IDAgMDAtLjgxIDEuNTQiLz48cGF0aCBzdHJva2U9ImhzbCg4OCwgMTAwJSwgNTAlKSIgZD0iTTc3LjEyMSAxMDIuMjU0YTY2LjUgNjYuNSAwIDAwLS44MzcgMS41MjYiLz48cGF0aCBzdHJva2U9ImhzbCg4OSwgMTAwJSwgNTAlKSIgZD0iTTc3LjcwMiAxMDEuMjQ5YTY2LjUgNjYuNSAwIDAwLS44NjQgMS41MTEiLz48cGF0aCBzdHJva2U9ImhzbCg5MCwgMTAwJSwgNTAlKSIgZD0iTTc4LjMgMTAwLjI1NGE2Ni41IDY2LjUgMCAwMC0uODkgMS40OTYiLz48cGF0aCBzdHJva2U9ImhzbCg5MSwgMTAwJSwgNTAlKSIgZD0iTTc4LjkxNCA5OS4yN2E2Ni41IDY2LjUgMCAwMC0uOTE2IDEuNDgiLz48cGF0aCBzdHJva2U9ImhzbCg5MiwgMTAwJSwgNTAlKSIgZD0iTTc5LjU0NyA5OC4yOTZhNjYuNSA2Ni41IDAgMDAtLjk0MiAxLjQ2NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDkzLCAxMDAlLCA1MCUpIiBkPSJNODAuMTk2IDk3LjMzNGE2Ni41IDY2LjUgMCAwMC0uOTY4IDEuNDQ4Ii8+PHBhdGggc3Ryb2tlPSJoc2woOTQsIDEwMCUsIDUwJSkiIGQ9Ik04MC44NjEgOTYuMzgzYTY2LjUgNjYuNSAwIDAwLS45OTIgMS40MyIvPjxwYXRoIHN0cm9rZT0iaHNsKDk1LCAxMDAlLCA1MCUpIiBkPSJNODEuNTQ0IDk1LjQ0NGE2Ni41IDY2LjUgMCAwMC0xLjAxOCAxLjQxMyIvPjxwYXRoIHN0cm9rZT0iaHNsKDk2LCAxMDAlLCA1MCUpIiBkPSJNODIuMjQyIDk0LjUxN2E2Ni41IDY2LjUgMCAwMC0xLjA0MiAxLjM5NSIvPjxwYXRoIHN0cm9rZT0iaHNsKDk3LCAxMDAlLCA1MCUpIiBkPSJNODIuOTU3IDkzLjYwM2E2Ni41IDY2LjUgMCAwMC0xLjA2NiAxLjM3NiIvPjxwYXRoIHN0cm9rZT0iaHNsKDk4LCAxMDAlLCA1MCUpIiBkPSJNODMuNjg3IDkyLjdhNjYuNSA2Ni41IDAgMDAtMS4wOSAxLjM1OSIvPjxwYXRoIHN0cm9rZT0iaHNsKDk5LCAxMDAlLCA1MCUpIiBkPSJNODQuNDMzIDkxLjgxMmE2Ni41IDY2LjUgMCAwMC0xLjExMyAxLjMzOCIvPjxwYXRoIHN0cm9rZT0iaHNsKDEwMCwgMTAwJSwgNTAlKSIgZD0iTTg1LjE5NCA5MC45MzZhNjYuNSA2Ni41IDAgMDAtMS4xMzYgMS4zMTkiLz48cGF0aCBzdHJva2U9ImhzbCgxMDEsIDEwMCUsIDUwJSkiIGQ9Ik04NS45NzEgOTAuMDczYTY2LjUgNjYuNSAwIDAwLTEuMTYgMS4zIi8+PHBhdGggc3Ryb2tlPSJoc2woMTAyLCAxMDAlLCA1MCUpIiBkPSJNODYuNzYzIDg5LjIyNGE2Ni41IDY2LjUgMCAwMC0xLjE4MiAxLjI3OSIvPjxwYXRoIHN0cm9rZT0iaHNsKDEwMywgMTAwJSwgNTAlKSIgZD0iTTg3LjU2OSA4OC4zOWE2Ni41IDY2LjUgMCAwMC0xLjIwNCAxLjI1NyIvPjxwYXRoIHN0cm9rZT0iaHNsKDEwNCwgMTAwJSwgNTAlKSIgZD0iTTg4LjM5IDg3LjU2OWE2Ni41IDY2LjUgMCAwMC0xLjIyNiAxLjIzNiIvPjxwYXRoIHN0cm9rZT0iaHNsKDEwNSwgMTAwJSwgNTAlKSIgZD0iTTg5LjIyNCA4Ni43NjNhNjYuNSA2Ni41IDAgMDAtMS4yNDcgMS4yMTQiLz48cGF0aCBzdHJva2U9ImhzbCgxMDYsIDEwMCUsIDUwJSkiIGQ9Ik05MC4wNzMgODUuOTcxYTY2LjUgNjYuNSAwIDAwLTEuMjY4IDEuMTkzIi8+PHBhdGggc3Ryb2tlPSJoc2woMTA3LCAxMDAlLCA1MCUpIiBkPSJNOTAuOTM2IDg1LjE5NGE2Ni41IDY2LjUgMCAwMC0xLjI4OSAxLjE3MSIvPjxwYXRoIHN0cm9rZT0iaHNsKDEwOCwgMTAwJSwgNTAlKSIgZD0iTTkxLjgxMiA4NC40MzNhNjYuNSA2Ni41IDAgMDAtMS4zMSAxLjE0OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDEwOSwgMTAwJSwgNTAlKSIgZD0iTTkyLjcgODMuNjg3YTY2LjUgNjYuNSAwIDAwLTEuMzI4IDEuMTI1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTEwLCAxMDAlLCA1MCUpIiBkPSJNOTMuNjAzIDgyLjk1N2E2Ni41IDY2LjUgMCAwMC0xLjM0OCAxLjEwMSIvPjxwYXRoIHN0cm9rZT0iaHNsKDExMSwgMTAwJSwgNTAlKSIgZD0iTTk0LjUxNyA4Mi4yNDJhNjYuNSA2Ni41IDAgMDAtMS4zNjcgMS4wNzgiLz48cGF0aCBzdHJva2U9ImhzbCgxMTIsIDEwMCUsIDUwJSkiIGQ9Ik05NS40NDQgODEuNTQ0YTY2LjUgNjYuNSAwIDAwLTEuMzg1IDEuMDUzIi8+PHBhdGggc3Ryb2tlPSJoc2woMTEzLCAxMDAlLCA1MCUpIiBkPSJNOTYuMzgzIDgwLjg2MWE2Ni41IDY2LjUgMCAwMC0xLjQwNCAxLjAzIi8+PHBhdGggc3Ryb2tlPSJoc2woMTE0LCAxMDAlLCA1MCUpIiBkPSJNOTcuMzM0IDgwLjE5NmE2Ni41IDY2LjUgMCAwMC0xLjQyMiAxLjAwNCIvPjxwYXRoIHN0cm9rZT0iaHNsKDExNSwgMTAwJSwgNTAlKSIgZD0iTTk4LjI5NiA3OS41NDdhNjYuNSA2Ni41IDAgMDAtMS40MzkuOTgiLz48cGF0aCBzdHJva2U9ImhzbCgxMTYsIDEwMCUsIDUwJSkiIGQ9Ik05OS4yNyA3OC45MTRhNjYuNSA2Ni41IDAgMDAtMS40NTYuOTU1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTE3LCAxMDAlLCA1MCUpIiBkPSJNMTAwLjI1NCA3OC4zYTY2LjUgNjYuNSAwIDAwLTEuNDcyLjkyOCIvPjxwYXRoIHN0cm9rZT0iaHNsKDExOCwgMTAwJSwgNTAlKSIgZD0iTTEwMS4yNDkgNzcuNzAyYTY2LjUgNjYuNSAwIDAwLTEuNDg5LjkwMyIvPjxwYXRoIHN0cm9rZT0iaHNsKDExOSwgMTAwJSwgNTAlKSIgZD0iTTEwMi4yNTQgNzcuMTIxYTY2LjUgNjYuNSAwIDAwLTEuNTA0Ljg3NyIvPjxwYXRoIHN0cm9rZT0iaHNsKDEyMCwgMTAwJSwgNTAlKSIgZD0iTTEwMy4yNjkgNzYuNTU5YTY2LjUgNjYuNSAwIDAwLTEuNTE5Ljg1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTIxLCAxMDAlLCA1MCUpIiBkPSJNMTA0LjI5NCA3Ni4wMTRhNjYuNSA2Ni41IDAgMDAtMS41MzQuODI0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTIyLCAxMDAlLCA1MCUpIiBkPSJNMTA1LjMyOCA3NS40ODdhNjYuNSA2Ni41IDAgMDAtMS41NDguNzk3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTIzLCAxMDAlLCA1MCUpIiBkPSJNMTA2LjM3MSA3NC45NzhhNjYuNSA2Ni41IDAgMDAtMS41NjEuNzciLz48cGF0aCBzdHJva2U9ImhzbCgxMjQsIDEwMCUsIDUwJSkiIGQ9Ik0xMDcuNDIzIDc0LjQ4OGE2Ni41IDY2LjUgMCAwMC0xLjU3NS43NDIiLz48cGF0aCBzdHJva2U9ImhzbCgxMjUsIDEwMCUsIDUwJSkiIGQ9Ik0xMDguNDgzIDc0LjAxNmE2Ni41IDY2LjUgMCAwMC0xLjU4Ny43MTUiLz48cGF0aCBzdHJva2U9ImhzbCgxMjYsIDEwMCUsIDUwJSkiIGQ9Ik0xMDkuNTUyIDczLjU2MmE2Ni41IDY2LjUgMCAwMC0xLjYuNjg3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTI3LCAxMDAlLCA1MCUpIiBkPSJNMTEwLjYyOCA3My4xMjdhNjYuNSA2Ni41IDAgMDAtMS42MTIuNjYiLz48cGF0aCBzdHJva2U9ImhzbCgxMjgsIDEwMCUsIDUwJSkiIGQ9Ik0xMTEuNzExIDcyLjcxMWE2Ni41IDY2LjUgMCAwMC0xLjYyMi42MzEiLz48cGF0aCBzdHJva2U9ImhzbCgxMjksIDEwMCUsIDUwJSkiIGQ9Ik0xMTIuODAyIDcyLjMxNGE2Ni41IDY2LjUgMCAwMC0xLjYzMy42MDMiLz48cGF0aCBzdHJva2U9ImhzbCgxMzAsIDEwMCUsIDUwJSkiIGQ9Ik0xMTMuOSA3MS45MzZhNjYuNSA2Ni41IDAgMDAtMS42NDQuNTc0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTMxLCAxMDAlLCA1MCUpIiBkPSJNMTE1LjAwMyA3MS41NzhhNjYuNSA2Ni41IDAgMDAtMS42NTMuNTQ1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTMyLCAxMDAlLCA1MCUpIiBkPSJNMTE2LjExMyA3MS4yMzhhNjYuNSA2Ni41IDAgMDAtMS42NjMuNTE3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTMzLCAxMDAlLCA1MCUpIiBkPSJNMTE3LjIyOSA3MC45MTlhNjYuNSA2Ni41IDAgMDAtMS42NzIuNDg3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTM0LCAxMDAlLCA1MCUpIiBkPSJNMTE4LjM1IDcwLjYxOGE2Ni41IDY2LjUgMCAwMC0xLjY4LjQ1OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDEzNSwgMTAwJSwgNTAlKSIgZD0iTTExOS40NzYgNzAuMzM3YTY2LjUgNjYuNSAwIDAwLTEuNjg3LjQyOSIvPjxwYXRoIHN0cm9rZT0iaHNsKDEzNiwgMTAwJSwgNTAlKSIgZD0iTTEyMC42MDcgNzAuMDc2YTY2LjUgNjYuNSAwIDAwLTEuNjk1LjQiLz48cGF0aCBzdHJva2U9ImhzbCgxMzcsIDEwMCUsIDUwJSkiIGQ9Ik0xMjEuNzQyIDY5LjgzNWE2Ni41IDY2LjUgMCAwMC0xLjcwMS4zNyIvPjxwYXRoIHN0cm9rZT0iaHNsKDEzOCwgMTAwJSwgNTAlKSIgZD0iTTEyMi44ODEgNjkuNjE0YTY2LjUgNjYuNSAwIDAwLTEuNzA3LjM0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTM5LCAxMDAlLCA1MCUpIiBkPSJNMTI0LjAyNCA2OS40MTJhNjYuNSA2Ni41IDAgMDAtMS43MTMuMzEiLz48cGF0aCBzdHJva2U9ImhzbCgxNDAsIDEwMCUsIDUwJSkiIGQ9Ik0xMjUuMTcgNjkuMjNhNjYuNSA2Ni41IDAgMDAtMS43MTguMjgiLz48cGF0aCBzdHJva2U9ImhzbCgxNDEsIDEwMCUsIDUwJSkiIGQ9Ik0xMjYuMzIgNjkuMDY5YTY2LjUgNjYuNSAwIDAwLTEuNzIzLjI1Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTQyLCAxMDAlLCA1MCUpIiBkPSJNMTI3LjQ3MiA2OC45MjdhNjYuNSA2Ni41IDAgMDAtMS43MjcuMjIiLz48cGF0aCBzdHJva2U9ImhzbCgxNDMsIDEwMCUsIDUwJSkiIGQ9Ik0xMjguNjI2IDY4LjgwNmE2Ni41IDY2LjUgMCAwMC0xLjczLjE5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTQ0LCAxMDAlLCA1MCUpIiBkPSJNMTI5Ljc4MiA2OC43MDVhNjYuNSA2Ni41IDAgMDAtMS43MzMuMTYiLz48cGF0aCBzdHJva2U9ImhzbCgxNDUsIDEwMCUsIDUwJSkiIGQ9Ik0xMzAuOTQgNjguNjI0YTY2LjUgNjYuNSAwIDAwLTEuNzM2LjEzIi8+PHBhdGggc3Ryb2tlPSJoc2woMTQ2LCAxMDAlLCA1MCUpIiBkPSJNMTMyLjEgNjguNTYzYTY2LjUgNjYuNSAwIDAwLTEuNzM5LjA5OSIvPjxwYXRoIHN0cm9rZT0iaHNsKDE0NywgMTAwJSwgNTAlKSIgZD0iTTEzMy4yNiA2OC41MjNhNjYuNSA2Ni41IDAgMDAtMS43NC4wNjgiLz48cGF0aCBzdHJva2U9ImhzbCgxNDgsIDEwMCUsIDUwJSkiIGQ9Ik0xMzQuNDIgNjguNTAzYTY2LjUgNjYuNSAwIDAwLTEuNzQuMDM4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTQ5LCAxMDAlLCA1MCUpIiBkPSJNMTM1LjU4IDY4LjUwM2E2Ni41IDY2LjUgMCAwMC0xLjc0LjAwNyIvPjxwYXRoIHN0cm9rZT0iaHNsKDE1MCwgMTAwJSwgNTAlKSIgZD0iTTEzNi43NCA2OC41MjNBNjYuNSA2Ni41IDAgMDAxMzUgNjguNSIvPjxwYXRoIHN0cm9rZT0iaHNsKDE1MSwgMTAwJSwgNTAlKSIgZD0iTTEzNy45IDY4LjU2M2E2Ni41IDY2LjUgMCAwMC0xLjc0LS4wNTMiLz48cGF0aCBzdHJva2U9ImhzbCgxNTIsIDEwMCUsIDUwJSkiIGQ9Ik0xMzkuMDYgNjguNjI0YTY2LjUgNjYuNSAwIDAwLTEuNzQtLjA4MyIvPjxwYXRoIHN0cm9rZT0iaHNsKDE1MywgMTAwJSwgNTAlKSIgZD0iTTE0MC4yMTggNjguNzA1YTY2LjUgNjYuNSAwIDAwLTEuNzM4LS4xMTQiLz48cGF0aCBzdHJva2U9ImhzbCgxNTQsIDEwMCUsIDUwJSkiIGQ9Ik0xNDEuMzc0IDY4LjgwNmE2Ni41IDY2LjUgMCAwMC0xLjczNS0uMTQ0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTU1LCAxMDAlLCA1MCUpIiBkPSJNMTQyLjUyOCA2OC45MjdhNjYuNSA2Ni41IDAgMDAtMS43MzItLjE3NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDE1NiwgMTAwJSwgNTAlKSIgZD0iTTE0My42OCA2OS4wNjlhNjYuNSA2Ni41IDAgMDAtMS43MjktLjIwNSIvPjxwYXRoIHN0cm9rZT0iaHNsKDE1NywgMTAwJSwgNTAlKSIgZD0iTTE0NC44MyA2OS4yM2E2Ni41IDY2LjUgMCAwMC0xLjcyNi0uMjM0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTU4LCAxMDAlLCA1MCUpIiBkPSJNMTQ1Ljk3NiA2OS40MTJhNjYuNSA2Ni41IDAgMDAtMS43MjEtLjI2NSIvPjxwYXRoIHN0cm9rZT0iaHNsKDE1OSwgMTAwJSwgNTAlKSIgZD0iTTE0Ny4xMTkgNjkuNjE0YTY2LjUgNjYuNSAwIDAwLTEuNzE2LS4yOTUiLz48cGF0aCBzdHJva2U9ImhzbCgxNjAsIDEwMCUsIDUwJSkiIGQ9Ik0xNDguMjU4IDY5LjgzNWE2Ni41IDY2LjUgMCAwMC0xLjcxLS4zMjUiLz48cGF0aCBzdHJva2U9ImhzbCgxNjEsIDEwMCUsIDUwJSkiIGQ9Ik0xNDkuMzkzIDcwLjA3NmE2Ni41IDY2LjUgMCAwMC0xLjcwNC0uMzU0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTYyLCAxMDAlLCA1MCUpIiBkPSJNMTUwLjUyNCA3MC4zMzdhNjYuNSA2Ni41IDAgMDAtMS42OTgtLjM4NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDE2MywgMTAwJSwgNTAlKSIgZD0iTTE1MS42NSA3MC42MThhNjYuNSA2Ni41IDAgMDAtMS42OS0uNDE0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTY0LCAxMDAlLCA1MCUpIiBkPSJNMTUyLjc3MSA3MC45MTlhNjYuNSA2Ni41IDAgMDAtMS42ODMtLjQ0NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDE2NSwgMTAwJSwgNTAlKSIgZD0iTTE1My44ODcgNzEuMjM4YTY2LjUgNjYuNSAwIDAwLTEuNjc2LS40NzIiLz48cGF0aCBzdHJva2U9ImhzbCgxNjYsIDEwMCUsIDUwJSkiIGQ9Ik0xNTQuOTk3IDcxLjU3OGE2Ni41IDY2LjUgMCAwMC0xLjY2Ny0uNTAyIi8+PHBhdGggc3Ryb2tlPSJoc2woMTY3LCAxMDAlLCA1MCUpIiBkPSJNMTU2LjEgNzEuOTM2YTY2LjUgNjYuNSAwIDAwLTEuNjU3LS41MyIvPjxwYXRoIHN0cm9rZT0iaHNsKDE2OCwgMTAwJSwgNTAlKSIgZD0iTTE1Ny4xOTggNzIuMzE0YTY2LjUgNjYuNSAwIDAwLTEuNjQ4LS41NiIvPjxwYXRoIHN0cm9rZT0iaHNsKDE2OSwgMTAwJSwgNTAlKSIgZD0iTTE1OC4yODkgNzIuNzExYTY2LjUgNjYuNSAwIDAwLTEuNjM5LS41ODgiLz48cGF0aCBzdHJva2U9ImhzbCgxNzAsIDEwMCUsIDUwJSkiIGQ9Ik0xNTkuMzcyIDczLjEyN2E2Ni41IDY2LjUgMCAwMC0xLjYyOC0uNjE3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTcxLCAxMDAlLCA1MCUpIiBkPSJNMTYwLjQ0OCA3My41NjJhNjYuNSA2Ni41IDAgMDAtMS42MTctLjY0NSIvPjxwYXRoIHN0cm9rZT0iaHNsKDE3MiwgMTAwJSwgNTAlKSIgZD0iTTE2MS41MTcgNzQuMDE2YTY2LjUgNjYuNSAwIDAwLTEuNjA2LS42NzQiLz48cGF0aCBzdHJva2U9ImhzbCgxNzMsIDEwMCUsIDUwJSkiIGQ9Ik0xNjIuNTc3IDc0LjQ4OGE2Ni41IDY2LjUgMCAwMC0xLjU5My0uNzAyIi8+PHBhdGggc3Ryb2tlPSJoc2woMTc0LCAxMDAlLCA1MCUpIiBkPSJNMTYzLjYyOSA3NC45NzhhNjYuNSA2Ni41IDAgMDAtMS41ODEtLjcyOSIvPjxwYXRoIHN0cm9rZT0iaHNsKDE3NSwgMTAwJSwgNTAlKSIgZD0iTTE2NC42NzIgNzUuNDg3YTY2LjUgNjYuNSAwIDAwLTEuNTY4LS43NTYiLz48cGF0aCBzdHJva2U9ImhzbCgxNzYsIDEwMCUsIDUwJSkiIGQ9Ik0xNjUuNzA2IDc2LjAxNGE2Ni41IDY2LjUgMCAwMC0xLjU1NC0uNzg0Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTc3LCAxMDAlLCA1MCUpIiBkPSJNMTY2LjczMSA3Ni41NTlhNjYuNSA2Ni41IDAgMDAtMS41NC0uODEiLz48cGF0aCBzdHJva2U9ImhzbCgxNzgsIDEwMCUsIDUwJSkiIGQ9Ik0xNjcuNzQ2IDc3LjEyMWE2Ni41IDY2LjUgMCAwMC0xLjUyNi0uODM3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTc5LCAxMDAlLCA1MCUpIiBkPSJNMTY4Ljc1MSA3Ny43MDJhNjYuNSA2Ni41IDAgMDAtMS41MTEtLjg2NCIvPjxwYXRoIHN0cm9rZT0iaHNsKDE4MCwgMTAwJSwgNTAlKSIgZD0iTTE2OS43NDYgNzguM2E2Ni41IDY2LjUgMCAwMC0xLjQ5Ni0uODkiLz48cGF0aCBzdHJva2U9ImhzbCgxODEsIDEwMCUsIDUwJSkiIGQ9Ik0xNzAuNzMgNzguOTE0YTY2LjUgNjYuNSAwIDAwLTEuNDgtLjkxNiIvPjxwYXRoIHN0cm9rZT0iaHNsKDE4MiwgMTAwJSwgNTAlKSIgZD0iTTE3MS43MDQgNzkuNTQ3YTY2LjUgNjYuNSAwIDAwLTEuNDY0LS45NDIiLz48cGF0aCBzdHJva2U9ImhzbCgxODMsIDEwMCUsIDUwJSkiIGQ9Ik0xNzIuNjY2IDgwLjE5NmE2Ni41IDY2LjUgMCAwMC0xLjQ0OC0uOTY4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTg0LCAxMDAlLCA1MCUpIiBkPSJNMTczLjYxNyA4MC44NjFhNjYuNSA2Ni41IDAgMDAtMS40My0uOTkyIi8+PHBhdGggc3Ryb2tlPSJoc2woMTg1LCAxMDAlLCA1MCUpIiBkPSJNMTc0LjU1NiA4MS41NDRhNjYuNSA2Ni41IDAgMDAtMS40MTMtMS4wMTgiLz48cGF0aCBzdHJva2U9ImhzbCgxODYsIDEwMCUsIDUwJSkiIGQ9Ik0xNzUuNDgzIDgyLjI0MmE2Ni41IDY2LjUgMCAwMC0xLjM5NS0xLjA0MiIvPjxwYXRoIHN0cm9rZT0iaHNsKDE4NywgMTAwJSwgNTAlKSIgZD0iTTE3Ni4zOTcgODIuOTU3YTY2LjUgNjYuNSAwIDAwLTEuMzc2LTEuMDY2Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTg4LCAxMDAlLCA1MCUpIiBkPSJNMTc3LjMgODMuNjg3YTY2LjUgNjYuNSAwIDAwLTEuMzU5LTEuMDkiLz48cGF0aCBzdHJva2U9ImhzbCgxODksIDEwMCUsIDUwJSkiIGQ9Ik0xNzguMTg4IDg0LjQzM2E2Ni41IDY2LjUgMCAwMC0xLjMzOC0xLjExMyIvPjxwYXRoIHN0cm9rZT0iaHNsKDE5MCwgMTAwJSwgNTAlKSIgZD0iTTE3OS4wNjQgODUuMTk0YTY2LjUgNjYuNSAwIDAwLTEuMzE5LTEuMTM2Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTkxLCAxMDAlLCA1MCUpIiBkPSJNMTc5LjkyNyA4NS45NzFhNjYuNSA2Ni41IDAgMDAtMS4zLTEuMTYiLz48cGF0aCBzdHJva2U9ImhzbCgxOTIsIDEwMCUsIDUwJSkiIGQ9Ik0xODAuNzc2IDg2Ljc2M2E2Ni41IDY2LjUgMCAwMC0xLjI3OS0xLjE4MiIvPjxwYXRoIHN0cm9rZT0iaHNsKDE5MywgMTAwJSwgNTAlKSIgZD0iTTE4MS42MSA4Ny41NjlhNjYuNSA2Ni41IDAgMDAtMS4yNTctMS4yMDQiLz48cGF0aCBzdHJva2U9ImhzbCgxOTQsIDEwMCUsIDUwJSkiIGQ9Ik0xODIuNDMxIDg4LjM5YTY2LjUgNjYuNSAwIDAwLTEuMjM2LTEuMjI2Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTk1LCAxMDAlLCA1MCUpIiBkPSJNMTgzLjIzNyA4OS4yMjRhNjYuNSA2Ni41IDAgMDAtMS4yMTQtMS4yNDciLz48cGF0aCBzdHJva2U9ImhzbCgxOTYsIDEwMCUsIDUwJSkiIGQ9Ik0xODQuMDI5IDkwLjA3M2E2Ni41IDY2LjUgMCAwMC0xLjE5My0xLjI2OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDE5NywgMTAwJSwgNTAlKSIgZD0iTTE4NC44MDYgOTAuOTM2YTY2LjUgNjYuNSAwIDAwLTEuMTcxLTEuMjg5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMTk4LCAxMDAlLCA1MCUpIiBkPSJNMTg1LjU2NyA5MS44MTJhNjYuNSA2Ni41IDAgMDAtMS4xNDgtMS4zMSIvPjxwYXRoIHN0cm9rZT0iaHNsKDE5OSwgMTAwJSwgNTAlKSIgZD0iTTE4Ni4zMTMgOTIuN2E2Ni41IDY2LjUgMCAwMC0xLjEyNS0xLjMyOCIvPjxwYXRoIHN0cm9rZT0iaHNsKDIwMCwgMTAwJSwgNTAlKSIgZD0iTTE4Ny4wNDMgOTMuNjAzYTY2LjUgNjYuNSAwIDAwLTEuMTAxLTEuMzQ4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjAxLCAxMDAlLCA1MCUpIiBkPSJNMTg3Ljc1OCA5NC41MTdhNjYuNSA2Ni41IDAgMDAtMS4wNzgtMS4zNjciLz48cGF0aCBzdHJva2U9ImhzbCgyMDIsIDEwMCUsIDUwJSkiIGQ9Ik0xODguNDU2IDk1LjQ0NGE2Ni41IDY2LjUgMCAwMC0xLjA1My0xLjM4NSIvPjxwYXRoIHN0cm9rZT0iaHNsKDIwMywgMTAwJSwgNTAlKSIgZD0iTTE4OS4xMzkgOTYuMzgzYTY2LjUgNjYuNSAwIDAwLTEuMDMtMS40MDQiLz48cGF0aCBzdHJva2U9ImhzbCgyMDQsIDEwMCUsIDUwJSkiIGQ9Ik0xODkuODA0IDk3LjMzNGE2Ni41IDY2LjUgMCAwMC0xLjAwNC0xLjQyMiIvPjxwYXRoIHN0cm9rZT0iaHNsKDIwNSwgMTAwJSwgNTAlKSIgZD0iTTE5MC40NTMgOTguMjk2YTY2LjUgNjYuNSAwIDAwLS45OC0xLjQzOSIvPjxwYXRoIHN0cm9rZT0iaHNsKDIwNiwgMTAwJSwgNTAlKSIgZD0iTTE5MS4wODYgOTkuMjdhNjYuNSA2Ni41IDAgMDAtLjk1NS0xLjQ1NiIvPjxwYXRoIHN0cm9rZT0iaHNsKDIwNywgMTAwJSwgNTAlKSIgZD0iTTE5MS43IDEwMC4yNTRhNjYuNSA2Ni41IDAgMDAtLjkyOC0xLjQ3MiIvPjxwYXRoIHN0cm9rZT0iaHNsKDIwOCwgMTAwJSwgNTAlKSIgZD0iTTE5Mi4yOTggMTAxLjI0OWE2Ni41IDY2LjUgMCAwMC0uOTAzLTEuNDg5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjA5LCAxMDAlLCA1MCUpIiBkPSJNMTkyLjg3OSAxMDIuMjU0YTY2LjUgNjYuNSAwIDAwLS44NzctMS41MDQiLz48cGF0aCBzdHJva2U9ImhzbCgyMTAsIDEwMCUsIDUwJSkiIGQ9Ik0xOTMuNDQxIDEwMy4yNjlhNjYuNSA2Ni41IDAgMDAtLjg1LTEuNTE5Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjExLCAxMDAlLCA1MCUpIiBkPSJNMTkzLjk4NiAxMDQuMjk0YTY2LjUgNjYuNSAwIDAwLS44MjQtMS41MzQiLz48cGF0aCBzdHJva2U9ImhzbCgyMTIsIDEwMCUsIDUwJSkiIGQ9Ik0xOTQuNTEzIDEwNS4zMjhhNjYuNSA2Ni41IDAgMDAtLjc5Ny0xLjU0OCIvPjxwYXRoIHN0cm9rZT0iaHNsKDIxMywgMTAwJSwgNTAlKSIgZD0iTTE5NS4wMjIgMTA2LjM3MWE2Ni41IDY2LjUgMCAwMC0uNzctMS41NjEiLz48cGF0aCBzdHJva2U9ImhzbCgyMTQsIDEwMCUsIDUwJSkiIGQ9Ik0xOTUuNTEyIDEwNy40MjNhNjYuNSA2Ni41IDAgMDAtLjc0Mi0xLjU3NSIvPjxwYXRoIHN0cm9rZT0iaHNsKDIxNSwgMTAwJSwgNTAlKSIgZD0iTTE5NS45ODQgMTA4LjQ4M2E2Ni41IDY2LjUgMCAwMC0uNzE1LTEuNTg3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjE2LCAxMDAlLCA1MCUpIiBkPSJNMTk2LjQzOCAxMDkuNTUyYTY2LjUgNjYuNSAwIDAwLS42ODctMS42Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjE3LCAxMDAlLCA1MCUpIiBkPSJNMTk2Ljg3MyAxMTAuNjI4YTY2LjUgNjYuNSAwIDAwLS42Ni0xLjYxMiIvPjxwYXRoIHN0cm9rZT0iaHNsKDIxOCwgMTAwJSwgNTAlKSIgZD0iTTE5Ny4yODkgMTExLjcxMWE2Ni41IDY2LjUgMCAwMC0uNjMxLTEuNjIyIi8+PHBhdGggc3Ryb2tlPSJoc2woMjE5LCAxMDAlLCA1MCUpIiBkPSJNMTk3LjY4NiAxMTIuODAyYTY2LjUgNjYuNSAwIDAwLS42MDMtMS42MzMiLz48cGF0aCBzdHJva2U9ImhzbCgyMjAsIDEwMCUsIDUwJSkiIGQ9Ik0xOTguMDY0IDExMy45YTY2LjUgNjYuNSAwIDAwLS41NzQtMS42NDQiLz48cGF0aCBzdHJva2U9ImhzbCgyMjEsIDEwMCUsIDUwJSkiIGQ9Ik0xOTguNDIyIDExNS4wMDNhNjYuNSA2Ni41IDAgMDAtLjU0NS0xLjY1MyIvPjxwYXRoIHN0cm9rZT0iaHNsKDIyMiwgMTAwJSwgNTAlKSIgZD0iTTE5OC43NjIgMTE2LjExM2E2Ni41IDY2LjUgMCAwMC0uNTE3LTEuNjYzIi8+PHBhdGggc3Ryb2tlPSJoc2woMjIzLCAxMDAlLCA1MCUpIiBkPSJNMTk5LjA4MSAxMTcuMjI5YTY2LjUgNjYuNSAwIDAwLS40ODctMS42NzIiLz48cGF0aCBzdHJva2U9ImhzbCgyMjQsIDEwMCUsIDUwJSkiIGQ9Ik0xOTkuMzgyIDExOC4zNWE2Ni41IDY2LjUgMCAwMC0uNDU4LTEuNjgiLz48cGF0aCBzdHJva2U9ImhzbCgyMjUsIDEwMCUsIDUwJSkiIGQ9Ik0xOTkuNjYzIDExOS40NzZhNjYuNSA2Ni41IDAgMDAtLjQyOS0xLjY4NyIvPjxwYXRoIHN0cm9rZT0iaHNsKDIyNiwgMTAwJSwgNTAlKSIgZD0iTTE5OS45MjQgMTIwLjYwN2E2Ni41IDY2LjUgMCAwMC0uNC0xLjY5NSIvPjxwYXRoIHN0cm9rZT0iaHNsKDIyNywgMTAwJSwgNTAlKSIgZD0iTTIwMC4xNjUgMTIxLjc0MmE2Ni41IDY2LjUgMCAwMC0uMzctMS43MDEiLz48cGF0aCBzdHJva2U9ImhzbCgyMjgsIDEwMCUsIDUwJSkiIGQ9Ik0yMDAuMzg2IDEyMi44ODFhNjYuNSA2Ni41IDAgMDAtLjM0LTEuNzA3Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjI5LCAxMDAlLCA1MCUpIiBkPSJNMjAwLjU4OCAxMjQuMDI0YTY2LjUgNjYuNSAwIDAwLS4zMS0xLjcxMyIvPjxwYXRoIHN0cm9rZT0iaHNsKDIzMCwgMTAwJSwgNTAlKSIgZD0iTTIwMC43NyAxMjUuMTdhNjYuNSA2Ni41IDAgMDAtLjI4LTEuNzE4Ii8+PHBhdGggc3Ryb2tlPSJoc2woMjMxLCAxMDAlLCA1MCUpIiBkPSJNMjAwLjkzMSAxMjYuMzJhNjYuNSA2Ni41IDAgMDAtLjI1LTEuNzIzIi8+PHBhdGggc3Ryb2tlPSJoc2woMjMyLCAxMDAlLCA1MCUpIiBkPSJNMjAxLjA3MyAxMjcuNDcyYTY2LjUgNjYuNSAwIDAwLS4yMi0xLjcyNyIvPjxwYXRoIHN0cm9rZT0iaHNsKDIzMywgMTAwJSwgNTAlKSIgZD0iTTIwMS4xOTQgMTI4LjYyNmE2Ni41IDY2LjUgMCAwMC0uMTktMS43MyIvPjxwYXRoIHN0cm9rZT0iaHNsKDIzNCwgMTAwJSwgNTAlKSIgZD0iTTIwMS4yOTUgMTI5Ljc4MmE2Ni41IDY2LjUgMCAwMC0uMTYtMS43MzMiLz48cGF0aCBzdHJva2U9ImhzbCgyMzUsIDEwMCUsIDUwJSkiIGQ9Ik0yMDEuMzc2IDEzMC45NGE2Ni41IDY2LjUgMCAwMC0uMTMtMS43MzYiLz48cGF0aCBzdHJva2U9ImhzbCgyMzYsIDEwMCUsIDUwJSkiIGQ9Ik0yMDEuNDM3IDEzMi4xYTY2LjUgNjYuNSAwIDAwLS4wOTktMS43MzkiLz48cGF0aCBzdHJva2U9ImhzbCgyMzcsIDEwMCUsIDUwJSkiIGQ9Ik0yMDEuNDc3IDEzMy4yNmE2Ni41IDY2LjUgMCAwMC0uMDY4LTEuNzQiLz48cGF0aCBzdHJva2U9ImhzbCgyMzgsIDEwMCUsIDUwJSkiIGQ9Ik0yMDEuNDk3IDEzNC40MmE2Ni41IDY2LjUgMCAwMC0uMDM4LTEuNzQiLz48cGF0aCBzdHJva2U9ImhzbCgyMzksIDEwMCUsIDUwJSkiIGQ9Ik0yMDEuNDk3IDEzNS41OGE2Ni41IDY2LjUgMCAwMC0uMDA3LTEuNzQiLz48L2c+PGNpcmNsZSBjeD0iMTM1IiBjeT0iMTM1IiByPSIxMzMiIGZpbGw9InVybCgjYSkiIGNsYXNzPSJJcm9XaGVlbFNhdHVyYXRpb24iLz48Y2lyY2xlIGN4PSIxMzUiIGN5PSIxMzUiIHI9IjEzMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIGNsYXNzPSJJcm9XaGVlbEJvcmRlciIvPjwvc3ZnPg==';

                        this.width = this.offsetWidth;
                        this.height = this.offsetHeight;
                    },
                    mousedown: function (event) {
                        var cvs = this,
                            ctx = this.getContext('2d');

                        function update(x, y) {
                            var cursor = cvs.nextSibling.nextSibling;

                            cursor.style.left = x + cvs.offsetLeft + 'px';
                            cursor.style.top = y + cvs.offsetTop + 'px';
                        }

                        function mousemove(event) {
                            update(event.layerX, event.layerY);
                        }

                        function mouseup(event) {
                            cvs.parentNode.data = {
                                rgb: ctx.getImageData(event.layerX, event.layerY, 1, 1).data,
                                cursor: [event.layerX, event.layerY]
                            };

                            this.removeEventListener('mousemove', mousemove);
                            this.removeEventListener('mouseup', mouseup);
                        }

                        this.addEventListener('mousemove', mousemove);
                        this.addEventListener('mouseup', mouseup);

                        update(event.layerX, event.layerY);

                        cvs.nextSibling.nextSibling.hidden = false;
                    }
                }
            },
            shadow: {
                component: 'div',
                class: 'satus-color-picker__dim'
            },
            cursor: {
                component: 'div',
                class: 'satus-color-picker__cursor',
                attr: {
                    hidden: true
                },
                on: {
                    render: function () {
                        var data = this.parentNode.data;

                        if (data.cursor) {
                            this.style.left = data.cursor[0] + 'px';
                            this.style.top = data.cursor[1] + 'px';

                            this.hidden = false;
                        }
                    }
                }
            },
            slider: {
                component: 'slider',
                class: 'satus-color-picker__slider',
                step: .01,
                on: {
                    render: function () {
                        var data = this.parentNode.data;

                        function rgbToHsv(r, g, b) {
                            r /= 255, g /= 255, b /= 255;

                            var max = Math.max(r, g, b),
                                min = Math.min(r, g, b);
                            var h, s, v = max;

                            var d = max - min;
                            s = max == 0 ? 0 : d / max;

                            if (max == min) {
                                h = 0; // achromatic
                            } else {
                                switch (max) {
                                    case r:
                                        h = (g - b) / d + (g < b ? 6 : 0);
                                        break;
                                    case g:
                                        h = (b - r) / d + 2;
                                        break;
                                    case b:
                                        h = (r - g) / d + 4;
                                        break;
                                }

                                h /= 6;
                            }

                            return [h, s, v];
                        }

                        this.value = 1 - rgbToHsv(data.rgb[0], data.rgb[1], data.rgb[2])[2];
                    },
                    change: function () {
                        this.previousSibling.previousSibling.style.opacity = this.value;
                    }
                }
            },
            actions: {
                component: 'section',
                class: 'satus-color-picker__actions',

                reset: {
                    component: 'button',
                    text: 'reset',

                    on: {
                        click: function () {
                            var modal = this.parentNode.parentNode.parentNode,
                                component = modal.parentComponent;

                            component.data = component.skeleton.value;

                            if (component.storage) {
                                satus.storage.set(component.storage, false);
                            }

                            var data = component.skeleton.value || {
                                    rgb: [0, 0, 0]
                                };

                                component.valueElement.style.backgroundColor = 'rgb(' + data.rgb[0] + ',' + data.rgb[1] + ',' + data.rgb[2] + ')';

                            modal.close();

                            component.colorValue = data;

                            component.dispatchEvent(new CustomEvent('change'));
                        }
                    }
                },
                cancel: {
                    component: 'button',
                    text: 'cancel',

                    on: {
                        click: function () {
                            var modal = this.parentNode.parentNode.parentNode;

                            modal.close();
                        }
                    }
                },
                ok: {
                    component: 'button',
                    text: 'OK',

                    on: {
                        click: function () {
                            var modal = this.parentNode.parentNode.parentNode,
                                data = this.parentNode.parentNode.data;

                            function rgbToHsv(r, g, b) {
                                r /= 255, g /= 255, b /= 255;

                                var max = Math.max(r, g, b),
                                    min = Math.min(r, g, b);
                                var h, s, v = max;

                                var d = max - min;
                                s = max == 0 ? 0 : d / max;

                                if (max == min) {
                                    h = 0; // achromatic
                                } else {
                                    switch (max) {
                                        case r:
                                            h = (g - b) / d + (g < b ? 6 : 0);
                                            break;
                                        case g:
                                            h = (b - r) / d + 2;
                                            break;
                                        case b:
                                            h = (r - g) / d + 4;
                                            break;
                                    }

                                    h /= 6;
                                }

                                return [h, s, v];
                            }

                            function hsvToRgb(h, s, v) {
                                var r, g, b;

                                var i = Math.floor(h * 6);
                                var f = h * 6 - i;
                                var p = v * (1 - s);
                                var q = v * (1 - f * s);
                                var t = v * (1 - (1 - f) * s);

                                switch (i % 6) {
                                    case 0:
                                        r = v, g = t, b = p;
                                        break;
                                    case 1:
                                        r = q, g = v, b = p;
                                        break;
                                    case 2:
                                        r = p, g = v, b = t;
                                        break;
                                    case 3:
                                        r = p, g = q, b = v;
                                        break;
                                    case 4:
                                        r = t, g = p, b = v;
                                        break;
                                    case 5:
                                        r = v, g = p, b = q;
                                        break;
                                }

                                return [r * 255, g * 255, b * 255];
                            }

                            var hsv = rgbToHsv(data.rgb[0], data.rgb[1], data.rgb[2]);

                            hsv[2] = 1 - this.parentNode.previousSibling.value;

                            data.rgb = hsvToRgb(hsv[0], hsv[1], hsv[2]);

                            modal.parentComponent.valueElement.style.backgroundColor = 'rgb(' + data.rgb[0] + ',' + data.rgb[1] + ',' + data.rgb[2] + ')';

                            if (modal.parentComponent.storage) {
                                satus.storage.set(modal.parentComponent.storage, data);
                            }

                            modal.parentComponent.colorValue = data;

                            modal.close();

                            modal.parentComponent.dispatchEvent(new CustomEvent('change'));
                        }
                    }
                }
            }
        });
    });

    component.appendChild(component_value);

    return component;
};
/*--------------------------------------------------------------
>>> TABS
--------------------------------------------------------------*/

satus.components.tabs = function (skeleton) {
	var component = document.createElement('div'),
		selection = document.createElement('div');

	selection.className = 'satus-tabs__selection';

	component.appendChild(selection);

	component.selection = selection;

	for (var i = 0, l = skeleton.items.length; i < l; i++) {
		var item = skeleton.items[i],
			button = document.createElement('button');

		button.className = 'satus-tabs__button';
		button.value = item;

		satus.text(button, item);

		button.addEventListener('click', function () {
			var component = this.parentNode;

			component.value = this.value;

			component.selection.style.left = this.offsetLeft + 'px';

			component.dispatchEvent(new CustomEvent('change'));
		});

		if (skeleton.value === item) {
			selection.style.left = i * 50 + '%';
		}

		component.appendChild(button);
	}

	return component;
};
/*--------------------------------------------------------------
>>> RADIO
--------------------------------------------------------------*/

satus.components.radio = function (skeleton) {
	var component = document.createElement('label'),
		content = document.createElement('span'),
		radio = document.createElement('input'),
		value = satus.storage.get(skeleton.group);

	component.inner = content;

	radio.type = 'radio';

	if (skeleton.group) {
		radio.name = skeleton.group;
	}

	if (skeleton.value) {
		radio.value = skeleton.value;
	}

	if (satus.isset(value)) {
		radio.checked = value === skeleton.value;
	}

	radio.addEventListener('change', function () {
		satus.storage.set(this.name, this.value);
	});

	component.appendChild(content);
	component.appendChild(radio);

	return component;
};
/*--------------------------------------------------------------
>>> LIST
--------------------------------------------------------------*/

satus.components.list = function (skeleton) {
	var ul = document.createElement('ul');

	for (var i = 0, l = skeleton.items.length; i < l; i++) {
		var li = document.createElement('li'),
			item = skeleton.items[i];

		li.className = 'satus-list__item';

		for (var j = 0, k = item.length; j < k; j++) {
			var child = item[j];

			if (typeof child === 'string') {
				var span = document.createElement('span');

				span.textContent = satus.locale.get(child);

				li.appendChild(span);
			} else {
				satus.render(child, li);
			}
		}

		ul.appendChild(li);
	}

	return ul;
};
/*--------------------------------------------------------------
>>> MODAL
--------------------------------------------------------------*/

satus.components.modal = function (skeleton) {
	var component = document.createElement('div'),
		scrim = document.createElement('div'),
		surface = document.createElement('div');

	scrim.className = 'satus-modal__scrim';
	surface.className = 'satus-modal__surface';

	component.close = function () {
		var component = this,
			component_surface = this.children[1];

		this.classList.add('satus-modal--closing');

		setTimeout(function () {
			component.remove();

			component.dispatchEvent(new CustomEvent('close'));
		}, satus.getAnimationDuration(component_surface));
	};

	scrim.addEventListener('click', function () {
		this.parentNode.close();
	});

	component.appendChild(scrim);
	component.appendChild(surface);

	component.inner = surface;

	return component;
};
/*--------------------------------------------------------------
>>> SWITCH
--------------------------------------------------------------*/

satus.components.switch = function (skeleton) {
	var component = document.createElement('button'),
		component_content = document.createElement('span'),
		component_thumb = document.createElement('i'),
		value = satus.storage.get(skeleton.storage);

	component.inner = component_content;

	if (satus.isset(value)) {
		component.dataset.value = value;
	} else if (skeleton.hasOwnProperty('value')) {
		component.dataset.value = skeleton.value;
	}

	component.addEventListener('click', function () {
		if (this.dataset.value === 'true') {
			this.dataset.value = 'false';
		} else {
			this.dataset.value = 'true';
		}

		this.change(this.dataset.value === 'true');
	});

	component.appendChild(component_content);
	component.appendChild(component_thumb);

	return component;
};
/*--------------------------------------------------------------
>>> SLIDER:
----------------------------------------------------------------
# 
--------------------------------------------------------------*/

satus.components.slider = function (skeleton) {
	var component = document.createElement('div'),
		container = document.createElement('div'),
		track_container = document.createElement('div'),
		track = document.createElement('div'),
		ring = document.createElement('div'),
		thumb = document.createElement('div'),
		range = document.createElement('input'),
		value = satus.storage.get(skeleton.storage);

	container.className = 'satus-slider__container';
	track_container.className = 'satus-slider__track-container';
	track.className = 'satus-slider__track';
	ring.className = 'satus-slider__ring';
	thumb.className = 'satus-slider__thumb';

	range.type = 'range';
	range.step = skeleton.step || 1;
	range.max = skeleton.max || 1;
	range.min = skeleton.min || 0;

	component.input = range;

	if (satus.isset(value)) {
		range.value = value;
	} else if (skeleton.hasOwnProperty('value')) {
		range.value = skeleton.value;
	} else {
		range.value = 0;
	}

	component.appendChild(container);
	track_container.appendChild(track);
	container.appendChild(track_container);
	track.appendChild(ring);
	track.appendChild(thumb);
	component.appendChild(range);

	component.update = function () {
		var track = this.querySelector('.satus-slider__track'),
			thumb = this.querySelector('.satus-slider__thumb'),
			min = Number(this.input.min) || 0,
			max = Number(this.input.max) || 1,
			step = Number(this.input.step) || 1,
			value = Number(this.input.value) || 0,
			offset = (value - min) / (max - min) * 100;

		track.style.width = 'calc(' + offset + '% - ' + Math.floor(offset * 12 / 100) + 'px)';

		thumb.dataset.value = this.input.value;
	};

	Object.defineProperty(component, 'value', {
		get: function () {
			return this.input.value;
		},
		set: function (value) {
			this.input.value = value;

			this.update();

			satus.storage.set(this.skeleton.storage, Number(value));

			this.dispatchEvent(new CustomEvent('change'));
		}
	});

	range.addEventListener('input', function () {
		var component = this.parentNode;

		console.log(this.value);

		component.value = this.value;
	});

	component.update();

	return component;
};
/*--------------------------------------------------------------
>>> SHORTCUT
--------------------------------------------------------------*/

satus.components.shortcut = function (skeleton) {
    var component = document.createElement('button'),
        value = document.createElement('div');

    component.className = 'satus-button';
    value.className = 'satus-shortcut__value';

    component.update = function () {
        var object = satus.storage.get(this.storage) || this.skeleton.value || {},
            array = [];

        if (object.shift) {
            array.push('Shift');
        }

        if (object.ctrl) {
            array.push('Ctrl');
        }

        if (object.alt) {
            array.push('Alt');
        }

        if (typeof object.keys === 'object') {
            for (var key in object.keys) {
                var char = object.keys[key].key || object.keys[key].code;

                if (key === 32) {
                    char = 'space';
                }

                array.push(char);
            }
        }

        this.valueElement.textContent = array.join(' + ');
    };

    component.render = function () {
        var self = this,
            children = this.primary.children;

        satus.empty(this.primary);

        function createElement(name) {
            var element = document.createElement('div');

            element.className = 'satus-shortcut__' + name;

            self.primary.appendChild(element);

            return element;
        }

        if (this.data.alt) {
            createElement('key').textContent = 'Alt';
        }

        if (this.data.ctrl) {
            if (children.length && children[children.length - 1].className.indexOf('key') !== -1) {
                createElement('plus');
            }

            createElement('key').textContent = 'Ctrl';
        }

        if (this.data.shift) {
            if (children.length && children[children.length - 1].className.indexOf('key') !== -1) {
                createElement('plus');
            }

            createElement('key').textContent = 'Shift';
        }

        for (var code in this.data.keys) {
            if (children.length && children[children.length - 1].className.indexOf('key') !== -1) {
                createElement('plus');
            }

            createElement('key').textContent = this.data.keys[code].key.toUpperCase();
        }

        if (this.data.wheel) {
            if (children.length && children[children.length - 1].className.indexOf('key') !== -1) {
                createElement('plus');
            }

            var mouse = createElement('mouse'),
                div = document.createElement('div');

            mouse.appendChild(div);

            mouse.className += ' ' + (this.data.wheel > 0);
        }
    };

    component.valueElement = value;

    component.data = satus.storage.get(skeleton.storage) || skeleton.value || {
        alt: false,
        ctrl: false,
        shift: false,
        keys: {},
        wheel: 0
    };

    component.appendChild(value);

    component.keydown = function (event) {
        event.preventDefault();
        event.stopPropagation();

        component.data = {
            alt: event.altKey,
            ctrl: event.ctrlKey,
            shift: event.shiftKey,
            keys: {}
        };

        component.data.keys[event.keyCode] = {
            code: event.code,
            key: event.key
        };

        component.data.wheel = 0;

        component.render();

        return false;
    };

    component.mousewheel = function (event) {
        event.preventDefault();
        event.stopPropagation();

        component.data.wheel = event.deltaY;

        component.render();

        return false;
    };

    component.addEventListener('click', function () {
        satus.render({
            component: 'modal',
            on: {
                close: function () {
                    window.removeEventListener('keydown', this.keydown);
                    window.removeEventListener('mousewheel', this.mousewheel);
                }
            },

            primary: {
                component: 'div',
                class: 'satus-shortcut__primary',
                on: {
                    render: function () {
                        component.primary = this;

                        component.render();
                    }
                }
            },
            actions: {
                component: 'div',
                class: 'satus-shortcut__actions',

                reset: {
                    component: 'button',
                    text: 'reset',
                    on: {
                        click: function () {
                            component.data = component.skeleton.value;

                            component.update();

                            satus.storage.set(component.storage, false);

                            this.parentNode.parentNode.parentNode.close();

                            window.removeEventListener('keydown', this.keydown);
                            window.removeEventListener('mousewheel', this.mousewheel);
                        }
                    }
                },
                cancel: {
                    component: 'button',
                    text: 'cancel',
                    on: {
                        click: function () {
                            component.data = satus.storage.get(skeleton.storage) || component.skeleton.value;

                            component.update();

                            this.parentNode.parentNode.parentNode.close();

                            window.removeEventListener('keydown', this.keydown);
                            window.removeEventListener('mousewheel', this.mousewheel);
                        }
                    }
                },
                save: {
                    component: 'button',
                    text: 'save',
                    on: {
                        click: function () {
                            satus.storage.set(component.storage, component.data);

                            component.update();

                            this.parentNode.parentNode.parentNode.close();

                            window.removeEventListener('keydown', this.keydown);
                            window.removeEventListener('mousewheel', this.mousewheel);
                        }
                    }
                }
            }
        });

        window.addEventListener('keydown', this.keydown);
        window.addEventListener('mousewheel', this.mousewheel);
    });

    component.addEventListener('render', component.update);

    return component;
};
/*--------------------------------------------------------------
>>> BASE
--------------------------------------------------------------*/

satus.components.base = function (skeleton) {
    var component = document.createElement('div');

    component.base = component;

    return component;
};
/*--------------------------------------------------------------
>>> TEXT FIELD
--------------------------------------------------------------*/

satus.components.textField = function (skeleton) {
	var component = document.createElement('div'),
		pre = document.createElement('pre'),
		input = document.createElement('textarea'),
		hidden_text = document.createElement('span'),
		text = document.createElement('span'),
		selection = document.createElement('div'),
		cursor = document.createElement('div'),
		value = satus.storage.get(skeleton.storage);

	input.className = 'satus-text-field__input';
	pre.className = 'satus-text-field__pre';
	hidden_text.className = 'satus-text-field__hidden-text';
	text.className = 'satus-text-field__text';
	selection.className = 'satus-text-field__selection';
	cursor.className = 'satus-text-field__cursor';

	component.inputElement = input;
	component.textElement = text;
	component.languages = {
		regex: function (component) {
		    var regex_token = /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,
		        char_class_token = /[^\\-]+|-|\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)/g,
		        char_class_parts = /^(\[\^?)(]?(?:[^\\\]]+|\\[\S\s]?)*)(]?)$/,
		        quantifier = /^(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??$/,
		        matches = component.inputElement.value.match(regex_token);

		    function create(type, string) {
		        var span = document.createElement('span');

		        span.className = type;
		        span.textContent = string;

		        component.textElement.appendChild(span);
		    }

		    for (var i = 0, l = matches.length; i < l; i++) {
		        var match = matches[i];

		        if (match[0] === '[') {
		            create('character-class', match);
		        } else if (match[0] === '(') {
		            create('group', match);
		        } else if (match[0] === ')') {
		            create('group', match);
		        } else if (match[0] === '\\' || match === '^') {
		            create('anchor', match);
		        } else if (quantifier.test(match)) {
		            create('quantifier', match);
		        } else if (match === '|' || match === '.') {
		            create('metasequence', match);
		        } else {
		            create('text', match);
		        }
		    }
		}
	};
	component._syntax = skeleton.syntax;

	Object.defineProperty(component, 'value', {
		get: function () {
			return this.inputElement.value;
		},
		set: function (value) {
			var input = this.inputElement;

			input.value = value;

			input.updateValue();
			input.updateCursor();
		}
	});

	Object.defineProperty(component, 'syntax', {
		get: function () {
			return this._syntax;
		},
		set: function (value) {
			var input = this.inputElement;

			this._syntax = value;

			input.updateValue();
			input.updateCursor();
		}
	});

	input.rows = skeleton.rows || 1;
	input.autocapitalize = 'none';
	input.autocomplete = 'off';
	input.autocorrect = 'off';
	input.spellcheck = false;
	input.autofocus = true;
	input.textElement = text;
	input.hiddenTextElement = hidden_text;
	input.selectionElement = selection;
	input.cursorElement = cursor;

	input.updateValue = function () {
		var component = this.parentNode.parentNode;

		for (var i = this.textElement.childNodes.length - 1; i > -1; i--) {
	        this.textElement.childNodes[i].remove();
	    }

	    if (this.value.length > 0) {
	    	if (component.languages[component._syntax]) {
		    	component.languages[component._syntax](component);
		    } else {
		    	this.textElement.textContent = this.value;
		    }
	    }

	    component.dispatchEvent(new Event('change'));
	};

	input.updateCursor = function () {
		var cursor = this.cursorElement,
			selection = this.selectionElement,
			hidden_text = this.hiddenTextElement,
			start = this.selectionStart,
			end = this.selectionEnd;

		cursor.style.animation = 'none';

		if (start === end) {
			selection.setAttribute('disabled', '');
		} else {
			selection.removeAttribute('disabled');

			hidden_text.textContent = this.value.substring(0, start);

			selection.style.left = hidden_text.offsetWidth - this.scrollLeft + 'px';

			hidden_text.textContent = this.value.substring(start, end);

			selection.style.width = hidden_text.offsetWidth + 'px';
		}

		if (this.selectionDirection === 'forward') {
			hidden_text.textContent = this.value.substring(0, end);
		} else {
			hidden_text.textContent = this.value.substring(0, start);
		}

		cursor.style.left = hidden_text.offsetWidth - this.scrollLeft + 'px';

		cursor.style.animation = '';

		hidden_text.textContent = '';
	};

	input.addEventListener('keydown', function () {
		var self = this;

		setTimeout(function () {
			var component = self.parentNode.parentNode;

		    if (component.skeleton && component.skeleton.storage) {
		    	satus.storage.set(component.skeleton.storage, self.value);
		    }

			self.updateValue();
			self.updateCursor();
		});
	});

	input.addEventListener('scroll', function (event) {
		this.textElement.style.left = -this.scrollLeft + 'px';
	});

	document.addEventListener('selectionchange', function () {
		input.updateCursor();
	});

	selection.setAttribute('disabled', '');

	pre.appendChild(input);
	pre.appendChild(hidden_text);
	pre.appendChild(text);
	pre.appendChild(selection);
	pre.appendChild(cursor);
	component.appendChild(pre);

	if (satus.isset(value)) {
		component.value = value;
	} else if (skeleton.hasOwnProperty('value')) {
		if (typeof skeleton.value === 'function') {
			input.value = skeleton.value();
		} else if (skeleton.value) {
			input.value = skeleton.value;
		}
	}

	component.addEventListener('render', function () {
		this.inputElement.updateValue();
		this.inputElement.updateCursor();
	});

	return component;
};
/*--------------------------------------------------------------
>>> ALERT
--------------------------------------------------------------*/

satus.components.alert = function (skeleton) {
	var component = document.createElement('div');

	return component;
};
/*--------------------------------------------------------------
>>> LAYERS
--------------------------------------------------------------*/

satus.components.layers = function (skeleton) {
	var component = document.createElement('div');

	component.path = [skeleton];

	component.back = function () {
		if (this.path.length > 1) {
			this.path.pop();

			this.open();
		}
	};

	component.open = function (skeleton) {
		var layer = document.createElement('div');

		if (skeleton) {
			this.path.push(skeleton);
		} else {
			skeleton = this.path[this.path.length - 1];
		}

		layer.className = 'satus-layer';

		layer.skeleton = skeleton;
		layer.base = this.base;

		satus.render(skeleton, layer, skeleton.component === 'layers');

		satus.empty(this);

		this.appendChild(layer);

		this.dispatchEvent(new Event('open'));
	};

	component.update = function () {
		var layer = this.querySelector('.satus-layer');

		satus.empty(layer);

		satus.render(layer.skeleton, layer);
	};

	component.render_children = false;

	component.addEventListener('render', function () {
		this.open();
	});

	return component;
};
/*--------------------------------------------------------------
>>> INPUT
--------------------------------------------------------------*/

satus.components.input = function (skeleton) {
	var component = document.createElement('input');

	if (skeleton.attr) {
		var key = skeleton.attr.name || skeleton.storage,
			value;

		if (satus.isset(satus.storage.get(key))) {
			value = satus.storage.get(key);
		} else {
			value = skeleton.value;
		}

		if (skeleton.attr.type === 'radio') {
			component.checked = value === skeleton.attr.value || skeleton.value;
		} else if (satus.isset(value)) {
			component.value = value;
		}

		component.addEventListener('change', function () {
			var key = this.skeleton.attr.name || this.skeleton.storage;

			satus.storage.set(key, this.value);
		});
	}

	return component;
};
/*--------------------------------------------------------------
>>> SELECT
--------------------------------------------------------------*/

satus.components.select = function (skeleton) {
	var component = document.createElement('div'),
		component_label = document.createElement('span'),
		component_value = document.createElement('span'),
		select = document.createElement('select');

	component_value.className = 'satus-select__value';

	for (var i = 0, l = skeleton.options.length; i < l; i++) {
		var option = document.createElement('option');

		option.value = skeleton.options[i].value;

		satus.text(option, skeleton.options[i].text);

		select.appendChild(option);
	}

	component.selectElement = select;
	select.valueElement = component_value;

	select.addEventListener('change', function () {
		satus.empty(this.valueElement);

		satus.text(this.valueElement, this.options[this.selectedIndex].text);

		this.parentNode.change(this.value);
	});

	component.appendChild(component_label);
	component.appendChild(component_value);
	component.appendChild(select);

	component.addEventListener('render', function () {
		var select = this.selectElement,
			value = satus.storage.get(this.storage) || this.skeleton.options[0].value;

		select.value = value;

		satus.text(select.valueElement, select.options[select.selectedIndex].text);
	});

	component.inner = component_label;

	return component;
};
/*--------------------------------------------------------------
>>> USER
--------------------------------------------------------------*/

satus.user = function () {
    /*--------------------------------------------------------------
    1.0 VARIABLES
    --------------------------------------------------------------*/

    var user_agent = navigator.userAgent,
        random_cookie = 'ta{t`nX6cMXK,Wsc',
        video = document.createElement('video'),
        video_formats = {
            ogg: 'video/ogg; codecs="theora"',
            h264: 'video/mp4; codecs="avc1.42E01E"',
            webm: 'video/webm; codecs="vp8, vorbis"',
            vp9: 'video/webm; codecs="vp9"',
            hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
        },
        audio = document.createElement('audio'),
        audio_formats = {
            mp3: 'audio/mpeg',
            mp4: 'audio/mp4',
            aif: 'audio/x-aiff'
        },
        cvs = document.createElement('canvas'),
        ctx = cvs.getContext('webgl'),
        data = {
            browser: {
                audio: null,
                cookies: null,
                flash: null,
                java: null,
                languages: null,
                name: null,
                platform: null,
                version: null,
                video: null,
                webgl: null
            },
            os: {
                name: null,
                type: null
            },
            device: {
                connection: {
                    type: null,
                    speed: null
                },
                cores: null,
                gpu: null,
                max_touch_points: null,
                ram: null,
                screen: null,
                touch: null
            }
        };


    /*--------------------------------------------------------------
    2.0 SOFTWARE
    --------------------------------------------------------------*/

    /*--------------------------------------------------------------
    2.1.0 OS
    --------------------------------------------------------------*/

    /*--------------------------------------------------------------
    2.1.1 NAME
    --------------------------------------------------------------*/

    if (navigator.appVersion.indexOf('Win') !== -1) {
        if (navigator.appVersion.match(/(Windows 10.0|Windows NT 10.0)/)) {
            data.os.name = 'Windows 10';
        } else if (navigator.appVersion.match(/(Windows 8.1|Windows NT 6.3)/)) {
            data.os.name = 'Windows 8.1';
        } else if (navigator.appVersion.match(/(Windows 8|Windows NT 6.2)/)) {
            data.os.name = 'Windows 8';
        } else if (navigator.appVersion.match(/(Windows 7|Windows NT 6.1)/)) {
            data.os.name = 'Windows 7';
        } else if (navigator.appVersion.match(/(Windows NT 6.0)/)) {
            data.os.name = 'Windows Vista';
        } else if (navigator.appVersion.match(/(Windows NT 5.1|Windows XP)/)) {
            data.os.name = 'Windows XP';
        } else {
            data.os.name = 'Windows';
        }
    } else if (navigator.appVersion.indexOf('(iPhone|iPad|iPod)') !== -1) {
        data.os.name = 'iOS';
    } else if (navigator.appVersion.indexOf('Mac') !== -1) {
        data.os.name = 'macOS';
    } else if (navigator.appVersion.indexOf('Android') !== -1) {
        data.os.name = 'Android';
    } else if (navigator.appVersion.indexOf('OpenBSD') !== -1) {
        data.os.name = 'OpenBSD';
    } else if (navigator.appVersion.indexOf('SunOS') !== -1) {
        data.os.name = 'SunOS';
    } else if (navigator.appVersion.indexOf('Linux') !== -1) {
        data.os.name = 'Linux';
    } else if (navigator.appVersion.indexOf('X11') !== -1) {
        data.os.name = 'UNIX';
    }

    /*--------------------------------------------------------------
    2.1.2 TYPE
    --------------------------------------------------------------*/

    if (navigator.appVersion.match(/(Win64|x64|x86_64|WOW64)/)) {
        data.os.type = '64-bit';
    } else {
        data.os.type = '32-bit';
    }


    /*--------------------------------------------------------------
    2.2.0 BROWSER
    --------------------------------------------------------------*/

    /*--------------------------------------------------------------
    2.2.1 NAME
    --------------------------------------------------------------*/

    if (user_agent.indexOf('Opera') !== -1) {
        data.browser.name = 'Opera';
    } else if (user_agent.indexOf('Vivaldi') !== -1) {
        data.browser.name = 'Vivaldi';
    } else if (user_agent.indexOf('Edge') !== -1) {
        data.browser.name = 'Edge';
    } else if (user_agent.indexOf('Chrome') !== -1) {
        data.browser.name = 'Chrome';
    } else if (user_agent.indexOf('Safari') !== -1) {
        data.browser.name = 'Safari';
    } else if (user_agent.indexOf('Firefox') !== -1) {
        data.browser.name = 'Firefox';
    } else if (user_agent.indexOf('MSIE') !== -1) {
        data.browser.name = 'IE';
    }


    /*--------------------------------------------------------------
    2.2.2 VERSION
    --------------------------------------------------------------*/

    var browser_version = user_agent.match(new RegExp(data.browser.name + '/([0-9.]+)'));

    if (browser_version[1]) {
        data.browser.version = browser_version[1];
    }


    /*--------------------------------------------------------------
    2.2.3 PLATFORM
    --------------------------------------------------------------*/

    data.browser.platform = navigator.platform || null;


    /*--------------------------------------------------------------
    2.2.4 LANGUAGES
    --------------------------------------------------------------*/

    data.browser.languages = navigator.languages || null;


    /*--------------------------------------------------------------
    2.2.5 COOKIES
    --------------------------------------------------------------*/

    if (document.cookie) {
        document.cookie = random_cookie;

        if (document.cookie.indexOf(random_cookie) !== -1) {
            data.browser.cookies = true;
        }
    }


    /*--------------------------------------------------------------
    2.2.6 FLASH
    --------------------------------------------------------------*/

    try {
        if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) {
            data.browser.flash = true;
        }
    } catch (e) {
        if (navigator.mimeTypes['application/x-shockwave-flash']) {
            data.browser.flash = true;
        }
    }


    /*--------------------------------------------------------------
    2.2.7 JAVA
    --------------------------------------------------------------*/

    if (typeof navigator.javaEnabled === 'function' && navigator.javaEnabled()) {
        data.browser.java = true;
    }


    /*--------------------------------------------------------------
    2.2.8 VIDEO FORMATS
    --------------------------------------------------------------*/

    if (typeof video.canPlayType === 'function') {
        data.browser.video = {};

        for (var i in video_formats) {
            var can_play_type = video.canPlayType(video_formats[i]);

            if (can_play_type === '') {
                data.browser.video[i] = false;
            } else {
                data.browser.video[i] = can_play_type;
            }
        }
    }


    /*--------------------------------------------------------------
    2.2.9 AUDIO FORMATS
    --------------------------------------------------------------*/

    if (typeof audio.canPlayType === 'function') {
        data.browser.audio = {};

        for (var i in audio_formats) {
            var can_play_type = audio.canPlayType(audio_formats[i]);

            if (can_play_type == '') {
                data.browser.audio[i] = false;
            } else {
                data.browser.audio[i] = can_play_type;
            }
        }
    }


    /*--------------------------------------------------------------
    2.2.10 WEBGL
    --------------------------------------------------------------*/

    if (ctx && ctx instanceof WebGLRenderingContext) {
        data.browser.webgl = true;
    }


    /*--------------------------------------------------------------
    3.0 HARDWARE
    --------------------------------------------------------------*/

    /*--------------------------------------------------------------
    3.1 SCREEN
    --------------------------------------------------------------*/

    if (screen) {
        data.device.screen = screen.width + 'x' + screen.height;
    }


    /*--------------------------------------------------------------
    3.2 RAM
    --------------------------------------------------------------*/

    if ('deviceMemory' in navigator) {
        data.device.ram = navigator.deviceMemory + ' GB';
    }


    /*--------------------------------------------------------------
    3.3 GPU
    --------------------------------------------------------------*/

    if (
        ctx &&
        ctx instanceof WebGLRenderingContext &&
        'getParameter' in ctx &&
        'getExtension' in ctx
    ) {
        var info = ctx.getExtension('WEBGL_debug_renderer_info');

        if (info) {
            data.device.gpu = ctx.getParameter(info.UNMASKED_RENDERER_WEBGL);
        }
    }


    /*--------------------------------------------------------------
    3.4 CORES
    --------------------------------------------------------------*/

    if (navigator.hardwareConcurrency) {
        data.device.cores = navigator.hardwareConcurrency;
    }


    /*--------------------------------------------------------------
    3.5 TOUCH
    --------------------------------------------------------------*/

    if (
        window.hasOwnProperty('ontouchstart') ||
        window.DocumentTouch && document instanceof window.DocumentTouch ||
        navigator.maxTouchPoints > 0 ||
        window.navigator.msMaxTouchPoints > 0
    ) {
        data.device.touch = true;
        data.device.max_touch_points = navigator.maxTouchPoints;
    }


    /*--------------------------------------------------------------
    3.6 CONNECTION
    --------------------------------------------------------------*/

    if (typeof navigator.connection === 'object') {
        data.device.connection.type = navigator.connection.effectiveType || null;

        if (navigator.connection.downlink) {
            data.device.connection.speed = navigator.connection.downlink + ' Mbps';
        }
    }


    /*--------------------------------------------------------------
    4.0 CLEARING
    --------------------------------------------------------------*/

    video.remove();
    audio.remove();
    cvs.remove();


    return data;
};
/*--------------------------------------------------------------
>>> EXTENSION STORAGE
--------------------------------------------------------------*/
/*--------------------------------------------------------------
>>> PLUVIAM
--------------------------------------------------------------*/

satus.events.add('render', function (component, skeleton) {
	if (skeleton.pluviam === true) {
		function createPluviam(event) {
			var pluviam = document.createElement('span'),
				rect = this.getBoundingClientRect(),
				x = event.clientX - rect.left,
				y = event.clientY - rect.top,
				diameter = Math.sqrt(Math.pow(rect.width * 2, 2) + Math.pow(rect.height * 2, 2));

			pluviam.className = 'satus-pluviam';

			pluviam.style.left = x - diameter / 2 + 'px';
			pluviam.style.top = y - diameter / 2 + 'px';
			pluviam.style.width = diameter + 'px';
			pluviam.style.height = diameter + 'px';

			this.appendChild(pluviam);

			setTimeout(function () {
				pluviam.remove();
			}, 1000);
		}

		component.addEventListener('mousedown', createPluviam);
		component.addEventListener('mouseover', createPluviam);
	}
});