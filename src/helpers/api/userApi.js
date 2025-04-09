import Vue from "vue";
import apiClient from "./apiClient";


const handleError = fn => (...params) =>
    fn(...params).catch(error => {
        let errorMessage = 'An unknown error occurred';
        
        if (error.response) {
            if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = `${error.response.status}: ${error.response.statusText}`;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        console.error('API Error:', error);
        
        Vue.$toast.error(errorMessage);
        
        throw error;
    });

export const userApi = {
    getUsers: handleError(async () => {
        const res = await apiClient.userApiClient.get();
        return res.data;
    }),
    getQuestionsByUserId: handleError(async id => {
        const res = await apiClient.userApiClient.get(`${id}/questions`);
        return res.data;
    }),
    deleteUser: handleError(async id => {
        const res = await apiClient.userApiClient.delete(`${id}`);
        return res.data;
    }),
    getUser: handleError(async id => {
        const res = await apiClient.userApiClient.get(`${id}`);
        return res.data;
    }),
    createUser: handleError(async payload => {
        const res = await apiClient.userApiClient.post('', payload);
        return res.data;
    }),
    updateUser: handleError(async (id, payload) => {
        const res = await apiClient.userApiClient.put(`${id}`, payload);
        return res.data;
    }),
    searchUsers: handleError(async keyword => {
        const res = await apiClient.userApiClient.get(`search?keyword=${encodeURIComponent(keyword)}`);
        return res.data;
    })
}