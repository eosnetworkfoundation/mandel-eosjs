#include <eosio/eosio.hpp>
using namespace eosio;

// Welcome to your new EOS Smart Contract.
// If you're just learning follow our Getting Started guide here:
// https://docs.eosnetwork.com/docs/latest/smart-contracts/getting-started/smart_contract_basics

CONTRACT mycontract : public contract {
   public:
      using contract::contract;

      [[eosio::action]] uint64_t getvalue(){
         return 42;
      }
};