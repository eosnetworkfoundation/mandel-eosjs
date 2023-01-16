import { TextDecoder, TextEncoder } from 'text-encoding';
import * as ser from "../eosjs-serialize";
import {SerialBuffer} from "../eosjs-serialize";
const transactionAbi = require('../transaction.abi.json');

//A3 8B 82 D9 A9 06 BD FE
describe('number-deserialization', () => {
    let textEncoder = new TextEncoder();
    let textDecoder = new TextDecoder();
    let transactionType: Map<string, ser.Type> = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);

    it('Deserialize Number One', () => {
        // int value 1 type uint64
        const OneAsDecArray = [1, 0, 0, 0, 0, 0, 0, 0];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(OneAsDecArray);
        const oneAsSigned64Int = BigInt(transactionType.get("uint64").deserialize(buffer));
        expect(oneAsSigned64Int).toEqual(BigInt(1));
    });

    it('Deserialize Uint64 Large Number', () => {
        // 18446744073709551615 type uint64
        // FF FF FF FF FF FF FF FF
        const LargeUint64AsDecArray = [255, 255, 255, 255, 255, 255, 255, 255];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(LargeUint64AsDecArray);
        const LargeUint64 = BigInt(transactionType.get("uint64").deserialize(buffer));
        expect(LargeUint64).toEqual(BigInt(1));
    });

    it('Deserialize Number Negative One', () => {
        // signed int value -1 type int 64
        const NegOneAsDecArray = [ 255, 255, 255, 255, 255, 255, 255, 255];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(NegOneAsDecArray);
        const oneAsSigned64Int = BigInt(transactionType.get("int64").deserialize(buffer));
        expect(oneAsSigned64Int).toEqual(BigInt(-1));
    });

    it('Deserialize Big Signed Number', () => {
        // signed int value -90909090909090909 int 64
        // const serializedBigNumberAsHex: string = "A38B82D9A906BDFE";
        const BigNegativeNumberAsDecArray = [163, 139, 130, 217, 169, 6, 189, 254];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(BigNegativeNumberAsDecArray);
        const largeSigned64Int = BigInt(transactionType.get("int64").deserialize(buffer));
        expect(largeSigned64Int).toEqual(BigInt(-90909090909090909));
    });

    it('Deserialize Float32 Zero', () => {
        // zero in float32
        const float32ZeroAsDecArray = [0, 0, 0, 0];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float32ZeroAsDecArray);
        const zero = transactionType.get("float32").deserialize(buffer);
        expect(zero).toEqual(0);
    });

    it('Deserialize Float32 Small Number', () => {
        // 0.125 in float32
        // 0000003E
        const float32SmallAsDecArray = [0, 0, 0, 62];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float32SmallAsDecArray);
        const float32Small = transactionType.get("float32").deserialize(buffer);
        expect(float32Small).toEqual(0.125);
    });

    it('Deserialize Float32 Neg Small Number', () => {
        // -0.125 in float32
        // 000000BE
        const float32NegSmallAsDecArray = [0, 0, 0, 190];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float32NegSmallAsDecArray);
        const float32NegSmall = transactionType.get("float32").deserialize(buffer);
        expect(float32NegSmall).toEqual(-0.125);
    });

    it('Deserialize Float64 Zero', () => {
        // zero in float64
        const float64ZeroAsDecArray = [0, 0, 0, 0, 0, 0, 0, 0];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float64ZeroAsDecArray);
        const zero = transactionType.get("float64").deserialize(buffer);
        expect(zero).toEqual(0);
    });

    it('Deserialize Float64 Small Number', () => {
        // 0.125 in float64
        // 000000000000C03F
        const float64SmallAsDecArray = [0, 0, 0, 0, 0, 0, 192, 63];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float64SmallAsDecArray);
        const float64Small = transactionType.get("float64").deserialize(buffer);
        expect(float64Small).toEqual(0.125);
    });

    it('Deserialize Float64 Neg Small Number', () => {
        // 0.125 in float64
        // 000000000000C0BF
        const float64NegSmallAsDecArray = [0, 0, 0, 0, 0, 0, 192, 191 ];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float64NegSmallAsDecArray);
        const float64NegSmall = transactionType.get("float64").deserialize(buffer);
        expect(float64NegSmall).toEqual(-0.125);
    });

    it('Deserialize Float64 Large Integer', () => {
        // 9007199254740992 in float64
        // 0000000000004043
        const float64LargeAsDecArray = [0, 0, 0, 0, 0, 0, 64, 67 ];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float64LargeAsDecArray);
        const float64Large = transactionType.get("float64").deserialize(buffer);
        expect(float64Large).toEqual(9007199254740992);
    });

    it('Deserialize Float64 Large Neg Integer', () => {
        // -9007199254740992 in float64
        // 00000000000040C3
        const float64NegLargeAsDecArray = [0, 0, 0, 0, 0, 0, 64, 195 ];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float64NegLargeAsDecArray);
        const float64LargeSmall = transactionType.get("float64").deserialize(buffer);
        expect(float64LargeSmall).toEqual(-9007199254740992);
    });

    it('Deserialize Float64 Pi', () => {
        // 3.141592653589793115997963468544185161590576171875 in float64
        // 182D4454FB210940
        const float64PiAsDecArray = [24, 45, 68, 84, 251, 33, 9, 64 ];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float64PiAsDecArray);
        const float64Pi = transactionType.get("float64").deserialize(buffer);
        expect(float64Pi).toEqual(3.141592653589793115997963468544185161590576171875);
    });

    it('Deserialize Float128 Large Number', () => {
        // 3.141592653589793115997963468544185161590576171875 in float128
        // beefbeefbeefbeefbeefbeefbeefbeef
        const float128LargeNumAsDecArray = [190, 239, 190, 239, 190, 239, 190, 239, 190, 239, 190, 239, 190, 239, 190, 239];
        const buffer: SerialBuffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
        buffer.pushArray(float128LargeNumAsDecArray);
        const float128LargeNumber = transactionType.get("float128").deserialize(buffer);
        expect(float128LargeNumber).toEqual("BEEFBEEFBEEFBEEFBEEFBEEFBEEFBEEF");
    });


});