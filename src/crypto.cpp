#include <memory>
#include <vector>
using std::unique_ptr;
using std::vector;

#include <openssl/bn.h>
#include <openssl/rsa.h>

#include <cassert>
#include <string.h>
#define ASSERT assert

using BN_ptr = std::unique_ptr<BIGNUM, decltype(&::BN_free)>;
using RSA_ptr = std::unique_ptr<RSA, decltype(&::RSA_free)>;

typedef unsigned char U8;

U8* RSA_EncodePublic(RSA* rsa, int* len) {
  U8 *buf, *next;
  *len = i2d_RSAPublicKey(rsa, NULL);
  buf = next = (U8*)OPENSSL_malloc(*len);
  i2d_RSAPublicKey(rsa, &next);
  return buf;
}

RSA* RSA_DecodePublic(U8* buf, long len) {
  return d2i_RSAPublicKey(NULL, const_cast<const U8**>(&buf), len);
}

U8* RSA_EncodePrivate(RSA* rsa, int* len) {
  U8 *buf, *next;
  *len = i2d_RSAPrivateKey(rsa, NULL);
  buf = next = (U8*)OPENSSL_malloc(*len);
  i2d_RSAPrivateKey(rsa, &next);
  return buf;
}

RSA* RSA_DecodePrivate(U8* buf, long len) {
  return d2i_RSAPrivateKey(NULL, const_cast<const U8**>(&buf), len);
}

void generate_keys() {
  int rc;

  RSA_ptr rsa(RSA_new(), ::RSA_free);
  BN_ptr bn(BN_new(), ::BN_free);

  rc = BN_set_word(bn.get(), RSA_F4);
  ASSERT(rc == 1);

  rc = RSA_generate_key_ex(rsa.get(), 2048, bn.get(), NULL);
  ASSERT(rc == 1);

  RSA_ptr rsa_pub(RSAPublicKey_dup(rsa.get()), ::RSA_free);
  RSA_ptr rsa_priv(RSAPrivateKey_dup(rsa.get()), ::RSA_free);

  int len = 0;
  U8* pub = RSA_EncodePublic(rsa_pub.get(), &len);
  printf("PUB LEN = %ld", len);
  // dump public key from RSA struct into binary array

  RSA* pub2 = RSA_DecodePublic(pub, len);
  // make RSA struct with public key from binary array

  for(int i = 0; i < len; i++)
    printf("%02X ", pub[i]);

  printf("\nPUBLIC ORIGIN\n");
  RSA_print_fp(stdout, rsa_pub.get(), 0);

  printf("\nPUBLIC COPY\n");
  RSA_print_fp(stdout, pub2, 0);



  int len2 = 0;
  U8* priv = RSA_EncodePrivate(rsa_priv.get(), &len2);
  printf("PRIV LEN = %ld", len2);
  // dump private key from RSA struct into binary array

  RSA* priv2 = RSA_DecodePrivate(priv, len2);
  // make RSA struct with private key from binary array

  for(int i = 0; i < len2; i++)
    printf("%02X ", priv[i]);

  printf("\nPRIVATE ORIGIN\n");
  RSA_print_fp(stdout, rsa_priv.get(), 0);

  printf("\nPRIVATE COPY\n");
  RSA_print_fp(stdout, priv2, 0);

}
