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

module.exports = {
    handleCreateNewFlashcards: handleCreateNewFlashcards,
}