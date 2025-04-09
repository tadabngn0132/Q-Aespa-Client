<template>
    <div class="user-form-container">
        <form action="#" class="user-form" @submit.prevent="onSubmit">
            <h1>
                {{ isEditing ? 'Update User' : 'Create User' }}
            </h1>
            
            <label class="name-label">
                Name
                <span class="require">
                    *
                </span>
            </label>

            <input 
            type="text" 
            class="name-input" 
            v-model="formData.name">

            <ul 
            v-if="errors.name.length > 0" 
            class="errors-list">
                <li 
                v-for="(err, i) in errors.name" 
                :key="i" 
                class="errors">
                    {{ err }}
                </li>
            </ul>

            <label class="email-label">
                Email
                <span class="require">
                    *
                </span>
            </label>

            <input 
            type="text" 
            class="email" 
            v-model="formData.email">

            <ul 
            v-if="errors.email.length > 0" 
            class="errors-list">
                <li 
                v-for="(err, i) in errors.email" 
                :key="i" 
                class="errors">
                    {{ err }}
                </li>
            </ul>

            <label 
            v-if="isEditing === false" 
            class="password">
                Password
                <span class="require">
                    *
                </span>
            </label>

            <input 
            v-if="isEditing === false" 
            type="password" 
            class="password" 
            v-model="formData.password">

            <ul 
            v-if="isEditing === false && errors.password.length > 0" 
            class="errors-list">
                <li 
                v-for="(err, i) in errors.password" 
                :key="i" 
                class="errors">
                    {{ err }}
                </li>
            </ul>

            <label class="role">
                Role
                <span class="require">
                    *
                </span>
            </label>

            <div v-if="isAdmin" class="role-choice">
                <div class="choice">
                    <input 
                    type="radio" 
                    name="role" 
                    id="admin-role" 
                    value="admin"
                    v-model="formData.role">
                    <span class="role-name">Admin</span>
                </div>
    
                <div class="choice">
                    <input 
                    type="radio" 
                    name="role" 
                    id="student-role" 
                    value="student"
                    v-model="formData.role">
                    <span class="role-name">Student</span>
                </div>
            </div>

            <input 
            v-else-if="isEditing === true" 
            type="role" 
            class="role"
            disabled
            v-model="user.role">

            <button type="submit">
                Submit
            </button>
        </form>
    </div>
</template>

<script>
import { validateCreateUser } from '@/helpers/validator/userValidator';
import { validateEditUser } from '@/helpers/validator/userValidator';
import { mapGetters } from 'vuex';

export default {
    name: 'UserForm',
    props: {
        isEditing: {
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            required: false,
            default: () => {
                return {
                    name: '',
                    email: '',
                    role: 'student'
                }
            }
        }
    },
    data() {
        return {
            formData: {
                name: '',
                email: '',
                password: '',
                role: 'student'
            },
            errors: {
                name: [],
                email: [],
                password: []
            }
        }
    },
    computed: {
        ...mapGetters('auth', ['isAdmin'])
    },
    methods: {
        async onSubmit() {
            this.errors = {
                name: [],
                email: [],
                password: []
            };

            if (this.isEditing === false) {
                const validationCreateErrors = validateCreateUser(this.formData);
                
                if (Object.values(validationCreateErrors).some(err => err.length > 0)) {
                    this.errors = validationCreateErrors;
                    return;
                }
                
                this.$emit('createUser', {
                    name: this.formData.name,
                    email: this.formData.email,
                    password: this.formData.password,
                    role: this.formData.role
                });
            }
            
            if (this.isEditing === true) {
                const validationEditErrors = validateEditUser(this.formData);
                
                if(Object.values(validationEditErrors).some(err => err.length > 0)) {
                    this.errors = validationEditErrors;
                    return;
                }
                
                this.$emit('editUser', {
                    name: this.formData.name,
                    email: this.formData.email,
                    role: this.formData.role
                });
            }
        }
    },
    watch: {
        user: {
            handler(newVal) {
                this.formData.name = newVal.name;
                this.formData.email = newVal.email;
                this.formData.role = newVal.role || 'student';
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
.user-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Roboto', Arial, sans-serif;
}

.user-form {
    width: 100%;
    max-width: 450px;
    padding: 2rem;
    background-color: white;
    border-radius: 1em;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.user-form h1 {
    margin-top: 0;
    margin-bottom: 1.75rem;
    color: #2c3e50;
    font-size: 1.8rem;
    font-weight: 600;
    text-align: center;
}

.user-form label {
    display: block;
    text-align: left;
    margin-bottom: 0.5rem;
    margin-top: 0.75em;
    color: #4a5568;
    font-size: 0.95rem;
    font-weight: 600;
}

.require {
    color: #e53e3e;
    margin-left: 3px;
}

.user-form input.name-input,
.user-form input.email,
.user-form input.password,
.user-form input.role {
    width: 100%;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    color: #2d3748;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.user-form input:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    outline: none;
}

.errors-list {
    margin: 0 0 1em 0;
    list-style-type: none;
}

.errors {
    text-align: left;
    color: #e53e3e;
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
}

.role-choice {
    display: flex;
    gap: 2em;
}

.choice {
    display: flex;
    gap: 0.25em;
}

.user-form button {
    display: block;
    width: 30%;
    padding: 0.75rem 1rem;
    background-color: #3182ce;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 0.75em;
    justify-self: center;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 1.5em;
}

.user-form button:hover {
    background-color: #2b6cb0;
}

.user-form button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.4);
}

@media screen and (max-width: 480px) {
    .user-form {
        padding: 1.5rem;
    }
    
    .user-form h1 {
        font-size: 1.5rem;
    }
}
</style>