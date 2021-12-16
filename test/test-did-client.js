const TEST_NET = 'https://api.baobab.klaytn.net:8651/';
const regABI = '/home/pslabmh/klaytn-did-lmp/verifier/utils/did_client/registry-abi.json';
const regAddr = '0xbCd509F468Fbc017fE615dE0b9cEfAa1Fbf335A6';
const did = 'did:kt:971dff7b7b9c57a24463a4fd0cb9b5ad6fcd2219';
const didPKey = '0xd4a7db5b054b7f44749ad0bc46bfdacdd6435353bf0397256799555092aabdaa'
// EcdsaSecp256k1RecoveryMethod2020, EcdsaSecp256k1VerificationKey2019

const did2 = 'did:kt:6fefc434aca00f3b465b1d7a311bdb1fd9de95ee'
const privateKEY = '0x9752165f09138b21d2a9f5fda0df769009bfe8c6809d2c812345b2af61342efa';

const account = '0x6fefc434aca00f3b465b1d7a311bdb1fd9de95ee';
const keyFileJson = '/home/pslabmh/klaytn-did-lmp/verifier/res/key-verfier-deployer.json'



const DIDClient = require('../utils/did_client/index');
const klayDID = new DIDClient({
    network: TEST_NET,
    regABI: regABI,
    regAddr: regAddr
});


const type1 = 'EcdsaSecp256k1RecoveryMethod2020'
const type2 = 'EcdsaSecp256k1VerificationKey2019'

async function writeTest(){
    klayDID.auth.login({ account: account, privateKey: privateKEY });
    //klayDID.auth.login({ path: keyFileJson, password: 'interface1@' });
    //console.log(klayDID.auth.isLogin());
    //console.log(klayDID.auth.getAccount());


    const curNonce = await klayDID.getNonce(did2);
    const fName = 'disableService';
    const regAddr = '0xbCd509F468Fbc017fE615dE0b9cEfAa1Fbf335A6'.toLowerCase();
    console.log(curNonce.value)
    const msg = fName+regAddr+curNonce.value+did2;
    const sig = klayDID.sign(msg,type1, didPKey)
    const VRS = sig.VRS;
    const result = await klayDID.revokePubKeyBySinger(did2, did2+'#scv2', VRS);
    console.log(result);
    const document = await klayDID.getDocument(did2);
    console.log(document);
}
writeTest();


/*
 Success List 
 1. getDocument
 2. extractPubKey
 3. getNonce
 4. creatPairKey
 5. auth.isLogin()
 6. auth.getAccount()
 7. auth.login()
 8. createDocument()
 9. setController()
 10. addPubKey()
 11. addService()
 12. revokePubKey()
 13. revokeService()
 14. addPubKeyBySigner()
 15. addServiceBySigner()
 16. revokePubKeyBySigner()
 17. revokePubKeyBySigner()
*/

/*
async function getTest(){
    //1. success
    //const document = await klayDID.getDocument(did);
    //console.log(document);

    //2. success
    //const pubkey = klayDID.extractPubKey(document,did+'#key-1');
    //console.log(pubkey);

    //3. success 
    //const nonce = await klayDID.getNonce(did);
    //console.log(nonce);

    //4. success
    //const pairKey = klayDID.creatPairKey('EcdsaSecp256VerificationKey2019');
    //console.log(pairKey)

} getTest(); */