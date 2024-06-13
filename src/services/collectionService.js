import axios from "../axios";

const handleCreateCollectionApi = (flashcardId, userId) => {
    return axios.post('/api/create-collection', { flashcardId, userId })
}

const handleGetAllCollectionApi = (userId) => {
    return axios.post('/api/display-collection', { id: userId })
}

const handleDelCollectionApi = (flashcardId) => {
    return axios.post('/api/delete-collection', { id: flashcardId });
}

export {
    handleCreateCollectionApi,
    handleGetAllCollectionApi,
    handleDelCollectionApi
}