/*
 * cgw-settings.h
 *
 *  Created on: 26 august 2015
 *      Author: Dmitry Trenin (dtrenin7@gmail.com)
 */

#ifndef SRC_CGW_SETTINGS_H_
#define SRC_CGW_SETTINGS_H_

#include "cgw-error.h"
#include <map>

#define CONFIG_FILE "./config.ini"

namespace CGW {

class settings {

    std::map<str_t, i32_t>  integers;   ///< integer values
    std::map<str_t, str_t>  strings;    ///< string values

    settings();
    settings(const settings&);
    settings& operator=(settings&);

public:
    static cstrptr_t   devices;            ///< amount of virtual devices
    static cstrptr_t   serial_base;        ///< base value for device serials

    static cstrptr_t   db_name;            ///< source database name
    static cstrptr_t   db_server;          ///< source database server
    static cstrptr_t   db_port;            ///< source database port
    static cstrptr_t   db_login;           ///< source database login
    static cstrptr_t   db_password;        ///< source database password
    static cstrptr_t   points_table;       ///< table with points from real devices
    static cstrptr_t   devices_table;      ///< table with devices info

    static cstrptr_t   column_serial;      ///< serial column name in points table
    static cstrptr_t   column_div_data;    ///< div_data column name in points table

    static cstrptr_t   device_packets_min; ///< minimum number of generated packets for each device
    static cstrptr_t   device_packets_max; ///< maximum number of generated packets for each device
    static cstrptr_t   device_auth_bytes;  ///< 32 bytes of AES-256 for device authority
    static cstrptr_t   device_send_period; ///< period (seconds) between packets sending

    static cstrptr_t   template_header;
    static cstrptr_t   template_header_end;
    static cstrptr_t   template_end;
    static cstrptr_t   template_session;
    static cstrptr_t   template_session_header;
    static cstrptr_t   template_session_end;
    static cstrptr_t   template_host;
    static cstrptr_t   template_port;
    static cstrptr_t   template_duration;
    static cstrptr_t   template_arrival_rate;
    static cstrptr_t   template_output;
    static cstrptr_t   template_source;
    static cstrptr_t   template_random;
    static cstrptr_t   template_packets_per_device;
    static cstrptr_t   template_include_response; ///< include response packets. 0=false, (!0)=true

    static cstrptr_t   thrash_output;   ///< output dir
    static cstrptr_t   thrash_packets;  ///< packets count
    static cstrptr_t   thrash_packet_size;  ///< packet size
    static cstrptr_t   thrash_devices;  ///< devices count

    static cstrptr_t   performance_output;   ///< output dir
    static cstrptr_t   performance_packets;  ///< packets per client
    static cstrptr_t   performance_packet_size;  ///< packet size
    static cstrptr_t   performance_clients;  ///< clients count
    static cstrptr_t   performance_encode_retry_count;  ///< max number of attempts to encode packet on Decoder.

    static cstrptr_t   cryptotest_host;
    static cstrptr_t   cryptotest_port;
    static cstrptr_t   cryptotest_inverse_host;
    static cstrptr_t   cryptotest_inverse_port;
    static cstrptr_t   cryptotest_container_name;

    static settings& instance();

    i32_t get_integer(str_t key);
    str_t get_string(str_t key);
    void save_in_log();
};

};	// namespace CGW

#endif /* SRC_CGW_SETTINGS_H_ */
