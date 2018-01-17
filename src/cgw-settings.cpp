/*
 * cgw-settings.cpp
 *
 *  Created on: 01 july 2015
 *      Author: Dmitry Trenin (dtrenin7@gmail.com)
 */

#include <stdio.h>
#include <stdlib.h>
#include "cgw-settings.h"
#include "cgw-ini.h"
#include "cgw-log.h"
#include "cgw-utils.h"

namespace CGW {
  settings* Settings;

#define READ_STRING(key, ini_section, ini_key) { conf_value.clear();\
    if( config.read(str_t(ini_section), str_t(ini_key), conf_value) == E_OK )\
        key = conf_value;\
    CGW_INFO("SETTINGS(%s) = %s", #key, key.c_str()); }

#define READ_BASE64(key, ini_section, ini_key) { conf_value.clear();\
    if( config.read(str_t(ini_section), str_t(ini_key), conf_value) == E_OK )\
        THROW(CGW::base64decode(key, STR2B(conf_value)));\
    CGW_INFO("SETTINGS(%s) = %s", #key, buff2hex2(key).c_str()); }

#define READ_INTEGER(key, ini_section, ini_key) { conf_value.clear();\
    if( config.read(str_t(ini_section), str_t(ini_key), conf_value) == E_OK )\
        key = atoi(conf_value.c_str());\
    CGW_INFO("SETTINGS(%s) = %d", #key, key); }

settings::settings() {
    error_t error;
    str_t conf_value;

    ini config;
    THROW(config.open(CONFIG_FILE));
    // try to open config file

    READ_BASE64(serverPublicKey, "server", "publicKey");
    READ_BASE64(serverPrivateKey, "server", "privateKey");

    str_t eth_config;
    READ_STRING(eth_config, "ethereum-common", "network"); // real or local or other
    str_t eth_node = "ethereum-" + eth_config;
    READ_STRING(eth.db, eth_node, "db");
    READ_STRING(eth.ipc, eth_node, "ipc");
    READ_STRING(eth.scripts, eth_node, "scripts");

    CGW_INFO("Reading settings done...");
    // read settings from config and/or environment */
}

#undef READ_STRING
#undef READ_INTEGER
#undef READ_BASE64
};	// namespace CGW
