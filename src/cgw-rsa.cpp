#include "cgw-rsa.h"
#include <cstring>


namespace CGW {
// ============================================================================
RSA_public::RSA_public() : rsa(RSA_new(), ::RSA_free) {
}

RSA_public::RSA_public(RSA* _rsa) : rsa(_rsa, ::RSA_free) {
}

RSA_public::RSA_public(U8* buf, long len) :
  rsa(d2i_RSAPublicKey(NULL, const_cast<const U8**>(&buf), len), ::RSA_free) {
}

RSA_public::~RSA_public() {
}

RSA* RSA_public::get(void) {
  return rsa.get();
}

void RSA_public::serialize(byte_vector& array) {
  long len = i2d_RSAPublicKey(rsa.get(), NULL);
  array.resize(len);
  U8 *next = &array[0];
  i2d_RSAPublicKey(rsa.get(), &next);
}

void RSA_public::encrypt(const byte_vector& ptext, byte_vector& ctext) {
  ctext.resize(RSA_size(rsa.get()));
  if( RSA_public_encrypt(ptext.size(), &ptext[0], &ctext[0], rsa.get(),
    RSA_PKCS1_OAEP_PADDING) < 0 ) {
      printf("ERROR: %s\n", ERR_error_string(ERR_get_error(), NULL));
      throw std::runtime_error("RSA_public_encrypt failed");
    }
}
// ============================================================================
RSA_private::RSA_private() : rsa(RSA_new(), ::RSA_free) {
}

RSA_private::RSA_private(RSA* _rsa) : rsa(_rsa, ::RSA_free) {
}

RSA_private::RSA_private(U8* buf, long len) :
  rsa(d2i_RSAPrivateKey(NULL, const_cast<const U8**>(&buf), len), ::RSA_free) {
}

RSA_private::~RSA_private() {
}

RSA* RSA_private::get(void) {
  return rsa.get();
}

void RSA_private::serialize(byte_vector& array) {
  long len = i2d_RSAPrivateKey(rsa.get(), NULL);
  array.resize(len);
  U8* next = &array[0];
  i2d_RSAPrivateKey(rsa.get(), &next);
}

void RSA_private::decrypt(const byte_vector& ctext, byte_vector& rtext) {
  rtext.resize(ctext.size());
  int len = RSA_private_decrypt(ctext.size(), &ctext[0], &rtext[0], rsa.get(),
    RSA_PKCS1_OAEP_PADDING);
  if( len < 0 ) {
    printf("ERROR: %s\n", ERR_error_string(ERR_get_error(), NULL));
    throw std::runtime_error("RSA_private_decrypt failed");
  }
  rtext.resize(len);
}
// ============================================================================
RSA_pair::RSA_pair() :
  rsa(RSA_new(), ::RSA_free),
  bn(BN_new(), ::BN_free) {
  gen_params();
}

RSA_pair::~RSA_pair() {
}

void RSA_pair::gen_params(void) {
  int rc = BN_set_word(bn.get(), RSA_F4);
  ASSERT(rc == 1);

  rc = RSA_generate_key_ex(rsa.get(), 2048, bn.get(), NULL);
  ASSERT(rc == 1);
}
// SSL error 110 = size too big (~210 bytes max)
// encryption may be reversed private --> public
void RSA_pair::encrypt(const byte_vector& ptext, byte_vector& ctext) {
  ctext.resize(RSA_size(rsa.get()));
  if( RSA_public_encrypt(ptext.size(), &ptext[0], &ctext[0], rsa.get(),
    RSA_PKCS1_OAEP_PADDING) < 0 ) {
      printf("ERROR: %s\n", ERR_error_string(ERR_get_error(), NULL));
      throw std::runtime_error("RSA_public_encrypt failed");
    }
}

void RSA_pair::decrypt(const byte_vector& ctext, byte_vector& rtext) {
  rtext.resize(ctext.size());
  int len = RSA_private_decrypt(ctext.size(), &ctext[0], &rtext[0], rsa.get(),
    RSA_PKCS1_OAEP_PADDING);
  if( len < 0 ) {
    printf("ERROR: %s\n", ERR_error_string(ERR_get_error(), NULL));
    throw std::runtime_error("RSA_private_decrypt failed");
  }
  rtext.resize(len);
}

RSA* RSA_pair::get_public(void) {
  return RSAPublicKey_dup(rsa.get());
}

RSA* RSA_pair::get_private(void) {
  return RSAPrivateKey_dup(rsa.get());
}
// ============================================================================
}; // namespace CGW
