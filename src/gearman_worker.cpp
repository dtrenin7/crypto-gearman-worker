#include <libgearman/gearman.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <string>

#define GEARMAN_CHECK(x) if(gearman_failed(x)) { *result_size = 0; *result = GEARMAN_ERROR; return NULL; }

void* worker_fn(gearman_job_st* job, void* context, size_t* result_size, gearman_return_t* result) {

    const char* workload = (const char*)gearman_job_workload(job);
    size_t workload_size = gearman_job_workload_size(job);
    if(workload && workload_size) {
        std::string work(workload, workload_size);
        printf("Workload = %s size = %lu\n", work.c_str(), work.size());

        GEARMAN_CHECK(gearman_job_send_status(job, 0, workload_size));
        // start progress count

        GEARMAN_CHECK(gearman_job_send_data(job, workload, workload_size));
        // send result

        GEARMAN_CHECK(gearman_job_send_status(job, workload_size, workload_size));
        // end progress count
    }

    *result_size = 0;
    *result = GEARMAN_SUCCESS;
    return NULL;
}

void *worker_builder( void *ptr ) {
    gearman_worker_st worker;
    gearman_worker_create(&worker);

    gearman_worker_set_timeout(&worker, 100);

    const char* fn_name = "reverse";
    gearman_return_t result = gearman_worker_add_function(&worker, fn_name, strlen(fn_name), worker_fn, 0);
    if(result != GEARMAN_SUCCESS) {
        printf("ERROR while adding function %s -> %s\n", fn_name, gearman_worker_error(&worker));
        exit(1);
    }

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

#define THREADS 10

int main(void) {

  printf("Welcome!\n");
/*    pthread_t threads[THREADS];
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
