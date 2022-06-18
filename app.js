const express = require("express");
const bodyParser = require("body-parser");
const { GoogleAuth } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const fileUpload = require("express-fileupload");

async function getGenericClass(req, res) {
  var credentials = JSON.parse(fs.readFileSync("./key.json"));
  var id = req.query.id;
  var wclass = req.query.class;
  const httpClient = new GoogleAuth({
    credentials: credentials,
    scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
  });

  objectResponse = await httpClient
    .request({
      url:
        "https://walletobjects.googleapis.com/walletobjects/v1/genericClass/" +
        id +
        "." +
        wclass,
      method: "GET",
    })
    .then((data) => {
      console.log("OK:" + JSON.stringify(data));
      res.send(data);
    })
    .catch((e) => {
      console.log("We have an Error:" + e);
      res.status(400);
      res.send({ msg: "" + e });
    });
  //console.log(objectResponse.data);
}
async function createGenericClass(req, res) {
  var credentials = JSON.parse(fs.readFileSync("./key.json"));
  var id = req.query.id;
  var wclass = req.query.class;

  //console.log("Body:" + JSON.stringify(req.body));

  const httpClient = new GoogleAuth({
    credentials: credentials,
    scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
  });

  const objectPayload = req.body;
  objectPayload.id = id + "." + wclass;
  //console.log("POST: " + JSON.stringify(httpClient));
  objectResponse = await httpClient
    .request({
      url: "https://walletobjects.googleapis.com/walletobjects/v1/genericClass/",
      method: "POST",
      data: objectPayload,
    })
    .then((data) => {
      console.log("OK:" + JSON.stringify(data));
      res.status(200);
      res.send({ msg: "class successfully created" });
    })
    .catch((e) => {
      console.log("We have an Error:" + e);
      res.status(400);
      res.send("" + e);
    });
}
async function updateGenericClass(req, res) {
  var credentials = JSON.parse(fs.readFileSync("./key.json"));
  var id = req.query.id;
  var wclass = req.query.class;
  //console.log("Body:" + JSON.stringify(req.body));
  const httpClient = new GoogleAuth({
    credentials: credentials,
    scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
  });

  const objectPayload = req.body;
  objectPayload.id = id + "." + wclass;
  objectResponse = await httpClient
    .request({
      url:
        "https://walletobjects.googleapis.com/walletobjects/v1/genericClass/" +
        id +
        "." +
        wclass,
      method: "PUT",
      data: objectPayload,
    })
    .then((data) => {
      console.log("OK:" + JSON.stringify(data));
      res.status(200);
      res.send({ msg: "class successfully updates" });
    })
    .catch((e) => {
      console.log("We have an Error:" + e);
      res.status(400);
      res.send("" + e);
    });
}

async function uploadKey(req, res) {
  const path = require("path");
  //console.log("Upload: "+JSON.stringify(req.files));
  let target_file = req.files.file;
  uploadPath = __dirname + "/key.json";

  // Use the mv() method to place the file somewhere on your server
  target_file.mv(uploadPath, function (err) {
    if (err) {
      console.log("Err:" + err);
      res.statusCode = 400;
      res.send({ msg: err, success: false });
    } else {
      console.log("Uploaded key.json");
      res.statusCode = 200;
      res.send({ success: true });
    }
  });
}

const app = express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/googlegetclass", getGenericClass);
app.post("/upload", uploadKey);
app.post("/googlecreatclass", createGenericClass);
app.post("/googleupdateclass", updateGenericClass);
app.listen(3000);
console.log("Server runs on http://localhost:3000");
