<template>
    <form action="#" class="register" @submit.prevent="onSubmit">
        <span class="title">Sign up</span>
    
        <div class="label-input-field-container">
            <div class="label-container">
                <label for="" class="input-field-name">Name</label>
                <input 
                v-model="inputs.name" 
                type="text" 
                class="input-form" 
                placeholder="e.g., Nguyen Van A"
                style="height: 1.5em !important; padding: 0.6em 1em !important; min-height: 40px !important;">
                <ul v-if="errors.name.length > 0">
                    <li v-for="(error, index) in errors.name" :key="index" class="error-mes">
                        {{ error }}
                    </li>
                </ul>
            </div>
        
            <div class="label-container">
                <label for="" class="input-field-name">Email</label>
                <input 
                v-model="inputs.email" 
                type="text" class="input-form" 
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
        
        <button class="auth-btn">Sign up</button>

        <label for="" class="change-lbl">Already have an account? 
            <router-link to="/login">Sign in</router-link></label>
    </form>
</template>

<script>
import '@/assets/css/auth.css';
import { validateRegisterInput } from '@/helpers/validator/authValidator';
import { mapGetters } from 'vuex';

export default {
    name: 'register',
    data() {
        return {
            inputs: {
                name: '',
                email: '',
                password: ''
            },
            inputType: 'password',
            toggle: 'fa-regular fa-eye',
            errors: {
                name: [],
                email: [],
                password: []
            },
            isReady: false,
        };
    },
    computed: {
        ...mapGetters('auth', ['isLoading', 'authError']),
        load() {
            return this.isLoading;
        },
        error() {
            return this.authError
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
            console.log("Submit button clicked!");
            try {
                this.errors = {
                    name: [],
                    email: [],
                    password: []
                };
    
                const validationErrors = validateRegisterInput(this.inputs);
    
                if (Object.values(validationErrors).some(err => err.length > 0)) {
                    this.errors = validationErrors;
                    return;    
                }
    
                await this.$store.dispatch('auth/register', {
                    name: this.inputs.name,
                    email: this.inputs.email,
                    password: this.inputs.password
                });                
            } catch (error) {
                console.error('Registration failed');
                this.$showMessage.error('Registration failed');
            }
        }
    }
}
</script>
