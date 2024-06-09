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
            resolve(flashcards)
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

module.exports = {
    handleCreateNewFlashcards: handleCreateNewFlashcards,
    handleGetFlashcards: handleGetFlashcards,
    handleDelFlashcards: handleDelFlashcards
}