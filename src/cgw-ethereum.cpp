#include <cstdio>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <array>

#include "cgw-ethereum.h"
#include "cgw-utils.h"
#include "json.hpp"

namespace CGW {
// ============================================================================
using json = nlohmann::json;

Ethereum::Ethereum() {
  db = Settings->eth.db;
  ipc = Settings->eth.ipc;
  jspath = Settings->eth.scripts;
}

Ethereum::~Ethereum() {
}

str_t Ethereum::getScriptPath(str_t script) {
  return str_t(jspath + "/" + script + ".js");
}

str_t Ethereum::exec(cstrptr_t cmd) {
    std::array<char, 128> buffer;
    str_t result;
    std::shared_ptr<FILE> pipe(popen(cmd, "r"), pclose);
    if( !pipe )
      throw std::runtime_error("popen() failed!");
    while (!feof(pipe.get())) {
        if (fgets(buffer.data(), 128, pipe.get()) != nullptr)
            result += buffer.data();
    }
    return result;
}

str_t Ethereum::run(str_t command) {
  return exec(("geth attach ipc:" + ipc +
    " --datadir " + db + " --exec \"" + command + "\"").c_str());
}

str_t Ethereum::runScript(str_t scriptFileName) {
  return exec(("geth attach ipc:" + ipc + " --datadir " + db + " --jspath " +
    jspath + " --exec 'loadScript(\"" + scriptFileName + ".js\")'").c_str());
}

str_t Ethereum::runJsonScript(buffer_t& jsondata) {
  str_t response;
  try {
    auto data = json::parse(jsondata);
    response = runJsonScript(data);
  }
  catch(const std::exception &e) {
    response = e.what();
  };
  return response;
}

str_t Ethereum::runJsonScript(nlohmann::json& data) {
  str_t response;
  try {
    error_t error;
    str_t script_name = data.at("script").get<CGW::str_t>();

    CGW::str_t script_template;
    THROW(file2string(getScriptPath(script_name).c_str(), script_template));
    // load script template

    auto args = data.at("args");
    bool noremove = false;
    for( json::iterator arg = args.begin(); arg != args.end(); ++arg ) {
      CGW::str_t key("$$$" + arg.key() + "$$$");
      CGW::str_t value(arg.value().get<std::string>());
      if( key == "$$$noremove$$$" ) // reserved keyword
        noremove = true;
      else
        replace_substring(script_template, key.c_str(), value);
       //response += (arg.key() + " : " + arg.value().get<std::string>() + "\n");
    }
    // patch script template

    str_t temp_script_name = script_name + random_str(4);
    str_t temp_script_path = getScriptPath(temp_script_name);
    THROW(write_file(temp_script_path.c_str(), script_template));
    // save patched script on temporary location

    response = runScript(temp_script_name);
    if( !noremove )
      remove(temp_script_path.c_str());
  }
  catch(const std::exception &e) {
    response = e.what();
  }
  catch(error_t& err) {
    response = err.get_text().c_str();
  };

  size_t len = response.length();
  if( len && response[len-1] == '\n')
    len--;  // omit line feed at end
  return response;
}


str_t Ethereum::createAccountCmd(str_t password) {
  return "personal.newAccount('" + password + "');";
}

str_t Ethereum::unlockAccountCmd(str_t account, str_t password) {
  return "personal.unlockAccount('" + account + "', '" + password + "');";
}

str_t Ethereum::lockAccountCmd(str_t account) {
  return "personal.lockAccount('" + account + "');";
}

str_t Ethereum::createAccount(str_t password) {
  str_t address = run(createAccountCmd(password));
  size_t pos = address.find("0x"), addrlen = 42;
  if( pos == str_t::npos || address.length() < pos + addrlen )
    throw std::runtime_error("createAccount() failed!");
  return address.substr(pos, addrlen);
}

str_t Ethereum::unlockAccount(str_t account, str_t password) {
  str_t response = run(unlockAccountCmd(account, password));
  size_t pos = response.find("true");
  if( pos == str_t::npos )
    throw std::runtime_error("unlockAccount() failed!");
  return response;
}

str_t Ethereum::lockAccount(str_t account) {
  str_t response = run(lockAccountCmd(account));
  size_t pos = response.find("true");
  if( pos == str_t::npos )
    throw std::runtime_error("lockAccount() failed!");
  return response;
}
// ============================================================================
}; // namespace CGW
