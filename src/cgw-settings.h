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

struct settings_ethereum {
  str_t db;         ///< путь к базе данных
  str_t ipc;        ///< путь к .ipc файлу с настройками
  str_t scripts;    ///< путь к каталогу с .js скриптами
  str_t geth;       ///< путь к geth
};

class settings {
public:
  settings();

  buffer_t   serverPublicKey;            ///< server public key (RSA)
  buffer_t   serverPrivateKey;           ///< server private key (RSA)
  settings_ethereum eth;                 ///< ethereum settings
  str_t host;       ///< адрес хоста для прием задач
  i32_t port;       ///< порт для приема задач
  i32_t threads;    ///< кол-во рабочих потоков
  i32_t timeout;    ///< тайм-аут для рабочих потоков
};

extern settings* Settings;
};	// namespace CGW

#endif /* SRC_CGW_SETTINGS_H_ */
