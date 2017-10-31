#ifndef CGW_RSA
#define CGW_RSA

#include "crypto.h"

using BN_ptr = std::unique_ptr<BIGNUM, decltype(&::BN_free)>;
using RSA_ptr = std::unique_ptr<RSA, decltype(&::RSA_free)>;


namespace CGW {
// ============================================================================
class RSA_private {
  RSA_ptr rsa;

public:
  RSA_private();
  RSA_private(RSA* _rsa);
  RSA_private(U8* buf, long len);
  virtual ~RSA_private();
  RSA* get(void);
  void serialize(byte_vector& array);
  void decrypt(const byte_vector& ctext, byte_vector& rtext);
};
// ============================================================================
class RSA_public {
  RSA_ptr rsa;

public:
  RSA_public();
  RSA_public(RSA* _rsa);
  RSA_public(U8* buf, long len);
  virtual ~RSA_public();
  RSA* get(void);
  void serialize(byte_vector& array);
  void encrypt(const byte_vector& ptext, byte_vector& ctext);
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
  void encrypt(const byte_vector& ptext, byte_vector& ctext);
  void decrypt(const byte_vector& ctext, byte_vector& rtext);

  RSA* get_public(void);
  RSA* get_private(void);
};
// ============================================================================
}; // namespace CGW

#endif
