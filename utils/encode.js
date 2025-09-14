// helper untuk encode / decode base64 yang aman untuk URL
const encode = (str) => {
return Buffer.from(str, 'utf8').toString('base64').replace(/=+$/g, '');
};


const decode = (b64) => {
// tambahkan padding yang diperlukan
const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
const full = b64 + pad;
return Buffer.from(full, 'base64').toString('utf8');
};


module.exports = { encode, decode };
