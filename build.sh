pkill -f gearman
rm -rf build
mkdir build
cd build
cmake ../ -DCMAKE_BUILD_TYPE=Release
make
cd ..
