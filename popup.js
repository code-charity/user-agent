/*--------------------------------------------------------------
>>> POPUP:
----------------------------------------------------------------
# Skeleton
# Initialization
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# SKELETON
--------------------------------------------------------------*/

var skeleton = {
    component: 'base',

    header: {
        component: 'header',

        section_1: {
            component: 'section',
            variant: 'align-start',

            back: {
                component: 'button',
                attr: {
                    'hidden': 'true'
                },
                on: {
                    click: 'layers.back'
                },
                pluviam: true,

                svg: {
                    component: 'svg',
                    attr: {
                        'viewBox': '0 0 24 24',
                        'fill': 'none',
                        'stroke-width': '1.5',
                        'stroke': 'currentColor'
                    },

                    path: {
                        component: 'path',
                        attr: {
                            'd': 'M14 18l-6-6 6-6'
                        }
                    }
                }
            },
            title: {
                component: 'h1',
                variant: 'title'
            }
        },
        section_2: {
            component: 'section',
            variant: 'align-end',

            menu: {
                component: 'button',
                on: {
                    click: {
                        component: 'modal',
                        variant: 'vertical',

                        settings: {
                            component: 'button',
                            on: {
                                click: {
                                    section: {
                                        component: 'section',
                                        variant: 'card',
                                        on: {
                                            render: function () {
                                                document.querySelector('.satus-modal').close();
                                            }
                                        },

                                        appearance: {
                                            component: 'button',
                                            on: {
                                                click: {
                                                    section: {
                                                        component: 'section',
                                                        variant: 'card',

                                                        hide_made_with_love: {
                                                            component: 'switch',
                                                            text: 'hideStarUs',
                                                            storage: 'hide-star-us-on-github'
                                                        }
                                                    }
                                                }
                                            },

                                            svg: {
                                                component: 'svg',
                                                attr: {
                                                    'viewBox': '0 0 24 24',
                                                    'fill': 'currentColor'
                                                },

                                                path: {
                                                    component: 'path',
                                                    attr: {
                                                        'd': 'M7 16c.6 0 1 .5 1 1a2 2 0 0 1-2 2h-.5a4 4 0 0 0 .5-2c0-.6.5-1 1-1M18.7 3a1 1 0 0 0-.7.3l-9 9 2.8 2.7 9-9c.3-.4.3-1 0-1.4l-1.4-1.3a1 1 0 0 0-.7-.3zM7 14a3 3 0 0 0-3 3c0 1.3-1.2 2-2 2 1 1.2 2.5 2 4 2a4 4 0 0 0 4-4 3 3 0 0 0-3-3z'
                                                    }
                                                }
                                            },
                                            label: {
                                                component: 'span',
                                                text: 'appearance'
                                            }
                                        },
                                        languages: {
                                            component: 'button',
                                            on: {
                                                click: {
                                                    section: {
                                                        component: 'section',
                                                        variant: 'card',

                                                        language: {
                                                            text: 'language',
                                                            component: 'select',
                                                            on: {
                                                                change: function (name, value) {
                                                                    var self = this;

                                                                    satus.ajax('_locales/' + this.querySelector('select').value + '/messages.json', function (response) {
                                                                        try {
                                                                            response = JSON.parse(response);

                                                                            for (var key in response) {
                                                                                satus.locale.strings[key] = response[key].message;
                                                                            }

                                                                            self.base.skeleton.header.section_1.title.rendered.textContent = satus.locale.get('languages');

                                                                            self.base.skeleton.layers.rendered.update();
                                                                        } catch (error) {
                                                                            console.log(error);
                                                                            //close();
                                                                        }
                                                                    });
                                                                }
                                                            },
                                                            options: [{
                                                                value: 'en',
                                                                text: 'English'
                                                            }, {
                                                                value: 'ko',
                                                                text: '한국어'
                                                            }, {
                                                                value: 'es',
                                                                text: 'Español (España)'
                                                            }, {
                                                                value: 'ru',
                                                                text: 'Русский'
                                                            }, {
                                                                value: 'de',
                                                                text: 'Deutsch'
                                                            }, {
                                                                value: 'zh_TW',
                                                                text: '中文 (繁體)'
                                                            }, {
                                                                value: 'pt_PT',
                                                                text: 'Português'
                                                            }, {
                                                                value: 'pt_BR',
                                                                text: 'Português (Brasil)'
                                                            }, {
                                                                value: 'zh_CN',
                                                                text: '中文 (简体)'
                                                            }, {
                                                                value: 'fr',
                                                                text: 'Français'
                                                            }, {
                                                                value: 'ja',
                                                                text: '日本語'
                                                            }, {
                                                                value: 'tr',
                                                                text: 'Türkçe'
                                                            }, {
                                                                value: 'tr',
                                                                text: 'Italiano'
                                                            }, {
                                                                value: 'nl',
                                                                text: 'Nederlands'
                                                            }, {
                                                                value: 'ar',
                                                                text: 'العربية'
                                                            }, {
                                                                value: 'id',
                                                                text: 'Bahasa Indonesia'
                                                            }, {
                                                                value: 'nb',
                                                                text: 'Norsk'
                                                            }, {
                                                                value: 'nb_NO',
                                                                text: 'Norsk (Bokmål)'
                                                            }, {
                                                                value: 'el',
                                                                text: 'Ελληνικά'
                                                            }, {
                                                                value: 'bn',
                                                                text: 'বাংলা'
                                                            }, {
                                                                value: 'hin',
                                                                text: 'हिन्दी'
                                                            }, {
                                                                value: 'sk',
                                                                text: 'Slovenčina'
                                                            }, {
                                                                value: 'pl',
                                                                text: 'Polski'
                                                            }]
                                                        }
                                                    }
                                                }
                                            },

                                            svg: {
                                                component: 'svg',
                                                attr: {
                                                    'viewBox': '0 0 24 24',
                                                    'fill': 'currentColor'
                                                },

                                                path: {
                                                    component: 'path',
                                                    attr: {
                                                        'd': 'M12.9 15l-2.6-2.4c1.8-2 3-4.2 3.8-6.6H17V4h-7V2H8v2H1v2h11.2c-.7 2-1.8 3.8-3.2 5.3-1-1-1.7-2.1-2.3-3.3h-2c.7 1.6 1.7 3.2 3 4.6l-5.1 5L4 19l5-5 3.1 3.1.8-2zm5.6-5h-2L12 22h2l1.1-3H20l1.1 3h2l-4.5-12zm-2.6 7l1.6-4.3 1.6 4.3H16z'
                                                    }
                                                }
                                            },
                                            label: {
                                                component: 'span',
                                                text: 'languages'
                                            }
                                        },
                                        about: {
                                            component: 'button',
                                            on: {
                                                click: {
                                                    component: 'span',

                                                    on: {
                                                        render: function () {
                                                            var component = this,
                                                                manifest = chrome.runtime.getManifest(),
                                                                user = satus.user(),
                                                                skeleton_about = {
                                                                    extension_section_label: {
                                                                        component: 'span',
                                                                        class: 'satus-section--label',
                                                                        text: 'extension'
                                                                    },
                                                                    extension_section: {
                                                                        component: 'section',
                                                                        variant: 'card',

                                                                        list: {
                                                                            component: 'list',
                                                                            items: [
                                                                                ['version', manifest.version],
                                                                                ['permissions', manifest.permissions.join(', ').replace('https://www.youtube.com/', 'YouTube')]
                                                                            ]
                                                                        }
                                                                    },
                                                                    browser_section_label: {
                                                                        component: 'span',
                                                                        class: 'satus-section--label',
                                                                        text: 'browser'
                                                                    },
                                                                    browser_section: {
                                                                        component: 'section',
                                                                        variant: 'card',

                                                                        list: {
                                                                            component: 'list',
                                                                            items: [
                                                                                ['name', user.browser.name],
                                                                                ['version', user.browser.version],
                                                                                ['platform', user.browser.platform],
                                                                                ['videoFormats', {
                                                                                    component: 'span',
                                                                                    on: {
                                                                                        render: function () {
                                                                                            var formats = [];

                                                                                            for (var key in user.browser.video) {
                                                                                                if (user.browser.video[key] !== false) {
                                                                                                    formats.push(key);
                                                                                                }
                                                                                            }

                                                                                            this.textContent = formats.join(', ');
                                                                                        }
                                                                                    }
                                                                                }],
                                                                                ['audioFormats', {
                                                                                    component: 'span',
                                                                                    on: {
                                                                                        render: function () {
                                                                                            var formats = [];

                                                                                            for (var key in user.browser.audio) {
                                                                                                if (user.browser.audio[key] !== false) {
                                                                                                    formats.push(key);
                                                                                                }
                                                                                            }

                                                                                            this.textContent = formats.join(', ');
                                                                                        }
                                                                                    }
                                                                                }],
                                                                                ['flash', !!user.browser.flash ? 'true' : 'false']
                                                                            ]
                                                                        }
                                                                    },
                                                                    os_section_label: {
                                                                        component: 'span',
                                                                        class: 'satus-section--label',
                                                                        text: 'os'
                                                                    },
                                                                    os_section: {
                                                                        component: 'section',
                                                                        variant: 'card',

                                                                        list: {
                                                                            component: 'list',
                                                                            items: [
                                                                                ['name', user.os.name],
                                                                                ['type', user.os.type]
                                                                            ]
                                                                        }
                                                                    },
                                                                    device_section_label: {
                                                                        component: 'span',
                                                                        class: 'satus-section--label',
                                                                        text: 'device'
                                                                    },
                                                                    device_section: {
                                                                        component: 'section',
                                                                        variant: 'card',

                                                                        list: {
                                                                            component: 'list',
                                                                            items: [
                                                                                ['screen', user.device.screen],
                                                                                ['cores', user.device.cores],
                                                                                ['gpu', user.device.gpu],
                                                                                ['ram', user.device.ram]
                                                                            ]
                                                                        }
                                                                    }
                                                                };

                                                            setTimeout(function () {
                                                                satus.render(skeleton_about, component.parentNode);

                                                                component.remove();
                                                            });
                                                        }
                                                    }
                                                }
                                            },

                                            svg: {
                                                component: 'svg',
                                                attr: {
                                                    'viewBox': '0 0 24 24',
                                                    'fill': 'currentColor'
                                                },

                                                path: {
                                                    component: 'path',
                                                    attr: {
                                                        'd': 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z'
                                                    }
                                                }
                                            },
                                            label: {
                                                component: 'span',
                                                text: 'about'
                                            }
                                        }
                                    }
                                }
                            },

                            icon: {
                                component: 'svg',
                                attr: {
                                    'viewBox': '0 0 24 24',
                                    'fill': 'var(--satus-primary)'
                                },

                                path: {
                                    component: 'path',
                                    attr: {
                                        'd': 'M19.4 13l.1-1v-1l2-1.6c.2-.2.3-.5.2-.7l-2-3.4c-.2-.3-.4-.3-.6-.3l-2.5 1-1.7-1-.4-2.6c0-.2-.3-.4-.5-.4h-4c-.3 0-.5.2-.5.4l-.4 2.7c-.6.2-1.1.6-1.7 1L5 5c-.2-.1-.4 0-.6.2l-2 3.4c0 .3 0 .5.2.7l2 1.6a8 8 0 0 0 0 2l-2 1.6c-.2.2-.3.5-.2.7l2 3.4c.2.3.4.3.6.3l2.5-1 1.7 1 .4 2.6c0 .2.2.4.5.4h4c.3 0 .5-.2.5-.4l.4-2.7c.6-.2 1.1-.6 1.7-1l2.5 1c.2.1.4 0 .6-.2l2-3.4c0-.2 0-.5-.2-.7l-2-1.6zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z'
                                    }
                                }
                            },
                            label: {
                                component: 'span',
                                text: 'settings'
                            }
                        }
                    }
                },
                pluviam: true,

                dot_1: {
                    component: 'span'
                },
                dot_2: {
                    component: 'span'
                },
                dot_3: {
                    component: 'span'
                }
            }
        }
    },
    layers: {
        component: 'layers',
        on: {
            open: function () {
                var parent = this.path[this.path.length - 1].parent,
                    section = this.base.skeleton.header.section_1,
                    title = 'User Agent';

                if (parent) {
                    if (parent.label) {
                        title = parent.label.text;
                    } else if (parent.text) {
                        title = parent.text;
                    }
                }

                section.back.rendered.hidden = this.path.length <= 1;
                section.title.rendered.innerText = satus.locale.get(title);
            }
        }
    }
};


/*--------------------------------------------------------------
# INITIALIZATION
--------------------------------------------------------------*/

satus.storage.attributes = {
    'hide-star-us-on-github': true
};

satus.storage.import(function (items) {
    var language = items.language || window.navigator.language || 'en';

    satus.ajax('_locales/' + language + '/messages.json', function (response) {
        try {
            response = JSON.parse(response);

            for (var key in response) {
                satus.locale.strings[key] = response[key].message;
            }

            function parse(target, source) {
                source.section = {
                    component: 'section',
                    variant: 'card'
                };

                source = source.section;

                for (var key in target) {
                    var item = target[key];

                    if (typeof item === 'object') {
                        source[key] = {
                            component: 'button',
                            text: key,
                            on: {
                                click: {}
                            }
                        };

                        parse(item, source[key].on.click);
                    } else {
                        source[key] = {
                            component: 'radio',
                            group: 'user-agent',
                            text: key,
                            value: item
                        };
                    }
                }
            }

            parse(user_agents, skeleton.layers);

            delete skeleton.layers.section.car.text;

            skeleton.layers.section.car.icon = {
                component: 'svg',
                attr: {
                    'viewBox': '0 0 24 24',
                    'fill': 'currentColor'
                },

                path: {
                    component: 'path',
                    attr: {
                        'd': 'M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z'
                    }
                }
            };

            skeleton.layers.section.car.label = {
                component: 'span',
                text: 'car'
            };

            delete skeleton.layers.section.computer.text;

            skeleton.layers.section.computer.icon = {
                component: 'svg',
                attr: {
                    'viewBox': '0 0 24 24',
                    'fill': 'currentColor'
                },

                path: {
                    component: 'path',
                    attr: {
                        'd': 'M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z'
                    }
                }
            };

            skeleton.layers.section.computer.label = {
                component: 'span',
                text: 'computer'
            };

            delete skeleton.layers.section.gameConsole.text;

            skeleton.layers.section.gameConsole.icon = {
                component: 'svg',
                attr: {
                    'viewBox': '0 0 24 24',
                    'fill': 'currentColor'
                },

                path: {
                    component: 'path',
                    attr: {
                        'd': 'm21.58 16.09-1.09-7.66A3.996 3.996 0 0 0 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z'
                    }
                }
            };

            skeleton.layers.section.gameConsole.label = {
                component: 'span',
                text: 'gameConsole'
            };

            delete skeleton.layers.section.phone.text;

            skeleton.layers.section.phone.icon = {
                component: 'svg',
                attr: {
                    'viewBox': '0 0 24 24',
                    'fill': 'currentColor'
                },

                path: {
                    component: 'path',
                    attr: {
                        'd': 'M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z'
                    }
                }
            };

            skeleton.layers.section.phone.label = {
                component: 'span',
                text: 'phone'
            };

            delete skeleton.layers.section.tv.text;

            skeleton.layers.section.tv.icon = {
                component: 'svg',
                attr: {
                    'viewBox': '0 0 24 24',
                    'fill': 'currentColor'
                },

                path: {
                    component: 'path',
                    attr: {
                        'd': 'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z'
                    }
                }
            };

            skeleton.layers.section.tv.label = {
                component: 'span',
                text: 'tv'
            };

            delete skeleton.layers.section.watch.text;

            skeleton.layers.section.watch.icon = {
                component: 'svg',
                attr: {
                    'viewBox': '0 0 24 24',
                    'fill': 'currentColor'
                },

                path: {
                    component: 'path',
                    attr: {
                        'd': 'M20 12c0-2.54-1.19-4.81-3.04-6.27L16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73A7.976 7.976 0 0 0 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z'
                    }
                }
            };

            skeleton.layers.section.watch.label = {
                component: 'span',
                text: 'watch'
            };

            skeleton.layers.section.custom = {
                component: 'button',
                on: {
                    click: {
                        component: 'section',
                        variant: 'column',

                        textarea: {
                            component: 'textarea',
                            storage: 'user-agent',
                            properties: {
                                placeholder: '...'
                            },
                            on: {
                                render: function () {
                                    this.value = satus.storage.get(this.skeleton.storage) || '';
                                },
                                keydown: function () {
                                    var self = this;

                                    setTimeout(function () {
                                        satus.storage.set(self.skeleton.storage, self.value);
                                    });
                                }
                            }
                        }
                    }
                },

                icon: {
                    component: 'svg',
                    attr: {
                        'viewBox': '0 0 24 24',
                        'fill': 'currentColor'
                    },

                    path: {
                        component: 'path',
                        attr: {
                            'd': 'M5 4v3h5.5v12h3V7H19V4z'
                        }
                    }
                },
                label: {
                    component: 'span',
                    text: 'custom'
                }
            };

            skeleton.layers.star_us_on_github = {
                component: 'a',
                class: 'star-us-on-github',
                attr: {
                    target: '_blank',
                    href: 'https://github.com/victor-savinov/user-agent'
                },

                span_1: {
                    component: 'span',
                    text: 'Star us'
                },
                svg: {
                    component: 'svg',
                    attr: {
                        'viewBox': '0 0 24 24',
                        'fill': '#ed2c4c'
                    },

                    path: {
                        component: 'path',
                        attr: {
                            'd': 'm14.43 10-1.47-4.84c-.29-.95-1.63-.95-1.91 0L9.57 10H5.12c-.97 0-1.37 1.25-.58 1.81l3.64 2.6-1.43 4.61c-.29.93.79 1.68 1.56 1.09l3.69-2.8 3.69 2.81c.77.59 1.85-.16 1.56-1.09l-1.43-4.61 3.64-2.6c.79-.57.39-1.81-.58-1.81h-4.45z'
                        }
                    }
                },
                span_2: {
                    component: 'span',
                    text: 'on GitHub'
                }
            };

            satus.render(skeleton);
        } catch (error) {
            console.error(error);
        }
    }, function (success) {
        satus.ajax('_locales/en/messages.json', success);
    });
});