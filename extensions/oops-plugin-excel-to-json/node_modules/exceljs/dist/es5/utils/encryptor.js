'use strict';

var crypto = require('crypto');

var Encryptor = {
  /**
   * Calculate a hash of the concatenated buffers with the given algorithm.
   * @param {string} algorithm - The hash algorithm.
   * @returns {Buffer} The hash
   */
  hash: function hash(algorithm) {
    var hash = crypto.createHash(algorithm);

    for (var _len = arguments.length, buffers = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      buffers[_key - 1] = arguments[_key];
    }

    hash.update(Buffer.concat(buffers));
    return hash.digest();
  },

  /**
   * Convert a password into an encryption key
   * @param {string} password - The password
   * @param {string} hashAlgorithm - The hash algoritm
   * @param {string} saltValue - The salt value
   * @param {number} spinCount - The spin count
   * @param {number} keyBits - The length of the key in bits
   * @param {Buffer} blockKey - The block key
   * @returns {Buffer} The encryption key
   */
  convertPasswordToHash: function convertPasswordToHash(password, hashAlgorithm, saltValue, spinCount) {
    hashAlgorithm = hashAlgorithm.toLowerCase();
    var hashes = crypto.getHashes();

    if (hashes.indexOf(hashAlgorithm) < 0) {
      throw new Error("Hash algorithm '".concat(hashAlgorithm, "' not supported!"));
    } // Password must be in unicode buffer


    var passwordBuffer = Buffer.from(password, 'utf16le'); // Generate the initial hash

    var key = this.hash(hashAlgorithm, Buffer.from(saltValue, 'base64'), passwordBuffer); // Now regenerate until spin count

    for (var i = 0; i < spinCount; i++) {
      var iterator = Buffer.alloc(4); // this is the 'special' element of Excel password hashing
      // that stops us from using crypto.pbkdf2()

      iterator.writeUInt32LE(i, 0);
      key = this.hash(hashAlgorithm, key, iterator);
    }

    return key.toString('base64');
  },

  /**
   * Generates cryptographically strong pseudo-random data.
   * @param size The size argument is a number indicating the number of bytes to generate.
   */
  randomBytes: function randomBytes(size) {
    return crypto.randomBytes(size);
  }
};
module.exports = Encryptor;
//# sourceMappingURL=encryptor.js.map
