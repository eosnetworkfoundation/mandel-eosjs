/**
 * @module API
 */
// copyright defined in eosjs/LICENSE.txt

import {ChainSemanticVersion} from './ChainSemanticVersion'
import { AbiProvider, AuthorityProvider, BinaryAbi, CachedAbi, SignatureProvider } from './eosjs-api-interfaces';
import { JsonRpc } from './eosjs-jsonrpc';
import {
    Abi,
    BlockHeader,
    BlockTaposInfo,
    GetInfoResult,
    PushTransactionArgs,
    SendTransaction2Args
} from "./eosjs-rpc-interfaces";
import * as ser from './eosjs-serialize';

const abiAbi = require('../src/abi.abi.json');
const transactionAbi = require('../src/transaction.abi.json');

interface Created {
    timestamp: string;
}

export class Api {
    /** Issues RPC calls */
    public rpc: JsonRpc

    /** Get subset of `availableKeys` needed to meet authorities in a `transaction` */
    public authorityProvider: AuthorityProvider

    /** Supplies ABIs in raw form (binary) */
    public abiProvider: AbiProvider

    /** Signs transactions */
    public signatureProvider: SignatureProvider

    /** Identifies chain */
    public chainId: string

    public textEncoder: TextEncoder
    public textDecoder: TextDecoder

    /** Converts abi files between binary and structured form (`abi.abi.json`) */
    public abiTypes: Map<string, ser.Type>

    /** Converts transactions between binary and structured form (`transaction.abi.json`) */
    public transactionTypes: Map<string, ser.Type>

    /** Holds information needed to serialize contract actions */
    public contracts = new Map<string, ser.Contract>()

    /** Fetched abis */
    public cachedAbis = new Map<string, CachedAbi>()

    /** Matched get_info server version string
     *  Deferred call to get_info will populate
     *  Needed for new 3.1+ endpoints to check support
     * */
    private server_version_string?: string

    /**
     * @param args
     *    * `rpc`: Issues RPC calls
     *    * `authorityProvider`: Get public keys needed to meet authorities in a transaction
     *    * `abiProvider`: Supplies ABIs in raw form (binary)
     *    * `signatureProvider`: Signs transactions
     *    * `chainId`: Identifies chain
     *    * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     *    * `textDecoder`: `TextDecoder` instance to use. Pass in `null` if running in a browser
     */
    constructor(args: {
        rpc: JsonRpc
        authorityProvider?: AuthorityProvider
        abiProvider?: AbiProvider
        signatureProvider: SignatureProvider
        chainId?: string
        textEncoder?: TextEncoder
        textDecoder?: TextDecoder
    }) {
        this.rpc = args.rpc
        this.authorityProvider = args.authorityProvider || args.rpc
        this.abiProvider = args.abiProvider || args.rpc
        this.signatureProvider = args.signatureProvider
        this.chainId = args.chainId
        this.textEncoder = args.textEncoder
        this.textDecoder = args.textDecoder

        this.abiTypes = ser.getTypesFromAbi(ser.createInitialTypes(), abiAbi)
        this.transactionTypes = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi)

        // deferred call to get_info will populate
        this.server_version_string = undefined
    }

    /** Decodes an abi as Uint8Array into json. */
    public rawAbiToJson(rawAbi: Uint8Array): Abi {
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
            array: rawAbi,
        })
        if (!ser.supportedAbiVersion(buffer.getString())) {
            throw new Error('Unsupported abi version')
        }
        buffer.restartRead()
        return this.abiTypes.get('abi_def').deserialize(buffer)
    }

    /** Get abi in both binary and structured forms. Fetch when needed. */
    public async getCachedAbi(accountName: string, reload = false): Promise<CachedAbi> {
        if (!reload && this.cachedAbis.get(accountName)) {
            return this.cachedAbis.get(accountName)
        }
        let cachedAbi: CachedAbi
        try {
            const rawAbi = (await this.abiProvider.getRawAbi(accountName)).abi
            const abi = this.rawAbiToJson(rawAbi)
            cachedAbi = {rawAbi, abi}
        } catch (e) {
            e.message = `fetching abi for ${accountName}: ${e.message}`
            throw e
        }
        if (!cachedAbi) {
            throw new Error(`Missing abi for ${accountName}`)
        }
        this.cachedAbis.set(accountName, cachedAbi)
        return cachedAbi
    }

    /** Get abi in structured form. Fetch when needed. */
    public async getAbi(accountName: string, reload = false): Promise<Abi> {
        return (await this.getCachedAbi(accountName, reload)).abi
    }

    /** Get abis needed by a transaction */
    public async getTransactionAbis(transaction: any, reload = false): Promise<BinaryAbi[]> {
        const actions = (transaction.context_free_actions || []).concat(transaction.actions)
        const accounts: string[] = actions.map((action: ser.Action): string => action.account)
        const uniqueAccounts: Set<string> = new Set(accounts)
        const actionPromises: Array<Promise<BinaryAbi>> = [...uniqueAccounts].map(
            async (account: string): Promise<BinaryAbi> => ({
                accountName: account,
                abi: (await this.getCachedAbi(account, reload)).rawAbi,
            })
        )
        return Promise.all(actionPromises)
    }

    /** Get data needed to serialize actions in a contract */
    public async getContract(accountName: string, reload = false): Promise<ser.Contract> {
        if (!reload && this.contracts.get(accountName)) {
            return this.contracts.get(accountName)
        }
        const abi = await this.getAbi(accountName, reload)
        const types = ser.getTypesFromAbi(ser.createInitialTypes(), abi)
        const actions = new Map<string, ser.Type>()
        for (const {name, type} of abi.actions) {
            actions.set(name, ser.getType(types, type))
        }
        const result = {types, actions}
        this.contracts.set(accountName, result)
        return result
    }

    /** Convert `value` to binary form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    public serialize(buffer: ser.SerialBuffer, type: string, value: any): void {
        this.transactionTypes.get(type).serialize(buffer, value)
    }

    /** Convert data in `buffer` to structured form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    public deserialize(buffer: ser.SerialBuffer, type: string): any {
        return this.transactionTypes.get(type).deserialize(buffer)
    }

    /** Convert a transaction to binary */
    public serializeTransaction(transaction: any): Uint8Array {
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
        })
        this.serialize(buffer, 'transaction', {
            max_net_usage_words: 0,
            max_cpu_usage_ms: 0,
            delay_sec: 0,
            context_free_actions: [],
            actions: [],
            transaction_extensions: [],
            ...transaction,
        })
        return buffer.asUint8Array()
    }

    /** Serialize context-free data */
    public serializeContextFreeData(contextFreeData: Uint8Array[]): Uint8Array {
        if (!contextFreeData || !contextFreeData.length) {
            return null
        }
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
        })
        buffer.pushVaruint32(contextFreeData.length)
        for (const data of contextFreeData) {
            buffer.pushBytes(data)
        }
        return buffer.asUint8Array()
    }

    /** Convert a transaction from binary. Leaves actions in hex. */
    public deserializeTransaction(transaction: Uint8Array): any {
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
        })
        buffer.pushArray(transaction)
        return this.deserialize(buffer, 'transaction')
    }

    /** Convert actions to hex */
    public async serializeActions(actions: ser.Action[]): Promise<ser.SerializedAction[]> {
        return await Promise.all(
            actions.map(async ({account, name, authorization, data}) => {
                const contract = await this.getContract(account)
                return ser.serializeAction(
                    contract,
                    account,
                    name,
                    authorization,
                    data,
                    this.textEncoder,
                    this.textDecoder
                )
            })
        )
    }

    /** Convert actions from hex */
    public async deserializeActions(actions: ser.Action[]): Promise<ser.Action[]> {
        return await Promise.all(
            actions.map(async ({account, name, authorization, data}) => {
                const contract = await this.getContract(account)
                return ser.deserializeAction(
                    contract,
                    account,
                    name,
                    authorization,
                    data,
                    this.textEncoder,
                    this.textDecoder
                )
            })
        )
    }

    /** Convert a transaction from binary. Also deserializes actions. */
    public async deserializeTransactionWithActions(transaction: Uint8Array | string): Promise<any> {
        if (typeof transaction === 'string') {
            transaction = ser.hexToUint8Array(transaction)
        }
        const deserializedTransaction = this.deserializeTransaction(transaction)
        const deserializedCFActions = await this.deserializeActions(
            deserializedTransaction.context_free_actions
        )
        const deserializedActions = await this.deserializeActions(deserializedTransaction.actions)
        return {
            ...deserializedTransaction,
            context_free_actions: deserializedCFActions,
            actions: deserializedActions,
        }
    }

    /**
     * Create and optionally broadcast a transaction.
     *
     * Named Parameters:
     *    * `broadcast`: broadcast this transaction?
     *    * `sign`: sign this transaction?
     *    * `useOldRPC`: use old RPC push_transaction, rather than new RPC send_transaction?
     *    * `useOldSendRPC`: use old RPC /v1/chain/send_transaction, rather than new RPC /v1/chain/send_transaction2?
     *    * `readOnly`: read only, nothing modified
     *    * `returnFailureTrace`: return partial traces on failed transactions?
     *    * `retryTrxNumBlocks`: request node to retry transaction until in a block of given height, blocking call?
     *    * `retryIrreversible`: request node to retry transaction until it is irreversible or expires, blocking call?
     *    * If both `blocksBehind` and `expireSeconds` are present,
     *      then fetch the block which is `blocksBehind` behind head block,
     *      use it as a reference for TAPoS, and expire the transaction `expireSeconds` after that block's time.
     *    * `searchBlocksAhead`: only for testing, on single producer nodes, there is only one irreversible block,
     *      and without the need for consensus irreversible blocks don't live long.
     *      This option makes corrections to look at the latest block to build Tapos
     * @returns node response if `broadcast`, `{signatures, serializedTransaction}` if `!broadcast`
     */
    public async transact(
        transaction: any,
        {
            broadcast = true,
            sign = true,
            blocksBehind,
            searchBlocksAhead = 0,
            expireSeconds,
            useOldRPC = false,
            useOldSendRPC = false,
            readOnly = false,
            returnFailureTrace = true,
            retryTrxNumBlocks = 0,
            retryIrreversible = false,
        }: {
            broadcast?: boolean
            sign?: boolean
            blocksBehind?: number
            searchBlocksAhead?: number
            expireSeconds?: number
            useOldRPC?: boolean
            useOldSendRPC?: boolean
            readOnly?: boolean
            returnFailureTrace?: boolean
            retryTrxNumBlocks?: number
            retryIrreversible?: boolean
        } = {}
    ): Promise<any> {
        let info: GetInfoResult
        let refBlock: BlockTaposInfo
        let semver: ChainSemanticVersion

        if (!this.chainId) {
            info = await this.rpc.get_info()
            refBlock = await this.rpc.get_block_header_state(
                info.head_block_num - blocksBehind + searchBlocksAhead
            )
            this.chainId = info.chain_id
            semver = new ChainSemanticVersion(info.server_version_string)
        }

        const isRetry = retryIrreversible || retryTrxNumBlocks > 0

        if (isRetry) {
            if (!this.server_version_string) {
                info = await this.rpc.get_info()
                refBlock = await this.rpc.get_block_header_state(
                    info.head_block_num - blocksBehind + searchBlocksAhead
                )
                semver = new ChainSemanticVersion(info.server_version_string)
            }

            // check if chain support 3.0 endpoints
            if (!semver.supportsLeap3Features()) {
                throw new Error(
                    `Retry transaction feature unavailable for nodeos :${info.server_version_string}`
                )
            }
            if (useOldRPC || useOldSendRPC) {
                throw new Error('Retry transaction feature not compatible with old RPC')
            }
            if (readOnly) {
                throw new Error(
                    'Retry transaction feature not compatible with readonly transaction'
                )
            }
            if (retryIrreversible && retryTrxNumBlocks > 0) {
                throw new Error('Must specify retry irreversible or until given block height')
            }
        }

        if ((useOldRPC || useOldSendRPC) && readOnly) {
            throw new Error(
                'old RPC not compatible with readonly transaction, please disable old RPC'
            )
        }

        if (typeof blocksBehind === 'number' && expireSeconds) {
            // use config fields to generate TAPOS if they exist
            if (!info) {
                info = await this.rpc.get_info()
                refBlock = await this.rpc.get_block_header_state(
                    info.head_block_num - blocksBehind + searchBlocksAhead
                )
                semver = new ChainSemanticVersion(info.server_version_string)
            }

            transaction = {...ser.transactionHeader(refBlock, expireSeconds), ...transaction}
        }

        if (!this.hasRequiredTaposFields(transaction)) {
            throw new Error('Required configuration or TAPOS fields are not present')
        }

        const abis: BinaryAbi[] = await this.getTransactionAbis(transaction)
        transaction = {
            ...transaction,
            context_free_actions: await this.serializeActions(
                transaction.context_free_actions || []
            ),
            actions: await this.serializeActions(transaction.actions),
        }
        const serializedTransaction = this.serializeTransaction(transaction)
        const serializedContextFreeData = this.serializeContextFreeData(
            transaction.context_free_data
        )
        let pushTransactionArgs: PushTransactionArgs = {
            serializedTransaction,
            serializedContextFreeData,
            signatures: [],
        }

        // no signature for readonly
        if (sign && !readOnly) {
            const availableKeys = await this.signatureProvider.getAvailableKeys()
            const requiredKeys = await this.authorityProvider.getRequiredKeys({
                transaction,
                availableKeys,
            })
            pushTransactionArgs = await this.signatureProvider.sign({
                chainId: this.chainId,
                requiredKeys,
                serializedTransaction,
                serializedContextFreeData,
                abis,
            })
        }
        if (broadcast) {
            if (isRetry) {
                let params: SendTransaction2Args = {
                    return_failure_trace: returnFailureTrace,
                    retry_trx: true,
                    transaction: pushTransactionArgs,
                }
                if (retryTrxNumBlocks > 0) {
                    params = {
                        ...params,
                        retry_trx_num_blocks: retryTrxNumBlocks,
                    }
                }
                return this.sendSignedTransaction2(params)
            } else if (readOnly) {
                if (!semver.supportsLeap4Features()) {
                    throw new Error(
                        `Read Only transaction feature unavailable for nodeos :${info.server_version_string}`
                    )
                }
                // no signature for read only
                return this.sendReadonlyTransaction(pushTransactionArgs)
            } else if (useOldSendRPC) {
                return this.sendSignedTransaction(pushTransactionArgs)
            } else if (useOldRPC) {
                return this.pushSignedTransaction(pushTransactionArgs)
            } else {
                return this.sendSignedTransaction2({
                    return_failure_trace: returnFailureTrace,
                    retry_trx: false,
                    transaction: pushTransactionArgs,
                })
            }
        }
        return pushTransactionArgs
    }

    /** Broadcast a signed transaction using push_transaction RPC */
    public async pushSignedTransaction({
        signatures,
        serializedTransaction,
        serializedContextFreeData,
    }: PushTransactionArgs): Promise<any> {
        return this.rpc.push_transaction({
            signatures,
            serializedTransaction,
            serializedContextFreeData,
        })
    }

    /** Broadcast a signed transaction using send_transaction RPC */
    public async sendSignedTransaction({
        signatures,
        serializedTransaction,
        serializedContextFreeData,
    }: PushTransactionArgs): Promise<any> {
        return this.rpc.send_transaction({
            signatures,
            serializedTransaction,
            serializedContextFreeData,
        })
    }

    /** Broadcast a signed transaction using send_transaction2 RPC*/
    public async sendSignedTransaction2({
        return_failure_trace,
        retry_trx,
        retry_trx_num_blocks,
        transaction: {signatures, serializedTransaction, serializedContextFreeData},
    }: SendTransaction2Args): Promise<any> {
        return this.rpc.send_transaction2({
            return_failure_trace,
            retry_trx,
            retry_trx_num_blocks,
            transaction: {
                signatures,
                serializedTransaction,
                serializedContextFreeData,
            },
        })
    }

    public async sendReadonlyTransaction({
        signatures,
        serializedTransaction,
        serializedContextFreeData,
    }: PushTransactionArgs): Promise<any> {
        return this.rpc.send_readonly_transaction({
            signatures,
            serializedTransaction,
            serializedContextFreeData,
        })
    }

    // eventually break out into TransactionValidator class
    private hasRequiredTaposFields({expiration, ref_block_num, ref_block_prefix}: any): boolean {
        return !!(
            expiration &&
            typeof ref_block_num === 'number' &&
            typeof ref_block_prefix === 'number'
        )
    }
} // Api
