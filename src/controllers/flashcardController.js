import flashcardService from "../services/flashcardServive";

let handleCreateFlashcard = async (req, res) => {
    let setFlashcardId = req.body.setFlashcardId;
    let terminology = req.body.terminology;
    let identify = req.body.identify;

    if (!terminology || !identify) {
        return res.status(500).json({
            errCode: 1,
            message: 'Các trường dữ liệu không được để trống!'
        });
    }

    let newFlashcard = await flashcardService.handleCreateNewFlashcard(setFlashcardId, terminology, identify);
    console.log(newFlashcard);

    // return flashcard info
    return res.status(200).json({
        errCode: newFlashcard.errCode,
        message: newFlashcard.errMessage,
        flashcard: newFlashcard.flashcard ? newFlashcard.flashcard : {}
    });
};

let handleGetOneFlashcards = async(req, res) => {
    let id = req.query.id; 
    // console.log(id);

    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Các trường dữ liệu không được để trống!',
            flashcard: {}
        })
    }

    let flashcard = await flashcardService.handleGetAFlashcards(id);

    return res.status(200).json({
        errCode: flashcard.errCode,
        errMessage: flashcard.errMessage,
        flashcard
    })
}

module.exports = {
    handleCreateFlashcard: handleCreateFlashcard,
    handleGetOneFlashcards: handleGetOneFlashcards
};
