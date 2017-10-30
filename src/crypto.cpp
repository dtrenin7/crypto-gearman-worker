#include "crypto.h"
#include "cgw-aes.h"
#include "cgw-rsa.h"

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
  // Load the necessary cipher
  CGW::AES::init();

  // plaintext, ciphertext, recovered text
  byte_vector ptext = {0xde, 0xad, 0xbe, 0xef},  ctext, rtext;

  CGW::AES aes;
  aes.encrypt(ptext, ctext);
  aes.decrypt(ctext, rtext);

  printf("\nAES ORIGIN\n");
  for(int i = 0; i < ptext.size(); i++)
    printf("%02X ", ptext[i]);

  printf("\nAES ENCODED\n");
  for(int i = 0; i < ctext.size(); i++)
    printf("%02X ", ctext[i]);

  printf("\nAES DECODED\n");
  for(int i = 0; i < rtext.size(); i++)
    printf("%02X ", rtext[i]);

  //==========================================================

  CGW::RSA_pair pair;
  CGW::RSA_public p(pair.get_public());
  CGW::RSA_private pr(pair.get_private());
  byte_vector p_array, pr_array;
  p.serialize(p_array);
  pr.serialize(pr_array);

  CGW::RSA_public p_copy(&p_array[0], p_array.size());
  CGW::RSA_private pr_copy(&pr_array[0], pr_array.size());

  printf("\nPUBLIC ORIGIN\n");
  RSA_print_fp(stdout, p.get(), 0);

  printf("\nPUBLIC COPY\n");
  RSA_print_fp(stdout, p_copy.get(), 0);

  printf("\nPRIVATE ORIGIN\n");
  RSA_print_fp(stdout, pr.get(), 0);

  printf("\nPRIVATE COPY\n");
  RSA_print_fp(stdout, pr_copy.get(), 0);
}
