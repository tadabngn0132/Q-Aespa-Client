<template>
    <div class="answer-form-container">
        <form action="#" class="answer-form" @submit.prevent="onSubmit">
            <h1 class="answer-title">
                {{ !localAnswer._id ? 'Create Answer' : 'Update Answer' }}
            </h1>

            <textarea 
            cols="30" 
            rows="10"
            v-model="localAnswer.description"
            ></textarea>

            <ul v-if="descriptionErrors.length > 0"
            class="errors-list">
                <li
                v-for="(err, i) in descriptionErrors"
                :key="i" 
                class="errors">
                    {{ err }}
                </li>
            </ul>

            <button type="submit">
                Submit
            </button>
        </form>
    </div>
</template>

<script>
import { validateAnswer } from '@/helpers/validator/answerValidator';

export default {
    name: 'AnswerForm',
    props: {
        answer: {
            type: Object,
            required: true,
            default: () => {
                return {
                    description: ''
                };
            }
        }
    },
    data() {
        return {
            localAnswer: { ...this.answer },
            descriptionErrors: []
        }
    },
    methods: {
        onSubmit: function() {
            this.descriptionErrors = [];

            const validationErrors = validateAnswer(this.localAnswer.description);

            if (Object.values(validationErrors).some(err => err.length > 0)) {
                this.descriptionErrors = validationErrors.descriptionErrors;
                return;
            }

            this.$emit('createOrUpdate', this.localAnswer);
        }
    },
    watch: {
        answer: {
            handler(newVal) {
                this.localAnswer = {...newVal};
            },
            immediate: true
        }
    }
};
</script>

<style scoped>
.answer-form-container {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

.answer-form {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.answer-title {
    font-size: 24px;
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
    font-weight: 600;
}

textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    font-size: 16px;
    box-sizing: border-box;
    margin-bottom: 15px;
    transition: border-color 0.3s;
}

textarea:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.errors-list {
    list-style: none;
    padding: 0;
    margin: 0 0 15px 0;
}

.errors {
    color: #e53935;
    font-size: 14px;
    margin-bottom: 8px;
    padding-left: 5px;
    border-left: 3px solid #e53935;
}

button[type="submit"] {
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
    font-weight: 500;
}

button[type="submit"]:hover {
    background-color: #3a7bc8;
}

button[type="submit"]:active {
    background-color: #2a6db8;
}

@media (max-width: 768px) {
    .answer-form {
        padding: 15px;
    }
    
    textarea {
        padding: 10px;
    }
    
    button[type="submit"] {
        padding: 10px 16px;
    }
}
</style>