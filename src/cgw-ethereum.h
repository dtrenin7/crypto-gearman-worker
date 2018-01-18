#ifndef CGW_ETHEREUM
#define CGW_ETHEREUM

#include "cgw-types.h"
#include "json.hpp"
#include "cgw-settings.h"

namespace CGW {
// ============================================================================
class Ethereum {
  str_t db;       // data dir
  str_t ipc;      // IPC attach hole
  str_t jspath;   // path to JS scripts folder
  str_t gpath;    // path to geth

  str_t exec(cstrptr_t cmd); // launch external app & get response

public:
  Ethereum();
  virtual ~Ethereum();

  str_t getScriptPath(str_t script);

  str_t run(str_t command);                 // execute Web3 JS command
  str_t runScript(str_t scriptFileName);    // execute JS script
  str_t runJsonScript(buffer_t& jsondata);  // execute JS script (args in JSON)
  str_t runJsonScript(nlohmann::json& jsondata);

  str_t createAccountCmd(str_t password);
  str_t unlockAccountCmd(str_t account, str_t password);
  str_t lockAccountCmd(str_t account);

  str_t createAccount(str_t password);
  str_t unlockAccount(str_t account, str_t password);
  str_t lockAccount(str_t account);
};
// ============================================================================
}; // namespace CGW

#endif
