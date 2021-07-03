const mailchimp = require("@mailchimp/mailchimp_marketing");

const express = require ("express");
const app = express();
const port = process.env.PORT;

const bodyParser = require ("body-parser");
const request = require ("request");

app.use (bodyParser.urlencoded({extended: true}));
app.use (express.static ("public"));

mailchimp.setConfig({
    apiKey: "ec81ce0c71bc296ea90ad1c36d23d199-us6",
    server: "us6",
});

// save email in data to mailchimp's server
const saveEmail = async (data) => {
    const response = await mailchimp.lists.batchListMembers("dae14fddb5")//, data);
    // console.log(response);
    console.log (response.statusCode);
    return response;
};

app.get ('/', function (req, res) {
    res.sendFile (__dirname + "/signup.html");
});

app.get ('/failure', function (req, res) {
    res.sendFile (__dirname + "/failure.html");
});

app.get ('/success', function (req, res) {
    res.sendFile (__dirname + "/success.html");
});

app.post ('/', async (req, res) => {
    console.log (req.body.firstName);
    console.log (req.body.lastName);
    console.log (req.body.email);

    var data = {
        members: [
            {
                email_address : req.body.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.firstName,
                    LNAME: req.body.lastName,
                }
            }
        ]
    };

    var status = await saveEmail (data);
    console.log(status);
    
    if (status.hasOwnProperty("new_members")) {
        console.log ("signup success");
        res.sendFile (__dirname + "/success.html");
    } else {
        console.log ("signup failed");
        res.sendFile (__dirname + "/failure.html");
    }
});

app.post ('/failure', function (req, res) {
    res.redirect ("/");
});

app.listen (port || 3000, function (req, res) {
    console.log ("Server started on http://localhost:3000");
});

// api key
// ec81ce0c71bc296ea90ad1c36d23d199-us6

// List ID
// dae14fddb5
