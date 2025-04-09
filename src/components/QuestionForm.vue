<template>
    <div class="question-form-container">        
        <form action="#" class="question-form" @submit.prevent="onSubmit">
            <label class="title-label">
                Title
                <span>*</span>
            </label>
            <p class="title-description">
                Enter a short, clear title to describe your question.
            </p>
            <input 
            type="text" 
            class="title-input" 
            :placeholder="titlePlaceholder" 
            required
            v-model="question.title">

            <ul v-if="errors.title.length > 0" class="errors-list">
                <li class="errors">
                    <p v-for="(err, i) in errors.title" :key="i" class="error-mes">
                        {{ err }}
                    </p>
                </li>
            </ul>
    
            <label class="description-label">
                Description
                <span>*</span>
            </label>
            <p class="description-description">
                Describe your question in detail. The more specific you are, the more likely you are to get an accurate answer.
            </p>
            <textarea 
            cols="72" 
            rows="12" 
            :placeholder="descriptionPlaceholder"
            v-model="question.description">
            </textarea>

            <ul v-if="errors.description.length > 0" class="errors-list">
                <li class="errors">
                    <p v-for="(err, i) in errors.description" :key="i" class="error-mes">
                        {{ err }}
                    </p>
                </li>
            </ul>

            <label class="tag-title">
                Tag
                <span>*</span>
            </label>
            <p class="tag-description" id="tag-description">
                Add relevant tags to make your question easier to find.
            </p>
            <p class="tag-description">
                Existing tags:
            </p>
            <div v-if="tags && tags.length > 0" class="existing-tags-container">
                <ul class="existing-tags-list">
                    <li 
                    v-for="(tag, i) in tags" 
                    :key="i"  
                    @click="selectTag(tag.name)" 
                    class="existing-tags">
                        {{ tag.name }}
                    </li>
                </ul>
            </div>

            <p class="tag-description">
                Selected tags:
            </p>
            <div class="tag-container">
                <ul class="selected-tag-list">
                    <li v-for="(tag, i) in question.tags" :key="i" class="selected-tags">
                        {{ tag.name }}
                        <i @click="removeTag(tag)" class="fa-solid fa-circle-minus"></i>
                    </li>
                </ul>
            </div>

            <ul v-if="errors.tag.length > 0" class="errors-list">
                <li class="errors">
                    <p v-for="(err, i) in errors.tag" :key="i" class="error-mes">
                        {{ err }}
                    </p>
                </li>
            </ul>

            <button type="submit" class="submit-button">Submit Question</button>
        </form>
    </div>
</template>

<script>
    import { validateQuestion } from '@/helpers/validator/questionValidator';

    export default {
        name: 'QuestionForm',
        props: {
            question: {
                type: Object,
                required: true,
                default: () => {
                    return {
                        title: '',
                        description: '',
                        tags: []
                    };
                }
            },
            tags: {
                type: Array,
                required: true,
                default: () => []
            }
        },
        data () {
            return {
                titlePlaceholder: 'e.g., How do I filter and display only in-stock products from an array of product objects in JavaScript?',
                descriptionPlaceholder: `e.g., I want to filter out the in-stock products (inStock: true) and display them on the user interface. Does anyone know how to do this in JavaScript? Specifically: How can I filter the in-stock products from this array? How can I display them as a list on the webpage?`,
                urlImagePlaceholder: 'e.g., https://images2.thanhnien.vn/zoom/700_438/528068263637045248/2024/1/26/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912-37-0-587-880-crop-1706239860681642023140.jpg',
                errors: {
                    title: [],
                    description: [],
                    tag: []
                },
                imagePreview: null,
                imageAlt: 'Preview'
            }
        },
        methods: {
            onSubmit: function() {
                this.errors = {
                    title: [],
                    description: [],
                    tag: []
                };
                const validationErrors = validateQuestion(this.question);

                if (Object.values(validationErrors).some(err => err.length > 0)) {
                    this.errors = validationErrors;
                    return;
                }

                this.$emit('createOrUpdate', this.question);
            },
            selectTag: function(tagName) {
                const tagObject = this.tags.find(t => t.name === tagName);

                if (tagObject
                    && !this.question.tags.some(t => t.name === tagName)
                ) {
                    this.question.tags.push(tagObject);
                }
            },
            removeTag(tag) {
                this.question.tags = this.question.tags.filter(t => t.name !== tag.name);
            }
        }
    };
</script>

<style scoped>
    .question-form-container {
        max-width: 50em;
        margin: 0 auto;
        padding: 0.5em 1.25em;
        font-family: Arial, sans-serif;
        text-align: left;
    }

    .question-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .title-label,
    .description-label,
    .image-label,
    .tag-title {
        font-weight: bold;
        font-size: 18px;
        margin: 0;
    }

    .title-label span,
    .description-label span,
    .tag-title span {
        color: #e74c3c;
        margin-left: 0.01em;
    }

    .title-description,
    .description-description,
    .image-description {
        color: #666;
        font-size: 14px;
        margin: 0;
    }

    .tag-description {
        color: #666;
        font-size: 14px;
        font-weight: 600;
        color: #454545;
        margin: 0;
    }

    .tag-description#tag-description {
        font-weight: normal;
    }

    .title-input,
    textarea,
    .url-image {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
        transition: border-color 0.3s;
    }

    .url-image {
        margin-bottom: 1em;
    }

    .title-input:focus,
    textarea:focus,
    .url-image:focus {
        border-color: #3498db;
        outline: none;
        box-shadow: 0 0 4px rgba(52, 152, 219, 0.5);
    }

    textarea {
        resize: vertical;
        min-height: 120px;
    }

    .sourceChoice {
        display: flex;
        gap: 3em;
    }

    .uploadUrlSourceChoice {
        display: flex;
        gap: 0.25em;
        align-items: center;
    }

    .image-choice {
        margin: 0;
        cursor: pointer;
    }

    .upload-image-container {
        display: flex;
        border: 1px solid #3498db;
        background-color: #f9f9f9;
        padding: 0.75em 1.2em;
        margin-bottom: 1em;
        border-radius: 1.25em;
        align-items: center;
    }

    .upload-image {
        display: block;
        width: 100%;
    }
    
    .image-preview {
        max-width: 100%;
        max-height: 60em;
        margin-top: 0.25em;
        margin-bottom: 1.25em;
        border-radius: 4px;
    }

    .remove-image-btn {
        padding: 5px 10px;
        background-color: #f44336;
        color: #fff;
        font-weight: 500;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: background-color 0.3s;
    }

    .remove-image-btn:hover {
        background-color: #d32f2f;
    }

    .tag-container {
        margin-top: 8px;
    }

    .selected-tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .selected-tags {
        display: flex;
        align-items: center;
        background-color: #e1f0fa;
        color: #3498db;
        padding: 0.5em 1em;
        border-radius: 16px;
        font-size: 14px;
    }

    .selected-tags i {
        margin-left: 8px;
        cursor: pointer;
        color: #3498db;
        transition: color 0.2s;
    }

    .selected-tags i:hover {
        color: #e74c3c;
    }

    .existing-tags-container {
        margin: 0;
        border: 1px solid #eee;
        border-radius: 0.5em;
        padding: 1em;
        background-color: #f9f9f9;
        max-height: 50em;
        overflow-y: auto;
    }

    .existing-tags-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .existing-tags {
        background-color: #f0f0f0;
        color: #555;
        padding: 0.35em 0.85em;
        border-radius: 1em;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .existing-tags:hover {
        background-color: #3498db;
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .submit-button {
        padding: 0.75em 1em;
        border-radius: 1em;
        font-size: 16px;
        width: 12.5em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: #3498db;
        color: white;
        border: none;
    }

    .submit-button:hover {
        background-color: #2980b9;
    }

    .errors-list {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }

    .error-mes {
        font-size: 15px;
        color: #e74c3c;
        margin-bottom: 1em;
    }
@media (max-width: 600px) {
    .question-form-container {
        padding: 1em;
    }
    
    .title-label,
    .description-label,
    .image-label,
    .tag-title {
        font-size: 1em;
    }
    
    .title-input,
    textarea,
    .url-image {
        padding: 0.8em;
    }
}
</style>