#include "cgw-rsa.h"
#include "cgw-error.h"
#include "cgw-utils.h"
#include "cgw-log.h"
#include <cstring>
#include <stdio.h>

namespace CGW {
// ============================================================================

//using EVP_KEY_ptr = std::unique_ptr<EVP_PKEY, decltype(&::EVP_PKEY_free)>;

RSA_public::RSA_public() : rsa(RSA_new(), ::RSA_free) {
}

RSA_public::RSA_public(RSA* _rsa) : rsa(_rsa, ::RSA_free) {
}

RSA_public::RSA_public(u8_t* buf, size_t len) :
  rsa(d2i_RSA_PUBKEY(NULL, const_cast<const U8**>(&buf), (long)len), ::RSA_free) {
}

RSA_public::RSA_public(buffer_t& buffer) : RSA_public(&buffer[0], buffer.size()) {
  CGW_DEBUG("RSA PUBLIC KEY: %lu = %s", buffer.size(), buff2hex2(buffer).c_str());
}

RSA_public::~RSA_public() {
}

RSA* RSA_public::get(void) {
  return rsa.get();
}

void RSA_public::serialize(buffer_t& array) {
  long len = i2d_RSA_PUBKEY(rsa.get(), NULL); // PKCS#8 (ASN.1 with meth)
  array.resize(len);
  U8 *next = &array[0];// i2d_RSA_PUBKEY
  i2d_RSA_PUBKEY(rsa.get(), &next); //*/
//  array.resize(4096);
//  FILE* fp = fmemopen(&array[0], 4096, "w");
//  if( !fp )
//    throw STATUS("Can't open memory file");

// Convert RSA to PKEY
/*  EVP_KEY_ptr pkey(EVP_PKEY_new(), ::EVP_PKEY_free);
  ASSERT(EVP_PKEY_set1_RSA(pkey.get(), rsa.get()) == 1);

  BIO *bio = BIO_new(BIO_s_mem());
  if( !PEM_write_bio_PUBKEY(bio, pkey.get()) )
    throw STATUS("Error writing public key");
  size_t size = BIO_pending(bio);
  array.resize(size + 1);
  BIO_read(bio, &array[0], size);
  array[size] = 0;
  BIO_free_all(bio); */

//  size_t size = (size_t)ftell(fp);
  //fflush(fp);
//  fclose(fp);
//  array.resize(size); // */
}

void RSA_public::encrypt(const buffer_t& ptext, buffer_t& ctext, size_t pos) {
  ctext.resize(pos + RSA_size(rsa.get()));
  int len = RSA_public_encrypt(ptext.size(), &ptext[0], &ctext[pos], rsa.get(),
    RSA_PADDING);
//  printf("\nRSA_public::encrypt: %lu >= %ld at %lu\n", ctext.size(), len, pos);

  if( len < 0 ) {
      printf("ERROR: %s\n", ERR_error_string(ERR_get_error(), NULL));
      throw std::runtime_error("RSA_public_encrypt failed");
    }
}
// ============================================================================
RSA_private::RSA_private() : rsa(RSA_new(), ::RSA_free) {
}

RSA_private::RSA_private(RSA* _rsa) : rsa(_rsa, ::RSA_free) {
}

RSA_private::RSA_private(u8_t* buf, size_t len) :
  rsa(RSA_LOAD_PRIVATE_KEY(NULL, const_cast<const u8_t**>(&buf), (long)len), ::RSA_free) {
    /*
    static EVP_PKEY *load_example_rsa_key(void)
    {
        EVP_PKEY *ret = NULL;
        const unsigned char *derp = kExampleRSAKeyDER;
        EVP_PKEY *pkey = NULL;
        RSA *rsa = NULL;

        if (!TEST_true(d2i_RSAPrivateKey(&rsa, &derp, sizeof(kExampleRSAKeyDER))))
            return NULL;

        if (!TEST_ptr(pkey = EVP_PKEY_new())
                || !TEST_true(EVP_PKEY_set1_RSA(pkey, rsa)))
            goto end;

        ret = pkey;
        pkey = NULL;

    end:
        EVP_PKEY_free(pkey);
        RSA_free(rsa);

        return ret;    */
}

RSA_private::RSA_private(buffer_t& buffer) : RSA_private(&buffer[0], buffer.size()) {
//  CGW_DEBUG("RSA PRIVATE KEY: %lu = %s", buffer.size(), buff2hex2(buffer).c_str());
}

RSA_private::~RSA_private() {
}

RSA* RSA_private::get(void) {
  return rsa.get();
}

void RSA_private::serialize(buffer_t& array) {
  long len = RSA_SAVE_PRIVATE_KEY(rsa.get(), NULL);
  array.resize(len);
  U8* next = &array[0];
  RSA_SAVE_PRIVATE_KEY(rsa.get(), &next); //*/

  /*array.resize(4096);
  FILE* fp = fmemopen(&array[0], 4096, "w");
  if( !fp )
    throw STATUS("Can't open memory file");
  size_t size = (size_t)PEM_write_RSAPublicKey(fp, rsa.get());
  if( !size )
    throw STATUS("Error writing public key");
  //fflush(fp);
  fclose(fp);
  //array.resize(size); */
}

void RSA_private::decrypt(const buffer_t& ctext, buffer_t& rtext, size_t pos, size_t clen) {
  if( !clen )
    clen = ctext.size() - pos;
  CGW_DEBUG("RSA DECRYPT %lu AT %lu", clen, pos);
  rtext.resize(clen);
  int len = RSA_private_decrypt(clen, &ctext[pos], &rtext[0], rsa.get(),
    RSA_PADDING);
  CGW_DEBUG("DECRYPTED %ld", len);
  if( len < 0 ) {
    ERR_load_crypto_strings();
    //ERR_error_string(ERR_get_error(), err);
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
  if(rc != 1) {
    printf("ERROR: %s\n", ERR_error_string(ERR_get_error(), NULL));
    throw std::runtime_error("BN_set_word failed");
  }

  rc = RSA_generate_key_ex(rsa.get(), 1024, bn.get(), NULL);
  if(rc != 1) {
    printf("ERROR: %s\n", ERR_error_string(ERR_get_error(), NULL));
    throw std::runtime_error("RSA_generate_key_ex failed");
  }
}
// SSL error 110 = size too big (~210 bytes max)
// encryption may be reversed private --> public
void RSA_pair::encrypt(const buffer_t& ptext, buffer_t& ctext, size_t pos) {
  ctext.resize(pos + RSA_size(rsa.get()));
  if( RSA_public_encrypt(ptext.size(), &ptext[0], &ctext[pos], rsa.get(),
    RSA_PADDING) < 0 ) {
      printf("ERROR: %s\n", ERR_error_string(ERR_get_error(), NULL));
      throw std::runtime_error("RSA_public_encrypt failed");
    }
}

void RSA_pair::decrypt(const buffer_t& ctext, buffer_t& rtext, size_t pos, size_t clen ) {
  if( !clen )
    clen = ctext.size() - pos;
  rtext.resize(clen);
  int len = RSA_private_decrypt(clen, &ctext[pos], &rtext[0], rsa.get(),
    RSA_PADDING);
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
