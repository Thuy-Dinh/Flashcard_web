import db from "../models/index";

let handleCreateNewFlashcards = (userId, flashcardtitle, flashcardtopic) => {
    return new Promise(async(resolve, reject) => {
        try {
            let flashcardData = {};
            let user = await db.User.findByPk(userId);
            if (user) {
                let titleExists = await checkFlashcardTitle(userId, flashcardtitle);
                if(!titleExists) {
                    let newFlashcard = await db.Setflashcard.create({
                        userId: userId,
                        title: flashcardtitle,
                        topic: flashcardtopic,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
        
                    flashcardData.errCode = 0;
                    flashcardData.errMessage = 'Ok';
                    flashcardData.flashcard = newFlashcard;
                }
                else {
                    flashcardData.errCode = 1;
                    flashcardData.errMessage = 'Tiêu đề đã tồn tại';
                }
            } else {
                flashcardData.errCode = 2;
                flashcardData.errMessage = 'Người dùng không hợp lệ';
            }
            resolve(flashcardData);
        } catch (e) {
            reject(e);
        }
    })
}

let checkFlashcardTitle = (userId, flashcardTitle) => {
    return new Promise(async (resolve, reject) => {
        try {
            let flashcard = await db.Setflashcard.findOne({
                where: {
                    userId: userId,
                    title: flashcardTitle
                }
            });

            if (flashcard) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
}

let handleGetFlashcards = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let flashcards = '';
            // console.log(userId);
            if(userId) {
                flashcards = await db.Setflashcard.findAll({
                    where: {userId: userId}
                })
            }
            
            if (flashcards.length === 0) {
                return resolve([]);
            }

            let flashcardIds = flashcards.map(record => record.id);

            const Sequelize = require('sequelize');
            const Op = Sequelize.Op;

            let flashcardCounts = await db.Flashcard.findAll({
                where: {
                    setFlashcardId: { [Op.in]: flashcardIds }
                },
                attributes: ['setFlashcardId', [Sequelize.fn('COUNT', Sequelize.col('id')), 'sumFlashcard']],
                group: ['setFlashcardId']
            })

            let quantity = flashcardCounts.map(index => index.sumFlashcard);

            let result = flashcards.map((record, key) => {
                return {
                    id: record.id,
                    topic: record.topic,
                    title: record.title,
                    quantity: quantity[key]
                };
            });

            resolve(result)
        } catch (e) {
            reject(e)
        }
    })
}

let handleDelFlashcards = (flashcardsId) =>{
    return new Promise(async(resolve, reject) => {
        try {
            let flashcardsDel = {};
            await handleDelAllFlashcard(flashcardsId);
            
            await handleDelAllCollections(flashcardsId);

            let flashcards = await db.Setflashcard.findOne({
                where: { id: flashcardsId },
                raw: false
            })
            if (flashcards) {
                flashcardsDel.errCode = 0;
                flashcardsDel.errMessage = 'ok';
                flashcardsDel.flashcards = await flashcards.destroy();
            }
            else {
                flashcardsDel.errCode = 1;
                flashcardsDel.errMessage = 'Không tìm thấy bộ flashcard cần xóa';
            }
    
            resolve(flashcardsDel);

        } catch (e) {
            reject(e);
        }
    })
}

let handleDelAllFlashcard = (id) => {
    return new Promise( async(resolve, reject) => {
        try {
            await db.Flashcard.destroy({
                where: { setFlashcardId: id }
            })
                
            resolve();
            
        } catch (e) {
            reject(e)
        }
    })
}

let handleDelAllCollections = (id) => {
    return new Promise( async(resolve, reject) => {
        try {
            await db.Collection.destroy({
                where: { setFlashcardId: id }
            })
                
            resolve();
            
        } catch (e) {
            reject(e)
        }
    })
}

let handleSearchSV = (id, request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Sequelize = require('sequelize');
            const Op = Sequelize.Op;

            // Find flashcards matching the request
            let flashcards = await db.Setflashcard.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${request}%` } },
                        { topic: { [Op.like]: `%${request}%` } }
                    ],
                    [Op.not]: { userId: id }
                },
                attributes: ['id', 'userId', 'topic', 'title']
            });

            // If no flashcards are found, search for users
            if (flashcards.length === 0) {
                let userSearch = await db.User.findAll({
                    where: {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${request}%` } },
                            { lastName: { [Op.like]: `%${request}%` } }
                        ],
                        [Op.not]: { id: id }
                    },
                    attributes: ['id', 'firstName', 'lastName']
                });

                let userIds = userSearch.map(record => record.id);
                flashcards = await db.Setflashcard.findAll({
                    where: {
                        userId: { [Op.in]: userIds }
                    },
                    attributes: ['id', 'userId', 'topic', 'title']
                });
            }

            // Fetch user information for each flashcard
            let userIds = flashcards.map(record => record.userId);
            let users = await db.User.findAll({
                where: {
                    id: { [Op.in]: userIds }
                },
                attributes: ['id', 'firstName', 'lastName']
            });

            let userMap = users.reduce((acc, user) => {
                acc[user.id] = `${user.firstName} ${user.lastName}`;
                return acc;
            }, {});

            let flashcardIds = flashcards.map(record => record.id);

                let flashcardCounts = await db.Flashcard.findAll({
                    where: {
                        setFlashcardId: { [Op.in]: flashcardIds }
                    },
                    attributes: ['setFlashcardId', [Sequelize.fn('COUNT', Sequelize.col('id')), 'sumFlashcard']],
                    group: ['setFlashcardId']
                })

                let quantity = flashcardCounts.map(index => index.sumFlashcard);

            // Combine flashcard information with user information
            let result = flashcards.map((record, index) => {
                return {
                    flashcardsId: record.id,
                    userName: userMap[record.userId],
                    topic: record.topic,
                    title: record.title,
                    quantity: quantity[index]
                };
            });

            resolve(result);

        } catch (e) {
            reject(e);
        }
    });
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

let handleRecommendSearchSV = (id, request) => {
    return new Promise(async (resolve, reject) => {
        try {

            const Sequelize = require('sequelize');
            const Op = Sequelize.Op;
            
            let data = await db.Setflashcard.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${request}%` } },
                        { topic: { [Op.like]: `%${request}%` } }
                    ],
                    [Op.not]: { userId: id } 
                },
                attributes: ['id', 'topic', 'title']
            });
            
            let result = data.map((record, index) => {
                return {
                    flashcardsId: record.id,
                    topic: record.topic,
                    title: record.title
                };
            });
            
            resolve(result);

        } catch (e) {
            reject(e);
        }
    });
} 

let handleUpdateFlashcards = (id, topic, title) => {
    return new Promise(async (resolve, reject) => {
        try {
            let flashcardsUpdated = {};
            
            let flashcards = await db.Setflashcard.findOne({
                where: { id: id },
                raw: false
            });

            if (flashcards) {
                flashcards.topic = topic;
                flashcards.title = title;

                flashcardsUpdated.flashcards = await flashcards.save();

                // Log flashcards sau khi cập nhật
                console.log('flashcards updated:', flashcardsUpdated.flashcards);

                flashcardsUpdated.errCode = 0;
                flashcardsUpdated.errMessage = 'ok';
            } else {
                flashcardsUpdated.errCode = 1;
                flashcardsUpdated.errMessage = 'Bộ flashcard không tồn tại';
            }

            resolve(flashcardsUpdated);

        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    handleCreateNewFlashcards: handleCreateNewFlashcards,
    handleGetFlashcards: handleGetFlashcards,
    handleDelFlashcards: handleDelFlashcards,
    handleSearchSV: handleSearchSV,
    handleRecommendSearchSV: handleRecommendSearchSV,
    handleUpdateFlashcards: handleUpdateFlashcards
}