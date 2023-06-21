import {TextDecoder, TextEncoder} from 'util';
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
    beforeEach(() => {
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
        // warning this getUint64AsNumber will lose percision
        const oneAsSigned64Int = buffer.getUint64AsNumber();
        expect(oneAsSigned64Int).toEqual(1);
    });

    it('Deserialize Uint64 Large Number', () => {
        // 18446744073709551615 type uint64
        // FF FF FF FF FF FF FF FF
        const LargeUint64AsDecArray = [255, 255, 255, 255, 255, 255, 255, 255];
        buffer.pushArray(LargeUint64AsDecArray);
        const thisType = ser.getType(transactionType, "uint64");
        const largeUInt64AsString = thisType.deserialize(buffer);
        expect("18446744073709551615").toEqual(largeUInt64AsString)
    });

    it('Deserialize Number Negative One', () => {
        // signed int value -1 type int 64
        const NegOneAsDecArray = [255, 255, 255, 255, 255, 255, 255, 255];
        buffer.pushArray(NegOneAsDecArray);
        const thisType = ser.getType(transactionType, "int64");
        const oneAsSigned64Int = thisType.deserialize(buffer);
        expect("-1").toEqual(oneAsSigned64Int);
    });

    it('Deserialize Big Signed Number', () => {
        // signed int value -90909090909090909 int 64
        // const serializedBigNumberAsHex: string = "A38B82D9A906BDFE";
        const BigNegativeNumberAsDecArray = [163, 139, 130, 217, 169, 6, 189, 254];
        buffer.pushArray(BigNegativeNumberAsDecArray);
        const thisType = ser.getType(transactionType, "int64");
        const largeSigned64Int = thisType.deserialize(buffer);
        expect("-90909090909090909").toEqual(largeSigned64Int);
    });

    it('Deserialize Float32 Zero', () => {
        // zero in float32
        const float32ZeroAsDecArray = [0, 0, 0, 0];
        buffer.pushArray(float32ZeroAsDecArray);
        const thisType = ser.getType(transactionType, "float32");
        const zero: number = thisType.deserialize(buffer);
        expect(0).toEqual(zero);
    });

    it('Deserialize Float32 Small Number', () => {
        // 0.125 in float32
        // 0000003E
        const float32SmallAsDecArray = [0, 0, 0, 62];
        buffer.pushArray(float32SmallAsDecArray);
        const thisType = ser.getType(transactionType, "float32");
        const float32Small: number = thisType.deserialize(buffer);
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
        const float64NegSmallAsDecArray = [0, 0, 0, 0, 0, 0, 192, 191];
        buffer.pushArray(float64NegSmallAsDecArray);
        const thisType = ser.getType(transactionType, "float64");
        const float64NegSmall: number = thisType.deserialize(buffer);
        expect(float64NegSmall).toEqual(-0.125);
    });

    it('Deserialize Float64 Large Integer', () => {
        // 9007199254740992 in float64
        // 0000000000004043
        const float64LargeAsDecArray = [0, 0, 0, 0, 0, 0, 64, 67];
        buffer.pushArray(float64LargeAsDecArray);
        const thisType = ser.getType(transactionType, "float64");
        const float64Large = thisType.deserialize(buffer);
        expect(float64Large).toEqual(9007199254740992);
    });

    it('Deserialize Float64 Large Neg Integer', () => {
        // -9007199254740992 in float64
        // 00000000000040C3
        const float64NegLargeAsDecArray = [0, 0, 0, 0, 0, 0, 64, 195];
        buffer.pushArray(float64NegLargeAsDecArray);
        const thisType = ser.getType(transactionType, "float64");
        const float64LargeSmall = thisType.deserialize(buffer);
        expect(float64LargeSmall).toEqual(-9007199254740992);
    });

    it('Deserialize Float64 Pi', () => {
        // 3.141592653589793115997963468544185161590576171875 in float64
        // 182D4454FB210940
        const float64PiAsDecArray = [24, 45, 68, 84, 251, 33, 9, 64];
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

describe('Float and Int Serialization', () => {
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
    it('Deserialize Uint64 Large Number', () => {
        const expected = "FFFFFFFFFFFFFFFF";
        const testValue = "18446744073709551615";
        const thisType = ser.getType(transactionType, "uint64");
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('Deserialize Big Signed Number', () => {
        const expected = "A38B82D9A906BDFE";
        const testValue = "-90909090909090909";
        const thisType = ser.getType(transactionType, "int64");
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check uint8 255', () => {
        const expected = "FF";
        const testValue = 255;
        const type = "uint8";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('Deserialize Float32 Small Number', () => {
        const expected = "0000003E";
        const testValue = 0.125;
        const type = "float32";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('Deserialize Float32 Neg Small Number', () => {
        // -0.125 in float32
        // 000000BE
        const expected = "000000BE";
        const testValue = -0.125;
        const type = "float32";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
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
    it('check varuint32 127', () => {
        const hex = "7F";
        const type = "varuint32";
        const expected = 127;
        buffer.pushArray(ser.hexToUint8Array(hex));
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

describe('Name Bytes and String Deserialization', () => {
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

    it('check empty name', () => {
        const type = "name";
        const expected = "";
        const hex = "0000000000000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check name single digit', () => {
        const hex = "0000000000000008";
        const type = "name";
        const expected = "1";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check name simple', () => {
        const hex = "000000000090D031";
        const type = "name";
        const expected = "abcd";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('', () => {
        const hex = "0000004B8184C031";
        const type = "name";
        const expected = "ab.cd.ef";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check name with periods', () => {
        const hex = "3444004B8184C031";
        const type = "name";
        const expected = "ab.cd.ef.1234";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check name strips numbers greater then 5', () => {
        const hex = "000000008002D031";
        const type = "name";
        const expected = "abc.5";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    // this is a weird one.
    // when you deserialize a name ending with "..."
    // eosjs-serialize silently drops the trailing dots
    it('check name leading trailing dots', () => {
        const hex = "00C0522021700C00";
        const type = "name";
        const expected = '..ab.cd.ef';
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check sleepy name', () => {
        const hex = "F0FFFFFFFFFFFFFF";
        const type = "name";
        const expected = "zzzzzzzzzzzz";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check name too long', () => {
        const hex = "FFFFFFFFFFFFFFFF";
        const type = "name";
        // 13th char of a name must be j or lower
        const expected = "zzzzzzzzzzzzj";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check empty byte', () => {
        const hex = "00";
        const type = "bytes";
        const expected = "";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check zero byte', () => {
        const hex = "0100";
        const type = "bytes";
        const expected = "00";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check byte long string', () => {
        const hex = "10AABBCCDDEEFF00010203040506070809";
        const type = "bytes";
        const expected = "AABBCCDDEEFF00010203040506070809";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check empty string', () => {
        const hex = "00";
        const type = "string";
        const expected = "";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check single char string', () => {
        const hex = "017A";
        const type = "string";
        const expected = "z";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check longer string', () => {
        const hex = "1154686973206973206120737472696E672E";
        const type = "string";
        const expected = "This is a string.";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check 128-long string ', () => {
        const hex = "8201222A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A22";
        const type = "string";
        const expected = '"' + '*'.repeat(128) + '"';
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check utf8 string', () => {
        const hex = "455C75303030302020E8BF99E698AFE4B880E4B8AAE6B58BE8AF952020D0ADD182D0BE20D182D0B5D181D1822020D987D8B0D8A720D8A7D8AED8AAD8A8D8A7D8B120F09F918D";
        const type = "string";
        const expected = "\\u0000  这是一个测试  Это тест  هذا اختبار 👍";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
});
describe('String and Byte Exceptions', () => {
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

    it('error: name expected name', () => {
        expect(() => {
            const testValue = true;
            const type = "name";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Expected string containing name");
    });
    it('error: bytes too short', () => {
        expect(() => {
            const testValue = "0";
            const type = "bytes";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Odd number of hex digits");
    });
    it('error: bytes not hex', () => {
        expect(() => {
            const testValue = "yz";
            const type = "bytes";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Expected hex string");
    });
    it('error: bytes expected hex', () => {
        expect(() => {
            const testValue = true;
            const type = "bytes";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Expected string containing hex digits");
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
        expect(() => {
            const testValue = 32768;
            const type = "int16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range int8 with -129', () => {
        expect(() => {
            const type = "int8";
            const testValue = -129;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint8 with -1', () => {
        expect(() => {
            const type = "uint8";
            const testValue = -1;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint8 with 256', () => {
        expect(() => {
            const type = "uint8";
            const testValue = 256;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range int8 with char 128', () => {
        expect(() => {
            const type = "int8";
            const testValue = '128';
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range int8 with char -129', () => {
        expect(() => {
            const type = "int8";
            const testValue = '-129';
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint8 with char -1', () => {
        expect(() => {
            const type = "uint8";
            const testValue = '-1';
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint8 with char 256', () => {
        expect(() => {
            const type = "uint8";
            const testValue = '256';
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });

    it('error: read past end of buffer int16 01', () => {
        expect(() => {
            const hex = "01";
            const type = "int16";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Expected number");
    });
    it('out of range int16 32768', () => {
        expect(() => {
            const testValue = 32768;
            const type = "int16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range int16 -32769', () => {
        expect(() => {
            const testValue = -32769;
            const type = "int16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint16 -1', () => {
        expect(() => {
            const testValue = -1;
            const type = "uint16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint16 655356', () => {
        expect(() => {
            const testValue = 655356;
            const type = "uint16";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('check error: Expected number int32 foo', () => {
        expect(() => {
            const hex = "foo";
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Odd number of hex digits");
    });
    it('Error: Expected number int32 true', () => {
        expect(() => {
            const hex = "true";
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Expected hex string");
    });
    it('Error: Expected number int32 []', () => {
        expect(() => {
            const hex = "[]";
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Expected hex string");
    });
    it('Error: Expected number int32 {}', () => {
        expect(() => {
            const hex = "{}";
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            buffer.pushArray(ser.hexToUint8Array(hex));
            thisType.serialize(buffer, type);
        }).toThrow("Expected hex string");
    });
    it('out of range int32 2147483648', () => {
        expect(() => {
            const testValue = 2147483648;
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range int32 -2147483649', () => {
        expect(() => {
            const testValue = -2147483649;
            const type = "int32";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint32 -1', () => {
        expect(() => {
            const testValue = -1;
            const type = "uint32";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint32 4294967296', () => {
        expect(() => {
            const testValue = 4294967296;
            const type = "uint32";
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("Number is out of range");
    });
    it('out of range uint64 -1', () => {
        expect(() => {
            const type = "uint64";
            const testValue = -1;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error int64 out of range 9223372036854775808', () => {
        expect(() => {
            const type = "int64";
            const testValue = 9223372036854775808;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("number is out of range");
    });
    it('Error int64 out of range -9223372036854775809', () => {
        expect(() => {
            const type = "int64";
            const testValue = -9223372036854775809;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("number is out of range");
    });
    it('Error int64 out of range 18446744073709551616', () => {
        expect(() => {
            const type = "int64";
            const testValue = 18446744073709551616;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("number is out of range");
    });
    it('Error int128 out of range 170141183460469231731687303715884105728', () => {
        expect(() => {
            const type = "int128";
            const testValue = 170141183460469231731687303715884105728;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error int128 out of range -170141183460469231731687303715884105729', () => {
        expect(() => {
            const type = "int128";
            const testValue = -170141183460469231731687303715884105729;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error int128 not a number true', () => {
        expect(() => {
            const type = "int128";
            const testValue = true;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error uint128 out of range -1', () => {
        expect(() => {
            const type = "uint128";
            const testValue = -1;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error uint128 not a number true', () => {
        expect(() => {
            const type = "uint128";
            const testValue = true;
            const thisType = ser.getType(transactionType, type);
            thisType.serialize(buffer, testValue);
            const hex = ser.arrayToHex(buffer.asUint8Array());
            expect(hex).toBeTruthy();
        }).toThrow("invalid number");
    });
    it('Error uint128 out of range 340282366920938463463374607431768211456', () => {
        expect(() => {
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

describe('Time Series Serialization', () => {
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

    it('time_point_sec epoch', () => {
        const type = "time_point_sec";
        const testValue = "1970-01-01T00:00:00.000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toEqual("00000000");
    });
    it('time_point_sec 2018-06-15T19:17:47.000', () => {
        const type = "time_point_sec";
        const testValue = "2018-06-15T19:17:47.000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toEqual("DB10245B");
    });
    it('check time_point epoch', () => {
        const type = "time_point";
        const testValue = "1970-01-01T00:00:00.000";
        const expected = "0000000000000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check time_point first sec', () => {
        const type = "time_point";
        const testValue = "1970-01-01T00:00:00.001";
        const expected = "E803000000000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check time_point 1970-01-01T00:00:00.002', () => {
        const type = "time_point";
        const testValue = "1970-01-01T00:00:00.002";
        const expected = "D007000000000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check time_point 1970-01-01T00:00:00.010', () => {
        const type = "time_point";
        const testValue = "1970-01-01T00:00:00.010";
        const expected = "1027000000000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check time_point 1970-01-01T00:00:00.100', () => {
        const type = "time_point";
        const testValue = "1970-01-01T00:00:00.100";
        const expected = "A086010000000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check time_point 2018-06-15T19:17:47.000', () => {
        const type = "time_point";
        const testValue = "2018-06-15T19:17:47.000";
        const expected = "C0AC3112B36E0500";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check time_point 2018-06-15T19:17:47.999', () => {
        const type = "time_point";
        const testValue = "2018-06-15T19:17:47.999";
        const expected = "18EB4012B36E0500";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check time_point 2060-06-15T19:17:47.999', () => {
        const type = "time_point";
        const testValue = "2060-06-15T19:17:47.999";
        const expected = "18CBC45533240A00";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check block_timestamp_type 2000-01-01T00:00:00.000', () => {
        const type = "block_timestamp_type";
        const testValue = "2000-01-01T00:00:00.000";
        const expected = "00000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check block_timestamp_type 2000-01-01T00:00:00.500', () => {
        const type = "block_timestamp_type";
        const testValue = "2000-01-01T00:00:00.500";
        const expected = "01000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check block_timestamp_type 2000-01-01T00:00:01.000', () => {
        const type = "block_timestamp_type";
        const testValue = "2000-01-01T00:00:01.000";
        const expected = "02000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check block_timestamp_type 2018-06-15T19:17:47.500', () => {
        const type = "block_timestamp_type";
        const testValue = "2018-06-15T19:17:47.500";
        const expected = "B79A6D45";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check block_timestamp_type 2018-06-15T19:17:48.000', () => {
        const type = "block_timestamp_type";
        const testValue = "2018-06-15T19:17:48.000";
        const expected = "B89A6D45";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
});

describe('Timestamp Deserialization', () => {
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

    it('time_point_sec epoch', () => {
        const type = "time_point_sec";
        const hex = "00000000";
        const expected = "1970-01-01T00:00:00.000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('time_point_sec 2018-06-15T19:17:47.000', () => {
        const type = "time_point_sec";
        const expected = "2018-06-15T19:17:47.000";
        const hex = "DB10245B";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check time_point epoch', () => {
        const type = "time_point";
        const expected = "1970-01-01T00:00:00.000";
        const hex = "0000000000000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check time_point first sec', () => {
        const type = "time_point";
        const expected = "1970-01-01T00:00:00.001";
        const hex = "E803000000000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check time_point 1970-01-01T00:00:00.002', () => {
        const type = "time_point";
        const expected = "1970-01-01T00:00:00.002";
        const hex = "D007000000000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check time_point 1970-01-01T00:00:00.010', () => {
        const type = "time_point";
        const expected = "1970-01-01T00:00:00.010";
        const hex = "1027000000000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check time_point 1970-01-01T00:00:00.100', () => {
        const type = "time_point";
        const expected = "1970-01-01T00:00:00.100";
        const hex = "A086010000000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check time_point 2018-06-15T19:17:47.000', () => {
        const type = "time_point";
        const expected = "2018-06-15T19:17:47.000";
        const hex = "C0AC3112B36E0500";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check time_point 2018-06-15T19:17:47.999', () => {
        const type = "time_point";
        const expected = "2018-06-15T19:17:47.999";
        const hex = "18EB4012B36E0500";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check time_point 2060-06-15T19:17:47.999', () => {
        const type = "time_point";
        const expected = "2060-06-15T19:17:47.999";
        const hex = "18CBC45533240A00";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check block_timestamp_type 2000-01-01T00:00:00.000', () => {
        const type = "block_timestamp_type";
        const expected = "2000-01-01T00:00:00.000";
        const hex = "00000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check block_timestamp_type 2000-01-01T00:00:00.500', () => {
        const type = "block_timestamp_type";
        const expected = "2000-01-01T00:00:00.500";
        const hex = "01000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check block_timestamp_type 2000-01-01T00:00:01.000', () => {
        const type = "block_timestamp_type";
        const expected = "2000-01-01T00:00:01.000";
        const hex = "02000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check block_timestamp_type 2018-06-15T19:17:47.500', () => {
        const type = "block_timestamp_type";
        const expected = "2018-06-15T19:17:47.500";
        const hex = "B79A6D45";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check block_timestamp_type 2018-06-15T19:17:48.000', () => {
        const type = "block_timestamp_type";
        const expected = "2018-06-15T19:17:48.000";
        const hex = "B89A6D45";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
});

describe('Name Bytes and String Serialization', () => {
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

    it('check empty name', () => {
        const type = "name";
        const testValue = "";
        const expected = "0000000000000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check name single digit', () => {
        const expected = "0000000000000008";
        const type = "name";
        const testValue = "1";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check name simple', () => {
        const expected = "000000000090D031";
        const type = "name";
        const testValue = "abcd";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('', () => {
        const expected = "0000004B8184C031";
        const type = "name";
        const testValue = "ab.cd.ef";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check name with periods', () => {
        const expected = "3444004B8184C031";
        const type = "name";
        const testValue = "ab.cd.ef.1234";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    // the trailing dots aren't valid
    // they will be accepted on serialization
    // they will be truncated on deserialization
    it('check name leading trailing dots', () => {
        const expected = "00C0522021700C00";
        const type = "name";
        const testValue = "..ab.cd.ef..";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check sleepy name', () => {
        const expected = "F0FFFFFFFFFFFFFF";
        const type = "name";
        const testValue = "zzzzzzzzzzzz";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check name too long', () => {
        const expected = "FFFFFFFFFFFFFFFF";
        const type = "name";
        // 13th character of a name must be 'j' or lower
        // maxes out byte array and extra bits for 13th 'z' are dropped
        // turing the last 'z' into an 'j'
        const testValue = "zzzzzzzzzzzzz";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check thirteenth j', () => {
        const expected = "FFFFFFFFFFFFFFFF";
        const type = "name";
        // 13th character of a name must be 'j' or lower
        const testValue = "zzzzzzzzzzzzj";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check number larger then 5', () => {
        const expected = "000000008002D031";
        const type = "name";
        // ok to serialize in but on deserialization will get striped out
        const testValue = "abc.578";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check empty byte', () => {
        const expected = "00";
        const type = "bytes";
        const testValue = "";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check zero byte', () => {
        const expected = "0100";
        const type = "bytes";
        const testValue = "00";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check byte long string', () => {
        const expected = "10AABBCCDDEEFF00010203040506070809";
        const type = "bytes";
        const testValue = "AABBCCDDEEFF00010203040506070809";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check empty string', () => {
        const expected = "00";
        const type = "string";
        const testValue = "";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check single char string', () => {
        const expected = "017A";
        const type = "string";
        const testValue = "z";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check longer string', () => {
        const expected = "1154686973206973206120737472696E672E";
        const type = "string";
        const testValue = "This is a string.";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check 128-long string ', () => {
        const expected = "8201222A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A22";
        const type = "string";
        const testValue = '"' + '*'.repeat(128) + '"';
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check utf8 string', () => {
        const expected = "455C75303030302020E8BF99E698AFE4B880E4B8AAE6B58BE8AF952020D0ADD182D0BE20D182D0B5D181D1822020D987D8B0D8A720D8A7D8AED8AAD8A8D8A7D8B120F09F918D";
        const type = "string";
        const testValue = "\\u0000  这是一个测试  Это тест  هذا اختبار 👍";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
});
describe('Checksum Serialization', () => {
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
    it('check checksum160 zero', () => {
        const expected = "0000000000000000000000000000000000000000";
        const type = "checksum160";
        const testValue = "0000000000000000000000000000000000000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check checksum160 long', () => {
        const expected = "123456789ABCDEF01234567890ABCDEF70123456";
        const type = "checksum160";
        const testValue = "123456789ABCDEF01234567890ABCDEF70123456";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check checksum256 zero', () => {
        const expected = "0000000000000000000000000000000000000000000000000000000000000000";
        const type = "checksum256";
        const testValue = "0000000000000000000000000000000000000000000000000000000000000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check checksum256 long', () => {
        const expected = "0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF";
        const type = "checksum256";
        const testValue = "0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check checksum512 zero', () => {
        const expected = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        const type = "checksum512";
        const testValue = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check checksum512 long', () => {
        const expected = "0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF";
        const type = "checksum512";
        const testValue = "0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
});
describe('Checksum Deserialization', () => {
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

    it('check checksum160 zero', () => {
        const hex = "0000000000000000000000000000000000000000";
        const type = "checksum160";
        const expected = "0000000000000000000000000000000000000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check checksum160 long', () => {
        const hex = "123456789ABCDEF01234567890ABCDEF70123456";
        const type = "checksum160";
        const expected = "123456789ABCDEF01234567890ABCDEF70123456";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check checksum256 zero', () => {
        const hex = "0000000000000000000000000000000000000000000000000000000000000000";
        const type = "checksum256";
        const expected = "0000000000000000000000000000000000000000000000000000000000000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check checksum256 long', () => {
        const hex = "0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF";
        const type = "checksum256";
        const expected = "0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check checksum512 zero', () => {
        const hex = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        const type = "checksum512";
        const expected = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check checksum512 long', () => {
        const hex = "0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF";
        const type = "checksum512";
        const expected = "0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF0987654321ABCDEF0987654321FFFF1234567890ABCDEF001234567890ABCDEF";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
});
describe('Symbol and Asset Serialization', () => {
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
    it('check symbol_code A', () => {
        const expected = "4100000000000000";
        const type = "symbol_code";
        const testValue = "A";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check symbol_code B', () => {
        const expected = "4200000000000000";
        const type = "symbol_code";
        const testValue = "B";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check symbol_code SYS', () => {
        const expected = "5359530000000000";
        const type = "symbol_code";
        const testValue = "SYS";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check symbol 0,A', () => {
        const expected = "0041000000000000";
        const type = "symbol";
        const testValue = "0,A";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check symbol 1,Z', () => {
        const expected = "015A000000000000";
        const type = "symbol";
        const testValue = "1,Z";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check symbol 4,SYS', () => {
        const expected = "0453595300000000";
        const type = "symbol";
        const testValue = "4,SYS";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset 0 FOO', () => {
        const expected = "000000000000000000464F4F00000000";
        const type = "asset";
        const testValue = "0 FOO";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset 0.0 FOO', () => {
        const expected = "000000000000000001464F4F00000000";
        const type = "asset";
        const testValue = "0.0 FOO";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset 0.00 FOO', () => {
        const expected = "000000000000000002464F4F00000000";
        const type = "asset";
        const testValue = "0.00 FOO";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset 0.000 FOO', () => {
        const expected = "000000000000000003464F4F00000000";
        const type = "asset";
        const testValue = "0.000 FOO";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset 1.2345 SYS', () => {
        const expected = "39300000000000000453595300000000";
        const type = "asset";
        const testValue = "1.2345 SYS";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset -1.2345 SYS', () => {
        const expected = "C7CFFFFFFFFFFFFF0453595300000000";
        const type = "asset";
        const testValue = "-1.2345 SYS";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset[] []', () => {
        const expected = "00";
        const type = "asset[]";
        const testValue: number[] = [];
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset[] ["0 FOO"]', () => {
        const expected = "01000000000000000000464F4F00000000";
        const type = "asset[]";
        const testValue: any[] = ["0 FOO"];
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset[] ["0 FOO","0.000 FOO"]', () => {
        const expected = "02000000000000000000464F4F00000000000000000000000003464F4F00000000";
        const type = "asset[]";
        const testValue: any[] = ["0 FOO","0.000 FOO"];
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset? null', () => {
        const expected = "00";
        const type = "asset?";
        const testValue: any = null;
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check asset? "0.123456 SIX"', () => {
        const expected = "0140E20100000000000653495800000000";
        const type = "asset?";
        const testValue = "0.123456 SIX";
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check extended_asset {"quantity":"0 FOO","contract":"bar"}', () => {
        const expected = "000000000000000000464F4F00000000000000000000AE39";
        const type = "extended_asset";
        const testValue = {"quantity":"0 FOO","contract":"bar"};
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
    it('check extended_asset {"quantity":"0.123456 SIX","contract":"seven"}', () => {
        const expected = "40E201000000000006534958000000000000000080A9B6C2";
        const type = "extended_asset";
        const testValue = {"quantity":"0.123456 SIX","contract":"seven"};
        const thisType = ser.getType(transactionType, type);
        thisType.serialize(buffer, testValue);
        const hex = ser.arrayToHex(buffer.asUint8Array());
        expect(hex).toBeTruthy();
        expect(hex).toEqual(expected);
    });
});
describe('Symbol and Asset Deserialization', () => {
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
    it('check symbol_code A', () => {
        const hex = "4100000000000000";
        const type = "symbol_code";
        const expected = "A";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check asset? "0.123456 SIX"', () => {
        const hex = "0140E20100000000000653495800000000";
        const type = "asset?";
        const expected = "0.123456 SIX";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check extended_asset {"quantity":"0 FOO","contract":"bar"}', () => {
        const hex = "000000000000000000464F4F00000000000000000000AE39";
        const type = "extended_asset";
        const expected = {"quantity":"0 FOO","contract":"bar"};
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
    it('check symbol 0,A', () => {
        const hex = "0041000000000000";
        const type = "symbol";
        const expected = "0,A";
        buffer.pushArray(ser.hexToUint8Array(hex));
        const thisType = ser.getType(transactionType, type);
        const testValue = thisType.deserialize(buffer);
        expect(testValue).toEqual(expected);
    });
});
