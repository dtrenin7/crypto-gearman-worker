#include "crypto.h"
#include "cgw-aes.h"
#include "cgw-rsa.h"

void generate_keys() {
  // Load the necessary cipher
  CGW::AES::init();

  // plaintext, ciphertext, recovered text
  byte_vector ptext,  ctext, rtext;

  int size = 210;
  ptext.resize(size);
  for(int i = 0; i < size; i++) {
    ptext[i] = i % 256;
  }

  CGW::AES aes;
//  aes.encrypt(ptext, ctext);
//  aes.decrypt(ctext, rtext);


  /* printf("\nAES ORIGIN\n");
  for(int i = 0; i < ptext.size(); i++)
    printf("%02X ", ptext[i]);

  printf("\nAES ENCODED\n");
  for(int i = 0; i < ctext.size(); i++)
    printf("%02X ", ctext[i]);

  printf("\nAES DECODED\n");
  for(int i = 0; i < rtext.size(); i++)
    printf("%02X ", rtext[i]);// */

//  printf("\nAES RESULT %s\n", memcmp(&ptext[0], &rtext[0], size) ? "NOT MATCHES" : "MATCHES" );

  //==========================================================

  CGW::RSA_pair pair;
  CGW::RSA_public p(pair.get_public());
  CGW::RSA_private pr(pair.get_private());
  byte_vector p_array, pr_array;
  p.serialize(p_array);
  pr.serialize(pr_array);


  p.encrypt(ptext, ctext);
  pr.decrypt(ctext, rtext);
  printf("\nRSA RESULT %s\n", memcmp(&ptext[0], &rtext[0], size) ? "NOT MATCHES" : "MATCHES" );

/*  CGW::RSA_public p_copy(&p_array[0], p_array.size());
  CGW::RSA_private pr_copy(&pr_array[0], pr_array.size());

  printf("\nPUBLIC ORIGIN\n");
  RSA_print_fp(stdout, p.get(), 0);

  printf("\nPUBLIC COPY\n");
  RSA_print_fp(stdout, p_copy.get(), 0);

  printf("\nPRIVATE ORIGIN\n");
  RSA_print_fp(stdout, pr.get(), 0);

  printf("\nPRIVATE COPY\n");
  RSA_print_fp(stdout, pr_copy.get(), 0); //*/
}
