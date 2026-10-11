const http = require("http")
const fs = require("fs")
const path = require("path")
const os = require("os");

const server = http.createServer((req, res) => {

    // home page
    if (req.method === "GET" && req.url === "/") {
        const filename = path.join(__dirname, "public", "index.html");
        fs.readFile(filename, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "content-type": "text/plain" })
                res.end("page not found")
                return
            }
            else {
                res.writeHead(200, { "content-type": "text/html" })
                res.end(data)
            }
        })
        return
    }

    if (req.method === "GET" && req.url === "/style.css") {
        const filepath = path.join(__dirname, "public", "style.css");
        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                res.end("somthing going wrong in reading style.css file")
            }
            else {
                res.setHeader("content-type", "text/css");
                res.end(data);
            }
        })
    }


    if (req.method === "GET" && req.url === "/app.js") {
        const filepath = path.join(__dirname, "public", "app.js");
        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                res.end("somthing going wrong in reading app.js file")
            }
            else {
                res.setHeader("content-type", "application/javascript");
                res.end(data);
            }
        })
    }

    if (req.method === "POST" && req.url === "/api/createFile") {
        let data = "";
        req.on("data", (chunk) => {
            data = data + chunk;
        })
        req.on("end", () => {
            const fileData = JSON.parse(data);
            console.log(fileData);
            const filename = fileData.fileName;
            console.log(filename);
            const filepath = path.join(__dirname, "data", filename);

            const filecontent = fileData.filecontent
            console.log(filecontent)

            fs.writeFile(filepath, filecontent, (err) => {
                if (err) {
                    res.end(JSON.stringify({ message: "somthing going wrong" }));
                }
                else {
                    res.end(JSON.stringify({ message: "file created successfully" }));
                }
            })

        })
    }

    if (req.method === "GET" && req.url === "/api/files") {

        const filepath = path.join(__dirname, "data");
        fs.readdir(filepath, (err, files) => {
            res.setHeader("Content-type", "application/json");

            if (err) {
                res.end(JSON.stringify({
                    files: []
                }));
                return;
            }
            res.end(JSON.stringify({
                files: files
            }));
        });
        return;
    }


    if (req.method === "GET" && req.url === "/api/systemInfo") {

        const info = {
            os: os.type(),
            platform: os.platform(),
            cpu: os.cpus()[0].model,
            cores: os.cpus().length,
            totalRAM: (os.totalmem() / 1024 ** 3).toFixed(2) + " GB",
            freeRAM: (os.freemem() / 1024 ** 3).toFixed(2) + " GB"
        };

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(info));

        return;
    }


    if (req.method === "GET" && req.url.startsWith("/api/readFile?name=")) {
        const url = new URL(req.url, "http://localhost:3000");
        const filename = url.searchParams.get("name");

        if (!filename || filename !== path.basename(filename)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid file name" }));
            return;
        }

        const filepath = path.join(__dirname, "data", filename);

        fs.readFile(filepath, "utf8", (err, content) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "File not found" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ fileName: filename, content: content }));
        });

        return;
    }


});

server.listen(3000, () => {
    console.log("server is running");
});
