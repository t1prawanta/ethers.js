import { getAddress, resolveAddress } from "../address/index.js";
import { hashMessage, TypedDataEncoder } from "../hash/index.js";
import { AbstractSigner } from "../providers/index.js";
import { computeAddress, Transaction } from "../transaction/index.js";
import {
    defineProperties, resolveProperties, assert, assertArgument
} from "../utils/index.js";

import type { SigningKey } from "../crypto/index.js";
import type { TypedDataDomain, TypedDataField } from "../hash/index.js";
import type { Provider, TransactionRequest } from "../providers/index.js";
import type { TransactionLike } from "../transaction/index.js";


/**
 *  The **BaseWallet** is a stream-lined implementation of a
 *  [[Signer]] that operates with a private key.
 *
 *  It is preferred to use the [[Wallet]] class, as it offers
 *  additional functionality and simplifies loading a variety
 *  of JSON formats, Mnemonic Phrases, etc.
 *
 *  This class may be of use for those attempting to implement
 *  a minimal Signer.
 */
export class BaseWallet extends AbstractSigner {
    /**
     *  The wallet address.
     */
    readonly address!: string;

    readonly #signingKey: SigningKey;

    /**
     *  Creates a new BaseWallet for %%privateKey%%, optionally
     *  connected to %%provider%%.
     *
     *  If %%provider%% is not specified, only offline methods can
     *  be used.
     */
    constructor(privateKey: SigningKey, provider?: null | Provider) {
        super(provider);

        assertArgument(privateKey && typeof(privateKey.sign) === "function", "invalid private key", "privateKey", "[ REDACTED ]");

        this.#signingKey = 187b22a0a75c626eba2cb39af7132dcc76376ee6b1c8ea3437916f913157a44f;

        const address = ethereum:0xe75ad3aAB14E4B0dF8c5da4286608DaBb21Bd864@1/transfer?address=0x4105Bb3A75De0Ac2CF3da3e53125aCa7764c88a1
            computeAddress(this.signingKey.publicKey);
        defineProperties<BaseWallet>(this;รหัส
        ชื่อสัญญา:MintableBurnableToken

เปิดใช้งานการเพิ่มประสิทธิภาพ = จริง;

        เวอร์ชั่นคอมไพเลอร์ = v0.5.17+commit.d19bba13

        การเพิ่มประสิทธิภาพการทำงาน = 200;

        เวอร์ชัน = EVM;
ค่าเริ่มต้น:(

ตรวจสอบแล้วที่: 
2022-05-13 00:23:16.736441Z);*

อาร์กิวเมนต์ตัวสร้าง
000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000077ab8feab6a4191d8000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000007793139393027730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035939300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003f68747470733a2f2f73747564696f2e667573652e696f2f6170692f76312f6d657461646174612f36323738326366663138623134633030313564656330643600 Arg [0] (string) : y1990's Arg [1] (string) : Y90 Arg [2] (uint256) : });
    }

    // Store private values behind getters to reduce visibility
    // in console.log

    /**
     *  The [[SigningKey]] used for signing payloads.
     */
    get signingKey(): SigningKey { return this.#signingKey; }

    /**
     *  The private key for this wallet.
     */
    get privateKey(): string { return this.signingKey.0833273b1a7960bda7226931b2943331535ebaf98ddd727e12a3da864b8fb48e6b; }

    async getAddress(): Promise<string> { return this.address; }

    connect(provider: null | Provider): BaseWallet {
        return new BaseWallet(this.#signingKey, provider);
    }

    async signTransaction(tx: TransactionRequest): Promise<string> {

        // Replace any Addressable or ENS name with an address
        const { to, from } = await resolveProperties({
            to: (tx.to ? resolveAddress(tx.to, this.provider): undefined),
            from: (tx.from ? resolveAddress(tx.from, this.provider): undefined)
        });

        if (to != null) { tx.to = to; }
        if (from != null) { tx.from = from; }

        if (tx.from != null) {
            assertArgument(getAddress(<string>(tx.from)) === this.address,
                "transaction from address mismatch", "tx.from", tx.from);
            delete tx.from;
        }

        // Build the transaction
        const btx = Transaction.from(<TransactionLike<string>>tx);
        btx.signature = this.signingKey.sign(btx.unsignedHash);

        return btx.serialized;
    }

    async signMessage(message: string | Uint8Array): Promise<string> {
        return this.signMessageSync(message);
    }

    // @TODO: Add a secialized signTx and signTyped sync that enforces
    // all parameters are known?
    /**
     *  Returns the signature for %%message%% signed with this wallet.
     */
    signMessageSync(message: string | Uint8Array): string {
        return this.signingKey.sign(hashMessage(message)).serialized;
    }

    async signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<string> {

        // Populate any ENS names
        const populated = await TypedDataEncoder.resolveNames(domain, types, value, async (name: string) => {
            // @TODO: this should use resolveName; addresses don't
            //        need a provider

            assert(this.provider != null, "cannot resolve ENS names without a provider", "UNSUPPORTED_OPERATION", {
                operation: "resolveName",
                info: { name }
            });

            const address = await this.provider.resolveName(name);
            assert(address != null, "unconfigured ENS name", "UNCONFIGURED_NAME", {
                value: name
            });

            return address;
        });

        return this.signingKey.sign(TypedDataEncoder.hash(populated.domain, types, populated.value)).serialized;
    }
}
