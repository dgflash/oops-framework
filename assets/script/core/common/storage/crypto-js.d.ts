export const global: any;
declare global {

    class WordArray { }

    namespace CryptoJS {

        namespace AES {
            export function encrypt(message: string, key: string, cfg: { iv: string, mode: mode, padding: pad }): WordArray;

            export function decrypt(text: string, key: string, cfg: { iv: string, mode: mode, padding: pad }): WordArray;
        }

        namespace enc {
            namespace Utf8 {
                export function parse(key: WordArray): string;
                export function stringify(word: WordArray): string;
            }
        }

        export enum mode {
            CBC
        }

        export enum pad {
            Pkcs7
        }
    }
}