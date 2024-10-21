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

const handleSearchApi = (userId, querySearch) => {
    return axios.get(`/api/search?id=${userId}&request=${querySearch}`)
} 

const handleRecommendSearchApi = (userId, querySearch) => {
    return axios.post('/api/recommend-searchResult', {id: userId, request: querySearch})
}

const handleEditFlashcardsApi = (id, topic, title)=> {
    return axios.get(`/api/edit-flashcards?id=${id}&topic=${topic}&title=${title}`)
}

const handleEditFlashcardApi = (id, terminology, identify)=> {
    return axios.get(`/api/edit-flashcard?id=${id}&terminology=${terminology}&identify=${identify}`)
}

const handleDelAFlashcardApi = (id) => {
    return axios.post('/api/delete-a-flashcard', {id})
}

export { 
    handleCreateFlashcardsApi, 
    handleCreateFlashcard, 
    handleGetAllFlashcardsApi, 
    handleGetAFlashcardsApi, 
    handleDelFlashcardsApi, 
    handleSearchApi,
    handleRecommendSearchApi,
    handleEditFlashcardsApi,
    handleEditFlashcardApi,
    handleDelAFlashcardApi
}