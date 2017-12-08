#include "crypto.h"
#include "cgw-codec.h"
#include "cgw-utils.h"
#include "cgw-ethereum.h"

#include <cstdio>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <array>
#include "json.hpp"

std::string exec(const char* cmd) {
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

std::string createAccount(std::string password) {
  std::string address = exec(("geth attach ipc:/db/geth.ipc --datadir /db --exec \"personal.newAccount('" + password + "')\"").c_str());
  size_t pos = address.find("0x"), addrlen = 42;
  if( pos == std::string::npos || address.length() < pos + addrlen )
    throw std::runtime_error("createAccount() failed!");
  return address.substr(pos, addrlen);
}

void generate_keys() {
  // Load the necessary cipher
//  CGW::AES::init();

  // plaintext, ciphertext, recovered text
  CGW::buffer_t ptext,  ctext, rtext;

  int size = 48;
  ptext.resize(size);
  for(int i = 0; i < size; i++) {
    ptext[i] = i % 256;
  }

  /*CGW::AES aes;
  //for( int i = 0; i < 100; i++)
  {
    aes.encrypt(ptext, ctext);
    aes.decrypt(ctext, rtext);
  }


   /*printf("\nAES ORIGIN\n");
  for(int i = 0; i < ptext.size(); i++)
    printf("%02X ", ptext[i]);

  printf("\nAES ENCODED\n");
  for(int i = 0; i < ctext.size(); i++)
    printf("%02X ", ctext[i]);

  printf("\nAES DECODED\n");
  for(int i = 0; i < rtext.size(); i++)
    printf("%02X ", rtext[i]);// */


  //==========================================================

//  CGW::RSA_pair pair;
//  CGW::RSA_public p(pair.get_public());
//  CGW::RSA_private pr(pair.get_private());

  CGW::buffer_t p_array, pr_array;
  CGW::str_t publicB64("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxBPm2juRg8V5bLptl6SaecEryLor5qYwyaRnPgdE18R0gxrokimOJC9M8ElzDVx5zVnsyKdyidaUOnAHyPXk26BXcDiY2i8/47II9ZqAZjwZ+dEJe82nbsf0qvjPQ20LUB/G5cCFBdp4H+cIYxaMCFDh72l00GFT5LgY74mBevwIDAQAB");
  CGW::str_t privateB64("MIICXAIBAAKBgQCxBPm2juRg8V5bLptl6SaecEryLor5qYwyaRnPgdE18R0gxrokimOJC9M8ElzDVx5zVnsyKdyidaUOnAHyPXk26BXcDiY2i8/47II9ZqAZjwZ+dEJe82nbsf0qvjPQ20LUB/G5cCFBdp4H+cIYxaMCFDh72l00GFT5LgY74mBevwIDAQABAoGBAKdfCfA3aO3UKZ/TEHEqIi6aA/K6WQK38WvUfef6WWJESIMuAt/7zSLOAHqC7hxwKcVp1m/WrtsYmuiWTyzIPOs9tWUeOqt6qJWU6XF0vO2yDin361x1bh13S8sJFJv6kuqdmp/XNFwzlwWGzzlyq1yOJk8aR0NrqpqdNKtwKyEpAkEA6yqR4x0BvhCeCq8OPb9lU6rvuYR6aeWXSpB9btBa7xYi0VxQ6P1gcUXhA8bru1o85XKSf+05Zc3vs9DbFnlW8wJBAMCzq3zzC/0UjACDOnh5pCcU3I03htv+K/tXwz1rJhuj5/bLW6OEhba7WIRsYe0b/lvSce8KhLKX7uJzLj/6pAUCQQCgUWcfU3kKn71+PxUQV1i2j0PaT0w8wT5AoPxB/VzgvVCDNdIa5BFJZ4Ac2RF/qeb17QOenpSQqLIO/gU97v6tAkBRhLAq73ZG3YZMQTde97ZlggG7C55VOjTI4tuJA+bfEntyf5yIk+ss3hwYCPF0KL91gJUKFl0EYBmCWk9aaWExAj8sMaAxb9i/10BbbXrwRrU0s/0BTnTV47KloMUHmryIY1HnqeL4o483u7UuW2O/s3lK+Djns6tQtrfSGkPgJts=");
  CGW::base64decode(p_array, STR2B(publicB64));
  CGW::base64decode(pr_array, STR2B(privateB64));

  //p.serialize(p_array);
  //pr.serialize(pr_array);

  CGW::RSA_public pubKey(p_array);
  CGW::RSA_private privKey(pr_array);

  pubKey.encrypt(ptext, ctext);
  privKey.decrypt(ctext, rtext);// */


/*  CGW::codec codec(&p, &pr);
  codec.encrypt(ptext, ctext);
  codec.decrypt(ctext, rtext);// */

  if( rtext.size() )
    printf("\nRESULT %s\n", memcmp(&ptext[0], &rtext[0], size) ? "NOT MATCHES" : "MATCHES" );
  else
    printf("\nERROR!\n");

/*  CGW::Ethereum eth;
  printf("\nUNLOCK ACCOUNT: %s\n", eth.unlockAccount("0x2c5c47a47efc6932a5f9eb367aed245907cc8ab3", "123").c_str());
  printf("\nLOCK ACCOUNT: %s\n", eth.lockAccount("0x2c5c47a47efc6932a5f9eb367aed245907cc8ab3").c_str());

  printf("\nRUN SCRIPT: %s\n", eth.runScript("test.js").c_str());


/*  CGW::RSA_public p_copy(&p_array[0], p_array.size());
  CGW::RSA_private pr_copy(&pr_array[0], pr_array.size());

  printf("\nPUBLIC ORIGIN\n");
  RSA_print_fp(stdout, p.get(), 0);

  printf("\nPUBLIC COPY\n");
  RSA_print_fp(stdout, p_copy.get(), 0);

  printf("\nPRIVATE ORIGIN\n");
  RSA_print_fp(stdout, pr.get(), 0);

  printf("\nPRIVATE COPY\n");
  RSA_print_fp(stdout, pr_copy.get(), 0); //*/
}
