const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const nodeApk = require("node-apk");

router.get("/app-manifest", async (req, res) => {
  // #swagger.tags = ['Android']
  // #swagger.description = 'get app manifest' 
  let auth = req.app.encryption.check_token(req.headers.authorization);
  if (auth == null) {
    /* #swagger.responses[400] = { 
      description: "Token Error" } */
    res.status(400).send("Token Error");
    return
  }
  var fileLocation = path.join('./files/apk', auth.project, "update.apk");
  if (!fs.existsSync(fileLocation)) {
    /* #swagger.responses[400] = { 
      description: "file was not found" } */
    console.log(fileLocation)
    res.status(400).send("file was not found");
    return
  }
  var apk = new nodeApk.Apk(fileLocation)
  var manifest = await apk.getManifestInfo();
  var resources = await apk.getResources();
  let label = manifest.applicationLabel;
  if (typeof label !== 'string') {
    const entries = resources.resolve(label);
    label = (
      entries.find((res) =>
        (res.locale && res.locale.language === DEFAULT_LOCALE)
      ) || entries[0]).value;
  }
  var result = {
    name: label,
    package: manifest.package,
    version: {
      code: manifest.versionCode,
      name: manifest.versionName
    }
  };
  apk.close();
  /* #swagger.responses[200] = { 
    schema: { "$ref": "#/definitions/AppManifest" },
    description: "Token Generated Successfully." } */
  res.status(200).send(result);
})

router.get('/:project/:file(*)', (req, res) => {
  // #swagger.tags = ['Android']
  // #swagger.description = 'get android app update apk' 
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [username, token] = Buffer.from(b64auth, 'base64').toString().split(':')
  let auth = req.app.encryption.check_token(token);
  if (auth == null) {
    /* #swagger.responses[400] = { 
      description: "Token Error" } */
    res.status(400).send("Token Error");
    return;
  }
  if (auth.username != username) {
    /* #swagger.responses[400] = { 
      description: "Token Error" } */
    res.status(400).send("username Error");
    return;
  }
  var file = req.params.file;
  var fileLocation = path.join('./files/apk', req.params.project, file);
  if (!fs.existsSync(fileLocation)) {
    /* #swagger.responses[400] = { 
      description: "file was not found" } */
    res.status(400).send("file was not found");
    return
  }
  res.download(fileLocation, file);
});

module.exports = router;

