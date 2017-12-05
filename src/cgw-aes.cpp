#include "cgw-aes.h"
#include "cgw-utils.h"
#include "cgw-log.h"
#include <cstring>

/*typedef unsigned char byte;  // Crypto++
#include <cryptopp/cryptlib.h>
using CryptoPP::Exception;

#include <cryptopp/hex.h>
using CryptoPP::HexEncoder;
using CryptoPP::HexDecoder;

#include <cryptopp/filters.h>
using CryptoPP::StringSink;
using CryptoPP::StringSource;
using CryptoPP::StreamTransformationFilter;

#include <cryptopp/modes.h>
#include <cryptopp/aes.h>
//using CryptoPP::AES;

#include <cryptopp/ccm.h>
using CryptoPP::CBC_Mode;
using CryptoPP::CBC_Mode;

namespace CryptoPP {

size_t StreamTransformation::ProcessLastBlock(byte *outString, size_t outLength, const byte *inString, size_t inLength)
{
	// this function should be overridden otherwise
	CRYPTOPP_ASSERT(MinLastBlockSize() == 0);

	if (inLength == MandatoryBlockSize())
	{
		outLength = inLength; // squash unused warning
		ProcessData(outString, inString, inLength);
		return outLength;
	}
	else if (inLength != 0)
		throw NotImplemented(AlgorithmName() + ": this object doesn't support a special last block");
	return 0;
}
StreamTransformationFilter::StreamTransformationFilter(StreamTransformation &c, BufferedTransformation *attachment, BlockPaddingScheme padding)
	: FilterWithBufferedInput(attachment), m_cipher(c), m_padding(DEFAULT_PADDING)
{
	CRYPTOPP_ASSERT(c.MinLastBlockSize() == 0 || c.MinLastBlockSize() > c.MandatoryBlockSize());

	const bool authenticatedFilter = dynamic_cast<AuthenticatedSymmetricCipher *>(&c) != NULLPTR;
	if (authenticatedFilter)
		throw InvalidArgument("StreamTransformationFilter: please use AuthenticatedEncryptionFilter and AuthenticatedDecryptionFilter for AuthenticatedSymmetricCipher");

	// InitializeDerivedAndReturnNewSizes may override some of these
	m_mandatoryBlockSize = m_cipher.MandatoryBlockSize();
	m_optimalBufferSize = m_cipher.OptimalBlockSize();
	m_isSpecial = m_cipher.IsLastBlockSpecial() && m_mandatoryBlockSize > 1;
	m_reservedBufferSize = STDMAX(2*m_mandatoryBlockSize, m_optimalBufferSize);

	IsolatedInitialize(MakeParameters(Name::BlockPaddingScheme(), padding));
}

StreamTransformationFilter::StreamTransformationFilter(StreamTransformation &c, BufferedTransformation *attachment, BlockPaddingScheme padding, bool authenticated)
	: FilterWithBufferedInput(attachment), m_cipher(c), m_padding(DEFAULT_PADDING)
{
	const bool authenticatedFilter = dynamic_cast<AuthenticatedSymmetricCipher *>(&c) != NULLPTR;
	if (!authenticatedFilter)
	{
		CRYPTOPP_ASSERT(c.MinLastBlockSize() == 0 || c.MinLastBlockSize() > c.MandatoryBlockSize());
	}

	if (authenticatedFilter && !authenticated)
		throw InvalidArgument("StreamTransformationFilter: please use AuthenticatedEncryptionFilter and AuthenticatedDecryptionFilter for AuthenticatedSymmetricCipher");

	// InitializeDerivedAndReturnNewSizes may override some of these
	m_mandatoryBlockSize = m_cipher.MandatoryBlockSize();
	m_optimalBufferSize = m_cipher.OptimalBlockSize();
	m_isSpecial = m_cipher.IsLastBlockSpecial() && m_mandatoryBlockSize > 1;
	m_reservedBufferSize = STDMAX(2*m_mandatoryBlockSize, m_optimalBufferSize);

	IsolatedInitialize(MakeParameters(Name::BlockPaddingScheme(), padding));
}

size_t CBC_CTS_Encryption::ProcessLastBlock(byte *outString, size_t outLength, const byte *inString, size_t inLength)
{
	CRYPTOPP_UNUSED(outLength);
	size_t used = inLength;
	if (inLength <= BlockSize())
	{
		if (!m_stolenIV)
			throw InvalidArgument("CBC_Encryption: message is too short for ciphertext stealing");

		// steal from IV
		memcpy(outString, m_register, inLength);
		outString = m_stolenIV;
	}
	else
	{
		// steal from next to last block
		xorbuf(m_register, inString, BlockSize());
		m_cipher->ProcessBlock(m_register);
		inString += BlockSize();
		inLength -= BlockSize();
		memcpy(outString+BlockSize(), m_register, inLength);
	}

	// output last full ciphertext block
	xorbuf(m_register, inString, inLength);
	m_cipher->ProcessBlock(m_register);
	memcpy(outString, m_register, BlockSize());

	return used;
}

}; // namespace CryptoPP */

namespace CGW {

AES::AES(): padding(2) {
  gen_params();
}

AES::AES(U8* _key, U8* _iv): padding(2) {
  memcpy(key, _key, AES_KEY_SIZE);
  memcpy(iv, _iv, AES_IV_SIZE);
}

AES::AES(const buffer_t& array, size_t pos): padding(2) {
  deserialize(array, pos);
}

AES::~AES() {
  OPENSSL_cleanse(key, AES_KEY_SIZE);
  OPENSSL_cleanse(iv, AES_IV_SIZE);  // paranoid?
}


void AES::gen_params(void) {
  int rc = RAND_bytes(key, AES_KEY_SIZE);
  if (rc != 1)
    throw std::runtime_error("RAND_bytes key failed");

  rc = RAND_bytes(iv, AES_IV_SIZE);
  if (rc != 1)
    throw std::runtime_error("RAND_bytes for iv failed");
}

void AES::pad(buffer_t& data, size_t boundary) {
  size_t messageLength = data.size();
  char padder = boundary - (messageLength % boundary);
  if( padder ) {
    data.resize(messageLength + padder);
    memset(&data[messageLength], padder, padder);
  }
  else {
    data.resize(messageLength + boundary);
    memset(&data[messageLength], padder, boundary);
  }
}

void AES::setIV(U8* _iv) {
  memcpy(iv, _iv, AES_IV_SIZE);
}

/*void AES::encrypt2(buffer_t& ptext, buffer_t& ctext, size_t pos) {
  size_t processed = ptext.size();
  if(!processed)
    throw STATUS("Nothing to encrypt");

  CGW_DEBUG("Encryped size %lu pos %lu", ptext.size(), pos);
  pad(ptext, 16);
  CGW_DEBUG("Padded size %lu", ptext.size());
  // AES256CBC works with padded blocks only

  byte _key[AES_KEY_SIZE], _iv[AES_IV_SIZE];
  memcpy(_key, &key[0], AES_KEY_SIZE);
  memcpy(_iv, &iv[0], AES_IV_SIZE);

  CryptoPP::CBC_Mode<CryptoPP::AES>::Encryption e;
  size_t bs = e.MandatoryBlockSize();
  CGW_DEBUG("Block size %lu", bs);
  if( ptext.size() % bs )
    throw STATUS("Data is not padded correctly");

  e.SetKeyWithIV(_key, CryptoPP::AES::MAX_KEYLENGTH, _iv);

  size_t blocks = ptext.size() / bs;
  ctext.resize(pos + ptext.size());
  CGW_DEBUG("Blocks %lu ctext size %lu", blocks, ctext.size());

  size_t offset = 0;
  for(size_t i = 0; i < blocks; i++) {
    e.ProcessData((CryptoPP::byte*)&ctext[offset + pos], (CryptoPP::byte*)&ptext[offset], bs);
    offset += bs;
  }
  // process all complete blocks (fixed size)
}

void AES::decrypt2(const buffer_t& ctext, buffer_t& rtext, size_t pos) {
} // Crypto++ */

void AES::encrypt(buffer_t& ptext, buffer_t& ctext, size_t pos) {
  EVP_CIPHER_CTX_free_ptr ctx(EVP_CIPHER_CTX_new(), ::EVP_CIPHER_CTX_free);
  int rc = EVP_EncryptInit_ex(ctx.get(), AES_OPERATION_MODE, NULL, key, iv);
  if (rc != 1)
    throw std::runtime_error("EVP_EncryptInit_ex failed");

  OPENSSL_assert(EVP_CIPHER_CTX_key_length(ctx.get()) == AES_KEY_SIZE);
  OPENSSL_assert(EVP_CIPHER_CTX_iv_length(ctx.get()) == AES_IV_SIZE);

  EVP_CIPHER_CTX_set_padding(ctx.get(), padding);
  EVP_CIPHER_CTX_set_key_length(ctx.get(), EVP_MAX_KEY_LENGTH);
  //  EVP_CIPHER_CTX_set_key_length(ctx.get(), 256);
  u32_t flags = EVP_CIPHER_CTX_flags(ctx.get());
  flags = flags & (~EVP_CIPH_CUSTOM_IV);
  EVP_CIPHER_CTX_set_flags(ctx.get(), flags);

  // Recovered text expands upto BLOCK_SIZE
  ctext.resize(ptext.size() + AES_IV_SIZE + pos);

  int out_len1 = 0;
  rc = EVP_EncryptUpdate(ctx.get(), &ctext[pos], &out_len1,
    (const U8*)&ptext[0], int(ptext.size()));
  if (rc != 1)
    throw std::runtime_error("EVP_EncryptUpdate failed");

  int out_len2 = 0;
  rc = EVP_EncryptFinal_ex(ctx.get(), &ctext[out_len1 + pos], &out_len2);
  if (rc != 1)
    throw std::runtime_error("EVP_EncryptFinal_ex failed");

  // Set cipher text size now that we know it
  ctext.resize(out_len1 + out_len2 + pos);
}

void AES::decrypt(const buffer_t& ctext, buffer_t& rtext, size_t pos) {
  EVP_CIPHER_CTX_free_ptr ctx(EVP_CIPHER_CTX_new(), ::EVP_CIPHER_CTX_free);
  EVP_CIPHER_CTX_init(ctx.get());
  int rc = EVP_DecryptInit_ex(ctx.get(), AES_OPERATION_MODE, NULL, key, iv);
  if (rc != 1)
    throw std::runtime_error("EVP_DecryptInit_ex failed");
  EVP_CIPHER_CTX_set_padding(ctx.get(), padding);
  EVP_CIPHER_CTX_set_key_length(ctx.get(), 256);

  // Recovered text contracts upto BLOCK_SIZE
  rtext.resize(ctext.size() - pos);
  int out_len1 = 0;

  rc = EVP_DecryptUpdate(ctx.get(), &rtext[0], &out_len1,
    (const U8*)&ctext[pos], int(ctext.size() - pos));
  if (rc != 1)
    throw std::runtime_error("EVP_DecryptUpdate failed");

  int out_len2 = 0;
  rc = EVP_DecryptFinal_ex(ctx.get(), &rtext[0]+out_len1, &out_len2);
  if (rc != 1)
    throw std::runtime_error("EVP_DecryptFinal_ex failed");

  // Set recovered text size now that we know it
  rtext.resize(out_len1 + out_len2);
}

U8* AES::getKey(void) {
  return &key[0];
}

U8* AES::getIV(void) {
  return &iv[0];
}

void AES::serialize(buffer_t& array, size_t pos) {
  array.resize(pos + AES_KEY_SIZE + AES_IV_SIZE);
  memcpy(&array[pos], key, AES_KEY_SIZE);
  memcpy(&array[pos + AES_KEY_SIZE], iv, AES_IV_SIZE);
}

void AES::deserialize(const buffer_t& array, size_t pos) {
  memcpy(key, &array[pos], AES_KEY_SIZE);
  memcpy(iv, &array[pos + AES_KEY_SIZE], AES_IV_SIZE);
}


EVP_CIPHER* AES::cipher = NULL;

}; // namespace CGW
