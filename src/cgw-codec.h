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
  void encrypt(buffer_t& ptext, buffer_t& ctext);
  void decrypt(const buffer_t& ctext, buffer_t& rtext);
};
// ============================================================================
}; // namespace CGW

#endif
