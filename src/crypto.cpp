#include "crypto.h"
#include "cgw-codec.h"

void generate_keys() {
  // Load the necessary cipher
  CGW::AES::init();

  // plaintext, ciphertext, recovered text
  byte_vector ptext,  ctext, rtext;

  int size = 11000000;
  ptext.resize(size + 10);
  for(int i = 0; i < size; i++) {
    ptext[i] = i % 256;
  }

  /*CGW::AES aes;
  for( int i = 0; i < 100; i++) {
    aes.encrypt2(ptext, ctext);
    aes.decrypt(ctext, rtext);
  }


   /*printf("\nAES ORIGIN\n");
  for(int i = 0; i < ptext.size(); i++)
    printf("%02X ", ptext[i]);

  printf("\nAES ENCODED\n");
  for(int i = 0; i < ctext.size(); i++)
    printf("%02X ", ctext[i]);

  printf("\nAES DECODED\n");
  for(int i = 0; i < rtext.size(); i++)
    printf("%02X ", rtext[i]);// */


  //==========================================================

  CGW::RSA_pair pair;
  CGW::RSA_public p(pair.get_public());
  CGW::RSA_private pr(pair.get_private());


/*  byte_vector p_array, pr_array;
  p.serialize(p_array);
  pr.serialize(pr_array);


  p.encrypt(ptext, ctext);
  pr.decrypt(ctext, rtext);// */


  CGW::codec codec(&p, &pr);
  codec.encrypt(ptext, ctext);
  codec.decrypt(ctext, rtext);

  if( rtext.size() )
    printf("\nRESULT %s\n", memcmp(&ptext[0], &rtext[0], size) ? "NOT MATCHES" : "MATCHES" );
  else
    printf("\nERROR!\n");

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
