const path = "/user";
const DIDClient = require('../utils/did_client/index');
const LDAPClient = require('../utils/ldap_client');
const DIDCfg = require('../utils/did_cfg');
const didCfg = new DIDCfg();
const didClient = new DIDClient({
    network: didCfg.getNetwork(),
    regABI: didCfg.getDidABI(),
    regAddr: didCfg.getDidAddr()
});
const ldapClient = new LDAPClient();


exports.userRouter = (app) => {
    /**
     * @param uDID: Did format (format -> klaytn did registry)
     * @param pubKeyID: Key id in document (ex. key-1)
     * @param signature: Data signed with private key (did+privilege)
     * @param lastName: 
     * @param firstName: name
     * @param privilege: Data used to sign
     * @param sDID: Storage service did 
    */    
    app.post(path, async (req, res)=>{
        const {uDID, pubKeyID, signature, sn, cn ,privilege, sDID} = {
            uDID: req.body.did,
            pubKeyID: `${req.body.did}#${req.body.keyid}`,
            signature: req.body.signature,
            sn: req.body.lastName,
            cn: req.body.firstName,
            privilege: req.body.privilege,
            sDID: req.body.storageDID
        };
        const event = ldapClient.searchUser(sDID, uDID);

        event.on('search', async (results)=>{
            const storageInfo  = results[0];
            const userInfo = results[1];

            const storageDN = storageInfo.dn;

            if(storageInfo == null) {
                res.send('Not exist service!');
                return;
            }

            if(userInfo != null){
                res.send('Already user!');
                return;
            }

            // const results = await didClient.didAuth(did, pubKeyID, signature, filesMeta);
            // const isValid = results[0];
            // const resultMsg = results[1];
            const isValid = true;

            if(!isValid){
                res.send(resultMsg);
            }else{
                {did, sn, cn, privilege} 
                ldapClient.addUser({
                    did: uDID, 
                    sn: sn,
                    cn: cn,
                    privilege: privilege}, storageDN);
                res.send("Success Enroll");
            }    
        });
    });



    /**
     * @param uDID: Did format (format -> klaytn did registry)
     * @param pubKeyID: Key id in document (ex. key-1)
     * @param signature: Data signed with private key
     * @param fileName
     * @param fileType
     * @param fileSize

     * @param filesMetaHash: Data used to sign
     * @param sDID: Storage service did
    */
    app.get(`${path}/storage/credential`, async (req, res) => {
        const {uDID,pubKeyID,signature, fileName, fileSize, fileType, fileDesc, contentType, filesMetaHash, sDID} = {
            uDID: req.query.did,
            pubKeyID: `${req.query.did}#${req.query.keyid}`,
            signature: req.query.signature,
            fileName: req.query.contentName,
            fileType: req.query.fileType,
            fileSize: req.query.contentSize,
            fileDesc: req.query.contentDesc,
            contentType: req.query.contentType,
            filesMetaHash: req.query.contentsMetaHash,
            sDID: req.query.storageDID
        };

        const NFT = req.query.NFT;

        console.log("@")
        console.log(NFT)
        console.log(fileDesc)
        console.log("#")

        const event = ldapClient.searchUser(sDID, uDID);
        event.on('search', async (results)=>{


            console.log('fdsfdsadsfaf')
            const storageInfo  = results[0];
            const userInfo = results[1];

            if(storageInfo == null) {
                res.send('Not exist service!');
                return;
            }
            if(userInfo == null){
                res.send('Not exist user!');
                return;
            }
            const authResults = await didClient.didAuth(uDID, pubKeyID, signature, filesMetaHash);
            const isValid = authResults[0];
            const resultMsg = authResults[1];

            //const isValid = true
            if(!isValid){
                console.log(resultMsg)
                res.send(resultMsg);
            }else{
                const serviceInfo = {did: sDID, name: 'serviceName', endPoint: 'http://203.250.77.120:8000/accesstoken'}; //modify!
                const userInfo =  {
                    did: uDID, 
                    privilege: 'all', 
                    keyID: pubKeyID, 
                    sig: signature, 
                    fileName: fileName,
                    fileType: fileType,
                    fileSize: fileSize,
                    fileDesc: fileDesc,
                    contentType: contentType,
                    filesMetaHash: filesMetaHash,
                    NFT: NFT
                }; //modify!
                const createdTime = new Date()+" ";

                const pKeyObj = didCfg.getRandomPrivatekey(); //pKeyObj: {id:"pubKeyID", type: "", value: "privateKey" }
                const vDid = didCfg.getDid();
                const vEndpoint = didCfg.getEndpoint();
                const credentialData = createdTime.toString()+JSON.stringify(serviceInfo)+JSON.stringify(userInfo);

                const credentialSig = didClient.sign(credentialData, pKeyObj.type, pKeyObj.value );
                const verifierInfo  = { did: vDid, keyID: pKeyObj.id, sig: credentialSig, endpoint: vEndpoint };
                
                console.log({
                    createdTime: createdTime,
                    service: serviceInfo,
                    user: userInfo,
                    verifier: verifierInfo
                })
                console.log("#")
                res.send({
                    createdTime: createdTime,
                    service: serviceInfo,
                    user: userInfo,
                    verifier: verifierInfo
                });
            }            
        });
    });
};

