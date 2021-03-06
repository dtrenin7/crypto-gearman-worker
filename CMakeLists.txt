cmake_minimum_required(VERSION 3.2)
project(crypto-gearman-worker)

include(${CMAKE_CURRENT_SOURCE_DIR}/cmake/OutputPaths.cmake)

add_definitions("-Wall")

#suppress warnings
add_definitions("-Wno-switch")
add_definitions("-Wno-write-strings")
add_definitions("-Wno-return-type")
add_definitions("-Wno-format-security")
add_definitions("-Wno-unused-but-set-variable")
add_definitions("-Wno-unused-result")
add_definitions("-Wno-comment")

#include debug info
add_definitions("-g")

add_definitions("-std=c++11")
add_definitions("-DSYSLOG")

add_definitions("-static")

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -g")

set(SOURCE_FILES
    src/crypto.cpp
    src/cgw-error.cpp
    src/cgw-utils.cpp
    src/cgw-ini.cpp
    src/cgw-settings.cpp
    src/cgw-aes.cpp
    src/cgw-rsa.cpp
    src/cgw-codec.cpp
    src/cgw-ethereum.cpp
    src/cgw-uri.cpp
    src/gearman_worker.cpp
    )

#set(LIBS ${LIBS} gearman pthread cryptopp crypto)
set(LIBS ${LIBS} gearman pthread crypto)

include_directories("${CMAKE_CURRENT_SOURCE_DIR}/src")

add_executable(crypto-gearman-worker ${SOURCE_FILES} )

target_link_libraries(crypto-gearman-worker ${LIBS})
