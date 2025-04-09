import apiClient from './apiClient';
import Vue from 'vue';

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
        
        if (Vue.$toast) {
            Vue.$toast.error(errorMessage);
        }
        
        error.userMessage = errorMessage;
        
        throw error;
    });

export const answerApi = {
    getAnswer: handleError(async (questionId, answerId) => {
        const path = `questions/${questionId}/answers/${answerId}`;
        const res = await apiClient.answerApiClient.get(path);
        return res.data;
    }),
    getAnswers: handleError(async (questionId) => {
        const path = `questions/${questionId}/answers`
        const res = await apiClient.answerApiClient.get(path);
        return res.data;
    }),
    getAllAnswers: handleError(async () => {
        const path = `/answers`
        const res = await apiClient.answerApiClient.get(path);
        return res.data;
    }),
    getAnswersByUserId: handleError(async (userId) => {
        const path = `users/${userId}/answers`;
        const res = await apiClient.answerApiClient.get(path);
        return res.data;
    }),
    createAnswer: handleError(async (questionId, payload) => {
        const path = `questions/${questionId}/answers`
        const res = await apiClient.answerApiClient.post(path, payload);
        return res.data;
    }),
    updateAnswer: handleError(async (questionId, answerId, payload) => {
        const path = `questions/${questionId}/answers/${answerId}`;
        const res = await apiClient.answerApiClient.put(path, payload);
        return res.data;
    }),
    deleteAnswer: handleError(async (questionId, answerId) => {
        const path = `questions/${questionId}/answers/${answerId}`;
        const res = await apiClient.answerApiClient.delete(path);
        return res.data;
    })
};