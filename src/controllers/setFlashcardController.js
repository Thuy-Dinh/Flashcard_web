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

// let handleGetAllUsers = async(req, res) => {
//     let id = req.query.id; // All, Single(sửa)

//     if(!id) {
//         return res.status(200).json({
//             errCode: 1,
//             errMessage: 'Missing required parameter',
//             users: []
//         })
//     }

//     let users = await userService.getAllUsers(id);

//     return res.status(200).json({
//         errCode: 0,
//         errMessage: 'Ok',
//         users
//     })
// }

module.exports = {
    handleCreateFlashcards: handleCreateFlashcards,
    // handleGetAllUsers: handleGetAllUsers
};
