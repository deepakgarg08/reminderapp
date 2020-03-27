const crypto = require("crypto");

function sha256(data) {
    let dataa = crypto.createHash("sha256").update(data, "binary").digest("base64");
    console.log('......',dataa);
}

let result = sha256("ohhyeah!");

if (result === "GKK2lB9coPoSiVZ/0wkv6CTrAYBmps1BGS3Vrjw+YdM=") {
    console.log("ohh yeah")
}
