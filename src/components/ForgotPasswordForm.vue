<template>
    <div class="forgot-password-container" id="container">
        <form @submit.prevent="submitForm" class="forgot-password-form">
            <h1>Forgot Password</h1>
            <p class="instruction">Enter your email address below and we'll send you a new password.</p>
            
            <div class="form-group">
            <label for="email">Email Address</label>
            <input
                type="email" 
                id="email"
                v-model="email" 
                required 
                placeholder="your-email@example.com"
            />
            </div>
            
            <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Reset Password' }}
            </button>
            
            <div v-if="message" class="message" :class="messageType">
            {{ message }}
            </div>
            
            <div v-if="!isAuthenticated" class="back-to-login">
            <router-link to="/login">Back to Login</router-link>
            </div>
        </form>
    </div>
</template>

<script>
import exportApis from '@/helpers/api/exportApis';
import { mapGetters } from 'vuex';

export default {
    name: 'ForgotPassword',
    props: {
        user: {
            type: Object,
            required: false,
            default: () => {}
        }
    },
    data() {
        return {
            email: '',
            isSubmitting: false,
            message: '',
            messageType: ''
        };
    },
    computed: {
        ...mapGetters('auth', ['isAuthenticated'])
    },
    methods: {
        async submitForm() {
            this.isSubmitting = true;
            this.message = '';
            
            try {
                await exportApis.auths.forgotPassword(this.email);
                this.message = 'If your email exists in our system, you will receive a password reset email shortly.';
                this.messageType = 'success';
                this.email = '';
            } catch (error) {
                console.error('Error requesting password reset:', error);
                this.message = 'An error occurred. Please try again later.';
                this.messageType = 'error';
            } finally {
                this.isSubmitting = false;
            }
        }
    },
    async mounted() {
        const container = document.getElementById('container');

        if (this.isAuthenticated) {
            container.style.minHeight = 'unset';
        } else {
            container.style.minHeight = '90vh';
        }

        if (this.isAuthenticated) {
            this.email = this.user.email
        }
    }
};
</script>

<style scoped>
    .forgot-password-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }
    
    .forgot-password-form {
        background-color: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        width: 400px;
    }
    
    h1 {
        margin-top: 0;
        color: #333;
        font-size: 24px;
        text-align: center;
    }
    
    .instruction {
        color: #666;
        margin-bottom: 20px;
        text-align: center;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    label {
        display: block;
        margin-top: 1.5em;
        margin-bottom: 8px;
        color: #333;
        text-align: left;
    }
    
    input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 0.75em;
    }
    
    input:focus {
        border-color: #3498db;
        outline: none;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
    
    button {
        width: 50%;
        padding: 12px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 0.75em;
        font-size: 16px;
        cursor: pointer;
        margin-top: 1.5em;
        transition: background-color 0.3s;
    }
    
    button:hover {
        background-color: #2980b9;
    }
    
    button:disabled {
        background-color: #95a5a6;
        cursor: not-allowed;
    }
    
    .message {
        margin-top: 15px;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
    }
    
    .success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .back-to-login {
        margin-top: 20px;
        text-align: center;
    }
    
    .back-to-login a {
        color: #3498db;
        text-decoration: none;
    }
    
    .back-to-login a:hover {
        text-decoration: underline;
    }
</style>