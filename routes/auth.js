const express = require('express');
const router = express.Router();

router.post("/access-token", async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'request token' 
  /*	#swagger.parameters['obj'] = {
        in: 'body',
        description: 'Login information.',
        required: true,
        schema: { $ref: "#/definitions/Auth" }
} */
  let json = null;
  json = req.body;
  if (json == null || typeof (json.id) == 'undefined' || typeof (json.password) == 'undefined' || typeof (json.project) == 'undefined') {
    res.status(404).send();
    return
  }
  try {
    let auth_data = await req.app.db.query(`username=\'${json.id}\' AND password=\'${json.password}\' AND project=\'${json.project}\'`);
    /* #swagger.responses[400] = { 
      description: "account was not found" } */
    if (auth_data.length == 0) {
      res.status(400).send("account was not found");
      return
    }
    auth_data = auth_data[0];
    let token = req.app.encryption.encrypt(JSON.stringify(auth_data));

    /* #swagger.responses[200] = { 
      schema: "12dnv*3nvdi",
      description: "Token Generated Successfully." } */
    res.status(200).send(token);

  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
