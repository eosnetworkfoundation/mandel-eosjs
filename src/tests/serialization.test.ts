import { TextDecoder, TextEncoder } from 'text-encoding';
import * as ser from "../eosjs-serialize";
import {SerialBuffer} from "../eosjs-serialize";
const transactionAbi = require('../transaction.abi.json');

// setup shared buffer re-established before every test
let buffer: SerialBuffer;

describe('Bool Serialization Deserialization', () => {
    let textEncoder = new TextEncoder();
    let textDecoder = new TextDecoder();
    let transactionType: Map<string, ser.Type> = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);

    /* reset buffer */
    beforeEach(() => {
        buffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
    });

    it('check bool true', () => {
        const hex = "01";
        const expected = true;
        const type = "bool";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check bool false', () => {
        const hex = "00";
        const expected = false;
        const type = "bool";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
});
describe('Floats and Ints Deserialization', () => {
    let textEncoder = new TextEncoder();
    let textDecoder = new TextDecoder();
    let transactionType: Map<string, ser.Type> = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);

    /* reset buffer */
    beforeEach( () => {
        buffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
    });

    it('check int8 0', () => {
        const hex = "00";
        const expected = 0;
        const type = "int8";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check int8 127', () => {
        const hex = "7F";
        const expected = 127;
        const type = "int8";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check int8 -128', () => {
        const hex = "80";
        const expected = -128;
        const type = "int8";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check uint8 0', () => {
        const hex = "00";
        const expected = 0;
        const type = "uint8";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check uint8 1', () => {
        const hex = "01";
        const expected = 1;
        const type = "uint8";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check uint8 254', () => {
        const hex = "FE";
        const expected = 254;
        const type = "uint8";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check uint8 255', () => {
        const hex = "FF";
        const expected = 255;
        const type = "uint8";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });

    it('Deserialize Number One', () => {
        // int value 1 type uint64
        const OneAsDecArray = [1, 0, 0, 0, 0, 0, 0, 0];
        buffer.pushArray(OneAsDecArray);
        const thisType = ser.getType(transactionType, "uint64");
        const oneAsSigned64Int = BigInt(thisType.deserialize(buffer));
        expect(oneAsSigned64Int).toEqual(BigInt(1));
    });

    it('Deserialize Uint64 Large Number', () => {
        // 18446744073709551615 type uint64
        // FF FF FF FF FF FF FF FF
        const LargeUint64AsDecArray = [255, 255, 255, 255, 255, 255, 255, 255];
        buffer.pushArray(LargeUint64AsDecArray);
        const thisType = ser.getType(transactionType, "uint64");
        const LargeUint64 = BigInt(thisType.deserialize(buffer));
        expect(LargeUint64).toEqual(BigInt(18446744073709551615));
    });

    it('Deserialize Number Negative One', () => {
        // signed int value -1 type int 64
        const NegOneAsDecArray = [ 255, 255, 255, 255, 255, 255, 255, 255];
        buffer.pushArray(NegOneAsDecArray);
        const thisType = ser.getType(transactionType, "int64");
        const oneAsSigned64Int = BigInt(thisType.deserialize(buffer));
        expect(oneAsSigned64Int).toEqual(BigInt(-1));
    });

    it('Deserialize Big Signed Number', () => {
        // signed int value -90909090909090909 int 64
        // const serializedBigNumberAsHex: string = "A38B82D9A906BDFE";
        const BigNegativeNumberAsDecArray = [163, 139, 130, 217, 169, 6, 189, 254];
        buffer.pushArray(BigNegativeNumberAsDecArray);
        const thisType = ser.getType(transactionType, "int64");
        const largeSigned64Int = BigInt(thisType.deserialize(buffer));
        expect(largeSigned64Int).toEqual(BigInt(-90909090909090909));
    });

    it('Deserialize Float32 Zero', () => {
        // zero in float32
        const float32ZeroAsDecArray = [0, 0, 0, 0];
        buffer.pushArray(float32ZeroAsDecArray);
        const thisType = ser.getType(transactionType, "float32");
        const zero: number = thisType.deserialize(buffer);
        expect(zero).toEqual(0);
    });

    it('Deserialize Float32 Small Number', () => {
        // 0.125 in float32
        // 0000003E
        const float32SmallAsDecArray = [0, 0, 0, 62];
        buffer.pushArray(float32SmallAsDecArray);
        const thisType = ser.getType(transactionType, "float32");
        const float32Small: number  = thisType.deserialize(buffer);
        expect(float32Small).toEqual(0.125);
    });

    it('Deserialize Float32 Neg Small Number', () => {
        // -0.125 in float32
        // 000000BE
        const float32NegSmallAsDecArray = [0, 0, 0, 190];
        buffer.pushArray(float32NegSmallAsDecArray);
        const thisType = ser.getType(transactionType, "float32");
        const float32NegSmall: number = thisType.deserialize(buffer);
        expect(float32NegSmall).toEqual(-0.125);
    });

    it('Deserialize Float64 Zero', () => {
        // zero in float64
        const float64ZeroAsDecArray = [0, 0, 0, 0, 0, 0, 0, 0];
        buffer.pushArray(float64ZeroAsDecArray);
        const thisType = ser.getType(transactionType, "float64");
        const zero = thisType.deserialize(buffer);
        expect(zero).toEqual(0);
    });

    it('Deserialize Float64 Small Number', () => {
        // 0.125 in float64
        // 000000000000C03F
        const float64SmallAsDecArray = [0, 0, 0, 0, 0, 0, 192, 63];
        buffer.pushArray(float64SmallAsDecArray);
        const thisType = ser.getType(transactionType, "float64");
        const float64Small: number = thisType.deserialize(buffer);
        expect(float64Small).toEqual(0.125);
    });

    it('Deserialize Float64 Neg Small Number', () => {
        // 0.125 in float64
        // 000000000000C0BF
        const float64NegSmallAsDecArray = [0, 0, 0, 0, 0, 0, 192, 191 ];
        buffer.pushArray(float64NegSmallAsDecArray);
        const thisType = ser.getType(transactionType, "float64");
        const float64NegSmall: number = thisType.deserialize(buffer);
        expect(float64NegSmall).toEqual(-0.125);
    });

    it('Deserialize Float64 Large Integer', () => {
        // 9007199254740992 in float64
        // 0000000000004043
        const float64LargeAsDecArray = [0, 0, 0, 0, 0, 0, 64, 67 ];
        buffer.pushArray(float64LargeAsDecArray);
        const thisType = ser.getType(transactionType, "float64");
        const float64Large = thisType.deserialize(buffer);
        expect(float64Large).toEqual(9007199254740992);
    });

    it('Deserialize Float64 Large Neg Integer', () => {
        // -9007199254740992 in float64
        // 00000000000040C3
        const float64NegLargeAsDecArray = [0, 0, 0, 0, 0, 0, 64, 195 ];
        buffer.pushArray(float64NegLargeAsDecArray);
        const thisType = ser.getType(transactionType, "float64");
        const float64LargeSmall = thisType.deserialize(buffer);
        expect(float64LargeSmall).toEqual(-9007199254740992);
    });

    it('Deserialize Float64 Pi', () => {
        // 3.141592653589793115997963468544185161590576171875 in float64
        // 182D4454FB210940
        const float64PiAsDecArray = [24, 45, 68, 84, 251, 33, 9, 64 ];
        buffer.pushArray(float64PiAsDecArray);
        const thisType = ser.getType(transactionType, "float64");
        const float64Pi = thisType.deserialize(buffer);
        expect(float64Pi).toEqual(3.141592653589793115997963468544185161590576171875);
    });
    it('check int128 0', () => {
        const hex = "00000000000000000000000000000000";
        const expected = "0";
        const type = "int128";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int128 1', () => {
        const hex = "01000000000000000000000000000000";
        const type = "int128";
        const expected = "1";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int128 -1', () => {
        const hex = "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
        const type = "int128";
        const expected = "-1";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int128 18446744073709551615', () => {
        const hex = "FFFFFFFFFFFFFFFF0000000000000000";
        const type = "int128";
        const expected = "18446744073709551615";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int128 -18446744073709551615', () => {
        const hex = "0100000000000000FFFFFFFFFFFFFFFF";
        const type = "int128";
        const expected = "-18446744073709551615";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int128 170141183460469231731687303715884105727', () => {
        const hex = "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7F";
        const type = "int128";
        const expected = "170141183460469231731687303715884105727";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int128 -170141183460469231731687303715884105727', () => {
        const hex = "01000000000000000000000000000080";
        const type = "int128";
        const expected = "-170141183460469231731687303715884105727";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int128 -170141183460469231731687303715884105728', () => {
        const hex = "00000000000000000000000000000080";
        const type = "int128";
        const expected = "-170141183460469231731687303715884105728";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('Deserialize Float128 Large Number', () => {
        // 3.141592653589793115997963468544185161590576171875 in float128
        // beefbeefbeefbeefbeefbeefbeefbeef
        const float128LargeNumAsDecArray = [190, 239, 190, 239, 190, 239, 190, 239, 190, 239, 190, 239, 190, 239, 190, 239];
        buffer.pushArray(float128LargeNumAsDecArray);
        const thisType = ser.getType(transactionType, "float128");
        const float128LargeNumber = thisType.deserialize(buffer);
        expect(float128LargeNumber).toEqual("BEEFBEEFBEEFBEEFBEEFBEEFBEEFBEEF");
    });
    it('check uint8[] []', () => {
        const hex = "00";
        const expected = "[]";
        const type = "uint8[]";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = JSON.stringify(thisType.deserialize(buffer));
        expect(expected).toEqual(testValue);
    });
    it('check uint8[] [10]', () => {
        const hex = "010A";
        const expected = "[10]";
        const type = "uint8[]";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = JSON.stringify(thisType.deserialize(buffer));
        expect(expected).toEqual(testValue);
    });
    it('check uint8[] [10,9]', () => {
        const hex = "020A09";
        const expected = "[10,9]";
        const type = "uint8[]";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = JSON.stringify(thisType.deserialize(buffer));
        expect(expected).toEqual(testValue);
    });
    it('check uint8[] [10,9,8]', () => {
        const hex = "030A0908";
        const expected = "[10,9,8]";
        const type = "uint8[]";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = JSON.stringify(thisType.deserialize(buffer));
        expect(expected).toEqual(testValue);
    });
    it('check int16 0', () => {
        const hex = "0000";
        const expected = 0;
        const type = "int16";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int16 32767', () => {
        const hex = "FF7F";
        const expected = 32767;
        const type = "int16";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int16 -32768', () => {
        const hex = "0080";
        const expected = -32768;
        const type = "int16";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });

    it('check uint16 0', () => {
        const hex = "0000";
        const expected = 0;
        const type = "uint16";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check uint16 65535', () => {
        const hex = "FFFF";
        const expected = 65535;
        const type = "uint16";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });

    it('check int32 0', () => {
        const hex = "00000000";
        const expected = 0;
        const type = "int32";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });

    it('check int32 2147483647', () => {
        const hex = "FFFFFF7F";
        const expected = 2147483647;
        const type = "int32";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check int32 -2147483648', () => {
        const hex = "00000080";
        const expected = -2147483648;
        const type = "int32";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check uint32 0', () => {
        const hex = "00000000";
        const expected = 0;
        const type = "uint32";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check uint32 4294967295', () => {
        const hex = "FFFFFFFF";
        const expected = 4294967295;
        const type = "uint32";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue: number = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check uint128 0', () => {
        const hex = "00000000000000000000000000000000";
        const type = "uint128";
        const expected = "0";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check uint128 1', () => {
        const hex = "01000000000000000000000000000000";
        const type = "uint128";
        const expected = "1";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check uint128 18446744073709551615', () => {
        const hex = "FFFFFFFFFFFFFFFF0000000000000000";
        const type = "uint128";
        const expected = "18446744073709551615";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check uint128 340282366920938463463374607431768211454', () => {
        const hex = "FEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
        const type = "uint128";
        const expected = "340282366920938463463374607431768211454";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check uint128 340282366920938463463374607431768211455', () => {
        const hex = "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
        const type = "uint128";
        const expected = "340282366920938463463374607431768211455";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
});

describe('Varint Deserialization', () => {
    let textEncoder = new TextEncoder();
    let textDecoder = new TextDecoder();
    let transactionType: Map<string, ser.Type> = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);

    /* reset buffer */
    beforeEach(() => {
        buffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
    });

    it('check varuint32 0', () => {
        const hex = "00";
        const type = "varuint32";
        const expected = 0;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 127',() => {
        const hex = "7F";
        const type = "varuint32";
        const expected = 127;     buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 128', () => {
        const hex = "8001";
        const type = "varuint32";
        const expected = 128;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 129', () => {
        const hex = "8101";
        const type = "varuint32";
        const expected = 129;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 16383', () => {
        const hex = "FF7F";
        const type = "varuint32";
        const expected = 16383;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 16384', () => {
        const hex = "808001";
        const type = "varuint32";
        const expected = 16384;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 16385 ', () => {
        const hex = "818001";
        const type = "varuint32";
        const expected = 16385;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 2097151', () => {
        const hex = "FFFF7F";
        const type = "varuint32";
        const expected = 2097151;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 2097152', () => {
        const hex = "80808001";
        const type = "varuint32";
        const expected = 2097152;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 2097153', () => {
        const hex = "81808001";
        const type = "varuint32";
        const expected = 2097153;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 268435455', () => {
        const hex = "FFFFFF7F";
        const type = "varuint32";
        const expected = 268435455;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 268435456', () => {
        const hex = "8080808001";
        const type = "varuint32";
        const expected = 268435456;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 268435457', () => {
        const hex = "8180808001";
        const type = "varuint32";
        const expected = 268435457;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 4294967294', () => {
        const hex = "FEFFFFFF0F";
        const type = "varuint32";
        const expected = 4294967294;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varuint32 4294967295', () => {
        const hex = "FFFFFFFF0F";
        const type = "varuint32";
        const expected = 4294967295;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varint32 0', () => {
        const hex = "00";
        const type = "varint32";
        const expected = 0;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varint32 -1', () => {
        const hex = "01";
        const type = "varint32";
        const expected = -1;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varint32 1', () => {
        const hex = "02";
        const type = "varint32";
        const expected = 1;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varint32 -2', () => {
        const hex = "03";
        const type = "varint32";
        const expected = -2;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });


    it('check varint32 2', () => {
        const hex = "04";
        const type = "varint32";
        const expected = 2;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varint32 -2147483647', () => {
        const hex = "FDFFFFFF0F";
        const type = "varint32";
        const expected = -2147483647;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varint32 2147483647', () => {
        const hex = "FEFFFFFF0F";
        const type = "varint32";
        const expected = 2147483647;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
    it('check varint32 -2147483648', () => {
        const hex = "FFFFFFFF0F";
        const type = "varint32";
        const expected = -2147483648;
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(expected).toEqual(testValue);
    });
});
describe('Bool Serialization Exceptions', () => {
    let textEncoder = new TextEncoder();
    let textDecoder = new TextDecoder();
    let transactionType: Map<string, ser.Type> = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);

    /* reset buffer */
    beforeEach(() => {
        buffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
    });

    it('error: expected true or false buffer empty', () => {
        expect(() => {
            const hex = "";
            const type = "bool";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Expected true or false");
    });
    it('error: bool must be true or false', () => {
        expect(() => {
            const testValue = "trues";
            const type = "bool";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Expected true or false");
    });
    it('error: bool can not serialize null', () => {
        expect(() => {
            const testValue: any = null;
            const type = "bool";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Expected true or false");
    });
});
describe('Floats and Ints Serialization Exceptions', () => {
    let textEncoder = new TextEncoder();
    let textDecoder = new TextDecoder();
    let transactionType: Map<string, ser.Type> = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);

    /* reset buffer */
    beforeEach(() => {
        buffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
    });

    it('out of range int8 with 128', () => {
        expect ( () => {
            const testValue = 32768;
            const type = "int16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it ('out of range int8 with -129', () => {
        expect ( () => {
            const type = "int8";
            const testValue = -129;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it ('out of range uint8 with -1', () => {
        expect ( () => {
            const type = "uint8";
            const testValue = -1;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it ('out of range uint8 with 256', () => {
        expect ( () => {
            const type = "uint8";
            const testValue = 256;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it ('out of range int8 with char 128', () => {
        expect ( () => {
            const type = "int8";
            const testValue = '128';
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it ('out of range int8 with char -129', () => {
        expect ( () => {
            const type = "int8";
            const testValue = '-129';
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it ('out of range uint8 with char -1', () => {
        expect ( () => {
            const type = "uint8";
            const testValue = '-1';
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it ('out of range uint8 with char 256', () => {
        expect ( () => {
            const type = "uint8";
            const testValue = '256';
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });

    it('error: read past end of buffer int16 01', () => {
        expect ( () => {
            const hex = "01";
            const type = "int16";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Expected number");
    });
    it('out of range int16 32768', () => {
        expect ( () => {
            const testValue = 32768;
            const type = "int16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range int16 -32769', () => {
        expect ( () => {
            const testValue = -32769;
            const type = "int16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint16 -1', () => {
        expect ( () => {
            const testValue = -1;
            const type = "uint16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint16 655356', () => {
        expect ( () => {
            const testValue = 655356;
            const type = "uint16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('check error: Expected number int32 foo', () => {
        expect ( () => {
            const hex = "foo";
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Odd number of hex digits");
    });
    it('Error: Expected number int32 true', () => {
        expect ( () => {
            const hex = "true";
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Expected hex string");
    });
    it('Error: Expected number int32 []', () => {
        expect ( () => {
            const hex = "[]";
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Expected hex string");
    });
    it('Error: Expected number int32 {}', () => {
        expect ( () => {
            const hex = "{}";
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Expected hex string");
    });
    it('out of range int32 2147483648', () => {
        expect ( () => {
            const testValue = 2147483648;
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range int32 -2147483649', () => {
        expect ( () => {
            const testValue = -2147483649;
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint32 -1', () => {
        expect ( () => {
            const testValue = -1;
            const type = "uint32";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint32 4294967296', () => {
        expect ( () => {
            const testValue = 4294967296;
            const type = "uint32";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it ('out of range uint64 -1', () => {
        expect ( () => {
            const type = "uint64";
            const testValue = -1;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error int64 out of range 9223372036854775808', () => {
        expect ( () => {
            const type = "int64";
            const testValue = 9223372036854775808;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("number is out of range");
    });
    it('Error int64 out of range -9223372036854775809', () => {
        expect ( () => {
            const type = "int64";
            const testValue = -9223372036854775809;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("number is out of range");
    });
    it('Error int64 out of range 18446744073709551616', () => {
        expect ( () => {
            const type = "int64";
            const testValue = 18446744073709551616;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("number is out of range");
    });
    it('Error int128 out of range 170141183460469231731687303715884105728', () => {
        expect ( () => {
            const type = "int128";
            const testValue = 170141183460469231731687303715884105728;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error int128 out of range -170141183460469231731687303715884105729', () => {
        expect ( () => {
            const type = "int128";
            const testValue = -170141183460469231731687303715884105729;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error int128 not a number true', () => {
        expect ( () => {
            const type = "int128";
            const testValue = true;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error uint128 out of range -1', () => {
        expect ( () => {
            const type = "uint128";
            const testValue = -1;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error uint128 not a number true', () => {
        expect ( () => {
            const type = "uint128";
            const testValue = true;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error uint128 out of range 340282366920938463463374607431768211456', () => {
        expect ( () => {
            const type = "uint128";
            const testValue = 340282366920938463463374607431768211456;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
});

describe('Varint Serialization Exceptions', () => {
    let textEncoder = new TextEncoder();
    let textDecoder = new TextDecoder();
    let transactionType: Map<string, ser.Type> = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);

    /* reset buffer */
    beforeEach(() => {
        buffer = new ser.SerialBuffer({
            textEncoder: textEncoder,
            textDecoder: textDecoder,
        });
    });

    it('Error varint32 out of range 2147483648', () => {
        expect(() => {
            const type = "varint32";
            const testValue = 2147483648;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('Error varint32 out of range -2147483649', () => {
        expect(() => {
            const type = "varint32";
            const testValue = -2147483649;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('Error varint32 out of range -1', () => {
        expect(() => {
            const type = "varuint32";
            const testValue = -1;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('Error varint32 out of range 4294967296', () => {
        expect(() => {
            const type = "varuint32";
            const testValue = 4294967296;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
});