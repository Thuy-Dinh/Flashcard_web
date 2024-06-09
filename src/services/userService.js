import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const handleSignupApi = (userName, userEmail, userPassword) => {
    return axios.post('/api/signup', {userName: userName, email: userEmail, password: userPassword})
}

const handleEditUserApi = (email, firstName, lastName, gender, age) => {
    return axios.post('/api/edit-user', {email, firstName, lastName, gender, age});
}

const handleDelUserApi = (userEmail) => {
    return axios.post('/api/delete-user', {email: userEmail});
}

export { handleLoginApi, getAllUsers, handleSignupApi, handleEditUserApi, handleDelUserApi }