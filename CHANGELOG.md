# Changelog

## v2.0.0

Changed:

* Update from QUnit 2.1 to QUnit 2.11. See [upstream release notes](https://github.com/qunitjs/qunit/blob/2.11.2/History.md). [#138](https://github.com/qunitjs/node-qunit/issues/138)

Removed:

* **(SEMVER-MAJOR)** Drop support for Node.js 8 and earlier, per [Node.js LTS schedule](https://github.com/nodejs/Release). Node 10 or higher is now required. [#144](https://github.com/qunitjs/node-qunit/pull/144)

## v1.0.0

This release upgrades QUnit to 2.x. See also <https://qunitjs.com/upgrade-guide-2.x/>.

Changed:

* **(SEMVER-MAJOR)** Update qunitjs version from 1.23.1 to 2.1.1. (Timo Tijhof)
* Update istanbul from 0.2-harmony to 0.4.5. [#127](https://github.com/qunitjs/node-qunit/issues/127)
* doc: Update description and add npm version badge to readme.

Removed:

* **(SEMVER-MAJOR)** Drop support for legacy Node.js, per [Node.js LTS schedule](https://github.com/nodejs/LTS/tree/a5b8bc19b5#readme). Node 4 or higher is now required.

## v0.9.3

**Note:** The next release will drop support for QUnit 1.x. The new API already works in QUnit 1.23. Use node-qunit 0.9.3 to migrate first, for a seamless upgrade to QUnit 2 after this. See <https://qunitjs.com/upgrade-guide-2.x/> for more information.

Changed:

* Update qunitjs version from 1.10.0 to 1.23.1. (Yomi Osamiluyi)
* tests: Use shorter timeouts to speed up the async test fixtures.

## v0.9.2

Fixes:

* Add support for Node 6 and Node 7. (Timo Tijhof) [#133](https://github.com/qunitjs/node-qunit/issues/133)

## v0.9.0

Removed:

* Removed buggy regexp option from instrument filter. (Bruno Jouhier) [#126](https://github.com/qunitjs/node-qunit/pull/126)

## v0.8.0

Added:
* Support instrumentation of multiple files through a new `coverage.files` option. (Bruno Jouhier) [#125](https://github.com/qunitjs/node-qunit/pull/125)