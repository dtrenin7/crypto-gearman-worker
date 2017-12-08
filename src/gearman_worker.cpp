#include <libgearman/gearman.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <string>

#include "crypto.h"
#include "cgw-ethereum.h"
#include "cgw-utils.h"
#include "cgw-uri.h"
#include "cgw-log.h"
#include "cgw-codec.h"
#include "json.hpp"

using json = nlohmann::json;

#define GEARMAN_CHECK(x) if(gearman_failed(x)) { *result_size = 0; *result = GEARMAN_ERROR; return NULL; }

void* worker_create_account(gearman_job_st* job, void* context, size_t* result_size, gearman_return_t* result) {
    const char* workload = (const char*)gearman_job_workload(job);
    size_t workload_size = gearman_job_workload_size(job);
    if(workload && workload_size) {
        std::string password(workload, workload_size);

        GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));
        // start progress count

        CGW::Ethereum eth;
        std::string account = eth.createAccount(password);
        GEARMAN_CHECK(gearman_job_send_data(job, account.c_str(), account.length()));
        // send result

        GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size));
        // end progress count
    }
    *result_size = 0;
    *result = GEARMAN_SUCCESS;
    return NULL;
}

void* worker_execute_js(gearman_job_st* job, void* context, size_t* result_size, gearman_return_t* result) {
    const char* workload = (const char*)gearman_job_workload(job);
    size_t workload_size = gearman_job_workload_size(job);
    if(workload && workload_size) {
        std::string command(workload, workload_size);

        GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));
        // start progress count

        CGW::Ethereum eth;
        std::string response = eth.run(command);
        size_t len = response.length();
        if( len && response[len-1] == '\n')
          len--;  // omit line feed at end
        GEARMAN_CHECK(gearman_job_send_data(job, response.c_str(), len));
        // send result

        GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size));
        // end progress count
    }
    *result_size = 0;
    *result = GEARMAN_SUCCESS;
    return NULL;
}

void* worker_generate_rsa_pair(gearman_job_st* job, void* context, size_t* result_size, gearman_return_t* result) {
    const char* workload = (const char*)gearman_job_workload(job);
    size_t workload_size = gearman_job_workload_size(job);
    if(workload && workload_size) {
      CGW::error_t error;
      CGW::str_t response;
      CGW::buffer_t base64data(workload_size), data;
      try {
        memcpy(&base64data[0], workload, workload_size);
        THROW(CGW::b64decode(data, base64data));
        // decode query from base64

        CGW::cstrptr_t magic = "DidUeaT$oMe$hit?"; // RGlkVWVhVCRvTWUkaGl0Pw==
        if( memcmp(&data[0], magic, strlen(magic)) )
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
      }
      catch(const std::exception &e) {
        response = e.what();
      }
      catch(CGW::error_t& err) {
        response = err.get_text().c_str();
      }

      GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));
      // start progress count

      GEARMAN_CHECK(gearman_job_send_data(job, response.c_str(), response.length()));
      // send result

      GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size));
      // end progress count
    }
    *result_size = 0;
    *result = GEARMAN_SUCCESS;
    return NULL;
}

void* worker_secure_js(gearman_job_st* job, void* context, size_t* result_size, gearman_return_t* result) {
    const char* workload = (const char*)gearman_job_workload(job); // WORK_IS_HERE
    size_t workload_size = gearman_job_workload_size(job);
    if(workload && workload_size) {
      CGW::error_t error;
      CGW::str_t response;
      std::string hexData(workload, workload_size);
      CGW::buffer_t data, decoded, encoded, sessionKey;
      try {
        //memcpy(&base64data[0], workload, workload_size);
        //THROW(CGW::b64decode(data, base64data));
        // decode query from base64

//        std::string hexData(workload, workload_size);
//        for( CGW::u32_t i = 0, j = hexData.length(); i < j; i++ )
//            hexData[i] = tolower(hexData[i]);

        CGW::hex2buff(hexData.c_str(), data);
        CGW_DEBUG("INPUT %lu = %s HASH: %s", data.size(), CGW::buff2hex2(data).c_str(), CGW::sha1(data).c_str());
        // decode query from base64

        CGW::buffer_t privKey;
        CGW::str_t privateB64("MIICXAIBAAKBgQCxBPm2juRg8V5bLptl6SaecEryLor5qYwyaRnPgdE18R0gxrokimOJC9M8ElzDVx5zVnsyKdyidaUOnAHyPXk26BXcDiY2i8/47II9ZqAZjwZ+dEJe82nbsf0qvjPQ20LUB/G5cCFBdp4H+cIYxaMCFDh72l00GFT5LgY74mBevwIDAQABAoGBAKdfCfA3aO3UKZ/TEHEqIi6aA/K6WQK38WvUfef6WWJESIMuAt/7zSLOAHqC7hxwKcVp1m/WrtsYmuiWTyzIPOs9tWUeOqt6qJWU6XF0vO2yDin361x1bh13S8sJFJv6kuqdmp/XNFwzlwWGzzlyq1yOJk8aR0NrqpqdNKtwKyEpAkEA6yqR4x0BvhCeCq8OPb9lU6rvuYR6aeWXSpB9btBa7xYi0VxQ6P1gcUXhA8bru1o85XKSf+05Zc3vs9DbFnlW8wJBAMCzq3zzC/0UjACDOnh5pCcU3I03htv+K/tXwz1rJhuj5/bLW6OEhba7WIRsYe0b/lvSce8KhLKX7uJzLj/6pAUCQQCgUWcfU3kKn71+PxUQV1i2j0PaT0w8wT5AoPxB/VzgvVCDNdIa5BFJZ4Ac2RF/qeb17QOenpSQqLIO/gU97v6tAkBRhLAq73ZG3YZMQTde97ZlggG7C55VOjTI4tuJA+bfEntyf5yIk+ss3hwYCPF0KL91gJUKFl0EYBmCWk9aaWExAj8sMaAxb9i/10BbbXrwRrU0s/0BTnTV47KloMUHmryIY1HnqeL4o483u7UuW2O/s3lK+Djns6tQtrfSGkPgJts=");
        THROW(CGW::base64decode(privKey, STR2B(privateB64)));
        CGW_DEBUG("PRIV KEY DECODED %lu HASH %s", privKey.size(), CGW::sha1(privKey).c_str());

        CGW::RSA_private serverPrivateKey(privKey);
        CGW_DEBUG("PRIV KEY ASSIGNED");

        serverPrivateKey.decrypt(data, sessionKey);
//        CGW::codec decoder(NULL, &serverPrivateKey);
//        decoder.decrypt(data, decoded); // */

        response = CGW::buff2hex2(sessionKey);
      }
      catch(const std::exception &e) {
        response = e.what();
      }
      catch(CGW::error_t& err) {
        response = err.get_text().c_str();
      }

      GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));
      // start progress count

      GEARMAN_CHECK(gearman_job_send_data(job, response.c_str(), response.length()));
      // send result

      GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size));
      // end progress count
    }
    *result_size = 0;
    *result = GEARMAN_SUCCESS;
    return NULL;
}

void* worker_test(gearman_job_st* job, void* context, size_t* result_size, gearman_return_t* result) {
    const char* workload = (const char*)gearman_job_workload(job);
    size_t workload_size = gearman_job_workload_size(job);
    if(workload && workload_size) {
      CGW::error_t error;
      CGW::str_t response;
      CGW::buffer_t base64data(workload_size), data, decoded, encoded;
      try {
        memcpy(&base64data[0], workload, workload_size);

        THROW(CGW::b64decode(data, base64data));
        // decode query from base64

        CGW::AES aes(data);
        U8 iv[AES_IV_SIZE];
        memcpy(iv, aes.getIV(), AES_IV_SIZE);

        size_t pos = AES_KEY_SIZE + AES_IV_SIZE;
        aes.decrypt(data, decoded, pos);
        aes.setIV(iv);

        aes.encrypt(decoded, encoded);

        base64data.clear();
        THROW(CGW::base64encode(base64data, encoded));
        response = B2STR(base64data);
      }
      catch(const std::exception &e) {
        response = e.what();
      }
      catch(CGW::error_t& err) {
        response = err.get_text().c_str();
      }
      /*catch(const CryptoPP::Exception& e)
      {
        response = e.what();
        encoded.resize(response.length());
        memcpy(&encoded[0], response.c_str(), response.length());
      }*/;

      GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));
      // start progress count

      GEARMAN_CHECK(gearman_job_send_data(job, response.c_str(), response.length()));
      // send result

      GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size));
      // end progress count
    }
    *result_size = 0;
    *result = GEARMAN_SUCCESS;
    return NULL;
}

void* worker_execute_js_script(gearman_job_st* job, void* context, size_t* result_size, gearman_return_t* result) {
    const char* workload = (const char*)gearman_job_workload(job);
    size_t workload_size = gearman_job_workload_size(job);
    if(workload && workload_size) {
        GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));
        // start progress count

        std::string response;
        try {
          CGW::error_t error;
          CGW::buffer_t base64data(workload_size), jsondata, uriencoded;
          memcpy(&base64data[0], workload, workload_size);
          THROW(CGW::base64decode(jsondata, base64data));
          //THROW(CGW::base64decode(uriencoded, base64data));
          // decode query from base64

          //THROW(CGW::UriDecodeBuffer(uriencoded, jsondata));
          // decode UriEncoded into raw JSON

          auto data = json::parse(jsondata);
          CGW::str_t script_name = data.at("script").get<std::string>();

          CGW::Ethereum eth;
          CGW::str_t script_template;
          THROW(CGW::file2string(eth.getScriptPath(script_name).c_str(), script_template));
          // load script template

          auto args = data.at("args");
          bool noremove = false;
          for( json::iterator arg = args.begin(); arg != args.end(); ++arg ) {
            CGW::str_t key("$$$" + arg.key() + "$$$");
            CGW::str_t value(arg.value().get<std::string>());
            if( key == "$$$noremove$$$" ) // reserved keyword
              noremove = true;
            else
              CGW::replace_substring(script_template, key.c_str(), value);
             //response += (arg.key() + " : " + arg.value().get<std::string>() + "\n");
          }
          // patch script template

          CGW::str_t temp_script_name = script_name + CGW::random_str(4);
          CGW::str_t temp_script_path = eth.getScriptPath(temp_script_name);
          THROW(CGW::write_file(temp_script_path.c_str(), script_template));
          // save patched script on temporary location

          response = eth.runScript(temp_script_name);
          if( !noremove )
            remove(temp_script_path.c_str());
        }
        catch(const std::exception &e) {
          response = e.what();
        }
        catch(CGW::error_t& err) {
          response = err.get_text().c_str();
        };

        size_t len = response.length();
        if( len && response[len-1] == '\n')
          len--;  // omit line feed at end
        GEARMAN_CHECK(gearman_job_send_data(job, response.c_str(), len));
        // send result

        GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size));
        // end progress count
    }
    *result_size = 0;
    *result = GEARMAN_SUCCESS;
    return NULL;
}

#define add_worker_function(fn_name, fn) \
  result = gearman_worker_add_function(&worker, fn_name, strlen(fn_name), fn, 0);\
  if(result != GEARMAN_SUCCESS) {\
      printf("ERROR while adding function %s -> %s\n", fn_name, gearman_worker_error(&worker));\
      exit(1); }

void *worker_builder( void *ptr ) {
    gearman_worker_st worker;
    gearman_worker_create(&worker);

    gearman_worker_set_timeout(&worker, 100);

    gearman_return_t result;
    add_worker_function("create_account", worker_create_account);
    add_worker_function("execute_js", worker_execute_js);
    add_worker_function("execute_js_script", worker_execute_js_script);
    add_worker_function("test", worker_test);
    add_worker_function("key", worker_generate_rsa_pair);
    add_worker_function("secure_js", worker_secure_js);

    gearman_worker_add_server(&worker, "localhost", 4730);

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
  return 0;
}
