import {
	strObj,
	applyAppData,
	nvramSetRet,
	clientList,
	cfgClientList,
	wiredClientList,
	clientlistFromJsonDatabase,
	onBoradingStatus,
	sambaInfo,
	defaultRebootTime,
	ethernetWanList,
	wClientList,
	lanHwaddr,
	channelList2G,
	channelList5G
} from './types.ts';

// ASUSwrt appGet.cgi path
const appGetCgiPath = '/appGet.cgi';
// ASUSwrt applyapp.cgi path
const applyAppCgiPath = '/applyapp.cgi';
// ASUSwrt login.cgi
const loginCgiPath = '/login.cgi';

class fetchOptions implements RequestInit {
	method: 'POST' | 'GET';
	credentials: RequestCredentials;
	body?: BodyInit | null | undefined;
	constructor(method: 'POST' | 'GET', body?: BodyInit | null | undefined) {
		this.method = method;
		this.credentials = 'same-origin';
		this.body = body;
	}
}

/**
 * ASUSwrt appGet API
 * @param  {string       | string[]}    actions should support nvram_get and other ASUS' httpApi
 * @return {Promise<object>}   Return data if sucess, empty object if fail
 */
async function appGet(actions: string | string[]): Promise<object> {
	var request = appGetCgiPath + '?hook=';
	var ret = {};
	if (Array.isArray(actions))
		request += actions.join('%3b');
	else
		request += actions;
	const resp = await fetch(request, new fetchOptions('GET'));
	if (resp.ok) {
		try {
			ret = await resp.json();
		} catch {
			ret = {};
		}
	} else {
		ret = {};
	}
	return ret;
}

/**
 * ASUSwrt applyapp API
 * @param  {applyAppData}    actions An object with key: value like hidden form input in asp webpage
 * @return {Promise<object>}         should return an object, for setting nvram. return { modify: '0' | '1'}
 */
async function applyApp(actions: applyAppData): Promise<object> {
	var ret = {};
	const resp = await fetch(applyAppCgiPath, new fetchOptions('POST', new URLSearchParams(actions).toString()));
	if (resp.ok) {
		try {
			ret = await resp.json();
		} catch {
			ret = {};
		}
	} else {
		ret = {};
	}
	return ret;
}

/**
 * Nvram Get & Set
 * @type {Object}
 */
export const nvram = {
	/**
	 * get single or multiple nvram values
	 * @param  {string       | string[]}    keys nvram values to get
	 * @return {Promise<strObj>}   return a string object of nvram values
	 */
	get: async (keys: string | string[]): Promise<strObj> => {
		if (Array.isArray(keys)) {
			const resp = await appGet(keys.map((key) => 'nvram_get(' + key + ')'));
			if (Object.keys(resp).length > 0)
				return resp as unknown as strObj;
			else
				return {};
		} else {
			const resp = await appGet('nvram_get(' + keys + ')');
			if (Object.keys(resp).length > 0)
				return resp as unknown as strObj;
			else
				return {};
		}
	},
	/**
	 * set nvram values
	 * @param  {strObj}  keyValPair    nvram key values pairs
	 * @param  {string}  action_script rc_service to notify
	 * @return {Promise<nvramSetRet | null>} return nvramSetRet, null if fail
	 */
	set: async (keyValPair: strObj, action_script?: string): Promise<nvramSetRet | null> => {
		if (Object.keys(keyValPair).length > 0) {
			var data2Send: applyAppData = { action_mode: 'apply' };
			Object.assign(data2Send, { ...keyValPair });
			if (action_script)
				Object.assign(data2Send, { rc_service: action_script });
			const resp = await applyApp(data2Send);
			if (Object.keys(resp).length > 0)
				return resp as nvramSetRet;
			else
				return null; // If no resp
		} else {
			// If params is not valid
			return null;
		}
	}
}

/**
 * Store the customSettings gets values, so no repeat getting
 * @type {strObj}
 */
var customSettingStore: strObj;

/**
 * ASUSWRT-Merlin Addons's Custom_settings
 * @type {Object}
 */
export const customSettings = {
	/**
	 * Get all custom settings
	 * @return {Promise} return a string object, null if fail
	 */
	getAll: async (): Promise<strObj | null> => {
		const resp = await appGet('get_custom_settings()');
		if ('get_custom_settings' in resp) {
			Object.assign(customSettingStore, resp['get_custom_settings']);
			return resp['get_custom_settings'] as strObj;
		} else {
			return null;
		}
	},
	/**
	 * Set custom settings, overwrite existing one
	 * @param  {strObj}  keyValPair    key values pairs of custom settings
	 * @param  {string}  action_script rc_service to notify
	 * @return {Promise}               return nvramSetRet, null if fail
	 */
	set: async (keyValPair: strObj, action_script?: string): Promise<nvramSetRet | null> => {
		var data2Send: applyAppData = { action_mode: 'apply' };
		if (customSettingStore === null || Object.keys(customSettingStore).length === 0) {
			// no getted custom setting in store, get it here
			if (Object.keys(customSettings.getAll()).length === 0)
				return null;
		}
		if (action_script)
			Object.assign(data2Send, { rc_service: action_script });
		// copy the stored custom settings to a backup object first, so if operation fail
		// stored one is not affected.
		var customSettingsBackup: strObj = {};
		Object.assign(customSettingsBackup, customSettingStore);
		Object.assign(customSettingsBackup, keyValPair);
		Object.assign(data2Send, { amng_custom: JSON.stringify(customSettingsBackup) });
		const resp = await applyApp(data2Send);
		if (Object.keys(resp).length > 0) {
			Object.assign(customSettingStore, customSettingsBackup);
			return resp as nvramSetRet;
		}
		else {
			return null;
		}
	},
	/**
	 * Remove list of custom settings values
	 * @param  {string[]} keys2del      array of key to be deleted
	 * @param  {string}   action_script rc_service to notify
	 * @return {Promise}                return nvramSetRet, null if fail
	 */
	remove: async (keys2del: string[], action_script?: string): Promise<nvramSetRet | null> => {
		var data2Send: applyAppData = { action_mode: 'apply' };
		if (customSettingStore === null || Object.keys(customSettingStore).length === 0) {
			// no geted custom setting in store, get it here
			if (Object.keys(customSettings.getAll()).length === 0)
				return null;
		}
		if (action_script)
			Object.assign(data2Send, { rc_service: action_script });
		// copy the stored custom settings to a backup object first, so if operation fail
		// stored one is not affected.
		var customSettingsBackup: strObj = {};
		Object.assign(customSettingsBackup, customSettingStore);
		for (let i = 0; i < keys2del.length; i++) {
			if (keys2del[i] in customSettingsBackup) {
				delete customSettingsBackup[keys2del[i]];
			}
		}
		Object.assign(data2Send, { amng_custom: JSON.stringify(customSettingsBackup) });
		const resp = await applyApp(data2Send);
		if (Object.keys(resp).length > 0) {
			Object.assign(customSettingStore, customSettingsBackup);
			return resp as nvramSetRet;
		}
		else {
			return null;
		}
	}
}

/**
 * Btoa function from Main_Login.asp for formating login credenitals 
 * @param  {string} input login username + password
 * @return {string}       formated string
 */
function bota(input: string): string {
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var output = "";
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i = 0;
	var utf8_encode = function(string: string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	};
	input = utf8_encode(input);
	while (i < input.length) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		}
		else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output = output + 
		keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
		keyStr.charAt(enc3) + keyStr.charAt(enc4);
	}
	return output;
}

/**
 * trim function from Main_Login.asp for formating username
 * @param  {string} val username
 * @return {string}     formated username
 */
function trim(val: string): string {
	val = val + '';
	for (var startIndex = 0; startIndex < val.length && val.substring(startIndex,startIndex + 1) == ' '; startIndex++) {
	}
	for (var endIndex = val.length - 1; endIndex > startIndex && val.substring(endIndex, endIndex + 1) == ' '; endIndex--) {
	}
	return val.substring(startIndex, endIndex + 1);

}

/**
 * ASUSWRT web UI Login
 * @param  {string}           username username
 * @param  {string}           password password
 * @return {Promise<boolean>}          true if success
 */
export async function login(username: string, password: string): Promise<boolean> {
	const loginInfo = new URLSearchParams('login_authorization=' + bota(trim(username) + ':' + password));
	const resp = await fetch(loginCgiPath, new fetchOptions('POST', loginInfo));
	if (resp.ok) {
		try {
			const htmlParser = new DOMParser();
			const loginRet = htmlParser.parseFromString(await resp.text(), 'text/html');
			console.log(loginRet);
			if (loginRet.head.getElementsByTagName('meta')[0].getAttribute('http-equiv') === 'refresh')
				return true;
			else
				return false;
		} catch {
			return false;
		}
	} else {
		return false;
	}
}

/**
 * ASUSWRT HTTPAPI
 * @type {Object}
 */
export const httpAPI = {
	clientList: async (): Promise<clientList | null> => {
		const resp = await appGet('get_clientlist()');
		if ('get_clientlist' in resp)
			return resp['get_clientlist'] as clientList;
		else
			return null;
	},
	wiredClientList: async (): Promise<wiredClientList | null> => {
		const resp = appGet('get_wiredclientlist()');
		if ('get_wiredclientlist' in resp)
			return resp['get_wiredclientlist'] as wiredClientList;
		else
			return null;
	},
	wClientList: async (): Promise<wClientList | null> => {
		const resp = appGet('get_wclientlist()');
		if ('get_wclientlist' in resp)
			return resp['get_wclientlist'] as wClientList;
		else
			return null;
	},
	cfgClientList: async (): Promise<cfgClientList | null> => {
		const resp = await appGet('get_cfg_clientlist()');
		if ('get_cfg_clientlist' in resp)
			return resp['get_cfg_clientlist'] as cfgClientList;
		else
			return null;
	},
	clientlisFromJsonDatabase: async (): Promise<clientlistFromJsonDatabase | null> => {
		const resp = await appGet('get_clientlist_from_json_database()');
		if ('get_clientlist_from_json_database' in resp)
			return resp['get_clientlist_from_json_database'] as clientlistFromJsonDatabase;
		else
			return null;
	},
	onBoradingStatus: async (): Promise<onBoradingStatus | null> => {
		const resp = await appGet('get_onboardingstatus()');
		if ('get_onboardingstatus' in resp)
			return resp['get_onboardingstatus'] as onBoradingStatus;
		else
			return null;
	},	
	sambaInfo: async (): Promise<sambaInfo | null> => {
		const resp = await appGet('get_SambaInfo()');
		if ('get_SambaInfo' in resp)
			return resp['get_SambaInfo'] as sambaInfo;
		else
			return null;
	},
	defaultRebootTime: async (): Promise<defaultRebootTime | null> => {
		const resp = await appGet('get_default_reboot_time()');
		if ('get_default_reboot_time' in resp)
			return resp['get_default_reboot_time'] as defaultRebootTime;
		else
			return null;
	},
	ethernetWanList: async (): Promise<ethernetWanList | null> => {
		const resp = appGet('get_ethernet_wan_list()');
		if ('get_ethernet_wan_list' in resp)
			return resp['get_ethernet_wan_list'] as ethernetWanList;
		else
			return null;
	},
	lanHwaddr: async (): Promise<lanHwaddr | null> => {
		const resp = await appGet('get_lan_hwaddr()');
		if ('get_lan_hwaddr' in resp)
			return resp['get_lan_hwaddr'] as lanHwaddr;
		else
			return null;
	},
	channeList5g: async (): Promise<channelList5G | null> => {
		const resp = await appGet('channel_list_5g()');
		if ('channel_list_5g' in resp)
			return resp['channel_list_5g'] as channelList5G;
		else
			return null;
	},
	channelList5g_2: async (): Promise<channelList5G | null> => {
		const resp = await appGet('channel_list_5g_2()');
		if ('channel_list_5g_2' in resp)
			return resp['channel_list_5g_2'] as channelList5G;
		else
			return null;
	},
	channelList2g: async (): Promise<channelList2G | null> => {
		const resp = await appGet('channel_list_2g()');
		if ('channel_list_2g' in resp)
			return resp['channel_list_2g'] as channelList2G;
		else
			return null;
	}
}

