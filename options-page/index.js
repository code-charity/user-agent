/*--------------------------------------------------------------
>>> OPTIONS PAGE
----------------------------------------------------------------
# Global variable
# Initialization
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GLOBAL VARIABLE
--------------------------------------------------------------*/

var extension = {};


/*--------------------------------------------------------------
# INITIALIZATION
--------------------------------------------------------------*/

satus.storage.import(function (items) {
	var language = items.language;

	if (!language) {
		language = window.navigator.language;
	}

	satus.locale.import(language, function () {
		satus.fetch(chrome.runtime.getURL('assets/data/user-agent.json'), function (response) {
			extension.render(response, extension.skeleton.main.layers);

			extension.skeleton.main.layers.section.custom = {
				component: 'button',
				text: 'custom',
				before: {
					component: 'svg',
					attr: {
						'fill': 'currentColor',
						'viewBox': '0 0 24 24'
					},

					path: {
						component: 'path',
						attr: {
							'd': 'M5 4v3h5.5v12h3V7H19V4z'
						}
					}
				},
				on: {
					click: {
						component: 'section',
						variant: 'transparent-card',
						style: {
							'height': 'calc(100% - 24px)',
							'margin': '12px'
						},

						textField: {
							component: 'text-field',
							storage: 'user-agent',
							style: {
								'height': '100%'
							}
						}
					}
				}
			};

			extension.skeleton.main.layers.section.reset = {
				component: 'button',
				text: 'reset',
				before: {
					component: 'svg',
					attr: {
						'fill': 'currentColor',
						'viewBox': '0 0 24 24'
					},

					path: {
						component: 'path',
						attr: {
							'd': 'm13 11.6 2.5 2.5q.275.275.275.7 0 .425-.275.7-.275.275-.7.275-.425 0-.7-.275l-2.8-2.8q-.15-.15-.225-.338-.075-.187-.075-.387V8q0-.425.288-.713Q11.575 7 12 7t.713.287Q13 7.575 13 8ZM12 21q-3.025 0-5.425-1.788-2.4-1.787-3.225-4.662-.125-.45.088-.85.212-.4.662-.5.425-.1.763.187.337.288.462.713.65 2.2 2.513 3.55Q9.7 19 12 19q2.925 0 4.962-2.038Q19 14.925 19 12t-2.038-4.963Q14.925 5 12 5q-1.725 0-3.225.8T6.25 8H8q.425 0 .713.287Q9 8.575 9 9t-.287.712Q8.425 10 8 10H4q-.425 0-.712-.288Q3 9.425 3 9V5q0-.425.288-.713Q3.575 4 4 4t.713.287Q5 4.575 5 5v1.35q1.275-1.6 3.113-2.475Q9.95 3 12 3q1.875 0 3.513.712 1.637.713 2.85 1.925 1.212 1.213 1.925 2.85Q21 10.125 21 12t-.712 3.512q-.713 1.638-1.925 2.85-1.213 1.213-2.85 1.926Q13.875 21 12 21Z'
						}
					}
				},
				on: {
					click: {
						component: 'modal',
						variant: 'confirm',
						content: 'allYourSettingsWillBeErasedAndCanTBeRecovered',
						buttons: {
							cancel: {
								component: 'button',
								text: 'cancel',
								on: {
									click: function () {
										this.modalProvider.close();
									}
								}
							},
							reset: {
								component: 'button',
								text: 'reset',
								on: {
									click: function () {
										satus.storage.clear(function () {
											close();
										});
									}
								}
							}
						}
					}
				}
			};

			satus.render(extension.skeleton);

			extension.exportSettings();
			extension.importSettings();
		});
	}, '_locales/');
});

chrome.runtime.sendMessage({
	action: 'options-page-connected'
}, function (response) {
	if (response.isPopup === false) {
		document.body.setAttribute('tab', '');
	}
});