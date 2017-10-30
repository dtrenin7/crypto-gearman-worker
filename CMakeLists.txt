cmake_minimum_required(VERSION 3.2)
project(crypto-gearman-worker)

include(${CMAKE_CURRENT_SOURCE_DIR}/cmake/OutputPaths.cmake)

add_definitions("-Wall")

#suppress warnings
add_definitions("-Wno-switch")
add_definitions("-Wno-write-strings")
add_definitions("-Wno-return-type")

add_definitions("-std=c++11")
add_definitions("-DSYSLOG")

add_definitions("-static")

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES
    src/crypto.cpp
    src/cgw-aes.cpp
    src/cgw-rsa.cpp
    src/gearman_worker.cpp
    )

set(LIBS ${LIBS} gearman pthread crypto)

include_directories("${CMAKE_CURRENT_SOURCE_DIR}/src")

add_executable(crypto-gearman-worker ${SOURCE_FILES} )

target_link_libraries(crypto-gearman-worker ${LIBS})
