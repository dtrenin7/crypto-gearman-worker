#include <libgearman/gearman.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <string>
#include <unordered_set>

#include "crypto.h"
#include "cgw-ethereum.h"
#include "cgw-utils.h"
#include "cgw-uri.h"
#include "cgw-log.h"
#include "cgw-codec.h"
#include "cgw-settings.h"
#include "json.hpp"

using json = nlohmann::json;

CGW::settings* Settings;

#define GEARMAN_CHECK(x) if(gearman_failed(x)) { *result_size = 0; *result = GEARMAN_ERROR; return NULL; }

#define GEARMAN_WORKER(name) void* worker_##name(gearman_job_st* job,\
  void* context, size_t* result_size, gearman_return_t* result) {\
  const char* workload = (const char*)gearman_job_workload(job);\
  size_t workload_size = gearman_job_workload_size(job);\
  if(workload && workload_size) {\
    CGW::error_t error; CGW::str_t response, input(workload, workload_size); try {

#define GEARMAN_WORKER_B64(name) void* worker_##name(gearman_job_st* job,\
  void* context, size_t* result_size, gearman_return_t* result) {\
  const char* workload = (const char*)gearman_job_workload(job);\
  CGW::error_t error; size_t workload_size = gearman_job_workload_size(job);\
  if(workload && workload_size) {\
    CGW::str_t response; CGW::buffer_t base64data(workload_size), input;\
    try { memcpy(&base64data[0], workload, workload_size);\
      THROW(CGW::b64decode(input, base64data));
      // decode query from base64

#define GEARMAN_WORKER_END } catch(const std::exception &e) { response = e.what(); }\
  catch(CGW::error_t& err) { response = err.get_text().c_str(); }\
    GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));\
    GEARMAN_CHECK(gearman_job_send_data(job, response.c_str(), response.length()));\
    GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size)); }\
  *result_size = 0; *result = GEARMAN_SUCCESS; return NULL; }

GEARMAN_WORKER(create_account) {
  CGW::Ethereum eth;
  response = eth.createAccount(input);
} GEARMAN_WORKER_END;

GEARMAN_WORKER(execute_js) {
  CGW::Ethereum eth;
  response = eth.run(input);
  size_t len = response.length();
  if( len && response[len-1] == '\n')
    len--;  // omit line feed at end
} GEARMAN_WORKER_END;

GEARMAN_WORKER(get_tx_result) {
  CGW::Ethereum eth;
  response = eth.run("web3.eth.getTransactionReceipt('" + input + "')");
  if( response.find("blockNumber") != std::string::npos &&
    response.find("blockHash") != std::string::npos ) {
      size_t len = response.length();
      if( len && response[len-1] == '\n')
        len--;  // omit line feed at end
  }
  else {
    response = "false";
  }
} GEARMAN_WORKER_END;

GEARMAN_WORKER(get_balance) {
  json out= {
    {"script", "get_balance"},
    {"args", {
      {"account", "'" + input + "'"}
    }}
  };

  CGW::Ethereum eth;
  response = eth.runJsonScript(out);
  // execute ethereum command
} GEARMAN_WORKER_END;

GEARMAN_WORKER_B64(key) {
  CGW::cstrptr_t magic = "DidUeaT$oMe$hit?"; // RGlkVWVhVCRvTWUkaGl0Pw==
  if( memcmp(&input[0], magic, strlen(magic)) )
    throw STATUS("*** FUCK YOU ***");
  // strip DDoS attack attempts

  CGW::RSA_pair rsa;
  CGW::RSA_public rsaPublic(rsa.get_public());
  CGW::RSA_private rsaPrivate(rsa.get_private());
  CGW::buffer_t pubBuffer, privBuffer, pubB64, privB64;
  rsaPublic.serialize(pubBuffer);
  rsaPrivate.serialize(privBuffer);
  THROW(CGW::base64encode(pubB64, pubBuffer));
  THROW(CGW::base64encode(privB64, privBuffer));
  response = B2STR(pubB64) + "***" + B2STR(privB64); // GENERATE PAIR */
} GEARMAN_WORKER_END;

GEARMAN_WORKER_B64(make_certificate) {
  auto jdata = json::parse(input);
  // decode JSON

  CGW::str_t account = jdata.at("account").get<CGW::str_t>();
  CGW::str_t password = jdata.at("password").get<CGW::str_t>();
  CGW::u32_t type = jdata.at("type").get<CGW::u32_t>();
  CGW::str_t date = jdata.at("date").get<CGW::str_t>();
  // operator's ethereum account & password

  json out= {
    {"script", "make_certificate"},
    {"args", {
      {"account", "'" + account + "'"},
      {"password", "'" + password + "'"},
      {"type",  "'" + std::to_string(type) + "'"},
      {"date", "'" + date + "'"}
    }}
  };

  CGW::Ethereum eth;
  response = eth.runJsonScript(out);
} GEARMAN_WORKER_END;

GEARMAN_WORKER_B64(make_subject) {
  auto jdata = json::parse(input);
  // decode JSON

  CGW::str_t address = jdata.at("address").get<CGW::str_t>();
  CGW::str_t account = jdata.at("account").get<CGW::str_t>();
  CGW::str_t password = jdata.at("password").get<CGW::str_t>();
  CGW::str_t subj_account = jdata.at("subj_account").get<CGW::str_t>();
  CGW::str_t birthdate = jdata.at("birthdate").get<CGW::str_t>();
  CGW::str_t name = jdata.at("name").get<CGW::str_t>();
  CGW::u32_t gender = jdata.at("gender").get<CGW::u32_t>();
  CGW::u32_t origin = jdata.at("origin").get<CGW::u32_t>();
  // operator's ethereum account & password

  json out= {
    {"script", "add_subject"},
    {"args", {
      {"address", "\"" + address + "\""},
      {"account", "\"" + account + "\""},
      {"password", "\"" + password + "\""},
      {"subj_account", "\"" + subj_account + "\""},
      {"birthdate", "\"" + birthdate + "\""},
      {"name", "\"" + CGW::b64decode(name) + "\""},
      {"gender", "\"" + std::to_string(gender) + "\""},
      {"origin", "\"" + std::to_string(origin) + "\""}
    }}
  };

  CGW::Ethereum eth;
  response = eth.runJsonScript(out);
} GEARMAN_WORKER_END;

GEARMAN_WORKER(testUtf8) {
  response = CGW::b64decode(input);
} GEARMAN_WORKER_END;

GEARMAN_WORKER_B64(get_certificates) {
  auto jdata = json::parse(input);
  // decode JSON

  CGW::str_t addrs("'");
  std::unordered_set<CGW::str_t> addresses =
    jdata.at("addresses").get<std::unordered_set<CGW::str_t>>();
  for( std::unordered_set<CGW::str_t>::iterator itr = addresses.begin();
    itr != addresses.end(); itr++) {
    if( itr != addresses.begin() )
      addrs += "$";
    addrs += *itr;
  }
  addrs += "'";

  json out= {
    {"script", "read_certificates"},
    {"args", {
      {"addresses", addrs}
    }}
  };

  CGW::Ethereum eth;
  response = eth.runJsonScript(out);
} GEARMAN_WORKER_END;

GEARMAN_WORKER_B64(pay) {
  auto jdata = json::parse(input);
  // decode JSON

  CGW::str_t sender = jdata.at("sender").get<CGW::str_t>();
  CGW::str_t password = jdata.at("password").get<CGW::str_t>();
  CGW::str_t receiver = jdata.at("receiver").get<CGW::str_t>();
  CGW::str_t ethers = jdata.at("ethers").get<CGW::str_t>();

  json out= {
    {"script", "pay"},
    {"args", {
      {"sender", "'" + sender + "'"},
      {"password", "'" + password + "'"},
      {"receiver", "'" + receiver + "'"},
      {"ethers", "'" + ethers + "'"}
    }}
  };

  CGW::Ethereum eth;
  response = eth.runJsonScript(out);
} GEARMAN_WORKER_END;

GEARMAN_WORKER_B64(sign) {
  auto jdata = json::parse(input);
  // decode JSON

  CGW::str_t address = jdata.at("address").get<CGW::str_t>();
  CGW::str_t account = jdata.at("account").get<CGW::str_t>();
  CGW::str_t password = jdata.at("password").get<CGW::str_t>();

  json out= {
    {"script", "sign"},
    {"args", {
      {"address", "'" + address + "'"},
      {"account", "'" + account + "'"},
      {"password", "'" + password + "'"}
    }}
  };

  CGW::Ethereum eth;
  response = eth.runJsonScript(out);
} GEARMAN_WORKER_END;

GEARMAN_WORKER_B64(cancel) {
  auto jdata = json::parse(input);
  // decode JSON

  CGW::str_t address = jdata.at("address").get<CGW::str_t>();
  CGW::str_t account = jdata.at("account").get<CGW::str_t>();
  CGW::str_t password = jdata.at("password").get<CGW::str_t>();

  json out= {
    {"script", "cancel"},
    {"args", {
      {"address", "'" + address + "'"},
      {"account", "'" + account + "'"},
      {"password", "'" + password + "'"}
    }}
  };

  CGW::Ethereum eth;
  response = eth.runJsonScript(out);
} GEARMAN_WORKER_END;

GEARMAN_WORKER(get_subject) {
  json out= {
    {"script", "get_subject"},
    {"args", {
      {"address", "'" + input + "'"}
    }}
  };

  CGW::Ethereum eth;
  response = eth.runJsonScript(out);
} GEARMAN_WORKER_END;


GEARMAN_WORKER(secure_js) {
  CGW::buffer_t data, decoded, encoded;
  CGW::hex2buff(input.c_str(), data);

  CGW::RSA_private serverPrivateKey(Settings->serverPrivateKey);
  CGW::codec decoder(NULL, &serverPrivateKey);
  decoder.decrypt(data, decoded);
  // decrypt incoming message with server private key (and SK of course)

  auto jdata = json::parse(decoded);
  // decode JSON

  CGW::buffer_t pubKey;
  CGW::str_t clientB64 = jdata.at("client").get<CGW::str_t>();
  THROW(CGW::base64decode(pubKey, STR2B(clientB64)));
//        CGW_DEBUG("CLIENT HASH: %s", CGW::sha1(pubKey).c_str());
  // get client public key (RSA)

  CGW::str_t hexData = jdata.at("command").get<CGW::str_t>();
  CGW::buffer_t commandBuf;
  CGW::hex2buff(hexData.c_str(), commandBuf);
  CGW::str_t command = B2STR(commandBuf);
//        CGW_DEBUG("COMMAND: %s", command.c_str());
  // get the etherteum command

  CGW::Ethereum eth;
  response = eth.run(command);
  size_t len = response.length();
  if( len && response[len-1] == '\n')
    len--;  // omit line feed at end */
  // execute ethereum command

  data = STR2B(response);
  CGW::RSA_public clientPublicKey(pubKey);
  CGW::codec encoder(&clientPublicKey, NULL);
  encoder.encrypt(data, encoded);
  response = CGW::buff2hex2(encoded);
  // encrypt response with client public key (and SK of course)
} GEARMAN_WORKER_END;

GEARMAN_WORKER(secure_js_script) {
  CGW::buffer_t data, decoded, encoded;
  CGW::hex2buff(input.c_str(), data);
//        CGW_DEBUG("INPUT %lu = %s HASH: %s", data.size(), CGW::buff2hex2(data).c_str(), CGW::sha1(data).c_str());
  // decode query from base64

  CGW::RSA_private serverPrivateKey(Settings->serverPrivateKey);
  CGW::codec decoder(NULL, &serverPrivateKey);
  decoder.decrypt(data, decoded); // */
  // decrypt incoming message with server private key (and SK of course)

  auto jdata = json::parse(decoded);
  // decode JSON

  CGW::buffer_t pubKey;
  CGW::str_t clientB64 = jdata.at("client").get<std::string>();
  THROW(CGW::base64decode(pubKey, STR2B(clientB64)));
//      CGW_DEBUG("CLIENT HASH: %s", CGW::sha1(pubKey).c_str());
  // get client public key (RSA)

  CGW::Ethereum eth;
  response = eth.runJsonScript(jdata);
  // execute ethereum script

  data = STR2B(response);
  CGW::RSA_public clientPublicKey(pubKey);
  CGW::codec encoder(&clientPublicKey, NULL);
  encoder.encrypt(data, encoded);
  response = CGW::buff2hex2(encoded);
  // encrypt response with client public key (and SK of course)
} GEARMAN_WORKER_END;

GEARMAN_WORKER_B64(test) {
  CGW::AES aes(input);
  U8 iv[AES_IV_SIZE];
  memcpy(iv, aes.getIV(), AES_IV_SIZE);

  size_t pos = AES_KEY_SIZE + AES_IV_SIZE;
  CGW::buffer_t base64data, encoded, decoded;
  aes.decrypt(input, decoded, pos);
  aes.setIV(iv);

  aes.encrypt(decoded, encoded);

  base64data.clear();
  THROW(CGW::base64encode(base64data, encoded));
  response = B2STR(base64data);
} GEARMAN_WORKER_END;

GEARMAN_WORKER_B64(execute_js_script) {
  CGW::Ethereum eth;
  response = eth.runJsonScript(input);
} GEARMAN_WORKER_END;

#define ADD_GEARMAN_WORKER(fn) \
  result = gearman_worker_add_function(&worker, #fn, strlen(#fn), worker_##fn, 0);\
  if(result != GEARMAN_SUCCESS) {\
      printf("ERROR while adding function %s -> %s\n", #fn, gearman_worker_error(&worker));\
      exit(1); }

void *worker_builder( void *ptr ) {
    gearman_worker_st worker;
    gearman_worker_create(&worker);

    gearman_worker_set_timeout(&worker, 100);

    gearman_return_t result;
    ADD_GEARMAN_WORKER(create_account);
    ADD_GEARMAN_WORKER(execute_js);
    ADD_GEARMAN_WORKER(execute_js_script);
    ADD_GEARMAN_WORKER(test);
    ADD_GEARMAN_WORKER(testUtf8);
    ADD_GEARMAN_WORKER(key);
    ADD_GEARMAN_WORKER(secure_js);
    ADD_GEARMAN_WORKER(secure_js_script);
    ADD_GEARMAN_WORKER(get_tx_result);
    ADD_GEARMAN_WORKER(pay);
    ADD_GEARMAN_WORKER(make_certificate);
    ADD_GEARMAN_WORKER(make_subject);
    ADD_GEARMAN_WORKER(get_subject);
    ADD_GEARMAN_WORKER(get_certificates);
    ADD_GEARMAN_WORKER(get_balance);
    ADD_GEARMAN_WORKER(sign);
    ADD_GEARMAN_WORKER(cancel);

    gearman_worker_add_server(&worker, "0.0.0.0", 4730);

    while(true) {
        result = gearman_worker_work(&worker);
        if(result == GEARMAN_TIMEOUT) {
        } else if(result != GEARMAN_SUCCESS) {
            printf("%s, %d", "Worker result != GEARMAN_SUCCESS", result);
        }
        usleep(1);
    }
    gearman_worker_free(&worker);
}

#define THREADS 4

int main(void) {
  CGW::AES::init();

  try {
    Settings = new CGW::settings();
  }
  catch(CGW::error_t& error) {
    printf("ERROR %s\n", error.get_text().c_str());
    exit(1);
  };

  //generate_keys();
  pthread_t threads[THREADS];
  for(int i = 0; i < THREADS; i++)
      if(pthread_create(&threads[i], NULL, worker_builder, NULL)) {
          printf("Can't create thread\n");
          exit(1);
      }
  printf("All %d threads created successfully.\n", THREADS);

  for(int i = 0; i < THREADS; i++)
      pthread_join(threads[i], NULL);

  printf("All %d threads finishes their jobs.\n", THREADS); // */
  delete Settings;
  return 0;
}
