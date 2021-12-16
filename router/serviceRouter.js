const path = "/service";
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

exports.serviceRouter = (app) => {
  app.post(`${path}`, async (req, res)=>{

        /*
        1. const scvConfig = req.body
        2. check format
        3. check alreday exist service
        4. check valid signature
        5. register scvConfig at LDAP
        */
        const scvConfig = req.body;
        const err = checkScvConfig(scvConfig);
        if(err != null){ 
          res.send(err);
          return;
        } 

        const event = ldapClient.searchService(scvConfig.service.did);
        
        event.on('search', async (results)=>{
          const storageInfo  = results[0];

          if(storageInfo != null) {
            res.send('Already exist service!');
            return;
          }

          // const sDid = scvConfig.service.did;
          // const pubKeyId = scvConfig.auth.pubkeyID;
          // const signature = scvConfig.auth.signature;
          // const signatureData = JSON.stringify(scvConfig.service) + JSON.stringify(scvConfig['user-enroll']);
          // const results = await didClient.didAuth(sDid, pubKeyId, signature, signatureData);
          // const isValid = results[0];
          // const resultMsg = results[1];
          const isValid = true;

          if(!isValid){
            res.send(resultMsg);
          }else{
         //   ldapClient.addService(uDID, privilege, storageDN);
            res.send("Success Enroll");
          }   
        });
    });

}

function checkScvConfig(cfg){
  const auth = cfg.auth;
  if(auth.signature == null || auth.pubkeyID == null){
    return 'User enroll config has no [signature or pubKeyID]';
  }

  const scv = cfg.service;
  if(scv == null || scv.name == null 
      || scv.did == null || scv.endPoint == null){
    return 'User enroll config has no [name or did or endpoint]';
  }

  const userEnroll = cfg['user-enroll'];
  if(userEnroll == null || userEnroll.must == null){
    return 'User enroll config has no [user-enroll or user-enroll.must]';
  }
}
