const axios = require("axios");
const mercadopago = require("mercadopago");

class PaymentService {
  constructor() {
    //Configuracion inicial MP
    mercadopago.configure({
      integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
      access_token:
        "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
    });

    this.tokensMercadoPago = {
      prod: {},
      test: {
        access_token:
          "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
        // el access_token de MP
      },
    };
    // declaramos de la siguiente manera el token, para que sea más fácil cambiarlo dependiendo del ambiente
    this.mercadoPagoUrl = "https://api.mercadopago.com/checkout";
    // declaramos la url en el constructor para poder accederla a lo largo de toda la clase
  }

  async createPaymentMercadoPago(name, price, unit, img) {
    // recibimos las props que le mandamos desde el PaymentController
    const url = `${this.mercadoPagoUrl}/preferences?access_token=${this.tokensMercadoPago.test.access_token}`;
    // url a la que vamos a hacer los requests

    const items = [
      {
        id: "1234",
        // id interno (del negocio) del item
        title: name,
        // nombre que viene de la prop que recibe del controller
        description: "Dispositivo móvil de Tienda e-commerce",
        // descripción del producto
        picture_url: img,
        // url de la imágen del producto
        category_id: "1234",
        // categoría interna del producto (del negocio)
        quantity: parseInt(unit),
        // cantidad, que tiene que ser un intiger
        currency_id: "ARS",
        // id de la moneda, que tiene que ser en ISO 4217
        unit_price: parseFloat(price),
        // el precio, que por su complejidad tiene que ser tipo FLOAT
      },
    ];

    const preferences = {
      // declaramos las preferencias de pago
      items,
      // el array de objetos, items que declaramos más arriba
      external_reference: "referencia del negocio",
      // referencia para identificar la preferencia, puede ser practicamente cualquier valor
      payer: {
        // información del comprador, si estan en producción tienen que //traerlos del request
        //(al igual que hicimos con el precio del item)
        name: "Lalo",
        surname: "Landa",
        email: "test_user_63274575@testuser.com",
        // si estan en sandbox, aca tienen que poner el email de SU usuario de prueba
        phone: {
          area_code: "11",
          number: 22223333,
        },
        address: {
          zip_code: "1111",
          street_name: "False",
          street_number: 123,
        },
      },
      payment_methods: {
        // declaramos el método de pago y sus restricciones
        excluded_payment_methods: [
          // aca podemos excluir metodos de pagos, tengan en cuenta que es un array de objetos
          {
            id: "amex",
          },
        ],
        excluded_payment_types: [{ id: "atm" }],
        // aca podemos excluir TIPOS de pagos, es un array de objetos
        installments: 6,
        // limite superior de cantidad de cuotas permitidas
        default_installments: 6,
        // la cantidad de cuotas que van a aparecer por defecto
      },
      back_urls: {
        // declaramos las urls de redireccionamiento
        success:
          "https://portisk8-mp-ecommerce-nodejs.herokuapp.com/payment/success",
        // url que va a redireccionar si sale todo bien
        pending:
          "https://portisk8-mp-ecommerce-nodejs.herokuapp.com/payment/pending",
        // url a la que va a redireccionar si decide pagar en efectivo por ejemplo
        failure:
          "https://portisk8-mp-ecommerce-nodejs.herokuapp.com/payment/error",
        // url a la que va a redireccionar si falla el pago
      },
      external_reference: "porti.sk8@gmail.com",
      notification_url:
        "https://portisk8-mp-ecommerce-nodejs.herokuapp.com/webhook",
      // declaramos nuestra url donde recibiremos las notificaciones
      auto_return: "approved",
      // si la compra es exitosa automaticamente redirige a "success" de back_urls
    };

    try {
      return mercadopago.preferences
        .create(preferences)
        .then(function (response) {
          // Este valor reemplazará el string "$$init_point$$" en tu HTML
          return response.body.init_point;
        })
        .catch(function (error) {
          console.log(error);
        });
      //   const request = await axios.post(url, preferences, {
      //     // hacemos el POST a la url que declaramos arriba, con las preferencias
      //     headers: {
      //       // y el header, que contiene content-Type
      //       "Content-Type": "application/json",
      //     },
      //   });

      //   return request.data;
      // devolvemos la data que devuelve el POST
    } catch (e) {
      console.log(e);
      // mostramos error en caso de que falle el POST
    }
  }
  getpayment(paymentId, type) {
    return mercadopago.payment
      .findById(paymentId)
      .then((data) => {
        console.log(
          "-----------------------------------------------------------------"
        );
        console.log("Data Webhook > ");
        console.log(data);
        console.log(data.body);
        return data.body;
      })
      .catch((err) => {
        console.log(
          "-----------------------------------------------------------------"
        );
        console.log("Data Webhook > ERROR > ");
        console.log(err);
        return err;
      });
  }

  getplan(paymentId, type) {
    return mercadopago.plan
      .findById(paymentId)
      .then((data) => {
        console.log("Data Webhook > ");
        return data.body;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  getsubscription(paymentId, type) {
    return mercadopago.subscription
      .findById(paymentId)
      .then((data) => {
        console.log("Data Webhook > ");
        return data.body;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  getinvoice(paymentId, type) {
    return mercadopago.invoice
      .findById(paymentId)
      .then((data) => {
        return data.body;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  getWebhook(paymenId, type) {
    console.log(
      "-----------------------------------------------------------------"
    );
    console.log("Obteniendo JSON");
    try {
      switch (type) {
        case "payment":
          url = `https://api.mercadopago.com/v1/payments/${paymenId}?access_token=${this.tokensMercadoPago.test.access_token}`;
          return this.getpayment(paymenId, type);
          break;
        case "plan":
          url = `https://api.mercadopago.com/v1/plans/${paymenId}?access_token=${this.tokensMercadoPago.test.access_token}`;
          return this.getplan(paymenId, type);
          break;
        case "subscription":
          return this.getsubscription(paymenId, type);
          url = `https://api.mercadopago.com/v1/subscriptions/${paymenId}?access_token=${this.tokensMercadoPago.test.access_token}`;
          break;
        case "invoice":
          return this.getinvoice(paymenId, type);
          url = `https://api.mercadopago.com/v1/invoices/${paymenId}?access_token=${this.tokensMercadoPago.test.access_token}`;
          break;
        case "test":
          return this.getpayment(paymenId, type);
          url = `https://api.mercadopago.com/v1/payments/${paymenId}?access_token=${this.tokensMercadoPago.test.access_token}`;
          break;

        default:
          return this.getpayment(paymenId, type);
          break;
      }
    } catch (error) {
      console.log(
        "-----------------------------------------------------------------"
      );
      console.log(error);
    }
  }

  async getWebhook2(paymentId, type) {
    console.log(
      "-----------------------------------------------------------------"
    );
    console.log("Obteniendo JSON");
    var url = "";
    switch (type) {
      case "payment":
        url = `https://api.mercadopago.com/v1/payments/${paymentId}?access_token=${this.tokensMercadoPago.test.access_token}`;
        break;
      case "plan":
        url = `https://api.mercadopago.com/v1/plans/${paymentId}?access_token=${this.tokensMercadoPago.test.access_token}`;
        break;
      case "subscription":
        url = `https://api.mercadopago.com/v1/subscriptions/${paymentId}?access_token=${this.tokensMercadoPago.test.access_token}`;
        break;
      case "invoice":
        url = `https://api.mercadopago.com/v1/invoices/${paymentId}?access_token=${this.tokensMercadoPago.test.access_token}`;
        break;
      case "test":
        url = `https://api.mercadopago.com/v1/payments/${paymentId}?access_token=${this.tokensMercadoPago.test.access_token}`;
        break;

      default:
        url = `https://api.mercadopago.com/v1/payments/${paymentId}?access_token=${this.tokensMercadoPago.test.access_token}`;
        break;
    }

    try {
      const request = await axios.get(url);
      console.log("Data Webhook > ");
      console.log(request);

      return request.data;
    } catch (error) {
      console.log("Data Webhook > Error > ");
      console.log(error);
      return error;
    }
  }
}

//NOTA: TODAS las URLS que usemos tienen que ser reales,
//si prueban con localhost, va a fallar

module.exports = PaymentService;
