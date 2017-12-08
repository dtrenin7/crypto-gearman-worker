#include "cgw-codec.h"
#include "cgw-error.h"
#include "cgw-log.h"
#include "cgw-utils.h"

namespace CGW {
// ============================================================================
codec::codec(RSA_public* _coder, RSA_private* _decoder) :
  coder(_coder), decoder(_decoder) {
}

codec::~codec() {
}

void codec::encrypt(buffer_t& ptext, buffer_t& ctext) {
  if( !coder )
    throw STATUS("Coder is empty");
  AES aes;
  size_t pos = 1;
  ctext.reserve(RSA_size(coder->get()) + AES_KEY_SIZE +
    (AES_IV_SIZE << 1) + ptext.size() + pos);
  // allocate enough

  buffer_t symmetric;
  aes.serialize(symmetric);
  coder->encrypt(symmetric, ctext, pos);
  // encrypt symmetric key AES-256 with asymmetric RSA-2048 public key

  size_t size = (ctext.size() - pos) & 0xFF;
  ctext[0] = (u8_t)size;
  // save encrypted sym key size

  aes.encrypt(ptext, ctext, ctext.size());
  // encrypt message with AES-256 and attach
}

void codec::decrypt(const buffer_t& ctext, buffer_t& rtext) {
  if( !decoder )
    throw STATUS("Decoder is empty");
  size_t size = size_t(ctext[0]) & 0xFF, pos = 1;
//  CGW_DEBUG("SIZE: %lu", size);
  // get the RSA-encrypted sym key length

  buffer_t symmetric;
  decoder->decrypt(ctext, symmetric, pos, size);
//  CGW_DEBUG("AES KEY & IV: %lu = %s HASH: %s", symmetric.size(),
//    buff2hex2(symmetric).c_str(), sha1(symmetric).c_str());

  AES aes(symmetric);
  pos += size;
  // decode & deserialize AES-256 session key

  aes.decrypt(ctext, rtext, pos);
  // decode the message with session key
}
// ============================================================================
}; // namespace CGW
