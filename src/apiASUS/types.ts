/**
 * Basic String Object
 */
export interface strObj {
	[key: string]: string
}


/**
 * applyapp.cgi action_mode list
 * @type {[type]}
 */
// actionOnly: no extra cmd, just the action_mode
type ActionMode =
'apply' | // For applying nvram value + action_script
' Refresh ' | // Run an systemCmd
' Restart ' | 'reboot' | 'Restore' | 'restore' | 'restore_erase' | 'logout' | // actionOnly
'change_wl_unit' | 'change_wps_unit' | 'wps_apply' | 'wps_reset' |
'change_wan_unit' | 'change_lan_unit' | 'change_dslx_transmode' | 
'refresh_networkmap' | 'update_client_list' | // actionOnly
'mfp_requeue' | 'mfp_monopolize' | // actionOnly
'ddnsclient' | 'ddns_hostname_check' | // actionOnly
'reset_traffic_meter' | // actionOnly
'get_sharelink' | 'change_vpn_server_unit' | 'change_vpn_client_unit' | 'refresh_vpn_ip' |
'NGAUpdate' | // Norton??
// USB Modem Mobile Boardband dongle
'restart_simauth' | 'start_simpin' | 'start_simpuk' | 'start_lockpin' | 'stop_lockpin' |
'start_pwdpin' |'scan_isp' | 'start_simdetect' | 'update_lte_fw' | 'restart_resetcount' |
'restart_sim_del' |
// Traffic limiter actionOnly
'traffic_resetcount' |
'wtfast_logout' | 'wtfast_login' |
'change_diskmon_unit' |
'change_ipv6_unit' |
'nt_apply' |
'upgrade_aqr113c_fw' |
'pms_apply' |
'firmware_upgrade' | 'firmware_check' |
'remove_slave' | 'reset_default' | 'self_optimize' |
// AiMesh Stuff
'onboarding' | 'ob_selection' | 'config_changed' | 'release_note' |
'device_reboot' | 're_reconnect' | 'force_roaming' |
'prefer_node_apply' |
// Wireguard
'chg_wgs_unit' | 'chg_wgsc_unit' | 'chg_wgc_unit';

/**
 * applyapp.cgi format
 */
/*
export interface applyAppData {
  action_mode: ActionMode
}
*/
export type applyAppData = Record<string, string> & { action_mode: ActionMode };

export interface nvramSetRet {
  modify: Bool,
  run_service?: string
}

type MacAddr = string;
type SSID = string;
type IP = string;
type Num = string;
type Bool = '0' | '1';
type InternetMode = 'allow' | 'time' | 'block';
type IpMethod = 'Static' | 'DHCP';

/**
 * get_clientlist api return
 */
export type clientList = {
  [index: MacAddr ]: {
    ROG: Bool,
    amesh_bind_band: string,
    amesh_bind_mac: MacAddr,
    amesh_isReClient: Bool
    amesh_papMac: MacAddr,
    callback: string,
    curRx: Num,
    curTx: Num,
    defaultType: string,
    dpiDevice: string,
    dpiType: string,
    from: string,
    group: string,
    internetMode: InternetMode,
    internetState: Bool,
    ip: IP,
    ipMethod: IpMethod,
    isGN: string,
    isGateway: Bool,
    isITunes: Bool,
    isLogin: Bool
    isOnline: Bool,
    isPrinter: Bool,
    isWL: Bool
    isWebServer: Bool
    keeparp: string,
    mac: MacAddr,
    macRepeat: Bool,
    name: string,
    nickName: string,
    opMode: string,
    qosLevel: string,
    rssi: string,
    ssid: string,
    totalRx: Num,
    totalTx: Num,
    type: string,
    vendor: string,
    wlConnectTime: Num,
    wtfast: Bool
  }
} & {
  ClientAPILevel: Num,
  maclist: MacAddr[]
}

/**
 * get_SambaInfo api return
 */
export type sambaInfo = string;

/**
 * get_cfg_clientlist api return
 */
export interface cfgClientList {
  [index: number]: {
    alias: string,
    ap2g: MacAddr,
    ap2g_fh: MacAddr,
    ap2g_ssid: SSID
    ap2g_ssid_fh: SSID,
    ap5g: MacAddr,
    ap5g1: MacAddr
    ap5g1_fh: MacAddr
    ap5g1_ssid: SSID
    ap5g1_ssid_fh: SSID
    ap5g_fh: MacAddr
    ap5g_ssid: SSID
    ap5g_ssid_fh: SSID
    ap6g: MacAddr
    ap6g_fh: MacAddr
    ap6g_ssid: SSID
    ap6g_ssid_fh: SSID
    apdwb: MacAddr,
    band_info: { [index: number]: any },
    band_num: Num,
    capability: { [index: number]: any},
    config: object,
    frs_model_name: string,
    fwver: string,
    icon_model_name: string,
    ip: IP,
    level: Num
    mac: MacAddr,
    mis_info: object,
    model_name: string,
    newfwver: string
    online: Bool
    pap2g: MacAddr,
    pap2g_ssid: SSID
    pap5g: MacAddr
    pap5g_ssid: SSID
    pap6g: MacAddr
    pap6g_ssid: SSID,
    plc_status: object,
    product_id: string
    re_path: Num,
    rssi2g: Num,
    rssi5g: Num,
    rssi6g: Num,
    sta2g: MacAddr
    sta5g: MacAddr
    sta6g: MacAddr
    tcode: string,
    ui_model_name: string,
    wired_mac: MacAddr[],
    wired_port: object
  }
}

/**
 * get_wiredclientlist api return
 */
export type wiredClientList = Record<MacAddr, MacAddr[]>;

interface wClientInfo {
  '2G'?: MacAddr[],
  '5G'?: MacAddr[]
}

/**
 * get_wclientlist api return
 */
export type wClientList = Record<MacAddr, wClientInfo>;

/**
 * get_clientlist_from_json_database api return
 */
export interface clientlistFromJsonDatabase {
  [index: MacAddr | 'ClientAPILevel' | 'maclist']: {
    ROG: Bool,
    amesh_bind_band: string,
    amesh_bind_mac: MacAddr,
    amesh_isRe: Bool,
    defaultType: string,
    from: string,
    mac: MacAddr,
    name: string,
    nickName: string,
    online: Bool,
    os_type: number,
    sdn_idx: number,
    type: Num,
    vendor: string,
    vendorclass: string,
    wireless: number
  } | Num | MacAddr[],
  ClientAPILevel: Num,
  maclist: MacAddr[]
}

/**
 * get_onboardingstatus api return
 */
export interface onBoradingStatus {
  cfg_newre: string,
  cfg_obcount: Num,
  cfg_obcurrent: Num,
  cfg_obfailresult: string
  cfg_obmodel: string
  cfg_obreboottime: Num
  cfg_obresult: string
  cfg_obrssi: Num
  cfg_obstage: string
  cfg_obstart: string
  cfg_obstatus: Num,
  cfg_obtimeout: Num,
  cfg_re_maxnum: Num,
  cfg_ready: Bool
  cfg_recount: Num
  cfg_ui_obmodel: string
  cfg_wifi_quality: Num
}

/**
 * get_default_reboot_time api return
 */
export type defaultRebootTime = number;

type wanType = 'wan' | '2p5g' | '10ge1' | '10ge2';

interface wanInfo {
  wan_name: string,
  wans_lanport?: Num,
  extra_settings?: {
    wans_extwan: Bool,
    wan_ifname_x?: string
  }
}

/**
 * get_ethernet_wan_list api return
 */
export type ethernetWanList = Record<wanType, wanInfo>

/**
 * get_lan_hwaddr api return
 */
export type lanHwaddr = MacAddr;

type channelNumber2G =
'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13';

type channelNumber5G =
'36' | '40' | '44' | '48' | '52' | '56' | '60' | '64' | '68' | '96' | '100' |
'104' | '108' | '112' | '116' | '120' | '124' | '128' | '132' | '136' | '140' |
'144' | '149' | '153' | '157' | '161' | '165' | '169' | '173' | '177';

/**
 * channel_list_5g_2 channel_list_5g_2 return
 * @type {[type]}
 */
export type channelList5G = channelNumber5G[];

/**
 * channel_list_2g api return
 * @type {[type]}
 */
export type channelList2G = channelNumber2G[];

type cpuInfo = {
  total: Num,
  usage: Num
}

/**
 * cpuUsage api return
 */
export interface cpuUsage {
  cpu0: cpuInfo,
  cpu1?: cpuInfo,
  cpu2?: cpuInfo,
  cpu3?: cpuInfo
}

/**
 * memUsage api return
 */
export interface memUsage {
    total: Num,
    free: Num,
    used: Num
}

/**
 * t: 10Mbps, M: 100Mbps, G: 1Gbps, Q: 2.5Gbps, F: 5Gbps, T: 10Gbps, X: unplugged
 * @type {String}
 */
type portSpeed = 't' | 'M' | 'G' | 'Q' | 'F' | 'T' | 'X';

/**
 * portState api return
 */
export interface portState {
  portCount: {
    wanCount: Num,
    lanCount: Num
  }
  portSpeed: {
    [port: string]: portSpeed
  }
}