rm -rf build
mkdir build
cp src/libcrypto.a build/ 
cd build
cmake ../ -DCMAKE_BUILD_TYPE=Release
make
cd ..
