import setFlashcardService from "../services/setFlashcardService";

let handleCreateFlashcards = async (req, res) => {
    let userId = req.body.userId;
    let title = req.body.title;
    let topic = req.body.topic;

    if (!userId || !title || !topic) {
        return res.status(500).json({
            errCode: 1,
            message: 'Các trường dữ liệu không được để trống!'
        });
    }

    let flashcardData = await setFlashcardService.handleCreateNewFlashcards(userId, title, topic);
    console.log(flashcardData);

    // return flashcard info
    return res.status(200).json({
        errCode: flashcardData.errCode,
        message: flashcardData.errMessage,
        flashcard: flashcardData.flashcard ? flashcardData.flashcard : {}
    });
};

let handleGetAllFlashcards = async(req, res) => {
    let id = req.query.id; 
    // console.log(id);
    let flashcards = await setFlashcardService.handleGetFlashcards(id);

    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'người dùng không hợp lệ',
            flashcards: []
        })
    }


    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        flashcards
    })
}

let handleDeleteFlashcards = async(req, res) => {
    let id = req.body.id;

    if (!id) {
        return res.status(500).json({
            errCode: 1,
            message: 'Không tìm thấy bộ flashcard!'
        });
    }

    let flashcardsDeleted = await setFlashcardService.handleDelFlashcards(id);
    console.log(flashcardsDeleted);

    return res.status(200).json({
        errCode: flashcardsDeleted.errCode,
        message: flashcardsDeleted.errMessage,
        flashcards: flashcardsDeleted.flashcards 
    });
}

let handleSearch = async(req, res) => {
    let userId = req.query.id;
    let request = req.query.request;

    if (!userId) {
        return res.status(500).json({
            errCode: 1,
            message: 'Các trường dữ liệu không được để trống!'
        });
    }

    let result = await setFlashcardService.handleSearchSV(userId, request);

    return res.status(200).json({
        data: result ? result : []
    });

}

module.exports = {
    handleCreateFlashcards: handleCreateFlashcards,
    handleGetAllFlashcards: handleGetAllFlashcards,
    handleDeleteFlashcards: handleDeleteFlashcards,
    handleSearch: handleSearch
};
