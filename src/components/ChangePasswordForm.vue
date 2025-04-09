<template>
    <div class="change-password-container">
        <h2>Change Password</h2>
        <form @submit.prevent="onSubmit" class="change-password-form">
            <div class="form-group">
                <label for="currentPassword">
                    Current Password
                    <span class="require">*</span>
                </label>
                <div class="password-container">
                    <input 
                        :type="inputTypes.currentPassword" 
                        id="currentPassword" 
                        v-model="passwordData.currentPassword"
                        class="password-input"
                        required
                    />
                    <span class="password-toggle" @click="togglePasswordVisibility('currentPassword')">
                        <i :class="toggleIcons.currentPassword"></i>
                    </span>
                </div>
            </div>
            
            <div class="form-group">
                <label for="newPassword">
                    New Password
                    <span class="require">*</span>
                </label>
                <div class="password-container">
                    <input 
                        :type="inputTypes.newPassword" 
                        id="newPassword" 
                        v-model="passwordData.newPassword"
                        class="password-input"
                        required
                    />
                    <span class="password-toggle" @click="togglePasswordVisibility('newPassword')">
                        <i :class="toggleIcons.newPassword"></i>
                    </span>
                </div>
                <ul v-if="errors.newPassword.length > 0" class="error-list">
                    <li v-for="(error, index) in errors.newPassword" :key="index" class="error-item">
                        {{ error }}
                    </li>
                </ul>
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">
                    Confirm New Password
                    <span class="require">*</span>
                </label>
                <div class="password-container">
                    <input 
                        :type="inputTypes.confirmPassword" 
                        id="confirmPassword" 
                        v-model="passwordData.confirmPassword"
                        class="password-input"
                        required
                    />
                    <span class="password-toggle" @click="togglePasswordVisibility('confirmPassword')">
                        <i :class="toggleIcons.confirmPassword"></i>
                    </span>
                </div>
                <p v-if="!passwordsMatch && passwordData.confirmPassword" class="error-message">
                    Passwords do not match
                </p>
            </div>
            
            <div class="button-group">
                <button type="submit" class="btn-save" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Changing...' : 'Change Password' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { validatePassword } from '@/helpers/validator/authValidator';
import exportApis from '@/helpers/api/exportApis';

export default {
    name: 'ChangePasswordForm',
    data() {
        return {
            passwordData: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            inputTypes: {
                currentPassword: 'password',
                newPassword: 'password',
                confirmPassword: 'password'
            },
            toggleIcons: {
                currentPassword: 'fa-regular fa-eye',
                newPassword: 'fa-regular fa-eye',
                confirmPassword: 'fa-regular fa-eye'
            },
            errors: {
                newPassword: []
            },
            isSubmitting: false
        }
    },
    computed: {
        ...mapGetters('auth', ['userId']),
        passwordsMatch() {
            return !this.passwordData.newPassword || 
                !this.passwordData.confirmPassword || 
                this.passwordData.newPassword === this.passwordData.confirmPassword;
        }
    },
    methods: {
        togglePasswordVisibility(field) {
            this.inputTypes[field] = this.inputTypes[field] === 'password' ? 'text' : 'password';
            this.toggleIcons[field] = this.inputTypes[field] === 'password' 
                ? 'fa-regular fa-eye' 
                : 'fa-regular fa-eye-slash';
        },
        validateForm() {
            this.errors.newPassword = validatePassword(this.passwordData.newPassword);
            
            return this.errors.newPassword.length === 0 && this.passwordsMatch;
        },
        async onSubmit() {
            if (!this.validateForm()) {
                return;
            }
            
            this.isSubmitting = true;
            const userId = this.$store.state.auth.userId;
            try {
                
                await exportApis.auths.changePassword(userId, {
                    currentPassword: this.passwordData.currentPassword,
                    newPassword: this.passwordData.newPassword
                });
                console.log('Password change request:', this.passwordData);
                
                setTimeout(() => {
                    this.$showMessage.success('Password changed successfully!');
                    this.resetForm();
                    this.isSubmitting = false;
                }, 1000);
            } catch (error) {
                console.error('Error changing password:', error);
                this.$showMessage.error('Failed to change password. Please try again.');
                this.isSubmitting = false;
            }
        },
        resetForm() {
            this.passwordData = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
            this.errors = {
                newPassword: []
            };
        }
    }
}
</script>

<style scoped>
.change-password-container {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
}

h2 {
    color: #333;
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
    text-align: center;
}

.change-password-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    text-align: left;
    color: #444;
}

.require {
    color: #e74c3c;
}

.password-container {
    position: relative;
}

.password-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.password-input:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.password-toggle {
    position: absolute;
    right: 10px;
    top: 47.5%;
    transform: translateY(-50%);
    color: #757575;
    cursor: pointer;
    padding: 4px;
}

.password-toggle i {
    color: inherit;
}

.button-group {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.btn-save {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
    min-width: 150px;
}

.btn-save:hover {
    background-color: #2980b9;
}

.btn-save:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
}

.error-list {
    list-style: none;
    padding: 0;
    margin: 8px 0 0 0;
}

.error-item, .error-message {
    color: #e74c3c;
    font-size: 13px;
    margin-top: 5px;
}
</style>