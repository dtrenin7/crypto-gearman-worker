#include <libgearman/gearman.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <string>

#include "crypto.h"
#include "cgw-ethereum.h"

#define GEARMAN_CHECK(x) if(gearman_failed(x)) { *result_size = 0; *result = GEARMAN_ERROR; return NULL; }

void* worker_create_account(gearman_job_st* job, void* context, size_t* result_size, gearman_return_t* result) {
    const char* workload = (const char*)gearman_job_workload(job);
    size_t workload_size = gearman_job_workload_size(job);
    if(workload && workload_size) {
        std::string password(workload, workload_size);

        GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));
        // start progress count

        CGW::Ethereum eth;
        std::string account = eth.createAccount(password);
        GEARMAN_CHECK(gearman_job_send_data(job, account.c_str(), account.length()));
        // send result

        GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size));
        // end progress count
    }
    *result_size = 0;
    *result = GEARMAN_SUCCESS;
    return NULL;
}

void* worker_execute_js(gearman_job_st* job, void* context, size_t* result_size, gearman_return_t* result) {
    const char* workload = (const char*)gearman_job_workload(job);
    size_t workload_size = gearman_job_workload_size(job);
    if(workload && workload_size) {
        std::string command(workload, workload_size);

        GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));
        // start progress count

        CGW::Ethereum eth;
        std::string response = eth.run(command);
        size_t len = response.length();
        if( len && response[len-1] == '\n')
          len--;  // omit line feed at end
        GEARMAN_CHECK(gearman_job_send_data(job, response.c_str(), len));
        // send result

        GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size));
        // end progress count
    }
    *result_size = 0;
    *result = GEARMAN_SUCCESS;
    return NULL;
}


#define add_worker_function(fn_name, fn) \
  result = gearman_worker_add_function(&worker, fn_name, strlen(fn_name), fn, 0);\
  if(result != GEARMAN_SUCCESS) {\
      printf("ERROR while adding function %s -> %s\n", fn_name, gearman_worker_error(&worker));\
      exit(1); }

void *worker_builder( void *ptr ) {
    gearman_worker_st worker;
    gearman_worker_create(&worker);

    gearman_worker_set_timeout(&worker, 100);

    gearman_return_t result;
    add_worker_function("create_account", worker_create_account);
    add_worker_function("execute_js", worker_execute_js);
    /*const char* fn_name = "reverse";
    gearman_return_t result = gearman_worker_add_function(&worker, fn_name, strlen(fn_name), worker_fn, 0);
    if(result != GEARMAN_SUCCESS) {
        printf("ERROR while adding function %s -> %s\n", fn_name, gearman_worker_error(&worker));
        exit(1);
    } //*/

    gearman_worker_add_server(&worker, "localhost", 4730);

    while(true) {
        result = gearman_worker_work(&worker);
        if(result == GEARMAN_TIMEOUT) {
        } else if(result != GEARMAN_SUCCESS) {
            printf("%s, %d", "Worker result != GEARMAN_SUCCESS", result);
        }
        usleep(1);
    }
    gearman_worker_free(&worker);
}

#define THREADS 4

int main(void) {

  //generate_keys();
    pthread_t threads[THREADS];
    for(int i = 0; i < THREADS; i++)
        if(pthread_create(&threads[i], NULL, worker_builder, NULL)) {
            printf("Can't create thread\n");
            exit(1);
        }
    printf("All %d threads created successfully.\n", THREADS);

    for(int i = 0; i < THREADS; i++)
        pthread_join(threads[i], NULL);

    printf("All %d threads finishes their jobs.\n", THREADS); // */
    return 0;
}
