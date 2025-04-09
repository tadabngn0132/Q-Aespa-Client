<template>
    <form action="#" class="register" @submit.prevent="onSubmit">
        <span class="title">Sign in</span>
    
        <div class="label-input-field-container">        
            <div class="label-container">
                <label for="" class="input-field-name">Email</label>
                <input 
                v-model="inputs.email" 
                type="text" 
                class="input-form" 
                placeholder="e.g., abc123@hotmail.com"
                style="height: 1.5em !important; padding: 0.6em 1em !important; min-height: 40px !important;">
                <ul v-if="errors.email.length > 0">
                    <li v-for="(error, index) in errors.email" :key="index" class="error-mes">
                        {{ error }}
                    </li>
                </ul>
            </div>
        
            <div class="label-container">
                <label for="" class="input-field-name">Password</label>
                <input 
                v-model="inputs.password" 
                :type="inputType" 
                class="input-form" 
                placeholder="e.g., dH465#Ugdl7$"
                style="height: 1.5em !important; padding: 0.6em 1em !important; min-height: 40px !important;">
                <ul v-if="errors.password.length > 0">
                    <li v-for="(error, index) in errors.password" :key="index" class="error-mes">
                        {{ error }}
                    </li>
                </ul>

                <span class="password-toggle" @click="OnOffTogglePassword">
                    <i :class="toggle"></i>
                </span>
            </div>
        </div>

        <div class="btn_fg_password">
            <button class="auth-btn">Sign in</button>
            <router-link to="/forgot-password" class="change-lbl">Forgot your password?</router-link> 
        </div>

        <label for="" class="change-lbl">Don't have account? 
            <router-link to="/register">Register</router-link></label>
    </form>
</template>

<script>
import '@/assets/css/auth.css';
import { validateLoginInput } from '@/helpers/validator/authValidator';
import { mapGetters } from 'vuex';

export default {
    name: 'login',
    data() {
        return {
            inputs: {
                email: '',
                password: ''
            },
            inputType: 'password',
            toggle: 'fa-regular fa-eye',
            errors: {
                email: [],
                password: []
            },
            isReady: false,
        };
    },
    computed: {
        ...mapGetters('auth', ['isLoading', 'authError']),
        error() {
            return this.authError;
        }
    },
    methods: {
        OnOffTogglePassword() {
            if (this.inputType === 'password') {
                this.inputType = 'text';
                this.toggle = 'fa-regular fa-eye-slash';
            } else {
                this.inputType = 'password';
                this.toggle = 'fa-regular fa-eye';
            }
        },

        async onSubmit() {
            this.errors = {
                email: [],
                password: []
            };

            const validationErrors = validateLoginInput(this.inputs);

            if (Object.values(validationErrors).some(err => err.length > 0)) {
                this.errors = validationErrors;
                return;
            }

            try {
                await this.$store.dispatch('auth/login', {
                    email: this.inputs.email,
                    password: this.inputs.password
                });
            } catch (error) {
                console.error('Login failed:', error.userMessage || 'Invalid credentials');

                if (!error.userMessage) {
                    this.$showMessage.error('Invalid email or password. Please try again.');
                }

                this.errors.password = ['Invalid email or password. Please try again.'];
            }
        }
    }
}
</script>