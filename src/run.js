import messageModel from "./dao/models/messages.model.js";
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import ViewsProductsRouter from "./routes/views.router.js";
import JWTRouter from "./routes/jwt.router.js";
import appRouter from "./routes/router.js";
import { passportCall } from "./utils.js";

const run = (io, app) => {
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Rutas para la API de productos, carritos , sessions y jwt
  const productsRouter = new ProductsRouter();
  app.use("/api/products", productsRouter.getRouter());
  const cartsRouter = new CartsRouter();
  app.use("/api/carts", cartsRouter.getRouter());
  const jwtrouter = new JWTRouter();
  app.use("/api/jwt", jwtrouter.getRouter());
  // Ruta para las vistas de productos
  const viewsProductsRouter = new ViewsProductsRouter();
  app.use("/products", passportCall("jwt"), viewsProductsRouter.getRouter());

  // Evento de conexión de Socket.IO
  io.on("connection", async (socket) => {
    // Escucha el evento "productList" emitido por el cliente
    socket.on("productList", (data) => {
      // Emitir el evento "updatedCarts" a todos los clientes conectados
      // console.log(data);
      io.emit("updatedProducts", data);
    });
    socket.on("cartList", (data) => {
      // Emitir el evento "updatedCarts" a todos los clientes conectados
      io.emit("updatedCarts", data);
    });

    let messages = (await messageModel.find()) ? await messageModel.find() : [];

    socket.broadcast.emit("alerta");
    socket.emit("logs", messages);
    socket.on("message", (data) => {
      messages.push(data);
      messageModel.create(messages);
      io.emit("logs", messages);
    });
  });

  // Ruta principal
  class router extends appRouter {
    init() {
      this.get("/",["PUBLIC"], (req, res) => {
        res.render("index", { name: "CoderHouse" });
      });
    }
  }
  const indexRouter = new router();
  app.use("/", indexRouter.getRouter());
};

export default run;
