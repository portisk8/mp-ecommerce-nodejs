class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }

  async getMercadoPagoLink(req, res) {
    const { name, price, unit, img } = req.body;
    try {
      const checkout = this.paymentService
        .createPaymentMercadoPago(
          name, // nombre del producto o servicio
          price, //precio del producto o servicio
          unit, //cantidad que estamos vendiendo
          img // imagen de referencia del producto o servicio
        )
        .then((response) => {
          res.redirect(response);
        });

      //   return;
      //si es exitoso los llevamos a la url de Mercado Pago

      //   return res.json({ url: checkout.init_point });
      //   // o si queres devolver la url al front
    } catch (err) {
      // si falla devolvemos un status 500

      return res.status(500).json({
        error: true,
        msg: "Hubo un error con Mercado Pago",
      });
    }
  }

  webhook(req, res) {
    console.log(req, res);
    return res.status(200);
  }
}

module.exports = PaymentController;