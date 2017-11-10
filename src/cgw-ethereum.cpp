#include <cstdio>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <array>

#include "cgw-ethereum.h"

namespace CGW {
// ============================================================================
Ethereum::Ethereum(const char* _db, const char* _ipc) : db(_db), ipc(_ipc) {
}

Ethereum::~Ethereum() {
}

std::string Ethereum::exec(const char* cmd) {
    std::array<char, 128> buffer;
    std::string result;
    std::shared_ptr<FILE> pipe(popen(cmd, "r"), pclose);
    if( !pipe )
      throw std::runtime_error("popen() failed!");
    while (!feof(pipe.get())) {
        if (fgets(buffer.data(), 128, pipe.get()) != nullptr)
            result += buffer.data();
    }
    return result;
}

std::string Ethereum::run(std::string command) {
  return exec(("geth attach ipc:" + ipc +
    " --datadir " + db + " --exec \"" + command + "\"").c_str());
}

std::string Ethereum::createAccountCmd(std::string password) {
  return "personal.newAccount('" + password + "');";
}

std::string Ethereum::unlockAccountCmd(std::string account, std::string password) {
  return "personal.unlockAccount('" + account + "', '" + password + "');";
}

std::string Ethereum::lockAccountCmd(std::string account) {
  return "personal.lockAccount('" + account + "');";
}

std::string Ethereum::createAccount(std::string password) {
  std::string address = run(createAccountCmd(password));
  size_t pos = address.find("0x"), addrlen = 42;
  if( pos == std::string::npos || address.length() < pos + addrlen )
    throw std::runtime_error("createAccount() failed!");
  return address.substr(pos, addrlen);
}

std::string Ethereum::unlockAccount(std::string account, std::string password) {
  std::string response = run(unlockAccountCmd(account, password));
  size_t pos = response.find("true");
  if( pos == std::string::npos )
    throw std::runtime_error("unlockAccount() failed!");
  return response;
}

std::string Ethereum::lockAccount(std::string account) {
  std::string response = run(lockAccountCmd(account));
  size_t pos = response.find("true");
  if( pos == std::string::npos )
    throw std::runtime_error("lockAccount() failed!");
  return response;
}
// ============================================================================
}; // namespace CGW
