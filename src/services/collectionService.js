import db from "../models/index";

let handleCreateCollection = (flashcardId, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            
            let collectionData = {};

            let user = await db.User.findByPk(userId);
            if (user) {
                let flashcards = await db.Setflashcard.findByPk(flashcardId);
                if(flashcards) {
                    const Sequelize = require('sequelize');
                    const Op = Sequelize.Op;

                    let collection = await db.Collection.findAll({
                        where: {
                            [Op.and]: [
                                { setFlashcardId: flashcardId },
                                { userId: userId }
                            ],
                        }
                    })
                    console.log(collection);
                    if(collection.length === 0) {
                        let newCollection = await db.Collection.create({
                            setFlashcardId: flashcardId,
                            userId: userId,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        });
                
                        collectionData.errCode = 0;
                        collectionData.errMessage = 'Ok';
                        collectionData.collecton = newCollection;
                    } else {
                        collectionData.errCode = 3;
                        collectionData.errMessage = 'Bộ flashcard đã được thêm vào bộ sưu tập';
                    }
                        
    
                } else {
                    collectionData.errCode = 1;
                    collectionData.errMessage = 'Bộ flashcard không tồn tại';
                }
                    
            } else {
                collectionData.errCode = 2;
                collectionData.errMessage = 'Người dùng không hợp lệ';
            }

            resolve(collectionData);

        } catch (e) {
            reject(e);
        }
    })
}

let handleGetAllCollection = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let flashcards = '';
            if(userId) {
                flashcards = await db.Collection.findAll({
                    where: {userId: userId},
                    attributes: ['id', 'setFlashcardId']
                })
            }
            
            if (flashcards.length === 0) {
                return resolve([]);
            }

            let ids = flashcards.map(record => record.id);

            let collectionPromises = flashcards.map(record => findFlashcards(record.setFlashcardId));

            // Chờ tất cả các promises hoàn thành
            let collections = await Promise.all(collectionPromises);

            let userPromises = collections.map(record => findUser(record.userId));

            let users = await Promise.all(userPromises);

            const Sequelize = require('sequelize');
            const Op = Sequelize.Op;

            let flashcardIds = flashcards.map(record => record.setFlashcardId);

            let flashcardCounts = await db.Flashcard.findAll({
                where: {
                    setFlashcardId: { [Op.in]: flashcardIds }
                },
                attributes: ['setFlashcardId', [Sequelize.fn('COUNT', Sequelize.col('id')), 'sumFlashcard']],
                group: ['setFlashcardId']
            })

            let quantity = flashcardCounts.map(index => index.sumFlashcard);

            let result = collections.map((record, key) => {
                let user = users[key];
                return {
                    id: ids[key],
                    flashcardId: record.id,
                    topic: record.topic,
                    title: record.title,
                    userName: `${user.firstName} ${user.lastName}`,
                    quantity: quantity[key]
                };
            });

            resolve(result)
        } catch (e) {
            reject(e)
        }
    })
}

let findUser = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id},
                attributes: ['firstName', 'lastName']
            })

            resolve(user);
        } catch (e) {
            reject(e);
        }
    })
}

let findFlashcards = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let flashcards = await db.Setflashcard.findOne({
                where: {id: id},
            })

            resolve(flashcards);
        } catch (e) {
            reject(e);
        }
    })
}

let handledelCollection = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let collection = await db.Collection;
            await collection.destroy({
                where: { id: id }
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleCreateCollection: handleCreateCollection,
    handleGetAllCollection: handleGetAllCollection,
    handledelCollection: handledelCollection
}