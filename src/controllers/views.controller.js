import { getProductsByIdService, getProductsService } from "../services/products.service.js";
import { getCartService } from "../services/carts.service.js";
import { getChatService } from "../services/chats.service.js";

export const getProductsViewsController = async (req, res) => {
  try {
    const products = await getProductsService(req);
    const user = req.user.user;
    let userAdmin;
    if (user) {
      userAdmin = user?.role === "admin" ? true : false;
    }
    res.render("products", { products, user, userAdmin });
  } catch (error) {
    console.log(error);
    return res.sendServerError(error);
  }
};

export const getRealTimeProductsController = async (req, res) => {
  try {
    const result = await getProductsService(req);
    const allProducts = result.payload;
    res.render("realTimeProducts", { allProducts: allProducts });
  } catch (error) {
    console.log(error);
    return res.sendServerError(error);
  }
};

export const getChatController = async (req, res) => {
  try {
    const messages = await getChatService();
    res.render("chat", { messages });
  } catch (error) {
    console.log(error);
    return res.sendServerError(error);
  }
};

export const getProductsByIdViewController = async (req, res) => {
  try {
    const product = await getProductsByIdService(req);
    if (product.status === "error") return res.sendRequestError(product.message);
    const user = req.user.user;
    let userAdmin;
    if (user) {
      userAdmin = user?.role === "Admin" ? true : false;
    }
    res.render("product", { product, user, userAdmin });
  } catch (error) {
    console.log(error);
    return res.sendServerError(error);
  }
};

export const getCartViewController = async (req, res) => {
  try {
    const cart = await getCartService(req);
    if (cart.status === "error") return res.sendRequestError(cart.message);
    if (cart === null || cart.products.length === 0) {
      const emptyCart = "Cart Empty";
      req.app.get("socketio").emit("updatedCarts", cart.products);
      return res.render("carts", { emptyCart });
    }
    const carts = cart.products;
    req.app.get("socketio").emit("updatedCarts", carts);

    res.render("carts", { carts });
  } catch (error) {
    console.log(error);
    return res.sendServerError(error);
  }
};
