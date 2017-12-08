#ifndef CGW_RSA
#define CGW_RSA

#include "crypto.h"
#include "cgw-types.h"

using BN_ptr = std::unique_ptr<BIGNUM, decltype(&::BN_free)>;
using RSA_ptr = std::unique_ptr<RSA, decltype(&::RSA_free)>;

#define RSA_PADDING RSA_PKCS1_PADDING
//#define RSA_LOAD_PRIVATE_KEY d2i_PKCS8_PRIV_KEY_INFO
//#define RSA_SAVE_PRIVATE_KEY i2d_PKCS8_PRIV_KEY_INFO
#define RSA_LOAD_PRIVATE_KEY d2i_RSAPrivateKey
#define RSA_SAVE_PRIVATE_KEY i2d_RSAPrivateKey

namespace CGW {
// ============================================================================
class RSA_private {
  RSA_ptr rsa;

public:
  RSA_private();
  RSA_private(RSA* _rsa);
  RSA_private(u8_t* buf, size_t len);
  RSA_private(buffer_t& buffer);
//  RSA_private(cstrptr_t base64data);
  virtual ~RSA_private();
  RSA* get(void);
  void serialize(buffer_t& array);
  void decrypt(const buffer_t& ctext, buffer_t& rtext, size_t pos = 0, size_t clen = 0);
};
// ============================================================================
class RSA_public {
  RSA_ptr rsa;

public:
  RSA_public();
  RSA_public(RSA* _rsa);
  RSA_public(u8_t* buf, size_t len);
  RSA_public(buffer_t& buffer);
  virtual ~RSA_public();
  RSA* get(void);
  void serialize(buffer_t& array);
  void encrypt(const buffer_t& ptext, buffer_t& ctext, size_t pos = 0);
};
// ============================================================================
class RSA_pair {
  RSA_ptr rsa;
  BN_ptr bn;

public:
  RSA_pair();
  virtual ~RSA_pair();

  static void init(void) {};

  void gen_params(void);
  void encrypt(const buffer_t& ptext, buffer_t& ctext, size_t pos = 0);
  void decrypt(const buffer_t& ctext, buffer_t& rtext, size_t pos = 0, size_t clen = 0);

  RSA* get_public(void);
  RSA* get_private(void);
};
// ============================================================================
}; // namespace CGW

#endif
