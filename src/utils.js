import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { PRIVATE_KEY } from "./config/config.js";


const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/img`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const uploader = multer({ storage });

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

/* JWT */
export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        // Si no hay usuario autenticado, redireccionar a la vista de login
        return res.redirect("/jwt/login");
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
export const passportCallCurrent = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        // Si no hay usuario, manejar el caso en el que no se proporcionó un token o no hay una cookie válida
        if (info && info.message === "No token provided") {
          return res.status(401).json({ status: "error", error: "No token provided" });
        } else if (info && info.message === "There is no user with an active session") {
          return res.status(401).json({ status: "error", error: "There is no user with an active session" });
        } else {
          return res.status(401).json({ status: "error", error: "Unauthorized" });
        }
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

