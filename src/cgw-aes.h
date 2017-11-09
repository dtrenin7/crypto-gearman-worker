#ifndef CGW_AES
#define CGW_AES

#include "crypto.h"

static const unsigned int AES_KEY_SIZE = 32;
static const unsigned int AES_IV_BLOCK_SIZE = 16;

namespace CGW {

class AES {

  U8 key[AES_KEY_SIZE];       // symmetric key
  U8 iv[AES_IV_BLOCK_SIZE];   // init vector

public:
  static EVP_CIPHER* cipher;

  AES();
  AES(U8 _key[AES_KEY_SIZE], U8 _iv[AES_IV_BLOCK_SIZE]);
  AES(const byte_vector& array, size_t pos = 0);
  virtual ~AES();

  static void init(void) {
    cipher = (EVP_CIPHER*)EVP_aes_256_cbc();
    //AES::block_size = EVP_CIPHER_block_size(aes);
    EVP_add_cipher((const EVP_CIPHER*)cipher);
  };

  void gen_params(void);
  void encrypt(const byte_vector& ptext, byte_vector& ctext, size_t pos = 0);
  void decrypt(const byte_vector& ctext, byte_vector& rtext, size_t pos = 0);
  U8* getKey(void);
  U8* getIV(void);
  void serialize(byte_vector& array, size_t pos = 0);
  void deserialize(const byte_vector& array, size_t pos = 0);
};

}; // namespace CGW

#endif
