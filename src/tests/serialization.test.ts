import { TextDecoder, TextEncoder } from 'text-encoding';
import * as ser from "../eosjs-serialize";
import {SerialBuffer} from "../eosjs-serialize";
const transactionAbi = require('../transaction.abi.json');

// signed int value -90909090909090909 int 64
// const serializedBigNumberAsHex: string = "A38B82D9A906BDFE";
const BigNegativeNumberAsDecArray = [163, 139, 130, 217, 169, 6, 189, 254];
// signed int value 1 type int64
const OneAsDecArray = [1, 0, 0, 0, 0, 0, 0, 0];
// signed int value -1 type int 64
const NegOneAsDecArray = [ 255, 255, 255, 255, 255, 255, 255, 255];

//A3 8B 82 D9 A9 06 BD FE
describe('number-deserialization', () => {
    let textEncoder = new TextEncoder();
    let textDecoder = new TextDecoder();
    let transactionType: Map<string, ser.Type> = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);

    it('Deserialize Number One', () => {
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(OneAsDecArray);
        const oneAsSigned64Int = BigInt(transactionType.get("uint64").deserialize(buffer));
        expect(oneAsSigned64Int).toEqual(BigInt(1));
    });

    it('Deserialize Number Negative One', () => {
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(NegOneAsDecArray);
        const oneAsSigned64Int = BigInt(transactionType.get("uint64").deserialize(buffer));
        expect(oneAsSigned64Int).toEqual(BigInt(-1));
    });

    it('Deserialize Big Signed Number', () => {
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(BigNegativeNumberAsDecArray);
        const largeSigned64Int = BigInt(transactionType.get("uint64").deserialize(buffer));
        expect(largeSigned64Int).toEqual(BigInt(-90909090909090909));
    });

});