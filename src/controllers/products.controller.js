import {
  addProductsService,
  deleteProductsService,
  getProductsByIdService,
  getProductsService,
  updateProductsService,
} from "../services/products.service.js";

export const getProductsController = async (req, res) => {
  try {
    const result = await getProductsService(req);
    return res.sendSuccess(result);
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};

export const getProductsByIdController = async (req, res) => {
  try {
    const result = await getProductsByIdService(req);
    if (result.status === "error") return res.sendRequestError(result.message);
    res.sendSuccess(result);
  } catch (error) {
    console.log(error);
    res.sendServerError(error.message);
  }
};

export const addProductsController = async (req, res) => {
  try {
    const result = await addProductsService(req);
    if (result.status === "error") return res.sendUserError(result.message);
    res.createdSuccess(result);
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};

export const updateProductsController = async (req, res) => {
  try {
    const result = await updateProductsService(req);
    if (result.status === "error") return res.sendRequestError(result.message);
    res.sendSuccess(result);
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

export const deleteProductsController = async (req, res) => {
  try {
    const result = await deleteProductsService(req);
    if (result.status === "error") return res.sendRequestError(result.message);
    res.sendSuccess(result);
  } catch (error) {
    console.log(error);
    return res.sendServerError(error.message);
  }
};
