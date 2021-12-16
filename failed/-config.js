const fs = require("fs");
const YAML = require("yaml");

module.exports = class ConfigMgmt {
    constructor(path) {
        const readed = fs.readFileSync(path, {
            encoding: "utf8"
        });
        this.cfg = YAML.parse(readed);
    }
    getDIDconfig() {
        return {
            network: this.cfg['network'],
            did: this.cfg['did'],
            registry: this.cfg['registry'],
            keyPath: this.cfg['account-key-path'],
            privateKey: this.cfg['private-key-paht']
        }
    }

    getDBconfig() {}
};