#ifndef CGW_ETHEREUM
#define CGW_ETHEREUM

#include <string>

namespace CGW {
// ============================================================================
class Ethereum {
  std::string db;   // data dir
  std::string ipc;  // IPC attach hole

  std::string exec(const char* cmd); // launch external app & get response

public:
  Ethereum(const char* _db = "/db", const char* _ipc = "/db/geth.ipc");
  virtual ~Ethereum();

  std::string run(std::string command); // execute Web3 JS command
  std::string createAccount(std::string password);
};
// ============================================================================
}; // namespace CGW

#endif
