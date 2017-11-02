#ifndef CGW_CODEC
#define CGW_CODEC

#include "cgw-rsa.h"
#include "cgw-aes.h"


namespace CGW {
// ============================================================================
class codec {
  RSA_public* coder;
  RSA_private* decoder;

public:
  codec(RSA_public* _coder, RSA_private* _decoder);

  virtual ~codec();
  void encrypt(const byte_vector& ptext, byte_vector& ctext);
  void decrypt(const byte_vector& ctext, byte_vector& rtext);
};
// ============================================================================
}; // namespace CGW

#endif
