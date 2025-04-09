import apiClient from './apiClient';
import Vue from 'vue';


const handleError = fn => (...params) =>
    fn(...params).catch(error => {
        let errorMessage = 'An unknown error occurred';
        
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = `${error.response.status}: ${error.response.statusText}`;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        console.error('API Error:', errorMessage);
        
        if (Vue && Vue.$toast) {
            Vue.$toast.error(errorMessage);
        }
        
        error.userMessage = errorMessage;
        throw error;
    });

export const authApi = {
    registerUser: handleError(async (name, email, password) => {
        const res = await apiClient.registerApiClient.post('', { name, email, password });
        return res.data;
    }),
    loginUser: handleError(async (email, password) => {
        const res = await apiClient.loginApiClient.post('', {email, password});
        
        if (res.data && res.data.token) {
            localStorage.setItem('token', res.data.token);
            apiClient.setupAuthInterceptor?.(res.data.token);
        }
        
        return res.data;
    }),
    logout: () => {
        apiClient.clearToken();
        return true;
    },
    isAuthenticated: () => {
        return !!apiClient.getToken();
    },
    changePassword: handleError(async (userId, passwordData) => {
        const res = await apiClient.changepasswordApiClient.put(`${userId}`, {
            currentPassword: passwordData.currentPassword, 
            newPassword: passwordData.newPassword
        });
        return res.data;
    }),
    forgotPassword: handleError(async (email) => {
        const res = await apiClient.authApiClient.post('forgot-password', { email });
        return res.data;
    })
};