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
            
            let data = await db.Setflashcard.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${request}%` } },
                        { topic: { [Op.like]: `%${request}%` } }
                    ],
                    [Op.not]: { userId: id } 
                },
                attributes: ['id', 'userId', 'topic', 'title']
            });
            console.log(data);
            if(data.length === 0) {
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
                console.log(userSearch);
                let userIds = userSearch.map(record => record.id);
                let data = await db.Setflashcard.findAll({
                    where: {
                        userId: { [Op.in]: userIds }
                    },
                    attributes: ['id', 'topic', 'title'],
                })

                let flashcardIds = data.map(record => record.id);

                let flashcardCounts = await db.Flashcard.findAll({
                    where: {
                        setFlashcardId: { [Op.in]: flashcardIds }
                    },
                    attributes: ['setFlashcardId', [Sequelize.fn('COUNT', Sequelize.col('id')), 'sumFlashcard']],
                    group: ['setFlashcardId']
                })

                let quantity = flashcardCounts.map(index => index.sumFlashcard);

                let userNames = userSearch.map(record => `${record.firstName} ${record.lastName}`);

                // Kết hợp thông tin người dùng với bản ghi Setflashcard
                let result = data.map((record, index) => {
                    return {
                        flashcardsId: record.id,
                        userName: userNames[index],
                        topic: record.topic,
                        title: record.title,
                        quantity: quantity[index]
                    };
                });
                
                resolve(result);

            } else {
                let flashcardIds = data.map(record => record.id);

                let flashcardCounts = await db.Flashcard.findAll({
                    where: {
                        setFlashcardId: { [Op.in]: flashcardIds }
                    },
                    attributes: ['setFlashcardId', [Sequelize.fn('COUNT', Sequelize.col('id')), 'sumFlashcard']],
                    group: ['setFlashcardId']
                })

                let quantity = flashcardCounts.map(index => index.sumFlashcard);

                // Tạo một mảng các promises để tìm user cho từng userId
                let userPromises = data.map(record => findUser(record.userId));

                // Chờ tất cả các promises hoàn thành
                let users = await Promise.all(userPromises);

                // Kết hợp thông tin người dùng với bản ghi Setflashcard
                let result = data.map((record, index) => {
                    let user = users[index];
                    return {
                        flashcardsId: record.id,
                        userName: `${user.firstName} ${user.lastName}`,
                        topic: record.topic,
                        title: record.title,
                        quantity: quantity[index]
                    };
                });
                
                resolve(result);

            }
            
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

module.exports = {
    handleCreateNewFlashcards: handleCreateNewFlashcards,
    handleGetFlashcards: handleGetFlashcards,
    handleDelFlashcards: handleDelFlashcards,
    handleSearchSV: handleSearchSV
}