var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const initUploadApi = require("./service/upload");

// 创建 application/x-www-form-urlencoded 编码解析
// var urljsonParser = bodyParser.json({ extended: false });

app.use("/assets", express.static("assets"));

initUploadApi(app);
// app.get('/index.html', function (req, res) {
//    res.sendFile( __dirname + "/" + "index.html" );
// })

app.post("/api/process_post", function (req, res) {
  // 输出 JSON 格式
  var response = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  console.log(response);
  res.end(JSON.stringify(response));
});

var server = app.listen(8081, function () {
  console.log(server.address());
  var host = server.address().address;
  var port = server.address().port;

  console.log("应用实例，访问地址为 http://%s:%s", "localhost", port);
});
