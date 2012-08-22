
const EXPRESS = require("express");


var app = EXPRESS();

app.use(EXPRESS.bodyParser());

app.post("/api/broadcast", function(req, res) {

    if (req.body && req.body.payload) {
        var payload = false;
        try {
            payload = JSON.parse(req.body.payload);
        } catch(err) {
            console.error(err.stack);
            res.writeHead(500);
            res.end("Error parsing payload!");
            return;
        }

console.log("payload", payload);

        res.send("OK");
        return;
    }
    res.writeHead(400);
    res.end();
});

app.listen(9998);
