/*--------------------------------------------------------------
>>> USER AGENTS
--------------------------------------------------------------*/

var user_agents = {
    'car': {
        'Tesla': 'Mozilla/5.0 (X11; GNU/Linux) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/88.0.4324.150 Chrome/88.0.4324.150 Safari/537.36 Tesla/2021.4.18.2-6c676ce09ea5'
    },
    'computer': {
        'Windows': {
            'Windows 10': {
                'Chrome': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0 Safari/537.36',
                'Firefox': 'Mozilla/5.0 (Windows NT 10.0; rv:95.0) Gecko/20171102 Firefox/95.0',
                'Opera': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 OPR/79.0.4143.61',
                'Edge': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36 Edg/94.0.992.31/PmaOHqHf-37',
                'Vivaldi': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.83 Safari/537.36 Vivaldi/4.2.2406.48',
                'Whale': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.232 Whale/2.10.124.26 Safari/537.36'
            },
            'Windows 8.1': {
                'Chrome': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.8948.8989 Safari/537.36',
                'Firefox': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0/10csO9CgK-99',
                'Opera': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 OPR/79.0.4143.50 (Edition Yx 02)',
                'Edge': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36 Edg/94.0.992.31',
                'Vivaldi': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.122 Safari/537.36 Vivaldi/2.3.1440.60',
                'Whale': 'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.229 Whale/2.10.123.42 Safari/537.36'
            },
            'Windows 8': {
                'Chrome': 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.48 CitizenFX/1.0.0.4590 Safari/537.36',
                'Firefox': 'Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0/10csO9CgK-99',
                'Opera': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 OPR/79.0.4143.66',
                'Edge': 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36 Edg/94.0.992.31',
                'Vivaldi': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.143 Safari/537.36 Vivaldi/1.95.1077.45',
                'Whale': 'Mozilla/5.0 (Windows NT 6.2; ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Whale/2.8.108.15 Safari/537.36'
            },
            'Windows 7': {
                'Chrome': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.48 CitizenFX/1.0.0.4590 Safari/537.36',
                'Firefox': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0/CZyfq6zd2FAGsZdS0An',
                'Opera': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 OPR/79.0.4143.66 (Edition Campaign 70)',
                'Edge': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36 Edg/94.0.992.31',
                'Vivaldi': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.183 Safari/537.36 Vivaldi/6969562071AB',
                'Whale': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.232 Whale/2.10.124.26 Safari/537.36',
                'Internet Explorer': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; InfoPath.2)'
            },
            'Windows Vista': {
                'Chrome': 'Mozilla/5.0 (Windows NT 6.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
                'Firefox': 'Mozilla/5.0 (Windows; U; Windows NT 6.0 x64; en-US; rv:1.9.1b2pre) Gecko/20081026 Minefield/3.1b2pre',
                'Opera': 'Mozilla/5.0 (Windows NT 6.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 OPR/78.0.4093.231',
                'Edge': 'Mozilla/5.0 (Windows NT 6.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
                'Vivaldi': 'Mozilla/5.0 (Windows NT 6.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36 Vivaldi/1.0.435.46',
                'Internet Explorer': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; BOIE9;FRFR)'
            },
            'Windows XP': {
                'Chrome': 'Mozilla/5.0 (Windows XP) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
                'Firefox': 'Mozilla/5.0 (Windows; U; Windows XP) Gecko MultiZilla/1.6.1.0a',
                'Opera': 'Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99',
                'Internet Explorer': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)'
            },
            'Windows 2000': {
                'Firefox': 'Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.8) Gecko/20051111 Firefox/1.5',
                'Opera': 'Opera/9.80 (Windows NT 5.0; U; MRA 5.9 (build 4930); ru) Presto/2.10.229 Version/11.62',
                'Internet Explorer': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)'
            },
            'Windows 98': {
                'Firefox': 'Mozilla/5.0 (Windows; U; Win98; bg; rv:1.8.1.10) Gecko/20100526 Firefox/3.7a5pre',
                'Opera': 'Opera/8.20.(Windows 98; ro-RO) Presto/2.9.186 Version/11.00',
                'Internet Explorer': 'Mozilla/4.0 (compatible; MSIE 4.01; MSN 2.5; Windows 98)'
            }
        },
        'macOS': {
            'Safari': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.7 Safari/605.1.15',
            'Chrome': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4653.2 Safari/537.36',
            'Firefox': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4; rv:87.0) Gecko/20100101 Firefox/87.0',
            'Opera': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 OPR/79.0.4143.50',
            'Edge': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36 Edg/94.0.992.31',
            'Vivaldi': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.88 Safari/537.36 Vivaldi/2.4.1488.36',
            'Whale': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Whale/2.8.108.15 Safari/537.36'
        },
        'Linux': {
            'Chrome': 'Mozilla/5.0 (Linux; 7.0; P2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            'Firefox': 'Mozilla/5.0 (X11; U; Linux i686; pt-BR; rv:1.8) Gecko/20051111 Firefox/54.0',
            'Vivaldi': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Vivaldi/4.1.2369.21'
        }
    },
    'gameConsole': {
        'PlayStation': {
            'PlayStation 4': 'Mozilla/5.0 (PlayStation 4 5.05) AppleWebKit/601.2 (KHTML, like Gecko)',
            'PlayStation 3': 'Mozilla/5.0 (PLAYSTATION 3 4.81) AppleWebKit/531.22.8 (KHTML, like Gecko)',
            'PlayStation Vita': 'Mozilla/5.0 (PlayStation Vita 3.50) AppleWebKit/537.73 (KHTML, like Gecko) Silk/3.2',
            'PlayStation Portable': 'Mozilla/4.0 (PSP (PlayStation Portable); 2.00)'
        },
        'Xbox': {
            'Xbox One': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
            'Xbox 360': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; Xbox)'
        },
        'Nintendo': {
            'Nintendo Switch': 'Mozilla/5.0 (Nintendo Switch; WebApplet) AppleWebKit/606.4 (KHTML, like Gecko) NF/6.0.1.18.3 NintendoBrowser/5.1.0.21481',
            'Nintendo Wii U': 'Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.4.2.13 NintendoBrowser/4.3.2.11274.US',
            'Nintendo Wii': 'Opera/9.30 (Nintendo Wii; U; ; 3642; en)',
            'Nintendo 3DS': 'Mozilla/5.0 (New Nintendo 3DS like iPhone) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.0.5.22 Mobile NintendoBrowser/1.10.10166.US'
        }
    },
    'phone': {
        'Android': {
            'Chrome': 'Mozilla/5.0 (Linux; Android 10; W-V680-OPE) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Mobile Safari/537.36',
            'Firefox': 'Mozilla/5.0 (Android 10.0; Mobile; rv:90.0) Gecko/90.0 Firefox/90.0',
            'Opera': 'Mozilla/5.0 (Linux; Android 11; CPH1979) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36 OPR/64.3.3282.60839',
            'Edge': 'Mozilla/5.0 (Linux; Android 11; Redmi Note 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36 EdgA/93.0.961.62'
        },
        'iOS': {
            'Safari': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.2 Mobile/15E148 Safari/604.1',
            'Chrome': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/93.0.4577.78 Mobile/15E148 Safari/604.1',
            'Firefox': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/37.0 Mobile/15E148 Safari/605.1.15'
        },
        'Symbian': {
            'Opera': 'Opera/9.80 (S60; SymbOS; Opera Mobi/SYB-1204232254; U; en-GB) Presto/2.10.254 Version/12.00',
            'Nokia Browser': 'Nokia7610/2.0 (5.0509.0) SymbianOS/7.0s Series60/2.1 Profile/MIDP-2.0 Configuration/CLDC-1.0',
            'Ovi 2.0': 'Mozilla/5.0 (Series40; Nokia200/11.64; Profile/MIDP-2.1 Configuration/CLDC-1.1) Gecko/20100401 S40OviBrowser/2.0.2.68.14'
        }
    },
    'tv': {
        'Google TV': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/90.0.4430.212 Large Screen Safari/534.24 GoogleTV/092754youtube.com/tv#',
        'Samsung TV': 'Mozilla/5.0 (SMART-TV; Linux; Tizen 2.4.0) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.1 TV Safari/538.1'
    },
    'watch': {
        'watchOS': 'atc/1.0 watchOS/7.5 model/Watch3,3 hwp/t8004 build/18T567 (6; dt:155)'
    }
};