interface CleanedVersion {
    version: string
    hasReleaseCandidate: boolean
    parsingError: boolean
}

interface MajorMinorPatch {
    major: number
    minor: number
    patch?: number
}

export class ChainSemanticVersion {
    public semverString: CleanedVersion

    /**
     *
     * @param info is a version string, starts with 'v' and followed by semver seperated by '. Example 'v4.0.1'
     *
     */
    constructor(info: string) {
        this.semverString = this.stripReleaseCandidate(this.stripLeadingV(info))
    }

    public supportsLeap3Features(): boolean {
        const versionObject = this.getMajorMinorVersion()
        // must be major version 3 with minor version 1 or better
        // note v3.1.0-rc1 is a pre-v3.1.0 release and does not support 3.0 features
        return (
            // better then 3 ok!
            versionObject.major > 3 ||
            // version 3 must be version 1 or better
            (versionObject.major == 3 &&
                ((versionObject.minor == 1 && !this.semverString.hasReleaseCandidate)
                ||
                versionObject.minor > 1)
            )
        )
    }

    public supportsLeap4Features(): boolean {
        const versionObject = this.getMajorMinorVersion()
        // must be major version 4 with minor version 0 or better
        // note v4.0.0-rc1 is a pre-v4.0.0 release and does not support 4.0 features
        return (
            // better then 4 ok!
            versionObject.major > 4 ||
            // RC versions of v4.0.0 will not work. RC version of other version will work
            (versionObject.major == 4 &&
                !(
                    versionObject.minor == 0 &&
                    versionObject.patch == 0 &&
                    this.semverString.hasReleaseCandidate
                ))
        )
    }

    private stripLeadingV(info: string): string {
        if (info.startsWith('v')) {
            return info.slice(1)
        } else {
            return info
        }
    }

    private stripReleaseCandidate(info: string): CleanedVersion {
        const versionString = info.split('-')
        if (versionString.length > 1) {
            return {
                version: versionString[0],
                hasReleaseCandidate: true,
                parsingError: false,
            }
        }
        return {
            version: info,
            hasReleaseCandidate: false,
            parsingError: false,
        }
    }

    private getMajorMinorVersion(): MajorMinorPatch {
        const semVersions = this.semverString.version.split('.')
        // expect at least major and minor version
        if (semVersions.length < 3) {
            this.semverString.parsingError = true
            return {major: 0, minor: 0}
        }
        // expect a number
        if (isNaN(parseInt(semVersions[0])) || isNaN(parseInt(semVersions[1]))) {
            this.semverString.parsingError = true
            return {major: 0, minor: 0}
        }
        let patch = 0
        if (semVersions.length > 2 && !isNaN(parseInt(semVersions[2]))) {
            patch = parseInt(semVersions[2])
        }
        return {major: parseInt(semVersions[0]), minor: parseInt(semVersions[1]), patch: patch}
    }
}
