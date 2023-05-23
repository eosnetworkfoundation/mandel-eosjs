The read only contract requires a special contract. You can find the source code under `src/tests/readonly_contract`. 
Once compiled the contracted is loaded via the command `cleos -u https://jungle4.cryptolions.io set contract hokieshokies ./ contract.wasm contract.abi`
The action on `read-only` test will refer to `mycontract`, and with the contract loaded you will be able to run the test