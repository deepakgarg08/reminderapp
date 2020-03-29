const crypto = require ('crypto')
let password =  "ohhyeah!"
password = crypto.createHash("sha256").update(password, "binary").digest("base64");
console.log('password::', password);