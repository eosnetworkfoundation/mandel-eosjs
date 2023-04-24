## Commit Etiquette
We use templates for Issues, Pull Requests to help us keep things simple and clear.
Commits should be small, frequent with simple messages

## Rebase
We do both small frequest commits to our working branches and sometimes we squash before doing Pull Requests to clean up many commits. 

## Work Items
1. Take an issue and assign to yourself
2. Create your own branch
- abbriavtion for you name or secrete identity 
- have a link to issue 
- ehp/52-special-sauce
3. Do work and test on branch
- currently tests are manually not part of github action
- e-2-e integration tests should be run against jungle testnet 
4. Create pull request into main
5. Have someone else reivew and approve PR
6. Merge into main 

## Create Release 
1. Create release tag and apply to main
- follow semver M.m.p-rcN 
- M = major
- m = minor
- p = patch
- rcN = release candidate (eg rc0)
2. Create release branch from tag
3. Complete Release notes
4. Testing - very manual right now, same as #3 in Work Items above

## Patch Releases
Purpose: need to fix a bug across the current release and previous major release. 
Example: There are three releases
- 3.1
- 3.2 
- 4.0
Skip and deprecate 3.1 release we will not fix that one.
Work on 3.2 as that is the latest and greatest for major release 3
Finally fix 4.0 as that is the latest and greatest for major release 4 

1. Create your own branch off for the previous (3.x) release, make sure to pick the latest major and minor version.
2. Do work and test on your branch, and merge into oldest major release per Work Items above
3. Update Release Notes for oldest branch, update release notes for other releases indicating not fixed
4. Continue onto current major release 




