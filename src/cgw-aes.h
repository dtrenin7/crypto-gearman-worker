#ifndef CGW_AES
#define CGW_AES

#include "crypto.h"
#include "cgw-types.h"

#include <cryptopp/cryptlib.h>
#include <cryptopp/hex.h>
#include <cryptopp/filters.h>
#include <cryptopp/modes.h>
#include <cryptopp/aes.h>
#include <cryptopp/ccm.h>

//#define AES_OPERATION_MODE  EVP_aes_256_ctr()
#define AES_OPERATION_MODE  EVP_aes_256_cbc()

static const unsigned int AES_KEY_SIZE = 32;
static const unsigned int AES_IV_SIZE = 16;

namespace CGW {


class AES {

  U8 key[AES_KEY_SIZE];       // symmetric key
  U8 iv[AES_IV_SIZE];   // init vector
  int padding;

public:
  static EVP_CIPHER* cipher;

  AES();
  AES(U8* _key, U8* _iv);
  AES(const buffer_t& array, size_t pos = 0);
  virtual ~AES();

  static void init(void) {
    //cipher = (EVP_CIPHER*)EVP_aes_256_ctr();
    cipher = (EVP_CIPHER*)AES_OPERATION_MODE;
    //AES::block_size = EVP_CIPHER_block_size(aes);
    EVP_add_cipher((const EVP_CIPHER*)cipher);
  };

  void gen_params(void);
  void pad(buffer_t& data, size_t boundary);
  void encrypt(buffer_t& ptext, buffer_t& ctext, size_t pos = 0);
  void decrypt(const buffer_t& ctext, buffer_t& rtext, size_t pos = 0);
//  void encrypt2(buffer_t& ptext, buffer_t& ctext, size_t pos = 0); // crypto++
//  void decrypt2(const buffer_t& ctext, buffer_t& rtext, size_t pos = 0);
  U8* getKey(void);
  U8* getIV(void);
  void setIV(U8* _iv);
  void serialize(buffer_t& array, size_t pos = 0);
  void deserialize(const buffer_t& array, size_t pos = 0);
};

}; // namespace CGW

#endif
