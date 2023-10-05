import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { __dirname } from "./utils.js";
import {PORT, SECRET_PASS, MONGO_URI, MONGO_DB_NAME} from "./config/config.js";
import run from "./run.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configurar el middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(`${__dirname}/public`));
// Configurar el motor de plantillas Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(cookieParser(SECRET_PASS));
initializePassport();
app.use(passport.initialize());

try {
  await mongoose.connect(`${MONGO_URI}${MONGO_DB_NAME}`);
  // Iniciar el servidor HTTP
  const serverHttp = app.listen(PORT, () =>
    console.log(`Server listening on port http://localhost:${PORT}`)
  );
  // Crear una instancia de Socket.IO y vincularla al servidor HTTP
  const io = new Server(serverHttp);
  // Establecer el objeto "socketio" en la aplicación para que esté disponible en todas las rutas
  app.set("socketio", io);

  run(io, app);
} catch (error) {
  console.log(`Cannot connect to dataBase: ${error}`);
  process.exit();
}
