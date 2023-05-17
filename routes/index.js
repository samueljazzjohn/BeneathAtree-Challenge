const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const AWS = require("aws-sdk");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-south-1",
});

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/signed-url", async (req, res) => {
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const imageurl = process.env.S3_BUCKET_IMAGE_URL;

  // Get the current time
  const currentTime = new Date();

  // Calculate the time 5 minutes from now
  const dateLessThan = new Date();
  dateLessThan.setTime(currentTime.getTime() + 5 * 60 * 1000);
  console.log("time", dateLessThan.toISOString());

  const params = {
    url: `https://${cloudFrontDomain}/${imageurl}`,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    dateLessThan: dateLessThan.toISOString(),
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY_STRING,
  };
  try {
    const signedUrl = await getSignedUrl(params);
    console.log(signedUrl);
    res.send(signedUrl);
  } catch (err) {
    console.error("Error generating signed URL:", err);
    //       res.status(500).send("Error generating signed URL");
  }
});

module.exports = router;
