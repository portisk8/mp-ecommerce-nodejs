var express = require("express");
var exphbs = require("express-handlebars");
const dotenv = require("dotenv");
var app = express();
const bodyParser = require("body-parser");

const PaymentController = require("./controllers/PaymentController");
//importamos el controller

const PaymentService = require("./services/PaymentService");
//importamos el service

const PaymentInstance = new PaymentController(new PaymentService());
// Permitimos que el controller pueda usar el service

dotenv.config();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  res.render("detail", req.query);
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

//MERCADO PAGO
app.post("/payment/new", (req, res) =>
  PaymentInstance.getMercadoPagoLink(req, res)
);
app.post("/webhook", (req, res) => PaymentInstance.webhook(req, res));

app.get("/payment/success", function (req, res) {
  console.log(req, res);
  console.log(req.query);
  res.render("paymentSucces", req.query);
});
app.get("/payment/pending", function (req, res) {
  console.log(req, res);
  res.render("home", req.query);
});
app.get("/payment/error", function (req, res) {
  console.log(req, res);
  res.render("home", req.query);
});

app.listen(process.env.PORT || 3000);

console.log("Puerto > ", process.env.PORT || 3000);
