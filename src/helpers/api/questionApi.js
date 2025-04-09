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
        
        Vue.$toast.error(errorMessage);
        
        throw error;
    });

export const questionApi = {
    getQuestion: handleError(async id => {
        const res = await apiClient.questionApiClient.get(`${id}`);
        return res.data;
    }),
    getQuestions: handleError(async () => {
        const res = await apiClient.questionApiClient.get();
        return res.data;
    }),
    getQuestionsByTagId: handleError(async (tagId) => {
        const res = await apiClient.questionApiClient.get(`bytag/${tagId}`);
        return res.data;
    }),
    createQuestion: handleError(async payload => {
        const res = await apiClient.questionApiClient.post('', payload);
        return res.data;
    }),
    updateQuestion: handleError(async payload => {
        const res = await apiClient.questionApiClient.put(`${payload._id}`, payload);
        return res.data;
    }),
    deleteQuestion: handleError(async id => {
        const res = await apiClient.questionApiClient.delete(`${id}`);
        return res.data;
    }),
    searchQuestion: handleError(async keyword => {
        const res = await apiClient.questionApiClient.get(`search?keyword=${encodeURIComponent(keyword)}`);
        return res.data;
    }),
    getQuestionsSort: handleError(async (sortType) => {
        const res = await apiClient.questionApiClient.get(`sort?sort=${encodeURIComponent(sortType)}`);
        return res.data;
    }),
    countQuestionByTagId: handleError(async tagId => {
        const res = await apiClient.questionApiClient.get(`/questionCount/${tagId}`);
        return res.data;
    }),
    searchQuestionExact: handleError(async (keyword, type) => {
        const res = await apiClient.questionApiClient.get(`search?keyword=${encodeURIComponent(keyword)}&type=${encodeURIComponent(type)}`);
        return res.data;
    })
};