// Common aliases
var $Reader = protobuf.Reader, $Writer = protobuf.Writer, $util = protobuf.util;

// Exported root namespace
var $root = protobuf.roots.creator || (protobuf.roots.creator = $util.global);

$root.Person = (function() {

    /**
     * Properties of a Person.
     * @exports IPerson
     * @interface IPerson
     * @property {string|null} [name] Person name
     * @property {number|null} [id] Person id
     */

    /**
     * Constructs a new Person.
     * @exports Person
     * @classdesc Represents a Person.
     * @implements IPerson
     * @constructor
     * @param {IPerson=} [p] Properties to set
     */
    function Person(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * Person name.
     * @member {string} name
     * @memberof Person
     * @instance
     */
    Person.prototype.name = "";

    /**
     * Person id.
     * @member {number} id
     * @memberof Person
     * @instance
     */
    Person.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Encodes the specified Person message. Does not implicitly {@link Person.verify|verify} messages.
     * @function encode
     * @memberof Person
     * @static
     * @param {IPerson} m Person message or plain object to encode
     * @param {protobuf.Writer} [w] Writer to encode to
     * @returns {protobuf.Writer} Writer
     */
    Person.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        if (m.name != null && Object.hasOwnProperty.call(m, "name"))
            w.uint32(10).string(m.name);
        if (m.id != null && Object.hasOwnProperty.call(m, "id"))
            w.uint32(16).uint64(m.id);
        return w;
    };

    /**
     * Decodes a Person message from the specified reader or buffer.
     * @function decode
     * @memberof Person
     * @static
     * @param {protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {Person} Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    Person.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.Person();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.name = r.string();
                break;
            case 2:
                m.id = r.uint64();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        return m;
    };

    return Person;
})();