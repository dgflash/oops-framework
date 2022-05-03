declare global {
 // DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run types'.

/** Properties of a Person. */
export interface IPerson {

    /** Person name */
    name?: (string|null);

    /** Person id */
    id?: (number|null);
}

/** Represents a Person. */
export class Person implements IPerson {

    /**
     * Constructs a new Person.
     * @param [p] Properties to set
     */
    constructor(p?: IPerson);

    /** Person name. */
    public name: string;

    /** Person id. */
    public id: number;

    /**
     * Encodes the specified Person message. Does not implicitly {@link Person.verify|verify} messages.
     * @param m Person message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IPerson, w?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a Person message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: (protobuf.Reader|Uint8Array), l?: number): Person;
}
 
}
export {}