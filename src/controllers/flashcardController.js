// import flashcardService from "../services/flashcardService";

// let handleCreateFlashcard = async (req, res) => {
//     let { idUser, title, topic, flashcards } = req.body;

//     if (!idUser || !title || !topic || !flashcards || !Array.isArray(flashcards)) {
//         return res.status(500).json({
//             errCode: 1,
//             message: 'Missing input parameters!'
//         });
//     }

//     try {
//         // Create flashcards and collect their ids
//         let flashcardIds = [];
//         for (let flashcard of flashcards) {
//             let { terminology, identify } = flashcard;
//             if (!terminology || !identify) {
//                 return res.status(500).json({
//                     errCode: 1,
//                     message: 'Missing flashcard parameters!'
//                 });
//             }
//             let createdFlashcard = await flashcardService.createFlashcard({ terminology, identify });
//             flashcardIds.push(createdFlashcard.id);
//         }

//         // Create flashcard set
//         let flashcardSet = {
//             idUser,
//             title,
//             topic,
//             idFlashcard: flashcardIds
//         };
//         await flashcardService.createFlashcardSet(flashcardSet);

//         return res.status(200).json({
//             errCode: 0,
//             message: 'Flashcard set created successfully!'
//         });
//     } catch (error) {
//         console.error('Error creating flashcard set:', error);
//         return res.status(500).json({
//             errCode: 2,
//             message: 'Error creating flashcard set!'
//         });
//     }
// };

// module.exports = {
//     handleCreateFlashcard: handleCreateFlashcard
// };
