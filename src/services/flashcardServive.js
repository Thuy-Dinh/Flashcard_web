import db from "../models/index";

let handleCreateNewFlashcard = (setFlashcardId, terminology, identify) => {
    return new Promise(async(resolve, reject) => {
        try {
            let newFlashcard = {};
            let flashcards = await db.Setflashcard.findByPk(setFlashcardId);
            if (flashcards) {
                let flashcardExists = await checkFlashcardExists(setFlashcardId, terminology, identify);
                if(!flashcardExists) {
                    let newFlashcardData = await db.Flashcard.create({
                        setFlashcardId: setFlashcardId,
                        terminology: terminology,
                        identify: identify,
                        img: '',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
        
                    newFlashcard.errCode = 0;
                    newFlashcard.errMessage = 'Ok';
                    newFlashcard.flashcard = newFlashcardData;
                }
                else {
                    newFlashcard.errCode = 1;
                    newFlashcard.errMessage = 'flashcard đã tồn tại';
                }
            } else {
                newFlashcard.errCode = 2;
                newFlashcard.errMessage = 'Dữ liệu không hợp lệ';
            }
            resolve(newFlashcard);
        } catch (e) {
            reject(e);
        }
    })
}

let checkFlashcardExists = (setFlashcardId, terminology, identify) => {
    return new Promise(async (resolve, reject) => {
        try {
            let flashcard = await db.Flashcard.findOne({
                where: {
                    setFlashcardId: setFlashcardId,
                    terminology: terminology,
                    identify: identify
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
    handleCreateNewFlashcard: handleCreateNewFlashcard,
}