#include "cgw-codec.h"

namespace CGW {
// ============================================================================
codec::codec(RSA_public* _coder, RSA_private* _decoder) :
  coder(_coder), decoder(_decoder) {
}

codec::~codec() {
}

void codec::encrypt(buffer_t& ptext, buffer_t& ctext) {
  AES aes;
  size_t pos = 4;
  ctext.reserve(RSA_size(coder->get()) + AES_KEY_SIZE +
    (AES_IV_SIZE << 1) + ptext.size() + pos);
  // allocate enough

  buffer_t symmetric;
  aes.serialize(symmetric);
  coder->encrypt(symmetric, ctext, pos);
  //printf("\nCLEN: %ld\n", ctext.size());
  // encrypt symmetric key AES-256 with asymmetric RSA-2048 public key

  size_t size = ctext.size() - pos;
//  printf("\nSIZE: %lu\n", size);
  memcpy(&ctext[0], &size, pos);
  // save encrypted sym key size

//  printf("\nENC: %ld\n", ctext.size());
  aes.encrypt(ptext, ctext, ctext.size());
  // encrypt message with AES-256 and attach
}

void codec::decrypt(const buffer_t& ctext, buffer_t& rtext) {
  size_t size = 0, pos = 4;
  memcpy(&size, &ctext[0], pos);
//  printf("\nSYM_SIZE: %lu\n", size);
  // get the RSA-encrypted sym key length

  buffer_t symmetric;
  decoder->decrypt(ctext, symmetric, pos, size);
  AES aes(symmetric);
  pos += size;
  // decode & deserialize AES-256 session key

  aes.decrypt(ctext, rtext, pos);
  // decode the message with session key
}
// ============================================================================
}; // namespace CGW
