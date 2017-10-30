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

void RSA_pair::encrypt(const byte_vector& ptext, byte_vector& ctext) {
}

void RSA_pair::decrypt(const byte_vector& ctext, byte_vector& rtext) {
}

RSA* RSA_pair::get_public(void) {
  return RSAPublicKey_dup(rsa.get());
}

RSA* RSA_pair::get_private(void) {
  return RSAPrivateKey_dup(rsa.get());
}
// ============================================================================
}; // namespace CGW
