## Testing Read Only

Performing a read only transaction requires an action that does not modify the blockchain. To facilitate testing a simple read only contract is included in the test directory.

## The Read Only Contract

You can find the source code under `src/tests/readonly_contract`. The contract returns a single numeric value. 

## Compile the Contract

Use `cdt-cpp` to compile this will produce two files one *.abi file and a *.wasm file
```shell
cd tests/readonly_contract
cdt-cpp --abigen -o simplereadonlycontract.wasm simplereadonlycontract.cpp
```

## Load The Contract

Loading the **Action Return Value**. You will need to make sure the action return value feature is avalible.

```shell
cleos push action eosio activate '["c3a6138c5061cf291310887c0b5c71fcaffeab90d5deb50d3b9e687cead45071"]' -p eosio
```
Once the feature is activated, you may load the contract. 
```shell
cd tests
cleos -u http://127.0.0.1:8888/ set contract hokieshokies ./simplereadonlycontract -p hokieshokies@active
```

## Running The Contract 

Once the contract is loaded the action `getvalue` in the account scope `hokieshokies` will work as a read only transaction.
