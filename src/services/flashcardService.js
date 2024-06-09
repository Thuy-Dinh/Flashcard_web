import axios from "../axios";

const handleCreateFlashcardsApi = (userId, flashcardtitle, flashcardtopic) => {
    return axios.post('/api/create-flashcards', { userId: userId, title: flashcardtitle, topic: flashcardtopic })
}

const handleCreateFlashcard = (setFlashcardId, terminology, identify) => {
    return axios.post('/api/create-flashcard', { setFlashcardId, terminology, identify })
}
 
const handleGetAllFlashcardsApi = (userId) => {
    return axios.get(`/api/get-all-flashcards?id=${userId}`)
}

const handleGetAFlashcardsApi = (flashcardId) => {
    return axios.get(`/api/get-a-flashcards?id=${flashcardId}`)
}

const handleDelFlashcardsApi = (flashcardsId) => {
    return axios.post('/api/delete-flashcards', {id: flashcardsId})
}

export { handleCreateFlashcardsApi, handleCreateFlashcard, handleGetAllFlashcardsApi, handleGetAFlashcardsApi, handleDelFlashcardsApi }