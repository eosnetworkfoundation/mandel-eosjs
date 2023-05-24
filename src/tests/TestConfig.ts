enum TestNet {
    Local,
    Jungle,
    HomeBrew
}

class TestConfig {
    // URL to Nodeos
    public endpoint: string
    // look at finalized header block to get chain information
    public blocksBehind: number
    // timeout
    public expireSeconds: number
    // on very fast single producer system need a search ahead for Tapos Block
    public searchBlockAhead: number
    public sleep: boolean

    constructor(type: TestNet) {
        if (type === TestNet.Local) {
            this.endpoint = 'http://127.0.0.1:8888'
            this.blocksBehind = 1
            this.expireSeconds = 30
            this.searchBlockAhead = 1
            this.sleep = true
            return
        }
        if (type === TestNet.HomeBrew) {
            this.endpoint = 'http://10.3.0.1:8888'
            this.blocksBehind = 1
            this.expireSeconds = 30
            this.searchBlockAhead = 1
            this.sleep = true
            return
        }
        // Default
        this.endpoint = 'https://jungle4.cryptolions.io'
        this.blocksBehind = 3
        this.expireSeconds = 30
        this.searchBlockAhead = 0
        this.sleep = false
    }
}

export {TestConfig, TestNet}
