import exportApis from "@/helpers/api/exportApis";
import apiClient from "@/helpers/api/apiClient";
import router from '@/router';
import Vue from "vue";

const state = {
    token: localStorage.getItem('token') || null,
    user: null,
    userId: localStorage.getItem('userId') || null,
    role: localStorage.getItem('userRole') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
};

const getters = {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    authError: state => state.error,
    isLoading: state => state.loading,
    userRole: state => state.role,
    isAdmin: state => state.role === 'admin',
    isStudent: state => state.role === 'student'
};

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token;
        state.isAuthenticated = !!token;
        apiClient.setupAuthToken(token)
    },
    SET_USER(state, user) {
        state.user = user;

        if (user) {
            localStorage.setItem('userData', JSON.stringify({
                name: user.name || '',
                email: user.email || ''
            }));
        } else {
            localStorage.removeItem('userData');
        }
    },
    SET_USER_ID(state, userId) {
        state.userId = userId;
        localStorage.setItem('userId', userId);
    },
    SET_ROLE(state, role) {
        state.role = role;
        localStorage.setItem('userRole', role);
    },
    SET_LOADING(state, status) {
        state.loading = status;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    CLEAR_AUTH(state) {
        state.token = null;
        state.user = null;
        state.userId = null;
        state.role = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
    }
};

const actions = {
    async register({ commit, dispatch }, { name, email, password, role }) {
        try {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            const response = await exportApis.auths.registerUser(name, email, password, role || 'student');

            if (response.success) {
                await dispatch('login', { email, password });
            }

            return response;
        } catch (error) {
            commit('SET_ERROR', error.message || 'Register failed');
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async login({ commit }, { email, password }) {
        try {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            const response = await exportApis.auths.loginUser(email, password);

            console.log('Login response:', response);
            
            if (response && response.token) {
                commit('SET_TOKEN', response.token);

                if (response.expiresIn) {
                    const expiresInMs = response.expiresIn * 1000;
                    const expirationTime = new Date().getTime() + expiresInMs;
                    localStorage.setItem('tokenExpiration', expirationTime);

                    const timeUntilExpiration = expiresInMs;
                    setTimeout(() => {
                        commit('CLEAR_AUTH');
                        router.push('/login');
                    }, timeUntilExpiration);
                }
                
                if (response.user) {
                    commit('SET_USER', response.user);
                }

                if (response.userId) {
                    commit('SET_USER_ID', response.userId);
                } else if (response.user && response.user.userId) {
                    commit('SET_USER_ID', response.user.userId);
                }

                let userRole = '';

                if (response.role) {
                    userRole = response.role;
                    commit('SET_ROLE', userRole);
                } else if (response.user && response.user.role) {
                    userRole = response.user.role;
                    commit('SET_ROLE', userRole);
                }

                console.log('User role:', userRole);

                if (userRole === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/student');
                }
                
                return response;
            }
        } catch (error) {
            commit('SET_ERROR', error.message || 'Login failed');
            Vue.$toast.error(error.message || 'Invalid credentials. Please try again.');
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async fetchUserProfile({ commit, state, dispatch }) {
        try {
            if (!state.userId) {
                console.warn('User ID not available, cannot fetch profile');
                return null;
            }
            
            commit('SET_LOADING', true);
            
            const userProfile = await exportApis.users.getUser(state.userId);
    
            if (userProfile) {
                const currentRole = state.role;
                
                commit('SET_USER', userProfile);
    
                if (userProfile.role && userProfile.role !== currentRole) {
                    commit('SET_ROLE', userProfile.role);
                }
    
                const tokenExpiration = localStorage.getItem('tokenExpiration');
                if (tokenExpiration) {
                    const now = new Date().getTime();
                    const timeLeft = parseInt(tokenExpiration) - now;
    
                    if (timeLeft <= 0) {
                        console.log('Token has expired');
                        dispatch('logout');
                        return;
                    } else {
                        setTimeout(() => {
                            dispatch('logout');
                        }, timeLeft);
                    }
                }
                
                return userProfile;
            } else {
                throw new Error('User profile not found');
            }
    
        } catch (error) {
            commit('SET_ERROR', error.message || 'Unable to get user information');
            return null;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    logout({ commit }) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiration');
        
        apiClient.clearToken();
        commit('CLEAR_AUTH');

        if (!router.currentRoute.path.startsWith('/student')) {
            router.push('/student');
        } else {
            window.location.reload();
        }
    },

    async checkAuthState({ commit, dispatch }) {
        try {
            const token = localStorage.getItem('token');
    
            if (!token) {
                console.log('No token found in localStorage');
                return;
            }
    
            const tokenExpiration = localStorage.getItem('tokenExpiration');
            if (tokenExpiration) {
                const now = new Date().getTime();
                if (now >= parseInt(tokenExpiration)) {
                    console.log('Token has expired');
                    dispatch('logout');
                    return;
                }
            }
    
            console.log('Found token, setting up authentication');
            commit('SET_TOKEN', token);
            apiClient.setupAuthToken(token);
            
            const savedRole = localStorage.getItem('userRole');
            if (savedRole) {
                commit('SET_ROLE', savedRole);
            }
            
            const saveUserId = localStorage.getItem('userId');
            if (saveUserId) {
                commit('SET_USER_ID', saveUserId);
            }
            
            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    const parsedUserData = JSON.parse(userData);
    
                    const userWithId = {
                        ...parsedUserData,
                        userId: saveUserId,
                        role: savedRole
                    }
    
                    commit('SET_USER', userWithId);
                } catch (error) {
                    console.error('Error parsing userData:', error);
                }
            }
            
            if (saveUserId) {
                try {
                    await dispatch('fetchUserProfile');
                } catch (error) {
                    console.warn('Failed to fetch updated user profile:', error);
                }
            }
        } catch (error) {
            console.error('Error in checkAuthState:', error);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}