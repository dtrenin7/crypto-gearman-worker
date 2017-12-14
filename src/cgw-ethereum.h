#ifndef CGW_ETHEREUM
#define CGW_ETHEREUM

#include "cgw-types.h"
#include "json.hpp"

namespace CGW {
// ============================================================================
class Ethereum {
  str_t db;       // data dir
  str_t ipc;      // IPC attach hole
  str_t jspath;   // path to JS scripts folder

  str_t exec(cstrptr_t cmd); // launch external app & get response

public:
  Ethereum(cstrptr_t _db = "/db", cstrptr_t _ipc = "/db/geth.ipc",
    cstrptr_t _jspath = "/home/dtrenin/job/crypto-gearman-worker/src/scripts"); // TODO: move to settings
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
