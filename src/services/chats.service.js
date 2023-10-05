import messageModel from "../dao/models/messages.model.js";

export const getChatService = async () => {
  const messages = await messageModel.find().lean().exec();
  return messages;
};
