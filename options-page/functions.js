/*--------------------------------------------------------------
>>> FUNCTIONS
----------------------------------------------------------------
# Render
# Export settings
# Import settings
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# RENDER
--------------------------------------------------------------*/

extension.icons = {
	car: 'M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z',
	computer: 'M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',
	gameConsole: 'm21.58 16.09-1.09-7.66A3.996 3.996 0 0 0 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
	phone: 'M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z',
	tv: 'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z',
	watch: 'M20 12c0-2.54-1.19-4.81-3.04-6.27L16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73A7.976 7.976 0 0 0 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z'
};

extension.render = function (object, skeleton) {
	skeleton.section = {
		component: 'section',
		variant: 'card'
	};

	for (var key in object) {
		var item = object[key];

		if (typeof item === 'object') {
			skeleton.section[key] = {
				component: 'button',
				text: key,
				on: {
					click: {}
				}
			};

			if (extension.icons[key]) {
				skeleton.section[key].before = {
					component: 'svg',
					attr: {
						'fill': 'currentColor',
						'viewBox': '0 0 24 24'
					},

					path: {
						component: 'path',
						attr: {
							'd': extension.icons[key]
						}
					}
				};
			}

			extension.render(item, skeleton.section[key].on.click);
		} else {
			skeleton.section[key] = {
				component: 'radio',
				group: 'user-agent',
				text: key,
				value: item
			};
		}
	}
};


/*--------------------------------------------------------------
# EXPORT SETTINGS
--------------------------------------------------------------*/

extension.exportSettings = function () {
	if (location.href.indexOf('action=export-settings') !== -1) {
		satus.render({
			component: 'modal',
			variant: 'confirm',
			content: 'areYouSureYouWantToExportTheData',
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
				ok: {
					component: 'button',
					text: 'ok',
					on: {
						click: function () {
							try {
								var blob = new Blob([JSON.stringify(satus.storage.data)], {
									type: 'application/json;charset=utf-8'
								});

								chrome.permissions.request({
									permissions: ['downloads']
								}, function (granted) {
									if (granted) {
										chrome.downloads.download({
											url: URL.createObjectURL(blob),
											filename: 'user-agent.json',
											saveAs: true
										}, function () {
											setTimeout(function () {
												close();
											}, 1000);
										});
									}
								});
							} catch (error) {
								console.error(error);
							}
						}
					}
				}
			}
		}, extension.skeleton.rendered);
	}
};


/*--------------------------------------------------------------
# IMPORT SETTINGS
--------------------------------------------------------------*/

extension.importSettings = function () {
	if (location.href.indexOf('action=import-settings') !== -1) {
		satus.render({
			component: 'modal',
			variant: 'confirm',
			content: 'areYouSureYouWantToImportTheData',
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
				ok: {
					component: 'button',
					text: 'ok',
					on: {
						click: function () {
							var input = document.createElement('input');

							input.type = 'file';

							input.addEventListener('change', function () {
								var file_reader = new FileReader();

								file_reader.onload = function () {
									var data = JSON.parse(this.result);

									for (var key in data) {
										satus.storage.set(key, data[key]);
									}

									setTimeout(function () {
										chrome.runtime.sendMessage({
											action: 'import-settings'
										});

										setTimeout(function () {
											close();
										}, 128);
									}, 256);
								};

								file_reader.readAsText(this.files[0]);
							});

							input.click();
						}
					}
				}
			}
		}, extension.skeleton.rendered);
	}
};