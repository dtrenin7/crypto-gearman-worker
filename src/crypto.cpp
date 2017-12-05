#include "crypto.h"
#include "cgw-codec.h"
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
  CGW::AES::init();

  // plaintext, ciphertext, recovered text
  byte_vector ptext,  ctext, rtext;

  int size = 11000000;
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

  CGW::RSA_pair pair;
  CGW::RSA_public p(pair.get_public());
  CGW::RSA_private pr(pair.get_private());


/*  byte_vector p_array, pr_array;
  p.serialize(p_array);
  pr.serialize(pr_array);


  p.encrypt(ptext, ctext);
  pr.decrypt(ctext, rtext);// */


  CGW::codec codec(&p, &pr);
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
