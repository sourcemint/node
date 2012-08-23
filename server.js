
const ASSERT = require("assert");
const PATH = require("path");
const FS = require("fs");
const URL = require("url");
const EXPRESS = require("express");
const SPAWN = require("child_process").spawn;


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

        if (payload && payload.name === "RepositoryNewTag") {
            scanRedeploy(payload.data, function(err) {
                if (err) return console.error(err.stack);
                // Ignore as we already returned.
            });
        }

        res.send("OK");
        return;
    }
    res.writeHead(400);
    res.end();
});

app.listen(9998);


function scanRedeploy(data, callback) {

    try {

        console.log("Scanning programs for events to relay:", data);

        var programsPath = "/pinf/programs";

        FS.readdirSync(programsPath).forEach(function(programId) {

            var descriptorPath = PATH.join(programsPath, programId, "program.json");

            if (FS.existsSync(descriptorPath)) {

                console.log("  " + descriptorPath);

                // TODO: Use pinf module to load & parse program descriptor.
                var descriptor = JSON.parse(FS.readFileSync(descriptorPath));

                if (descriptor && descriptor.config && descriptor.config["github.com/sourcemint/node/0"]) {

                    var config = descriptor.config["github.com/sourcemint/node/0"];

                    if (config.on && config.on["RepositoryNewTag"]) {

                        config = config.on["RepositoryNewTag"];

                        ASSERT(typeof config.do === "string", "`do` not set for '" + descriptorPath + " ~ config[\"github.com/sourcemint/node/0\"].on.RepositoryNewTag'!");
                        ASSERT(typeof config.match === "object", "`match` not set for '" + descriptorPath + " ~ config[\"github.com/sourcemint/node/0\"].on.RepositoryNewTag'!");
                        ASSERT(typeof config.match.repository === "string", "`repository` not set for '" + descriptorPath + " ~ config[\"github.com/sourcemint/node/0\"].on.RepositoryNewTag.match'!");

                        var parsedUrl = URL.parse(data.repository);

                        if (config.match.repository === parsedUrl.hostname + parsedUrl.pathname) {

                            console.log("    Running event hook ...");

                            call(config.do, PATH.dirname(descriptorPath), function(err) {
                                if (err) return console.error(err.stack);
                            });
                        }
                    }
                }
            }
        });

    } catch(err) {
        return callback(err);
    }
}

function call(command, programPath, callback) {

    // TODO: If already redeploying cancel previous and run this one.
    // TODO: Spawn child, change ownership and then run script.

    console.log("Running: " + command);

    var command = command.split(" ");

    var proc = SPAWN(command.shift(), command, {
        cwd: programPath
    });

    proc.on("error", function(err) {
        callback(err);
    });

    proc.stdout.on("data", function(data) {
        process.stdout.write(data.toString().replace(/\\n/g, "\n"));
    });

    var stderr = "";
    proc.stderr.on("data", function(data) {
        stderr += data.toString();
        process.stderr.write(data.toString());
    });
    proc.on("exit", function(code) {
        if (code !== 0) {
            var err = new Error("Error: " + stderr);
            return callback(err);
        }
        callback(null);
    });
}
