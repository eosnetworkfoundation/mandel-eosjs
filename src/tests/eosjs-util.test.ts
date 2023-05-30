import {ChainSemanticVersion} from '../ChainSemanticVersion'

const version3NoSupport = ['v3.1.0-rc4', 'v3.0.99-rc1', 'v3.0.99']
const version3WithSupport = [
    'v3.2.0-rc1',
    'v3.2.0-rc2',
    'v3.2.0-rc3',
    'v3.1.0',
    'v3.1.1',
    'v3.1.2',
    'v3.1.3',
    'v3.1.4',
    'v3.2.0',
    'v3.2.1',
    'v3.2.2',
    'v3.2.3',
]
const version4NoSupport = ['v4.0.0-rc1', 'v4.0.0-rc2', 'v4.0.0-rc3']
const version4WithSupport = ['v4.0.0', 'v4.0.1-rc1', 'v4.0.1']

describe('test parse semver string', () => {
    it('Lacks Version 3 Support', () => {
        version3NoSupport.forEach((version) => {
            const thisService = new ChainSemanticVersion(version)
            expect(thisService.supportsLeap3Features()).not.toBeTruthy()
            expect(thisService.supportsLeap4Features()).not.toBeTruthy()
        })
    })
    it('Has Version 3 Support', () => {
        version3WithSupport.forEach((version) => {
            const thisService = new ChainSemanticVersion(version)
            expect(thisService.supportsLeap3Features()).toBeTruthy()
            expect(thisService.supportsLeap4Features()).not.toBeTruthy()
        })
    })
    it('Lacks Version 4 Support', () => {
        version4NoSupport.forEach((version) => {
            const thisService = new ChainSemanticVersion(version)
            expect(thisService.supportsLeap3Features()).toBeTruthy()
            expect(thisService.supportsLeap4Features()).not.toBeTruthy()
        })
    })
    it('Has Version 4 Support', () => {
        version4WithSupport.forEach((version) => {
            const thisService = new ChainSemanticVersion(version)
            expect(thisService.supportsLeap3Features()).toBeTruthy()
            expect(thisService.supportsLeap4Features()).toBeTruthy()
        })
    })
    it('Check V4 No Patch with RC', () => {
        // check version 4.0 no patch level will pass
        const thisService = new ChainSemanticVersion('v4.0-rc12')
        expect(thisService.supportsLeap3Features()).toBeTruthy()
        expect(thisService.supportsLeap4Features()).not.toBeTruthy()
    })
    it('Check V4 No Patch', () => {
        // check version 4.0 no patch level will pass
        const thisServiceZero = new ChainSemanticVersion('v4.0')
        expect(thisServiceZero.supportsLeap3Features()).toBeTruthy()
        expect(thisServiceZero.supportsLeap4Features()).toBeTruthy()
        // check version 4.1 no patch level will pass
        const thisServiceOne = new ChainSemanticVersion('v4.1')
        expect(thisServiceOne.supportsLeap3Features()).toBeTruthy()
        expect(thisServiceOne.supportsLeap4Features()).toBeTruthy()
    })
})
