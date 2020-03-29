const crypto = require ('crypto')
let password = "mypassword"
password = crypto.createHash("sha256").update(password, "binary").digest("base64");
console.log('password::', password);