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

let handleUpdateFlashcard = (id, terminology, identify) => {
    return new Promise(async (resolve, reject) => {
        try {
            let flashcardUpdated = {};
            
            let flashcard = await db.Flashcard.findOne({
                where: { id: id },
                raw: false
            });

            if (flashcard) {
                flashcard.terminology = terminology;
                flashcard.identify = identify;

                flashcardUpdated.flashcard = await flashcard.save();

                // Log flashcards sau khi cập nhật
                console.log('flashcards updated:', flashcardUpdated.flashcard);

                flashcardUpdated.errCode = 0;
                flashcardUpdated.errMessage = 'ok';
            } else {
                flashcardUpdated.errCode = 1;
                flashcardUpdated.errMessage = 'Bộ flashcard không tồn tại';
            }

            resolve(flashcardUpdated);

        } catch (e) {
            reject(e);
        }
    });
}

let handleDelAFlashcard = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let flashcardDel = {};

            let flashcard = await db.Flashcard.findOne({
                where: { id: id },
                raw: false
            })
            if (flashcard) {
                flashcardDel.errCode = 0;
                flashcardDel.errMessage = 'ok';
                flashcardDel.flashcard = await flashcard.destroy();
            }
            else {
                flashcardDel.errCode = 1;
                flashcardDel.errMessage = 'Không tìm thấy bộ flashcard cần xóa';
            }
    
            resolve(flashcardDel);

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleCreateNewFlashcard: handleCreateNewFlashcard,
    handleGetAFlashcards: handleGetAFlashcards,
    handleUpdateFlashcard: handleUpdateFlashcard,
    handleDelAFlashcard: handleDelAFlashcard
}