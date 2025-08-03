const express = require("express");
const fs = require("fs");
const path = require("path");

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the environment variable PORT."
  );
}

const PORT = process.env.PORT;

const storagePath = path.join(__dirname, "../storage");
console.log(`Storing files at ${storagePath}.`);

const app = express();

//
// HTTP GET route that streams a video from storage.
//
app.get("/video", (req, res) => {
  const videoId = req.query.id;
  const localFilePath = path.join(storagePath, videoId);
  res.sendFile(localFilePath);
});

//
// HTTP POST route to upload a video to storage.
//
app.post("/upload", (req, res) => {
  const videoId = req.headers.id;
  const localFilePath = path.join(storagePath, videoId);
  //Stream the body of the incoming HTTP request(uploaded file) into the local file
  const fileWriteStream = fs.createWriteStream(localFilePath); //creates a writable stream to the computed local file

  req
    .pipe(fileWriteStream) //Pipes the incoming request body (req)
    .on("error", (err) => {
      console.error("Upload failed.");
      console.error((err && err.stack) || err);
    })
    .on("finish", () => {
      res.sendStatus(200);
    });
});

app.listen(PORT, () => {
  console.log(`Microservice online`);
});
