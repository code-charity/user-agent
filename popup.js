/*---------------------------------------------------------------
>>> CUSTOM USER-AGENT
-----------------------------------------------------------------
# Menu
# Init
---------------------------------------------------------------*/

/*---------------------------------------------------------------
# MENU
---------------------------------------------------------------*/

var Menu = {
    header: {
        type: 'header',

        section_start: {
            type: 'section',
            variant: 'align-start',

            title: {
                type: 'text',
                variant: 'title'
            }
        },
        section_end: {
            type: 'section',
            variant: 'align-end',

            button_vert: {
                type: 'button',
                before: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>',
                onclick: {
                    type: 'dialog',
                    variant: 'vertical-menu'
                }
            }
        }
    },
    main: {
        type: 'main',
        appearanceKey: 'home',
        onchange: function() {
            document.querySelector('.satus-text--title').innerText = satus.locale.getMessage(this.history[this.history.length - 1].label) || 'User-Agent';
        },

        hardware: {
            type: 'radio-group',
            radios: [{
                    class: 'satus-button--computer',
                    before: '<span class="satus-button__before"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="3" rx="2" ry="2"/><path d="M8 21h8M12 17v4"/></svg></span>',
                    label: 'Computer',
                    value: 'computer'
                },
                {
                    class: 'satus-button--phone',
                    before: '<span class="satus-button__before"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg></span>',
                    label: 'Phone',
                    value: 'phone'
                },
                {
                    class: 'satus-button--tv',
                    before: '<span class="satus-button__before"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><path d="M17 2l-5 5-5-5"/></svg></span>',
                    label: 'TV',
                    value: 'tv'
                },
                {
                    class: 'satus-button--watch',
                    before: '<span class="satus-button__before"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 9v3l1.5 1.5M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 012 1.82l.35 3.83"/></svg></span>',
                    label: 'Watch',
                    value: 'watch'
                }
            ]
        },
        section: {
            type: 'section',
            variant: 'card',

            /*hardware: {
                type: 'select',
                label: 'hardware',
                variant: 'list-item',
                options: [
                    { label: 'Computer', value: 'computer' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Tablet', value: 'tablet' },
                    { label: 'Server', value: 'server' },
                    { label: 'TV', value: 'tv' },
                    { label: 'Game Console', value: 'game_console' },
                    { label: 'Watch', value: 'watch' }
                ]
            },*/
            os: {
                type: 'select',
                label: 'os',
                variant: 'list-item',
                options: [
                    { label: 'Windows', value: 'windows' },
                    { label: 'macOS', value: 'macos' },
                    { label: 'Linux', value: 'linux' },
                    { label: 'Android', value: 'android' },
                    { label: 'iOS', value: 'ios' },
                    { label: 'Chrome OS', value: 'chrome_os' }
                ]
            },
            software: {
                type: 'select',
                label: 'software',
                variant: 'list-item',
                options: [
                    { label: 'Chrome', value: 'chrome' },
                    { label: 'Safari', value: 'safari' },
                    { label: 'Edge', value: 'edge' },
                    { label: 'Firefox', value: 'firefox' },
                    { label: 'Opera', value: 'opera' },
                    { label: 'Internet Explorer', value: 'internet_explorer' }
                ]
            }
        }
    }
};


/*---------------------------------------------------------------
# INIT
---------------------------------------------------------------*/

satus.storage.import(function(items) {
    var language = items.language;

    satus.updateStorageKeys(Menu, function() {
        satus.locale.import(language, function() {
            satus.render(Menu, document.body);
        });
    });
});