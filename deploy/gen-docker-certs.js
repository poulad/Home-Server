const fs = require('fs');

const certs = {
    host: "my-hostname.org:2376"
};
[
    ['ca', 'ca.pem'],
    ['cert', 'cert.pem'],
    ['key', 'key.pem']
].forEach(tuple => {
    certs[tuple[0]] = fs.readFileSync(tuple[1], 'utf8');
});

fs.writeFileSync('docker-certs.json', JSON.stringify(certs));