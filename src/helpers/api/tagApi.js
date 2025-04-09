import apiClient from "./apiClient";
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

export const tagApi = {
    getTag: handleError(async id => {
        const res = await apiClient.tagApiClient.get(`${id}`);
        return res.data;
    }),
    getTags: handleError(async () => {
        const res = await apiClient.tagApiClient.get();
        return res.data;
    }),
    createTag: handleError(async payload => {
        const res = await apiClient.tagApiClient.post('', payload);
        return res.data;
    }),
    updateTag: handleError(async payload => {
        const res = await apiClient.tagApiClient.put(`${payload._id}`, payload);
        return res.data;
    }),
    deleteTag: handleError(async id => {
        const res = await apiClient.tagApiClient.delete(`${id}`);
        return res.data;
    }),
    getTagsSort: handleError(async (sortType) => {
        const res = await apiClient.tagApiClient.get(`/sort?sort=${encodeURIComponent(sortType)}`);
        return res.data;
    }),
    getTagByTagName: handleError(async tagName => {
        const res = await apiClient.tagApiClient.get(`/search?tagName=${encodeURIComponent(tagName)}`);
        return res.data;
    })
};