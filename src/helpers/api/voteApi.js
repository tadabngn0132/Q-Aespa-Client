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

export const voteApi = {
    countVote: handleError(async id => {
        const res = await apiClient.voteApiClient.get(`${id}`);
        return res.data;
    }),
    deleteVote: handleError(async voteId => {
        const res = await apiClient.voteApiClient.delete(`delete/${voteId}`);
        return res.data;
    }),
    createVote: handleError(async (userId, targetId, targetType, vote) => {
        const res = await apiClient.voteApiClient.post(`${userId}/${targetId}`, { targetType, vote });
        return res.data;        
    }),
    updateVote: handleError(async (voteId, userId, targetId, targetType, vote) => {
        const res = await apiClient.voteApiClient.put(`${voteId}/update?userId=${encodeURIComponent(userId)}&targetId=${encodeURIComponent(targetId)}`,
                                                        { targetType, vote });
        return res.data;
    }),
    getVotesByUserId: handleError(async userId => {
        const res = await apiClient.voteApiClient.get(`user/${userId}`);
        return res.data;
    })
}