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

let handleGetAFlashcards = (setFlashcardId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let flashcard = {};
            if(setFlashcardId) {
                flashcard = await db.Flashcard.findAll({
                    where: {setFlashcardId: setFlashcardId}
                })
            } 
            if (flashcard.length === 0) {
                flashcard.errCode = 1;
                flashcard.errMessage = 'Bộ flashcard không tồn tại';
            } else {
                flashcard.errCode = 0;
                flashcard.errMessage = 'ok';
            }
            resolve(flashcard);
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleCreateNewFlashcard: handleCreateNewFlashcard,
    handleGetAFlashcards: handleGetAFlashcards
}