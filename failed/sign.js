const Caver = require("caver-js");
const caver = new Caver();
const secp256k1 = require('secp256k1');
const {Keccak} = require('sha3');
const hash = new Keccak(256);

module.exports = {

    /**
     * @dev 
     * @param signature:
     * @param data:
     * @param pubKey:
     * @returns Bool:
     **/
    isValidSign: (signature, data, pubKey)=>{
        if(pubKey.keyType == 'EcdsaSecp256k1RecoveryMethod2020')
            return isValid_Secpk1_Recovery2020(signature, data, pubKey.pubKeyData);
        else if(pubKey.keyType == 'EcdsaSecp256k1VerificationKey2019')
            return isValid_Secpk1_2019(signature, data, pubKey.pubKeyData);
        return false;
    },

    /**
     * @dev
     * @param data: (string)
     * @param privateKey: hex string ex. 0x (string)
     * @return signature: hex string ex. 0x (string)
     * */ 
    sign: (data, privateKey)=>{
        const data32 = hash.update(Buffer.from(data)).digest();
        const pKey = Buffer.from(privateKey.replace("0x",""),'hex');
        const sigObj = secp256k1.ecdsaSign(data32, pKey);

        return '0x'+Buffer.from(sigObj.signature).toString('hex');
    },
}


/**
 * @param signature: value signed file metadata with private key (0x{hex}:65byte:module->caver.klay.accounts.sign)
 * @param data: file meta contained in signature
 * @param pubKey: public key(address) in document (0x{Hex.toLowCase})
 */
function isValid_Secpk1_Recovery2020(signature, data, pubKeyAddr){
    const signerAddress = caver.klay.accounts.recover(data, signature);
    return (pubKeyAddr == signerAddress.toLowerCase());
}

/**
 * @param signature: value signed file metadata with private key (0x{hex}:64byte:module->secp256k1)
 * @param data: file meta contained in signature
 * @param pubKey: public key in document (0x{Hex})
 */
function isValid_Secpk1_2019(signature, data, pubKey){

    const pureHexKey = pubKey.replace("0x", "");
    const uint8ArrPubKey = Uint8Array.from(Buffer.from(pureHexKey,'hex'));

    const msg32 = hash.update(Buffer.from(data)).digest();
    
    const pureHexSig = signature.replace("0x","");

    const bytesSig = Buffer.from(pureHexSig,'hex'); 
    // pubKey -> buffer byte

    return secp256k1.ecdsaVerify(bytesSig, msg32, uint8ArrPubKey);
}