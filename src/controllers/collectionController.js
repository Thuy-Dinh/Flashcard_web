import collectionService from "../services/collectionService"

let collectionFlashcards = async(req, res) => {
    let flashcardId = req.body.flashcardId;
    let userId = req.body.userId;

    if (!flashcardId || !userId) {
        return res.status(500).json({
            errCode: 1,
            message: 'Các trường dữ liệu không được để trống!'
        });
    }

    let collectionData = await collectionService.handleCreateCollection(flashcardId, userId);
    console.log(collectionData);

    // return flashcard info
    return res.status(200).json({
        errCode: collectionData.errCode,
        message: collectionData.errMessage,
        collecton: collectionData.collecton ? collectionData.collecton : {}
    });

}

let getAllCollection = async(req, res) => {
    let userId = req.body.id; 

    if(!userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'người dùng không hợp lệ',
            flashcards: []
        })
    }

    let collections = await collectionService.handleGetAllCollection(userId);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        collections
    })
}

let delCollection = async(req, res) => {
    let collectionId = req.body.id; 

    if(!collectionId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Bộ flashcard không tồn tại',
            flashcards: []
        })
    }

    let collectionDeleted = await collectionService.handledelCollection(collectionId);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        collectionDeleted
    })
}

module.exports = {
    collectionFlashcards: collectionFlashcards,
    getAllCollection: getAllCollection,
    delCollection: delCollection
}