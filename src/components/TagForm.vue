<template>
    <div class="tag-form-container">
        <form action="#" class="tag-form" @submit.prevent="onSubmit">
            <h1>
                {{ tag._id ? 'Update Tag' : 'Create Tag' }}
            </h1>
            
            <label class="name-label">
                Name
                <span class="require">
                    *
                </span>
            </label>

            <input 
            type="text" 
            :placeholder="namePlaceholder"
            class="name-input"
            v-model="tag.name">

            <ul 
            v-if="errors.name && errors.name.length > 0" 
            class="errors-list">
                <li 
                v-for="(err, i) in errors.name" 
                :key="i" 
                class="error">
                    {{ err }}
                </li>
            </ul>

            <label class="description-label">
                Description
                <span class="require">
                    *
                </span>
            </label>

            <textarea 
            cols="40" 
            rows="10"
            class="description-textarea"
            :placeholder="descriptionPlaceholder"
            v-model="tag.description"
            ></textarea>

            <ul 
            v-if="errors.description 
                && errors.description.length > 0" 
            class="errors-list">
                <li
                v-for="(err, i) in errors.description" 
                :key="i" 
                class="error">
                    {{ err }}
                </li>
            </ul>

            <button class="create-or-update-btn" type="submit">
                {{ tag._id ? 'Update Tag' : 'Create Tag' }}
            </button>
        </form>
    </div>
</template>

<script>
    import { validateTag } from '@/helpers/validator/tagValidator';

    export default {
        name: 'TagForm',
        props: {
            tag: {
                type: Object,
                required: true,
                default: () => {
                    return {
                        name: '',
                        description: ''
                    }
                }
            }
        },
        data() {
            return {
                namePlaceholder: 'Machine Learning',
                descriptionPlaceholder: 'Machine Learning is a branch of AI that focuses on developing algorithms that allow computers to learn from data and improve their performance over time without being explicitly programmed. Applications of ML include prediction, classification, and pattern recognition.',
                errors: {
                    name: [],
                    description: []
                }
            }
        },
        methods: {
            onSubmit: function() {
                this.errors = {
                    name: [],
                    description: []
                };

                const validationErrors = validateTag(this.tag);

                if (Object.values(validationErrors).some(err => err.length > 0)) {
                    this.errors = validationErrors;
                    return;
                }

                this.$emit('createOrUpdate', this.tag);
            }
        }
    }
</script>

<style scoped>
.tag-form-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 25px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.tag-form {
    display: flex;
    flex-direction: column;
}

.name-label, .description-label {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: left;
    color: #333;
}

.require {
    color: #e74c3c;
    margin-left: 4px;
}

.name-input {
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 15px;
    transition: all 0.3s ease;
}

.name-input:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    outline: none;
}

.description-textarea {
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 15px;
    resize: vertical;
    min-height: 150px;
    font-family: Arial, sans-serif;
    line-height: 1.5;
    transition: all 0.3s ease;
}

.description-textarea:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    outline: none;
}

.errors-list {
    list-style-type: none;
    padding: 0;
    margin: -5px 0 15px 0;
    animation: fadeIn 0.3s ease-in-out;
}

.error {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-bottom: 5px;
    padding-left: 5px;
    border-left: 2px solid #e74c3c;
}

.create-or-update-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    align-self: flex-start;
    margin-top: 10px;
}

.create-or-update-btn:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.create-or-update-btn:active {
    transform: translateY(0);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .tag-form-container {
        padding: 20px;
        margin: 0 15px;
    }
    
    .name-input, .description-textarea {
        padding: 10px 12px;
    }
    
    .create-or-update-btn {
        width: 100%;
        padding: 12px 0;
    }
}
</style>