import {
  addCartService,
  addProductToCartService,
  deleteCartService,
  deleteProductInCartService,
  getCartService,
  updateProductToCartService,
  updatedCartService,
} from "../services/carts.service.js";

export const addCartController = async (req, res) => {
  try {
    const result = await addCartService(req);
    res.createdSuccess(result);
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};

export const addProductToCartController = async (req, res) => {
  try {
    const result = await addProductToCartService(req);
    if (result.status === "error") return res.sendRequestError(result.message);
    return res.sendSuccess(result);
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};

export const getCartController = async (req, res) => {
  try {
    const result = await getCartService(req);
    if (result.status === "error") return res.sendRequestError(result.message);
    return res.sendSuccess(result);
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};

export const updateProductToCartController = async (req, res) => {
  try {
    const result = await updateProductToCartService(req);
    if (result.status === "error") return res.sendRequestError(result.message);
    return res.sendSuccess(result.message);
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};

export const updatedCartController = async (req, res) => {
  try {
    const result = await updatedCartService(req);
    if (result.status === "error") return res.sendRequestError(result.message);
    return res.sendSuccess({
      products: result.result,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
    });
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const result = await deleteCartService(req);
    if (result.status === "error") return res.sendRequestError(result.message);
    res.sendSuccess(result);
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};

export const deleteProductInCartController = async (req, res) => {
  try {
    const result = await deleteProductInCartService(req);
    if (result.status === "error") return res.sendRequestError(result.message);
    res.sendSuccess(result);
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};
