////////////////////////////////////////////////////////////
// Get CLI ARGS
////////////////////////////////////////////////////////////
let pathToWasm = '';
if (process.argv.length < 3) {
    console.log('\n\nNeed Path To WASM\n\n');
    console.log('\nTo run WASI files,\n',
        'place the \'--experimental-wasi-unstable-preview1\'\n',
        'immediately after \'node\'. \n\n',
        'ex: node --experiment...  runner.js  <path-to-wasi> func  arg arg');

    return;
}
pathToWasm = process.argv[2];

let funcName;
if (process.argv.length > 3) {
    funcName = process.argv[3].trim();
}

let varA;
let varB;
if (process.argv.length > 4) { varA = process.argv[4]; }
if (process.argv.length > 5) { varB = process.argv[5]; }

////////////////////////////////////////////////////////////
// Verify that it is a wasm file, one of these:
// Because they will be run differently
//
// - wasm32-unknown-unknown
// - wasm32-wasi
////////////////////////////////////////////////////////////
let plainVanillaWASM = pathToWasm.includes('wasm32-unknown-unknown');
const wasiWASM = pathToWasm.includes('wasm32-wasi');
if (!plainVanillaWASM && !wasiWASM) {
    //console.log('\n\nNeed either wasm32-unknown-unknown or wasm32-wasi file\n\n');
    //return;
    plainVanillaWASM = true;
}

const fs = require('fs');
const wasmBuffer = fs.readFileSync(pathToWasm);

if (plainVanillaWASM) {
    WebAssembly.instantiate(wasmBuffer)
        .then(wasmModule => {
            console.log('\nWASM Module:\n');
            console.log(wasmModule);

            console.log('\nWASM Module Instance Exports:\n');
            console.log(wasmModule.instance.exports);

            if (funcName) {
                const func = wasmModule.instance.exports[funcName];
                console.log('Running function ', funcName, ' w no params.');
                const result = func();
                console.log('Result: ', result);

                if (varA) {
                    const func = wasmModule.instance.exports[funcName];
                    console.log('Running function ', funcName, ' w param varA (', varA, ').');
                    const result = func(varA);
                    console.log('Result: ', result);
                }
                if (varA && varB) {
                    const func = wasmModule.instance.exports[funcName];
                    console.log('Running function ', funcName, ' w param varA(', varA, ') and varB(', varB, ').');
                    const result = func(varA, varB);
                    console.log('Result: ', result);
                }
            }
        })
        .catch(err => {
            console.log('\n\nThere was an error:\n\n', err, '\n\n');
        });

    // else it's a wasm32-wasi file
} else {
    const process = require('node:process');
    const args = process.argv;
    const env = process.env;

    let wasiModule;
    try {
        wasiModule = require('wasi');
    } catch (error) {
        console.log('\n\nThere was an error:\n\n');
        console.log('\n\n', error, '\n\n');
        console.log('\n\nDid you add this option to command-line:\n',
            'node --experimental-wasi-unstable-preview1 <path-to-wasi> etc ?\n\n');
        return;
    }

    const wasi = new wasiModule.WASI({ args: args, env });
    const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

    WebAssembly.instantiate(wasmBuffer, importObject)
        .then(wasiInstance => {
            console.log(wasiInstance.instance);

            console.log('\nWASM Module Instance Exports:\n');
            const wasiExports = wasiInstance.instance.exports;
            console.log(wasiExports);

            wasi.start(wasiInstance.instance);

            if (funcName) {
                const func = wasiExports[funcName];
                console.log(func);


                console.log('Running function \'%s()\' with no params.', funcName);
                const funcResult = func();
                console.log(funcResult);


                if (varA) {
                    console.log('Running function \'%s()\' with just varA(%s).', funcName, varA);
                    const funcResult = func(varA);
                    console.log(funcResult);
                }

                if (varA && varB) {
                    console.log('Running function \'%s()\' varA(%s), and varB(%s).', funcName, varA, varB);
                    const funcResult = func(varA, varB);
                    console.log(funcResult);
                }

            }

        })
        .catch(err => {
            console.log('\n\nThere was an error:\n\n', err, '\n\n');
        });

}
