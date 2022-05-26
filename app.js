const express = require('express');
const bodyParser = require("body-parser");
const request = require('request');
const https = require("https")
const app = express();

app.use('/public', express.static("public"))

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/sign-up.html");
})

app.post("/sign-up", function(req, res) {

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us11.api.mailchimp.com/3.0/lists/2af4c8b29b";

  const options = {
    method: "POST",
    auth: "thiyagu15:5397568d71949ff09e7322f8d39b7fef-us11"
  }

  const req1 = https.request(url, options, function(res1) {
    if (res1.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
    res.sendFile(__dirname + "/failure.html");
    }

    res1.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  req1.write(jsonData);
  req1.end();

});

app.post("/failure", function (req, res) {
  res.redirect("/")
});



app.listen(process.env.PORT || 3000, function() {
  console.log("server is running");
});
