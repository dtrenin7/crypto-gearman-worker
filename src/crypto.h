#ifndef CRYPTO_GEARMAN_WORKER
#define CRYPTO_GEARMAN_WORKER

#include <iostream>
#include <string>
#include <memory>
#include <limits>
#include <stdexcept>
#include <vector>
using std::unique_ptr;
using std::vector;

#include <cassert>
#include <string.h>

#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/bn.h>
#include <openssl/rsa.h>
#include <openssl/err.h>

#define ASSERT assert

typedef unsigned char U8;
using EVP_CIPHER_CTX_free_ptr = std::unique_ptr<EVP_CIPHER_CTX, decltype(&::EVP_CIPHER_CTX_free)>;
typedef std::vector<unsigned char> byte_vector;


void generate_keys();


#endif /* end of include guard CRYPTO_GEARMAN_WORKER */
