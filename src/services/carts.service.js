import { productModel } from "../dao/models/products.model.js";
import { cartModel } from "../dao/models/carts.model.js";

export const addCartService = async (req) => {
  const cart = req.body;
  const addCart = await cartModel.create(cart);
  return addCart;
};

export const addProductToCartService = async (req) => {
  const pid = req.params.pid;
  const product = await productModel.findById(pid);
  if (!product) {
    return { status: "error", message: "Invalid product" };
  }
  const cid = req.params.cid;
  const cart = await cartModel.findById(cid);
  if (!cart) {
    return { status: "error", message: "Invalid cart" };
  }
  // Verificar si el producto ya existe en el carrito
  const existingProduct = cart.products.findIndex((item) =>
    item.product.equals(pid)
  );
  if (existingProduct !== -1) {
    // Incrementar la cantidad del producto existente
    cart.products[existingProduct].quantity += 1;
  } else {
    // Agregar el producto al carrito
    const newProduct = {
      product: pid,
      quantity: 1,
    };
    cart.products.push(newProduct);
  }
  const result = await cart.save();
  return result;
};

export const getCartService = async (req) => {
  // Obtenemos el Id del carrito
  const cartId = req.params.cid;
  // Obtenemos el producto por ID
  const cart = await cartModel.findById(cartId).lean().exec();
  if (!cart)
    return {
      status: "error",
      message: `The cart with id ${cartId} does not exist`,
    };
  return cart;
};

export const updateProductToCartService = async (req) => {
  const cid = req.params.cid;
  const cart = await cartModel.findById(cid);
  if (!cart) {
    return { status: "error", message: "Invalid cart" };
  }
  const pid = req.params.pid;
  const existingProduct = cart.products.findIndex((item) =>
    item.product.equals(pid)
  );
  if (existingProduct === -1) {
    return { status: "error", message: "Invalid product" };
  }
  const quantity = req.body.quantity;
  /* A verificar */
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { status: "error", message: "Quantity must be a positive integer" };
  }
  // Actualizamos la cantidad del producto existente
  cart.products[existingProduct].quantity = quantity;
  // Guardamos el carrito actualizado
  await cart.save();
  return {
    status: "success",
    message: "Product quantity updated successfully",
  };
};

export const updatedCartService = async (req) => {
  const cid = req.params.cid;
  const cart = await cartModel.findById(cid);
  if (!cart) {
    return { status: "error", message: "Invalid Cart" };
  }
  const products = req.body.products;
  /* A verificar */
  if (!Array.isArray(products)) {
    return { status: "error", message: "The product array format is invalid" };
  }
  cart.products = products;
  // Guardamos el carrito actualizado
  const result = await cart.save();
  const totalPages = 1;
  const prevPage = null;
  const nextPage = null;
  const page = 1;
  const hasPrevPage = false;
  const hasNextPage = false;
  const prevLink = null;
  const nextLink = null;

  return {
    result,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
  };
};

export const deleteCartService = async (req) => {
  const cid = req.params.cid;
  const cart = await cartModel
    .findByIdAndUpdate(cid, { products: [] }, { new: true })
    .lean()
    .exec();
  if (!cart) {
    return { status: "error", message: "Invalid cart" };
  }
  return cart;
};

export const deleteProductInCartService = async (req) => {
  const cid = req.params.cid;
  const cart = await cartModel.findById(cid);
  if (!cart) {
    return { status: "error", message: "Invalid cart" };
  }
  const pid = req.params.pid;
  // Verificar si el producto ya existe en el carrito
  const existingProduct = cart.products.findIndex((item) =>
    item.product.equals(pid)
  );
  if (existingProduct === -1) {
    return { status: "error", message: "Invalid product" };
  }
  // Eliminamos el producto del carrito
  cart.products.splice(existingProduct, 1);
  const result = await cart.save();
  return result;
};
