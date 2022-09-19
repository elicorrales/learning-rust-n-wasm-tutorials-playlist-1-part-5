#!/usr/bin/bash

#echo "wasm-dis: =====================";
#wasm-dis my.wasm;
#echo;echo;

#echo "wasm-objdump: =====================";
#wasm-objdump -s my.wasm;
#echo;echo;

#echo "wasmer inspect: =====================";
#wasmer inspect my.wasm;

#echo;echo;
#echo "wasmedge: =====================";
#wasmedge --reactor my.wasm myfunc 5 7 ;
#echo;echo;

echo "runner.js: =====================";
node runner.js my.wasm  add   5 7;
echo;echo;


