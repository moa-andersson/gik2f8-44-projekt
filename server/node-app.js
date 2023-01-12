const http = require("http");
const server = http.createServer((req, res) => {
  console.log(req.url);

  const statusCode = 425;
  res.writeHead(statusCode);
  res.end(`Du gjorde ett ${req.method} anrop till ${req.url}`);
});

server.listen("5001", () =>
  console.log("server running on http://localhost:5001")
);
