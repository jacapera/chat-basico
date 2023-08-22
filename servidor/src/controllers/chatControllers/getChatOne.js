const { Chat, User, Message } = require('../../db');
const { Op } = require('sequelize');


const getChatOne = async (sender_id, receiver_id) => {
    try {
      let chat = await Chat.findOne({
        where: {
          [Op.or]: [
            { user1_id: sender_id, user2_id: receiver_id },
            { user1_id: receiver_id, user2_id: sender_id },
          ],
        },
        include:[
          {
            model: User,
            as: "UserSent"
          },
          {
            model: User,
            as: "UserReceived",
          },
          {
            model: Message,
            
          }
        
        ]
      });
      if(!chat){
        const error = new Error ("Chat no encontrado");
        error.statusCode = 404;
        throw error;
      }
      return chat;
    } catch (error) {
      throw new Error(error)
    }
}

module.exports = getChatOne;