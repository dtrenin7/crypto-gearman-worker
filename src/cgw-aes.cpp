#include "cgw-aes.h"
#include <cstring>

namespace CGW {

AES::AES() {
  gen_params();
}

AES::AES(U8 _key[AES_KEY_SIZE], U8 _iv[AES_IV_BLOCK_SIZE]) {
  memcpy(key, _key, AES_KEY_SIZE);
  memcpy(iv, _iv, AES_IV_BLOCK_SIZE);
}

AES::~AES() {
  OPENSSL_cleanse(key, AES_KEY_SIZE);
  OPENSSL_cleanse(iv, AES_IV_BLOCK_SIZE);  // paranoid?
}


void AES::gen_params(void) {
  int rc = RAND_bytes(key, AES_KEY_SIZE);
  if (rc != 1)
    throw std::runtime_error("RAND_bytes key failed");

  rc = RAND_bytes(iv, AES_IV_BLOCK_SIZE);
  if (rc != 1)
    throw std::runtime_error("RAND_bytes for iv failed");
}

void AES::encrypt(const byte_vector& ptext, byte_vector& ctext) {
  EVP_CIPHER_CTX_free_ptr ctx(EVP_CIPHER_CTX_new(), ::EVP_CIPHER_CTX_free);
  int rc = EVP_EncryptInit_ex(ctx.get(), EVP_aes_256_cbc(), NULL, key, iv);
  if (rc != 1)
    throw std::runtime_error("EVP_EncryptInit_ex failed");

  // Recovered text expands upto BLOCK_SIZE
  ctext.resize(ptext.size() + AES_IV_BLOCK_SIZE);
  int out_len1 = (int)ctext.size();

  rc = EVP_EncryptUpdate(ctx.get(), &ctext[0], &out_len1,
    (const U8*)&ptext[0], (int)ptext.size());
  if (rc != 1)
    throw std::runtime_error("EVP_EncryptUpdate failed");

  int out_len2 = (int)ctext.size() - out_len1;
  rc = EVP_EncryptFinal_ex(ctx.get(), &ctext[0] + out_len1, &out_len2);
  if (rc != 1)
    throw std::runtime_error("EVP_EncryptFinal_ex failed");

  // Set cipher text size now that we know it
  ctext.resize(out_len1 + out_len2);
}

void AES::decrypt(const byte_vector& ctext, byte_vector& rtext) {
  EVP_CIPHER_CTX_free_ptr ctx(EVP_CIPHER_CTX_new(), ::EVP_CIPHER_CTX_free);
  int rc = EVP_DecryptInit_ex(ctx.get(), EVP_aes_256_cbc(), NULL, key, iv);
  if (rc != 1)
    throw std::runtime_error("EVP_DecryptInit_ex failed");

  // Recovered text contracts upto BLOCK_SIZE
  rtext.resize(ctext.size());
  int out_len1 = (int)rtext.size();

  rc = EVP_DecryptUpdate(ctx.get(), &rtext[0], &out_len1,
    (const U8*)&ctext[0], (int)ctext.size());
  if (rc != 1)
    throw std::runtime_error("EVP_DecryptUpdate failed");

  int out_len2 = (int)rtext.size() - out_len1;
  rc = EVP_DecryptFinal_ex(ctx.get(), &rtext[0]+out_len1, &out_len2);
  if (rc != 1)
    throw std::runtime_error("EVP_DecryptFinal_ex failed");

  // Set recovered text size now that we know it
  rtext.resize(out_len1 + out_len2);
}

U8* AES::getKey(void) {
  return &key[0];
}

U8* AES::getIV(void) {
  return &iv[0];
}

}; // namespace CGW
