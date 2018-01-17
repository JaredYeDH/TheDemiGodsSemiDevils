/**
 * Created by bayilaoye on 10/4/17.
 */

var RedisTables = {
    /**
     * redis string, seed of connection id
     */
    CONNECTION_ID_SEED: "connection_id_seed",
    /**
     * redis string, mapping for udid to connectionid
     */
    UDID2CONNECTION_ID_LIST: "udid2connection_id_list",
    /**
     * redis string, gate server info list
     */
    GATESERVER_INFO_LIST: "gateserver_info_list",
    /**
     * redis string, gate server status list
     */
    GATESERVER_STATUS_LIST: "gateserver_status_list",
    /**
     * redis string, login: verifyed cliets list
     */
    CLIENTS_VERIFYED_LIST: "verifyed_clients_list",
    /**
     * redis string, login: verifyed cliets list - ios device
     */
    CLIENTS_VERIFYED_IOS_LIST: "clients_verifyed_ios_list",
    /**
     * redis string, login: verifyed cliets list - android device
     */
    CLIENTS_VERIFYED_ANDROID_LIST: "clients_verifyed_android_list",
    /**
     * redis string, login: verifyed cliets list - weibo
     */
    CLIENTS_VERIFYED_WEIBO_LIST: "clients_verifyed_weibo_list",
    /**
     * redis string, login: verifyed cliets list - weixin
     */
    CLIENTS_VERIFYED_WEIXIN_LIST: "clients_verifyed_weixin_list",
    /**
     * redis string, login: verifyed cliets list - QQ
     */
    CLIENTS_VERIFYED_QQ_LIST: "clients_verifyed_qq_list",
    /**
     * redis string, login: verifyed cliets list - mobilenumber
     */
    CLIENTS_VERIFYED_MOBILENUMBER_LIST: "clients_verifyed_mobilenumber_list",
    /**
     * redis string, seed of player id
     */
    PLAYER_ID_SEED: "player_id_seed",
    /**
     * redis hash, udid|facebookId => pid
     */
    PID_MAP: "pid_map",
    /**
     * redis hash, pid=>udid|facebookId
     */
    PID_BINDMAP: "pid_bindmap",
    /**
     * redis string, seed of serialize id
     */
    SERIALIZE_SESSION_ID_SEED : 'serialize_session_id_seed',
    /**
     * redis hashmap, key:[uid] value:[operversion:serializeid] list
     */
    SERIALIZE_SESSION_ID_LIST : 'serialize_session_id_list',
    /**
     * redis hashmap, key:[uid] value:[frozeninfo] list
     */
    FROZEN_UID_LIST : 'frozen_uid_list',
    /**
     * (LOGINUIDS_INONEDAY_TEMPLATE + date) => redis hash
     * redis hashmap, key:[uid] value:[latest login time in one day] list
     */
    LOGINUIDS_INONEDAY_TEMPLATE : 'loginuids_inoneday_',
    /**
     * redis hash, player id => Player
     */
    PLAYER_MAP: "player_map",
    /**
     * redis hash, client device id => gate server id
     */
    TESTCLIENT_DISPATCH_LIST: "testclient_dispatch_list",
    /**
     * redis hash, transaction id => IapRecord
     */
    IAP_RECORD_MAP: "iap_record_map",
    /**
     * (IAP_RECORD_TEMPLATE + playerId) => redis hash
     * redis hash, transaction id => IapData
     */
    IAP_RECORD_TEMPLATE: "iap_record_template_",
    /**
     * redis hash, admin user name => password
     */
    ADMIN_USER_MAP: "admin_user_map",
    /**
     * HASH
     * configId => configData
     */
    SERVER_CONFIGS: "server_configs"
};

module.exports = RedisTables;
