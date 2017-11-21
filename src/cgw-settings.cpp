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

cstrptr_t settings::devices            = "CALM_LOAD_TEST_DEVICES";
cstrptr_t settings::serial_base        = "CALM_LOAD_TEST_SERIAL_BASE";
cstrptr_t settings::db_name            = "CALM_LOAD_TEST_DB_NAME";
cstrptr_t settings::db_server          = "CALM_LOAD_TEST_DB_SERVER";
cstrptr_t settings::db_port            = "CALM_LOAD_TEST_DB_PORT";
cstrptr_t settings::db_login           = "CALM_LOAD_TEST_DB_LOGIN";
cstrptr_t settings::db_password        = "CALM_LOAD_TEST_DB_PASSWORD";
cstrptr_t settings::points_table       = "CALM_LOAD_TEST_POINTS_TABLE";
cstrptr_t settings::devices_table      = "CALM_LOAD_TEST_DEVICES_TABLE";
cstrptr_t settings::column_serial      = "CALM_LOAD_TEST_COLUMN_SERIAL";
cstrptr_t settings::column_div_data    = "CALM_LOAD_TEST_COLUMN_DIV_DATA";
cstrptr_t settings::device_packets_min = "CALM_LOAD_TEST_PACKETS_MIN";
cstrptr_t settings::device_packets_max = "CALM_LOAD_TEST_PACKETS_MAX";
cstrptr_t settings::device_auth_bytes  = "CALM_LOAD_TEST_AUTH_BYTES";
cstrptr_t settings::device_send_period = "CALM_LOAD_TEST_SEND_PERIOD";
cstrptr_t settings::template_header = "CALM_LOAD_TEST_TEMPLATE_HEADER";
cstrptr_t settings::template_header_end = "CALM_LOAD_TEST_TEMPLATE_HEADER_END";
cstrptr_t settings::template_end = "CALM_LOAD_TEST_TEMPLATE_END";
cstrptr_t settings::template_session = "CALM_LOAD_TEST_TEMPLATE_SESSION";
cstrptr_t settings::template_session_header = "CALM_LOAD_TEST_TEMPLATE_SESSION_HEADER";
cstrptr_t settings::template_session_end = "CALM_LOAD_TEST_TEMPLATE_SESSION_END";
cstrptr_t settings::template_host = "CALM_LOAD_TEST_TEMPLATE_HOST";
cstrptr_t settings::template_port = "CALM_LOAD_TEST_TEMPLATE_PORT";
cstrptr_t settings::template_duration = "CALM_LOAD_TEST_TEMPLATE_DURATION";
cstrptr_t settings::template_arrival_rate = "CALM_LOAD_TEST_TEMPLATE_ARRIVAL_RATE";
cstrptr_t settings::template_output = "CALM_LOAD_TEST_TEMPLATE_OUTPUT";
cstrptr_t settings::template_source = "CALM_LOAD_TEST_TEMPLATE_SOURCE";
cstrptr_t settings::template_random = "CALM_LOAD_TEST_TEMPLATE_RANDOM";
cstrptr_t settings::template_packets_per_device = "CALM_LOAD_TEST_TEMPLATE_PACKETS_PER_DEVICE";
cstrptr_t settings::template_include_response = "CALM_LOAD_TEST_TEMPLATE_INCLUDE_RESPONSE";
cstrptr_t settings::thrash_output = "CALM_LOAD_TEST_THRASH_OUTPUT";
cstrptr_t settings::thrash_packets = "CALM_LOAD_TEST_THRASH_PACKETS";
cstrptr_t settings::thrash_packet_size = "CALM_LOAD_TEST_THRASH_PACKET_SIZE";
cstrptr_t settings::thrash_devices = "CALM_LOAD_TEST_THRASH_DEVICES";
cstrptr_t settings::performance_output = "CALM_LOAD_TEST_PERFORMANCE_OUTPUT";
cstrptr_t settings::performance_packets = "CALM_LOAD_TEST_PERFORMANCE_PACKETS";
cstrptr_t settings::performance_packet_size = "CALM_LOAD_TEST_PERFORMANCE_PACKET_SIZE";
cstrptr_t settings::performance_clients = "CALM_LOAD_TEST_PERFORMANCE_DEVICES";
cstrptr_t settings::performance_encode_retry_count = "CALM_LOAD_TEST_PERFORMANCE_ENCODE_RETRY_COUNT";
cstrptr_t settings::cryptotest_host = "CALM_LOAD_TEST_CRYPTOTEST_HOST";
cstrptr_t settings::cryptotest_port = "CALM_LOAD_TEST_CRYPTOTEST_PORT";
cstrptr_t settings::cryptotest_inverse_host = "CALM_LOAD_TEST_CRYPTOTEST_INVERSE_HOST";
cstrptr_t settings::cryptotest_inverse_port = "CALM_LOAD_TEST_CRYPTOTEST_INVERSE_PORT";
cstrptr_t settings::cryptotest_container_name = "CALM_LOAD_TEST_CRYPTOTEST_CONTAINER_NAME";


#define READ_STRING(key, ini_section, ini_key) { conf_value.clear();\
    if( config.read(str_t(ini_section), str_t(ini_key), conf_value) == E_OK )\
        strings[key] = conf_value;\
    value = getenv(key); if( value ) strings[key] = value;\
    CGW_INFO("SETTINGS(%s) = %s", key, strings[key].c_str()); }

#define READ_INTEGER(key, ini_section, ini_key) { conf_value.clear();\
    if( config.read(str_t(ini_section), str_t(ini_key), conf_value) == E_OK )\
        integers[key] = atoi(conf_value.c_str());\
    value = getenv(key); if( value ) integers[key] = atoi(value);\
    CGW_INFO("SETTINGS(%s) = %d", key, integers[key]); }

settings::settings() {

    error_t error;
    strptr_t value;
    str_t conf_value;

    ini config;
    THROW(config.open(CONFIG_FILE));
    // try to open config file

    READ_INTEGER(devices, "main", "devices");
    READ_INTEGER(serial_base, "main", "serial_base");
    READ_STRING(db_name, "db", "name");
    READ_STRING(db_server, "db", "server");
    READ_STRING(db_port, "db", "port");
    READ_STRING(db_login, "db", "login");
    READ_STRING(db_password, "db", "password");
    READ_STRING(points_table, "db", "points_table");
    READ_STRING(devices_table, "db", "devices_table");
    READ_STRING(column_serial, "points_table", "serial");
    READ_STRING(column_div_data, "points_table", "div_data");
    READ_STRING(device_packets_min, "device", "packets_min");
    READ_STRING(device_packets_max, "device", "packets_max");
    READ_STRING(device_auth_bytes, "device", "auth_bytes");
    READ_INTEGER(device_send_period, "device", "send_period");
    READ_STRING(template_output, "template", "output");
    READ_STRING(template_source, "template", "source");
    READ_STRING(template_header, "template", "header");
    READ_STRING(template_header_end, "template", "header_end");
    READ_STRING(template_end, "template", "end");
    READ_STRING(template_session, "template", "session");
    READ_STRING(template_session_header, "template", "session_header");
    READ_STRING(template_session_end, "template", "session_end");
    READ_STRING(template_host, "template", "host");
    READ_STRING(template_port, "template", "port");
    READ_STRING(template_duration, "template", "duration");
    READ_STRING(template_arrival_rate, "template", "arrival_rate");
    READ_INTEGER(template_random, "template", "random");
    READ_INTEGER(template_packets_per_device, "template", "packets_per_device");
    READ_INTEGER(template_include_response, "template", "include_response");
    READ_STRING(thrash_output, "thrash", "output");
    READ_INTEGER(thrash_packets, "thrash", "packets");
    READ_INTEGER(thrash_packet_size, "thrash", "packet_size");
    READ_INTEGER(thrash_devices, "thrash", "devices");
    READ_STRING(performance_output, "performance", "output");
    READ_INTEGER(performance_packets, "performance", "packets");
    READ_INTEGER(performance_packet_size, "performance", "packet_size");
    READ_INTEGER(performance_clients, "performance", "clients");
    READ_INTEGER(performance_encode_retry_count, "performance", "encode_retry_count");
    READ_STRING(cryptotest_host, "cryptotest", "host");
    READ_STRING(cryptotest_port, "cryptotest", "port");
    READ_STRING(cryptotest_inverse_host, "cryptotest", "inverse_host");
    READ_STRING(cryptotest_inverse_port, "cryptotest", "inverse_port");
    READ_STRING(cryptotest_container_name, "cryptotest", "container_name");

    CGW_INFO("Reading settings done...");
    // read settings from config and/or environment */
}

#undef READ_STRING
#undef READ_INTEGER

settings::settings(const settings&) {

}

settings& settings::operator = (settings&) {

}

settings& settings::instance() {

    static settings  instance_;
    return instance_;
}

i32_t settings::get_integer(str_t key) {

    std::map<str_t, i32_t>::const_iterator found =
        integers.find(key);
    if( found == integers.end() )
        throw STATUS("Integer " + key + " not found in settings");
    return found->second;
}

str_t settings::get_string(str_t key) {

    std::map<str_t, str_t>::const_iterator found =
        strings.find(key);
    if( found == strings.end() )
        throw STATUS("String " + key + " not found in settings");
    return found->second;
}

void settings::save_in_log() {

    for(auto item : integers)
        CGW_INFO("SETTINGS(%s) = %d", item.first.c_str(), item.second);

    for(auto item : strings)
        CGW_INFO("SETTINGS(%s) = %s", item.first.c_str(), item.second.c_str());
}

};	// namespace CGW
