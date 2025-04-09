<template>
    <div class="admin-tag-detail">
        <div v-if="isLoading" class="loading-container">
            <span class="loader"></span>
            <p>Loading tag details...</p>
        </div>

        <div v-else>
            <div class="tag-name-create-btn">
                <h1 class="tag-name">[{{ tag.name }}]</h1>
                <router-link 
                to="CreateTag"
                class="create-btn">
                    <span>Create Tag</span>
                </router-link>
            </div>
            <p class="tag-description">{{ tag.description }}</p>

            <div class="ud-btn-container">
                <div class="ud-btn">
                    <router-link 
                    class="ud-btn edit-btn" 
                    :to="{name: 'UpdateTag', params: { id: tag._id}}">
                        <span class="icon">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </span>

                        <span class="text">
                            Edit
                        </span>
                    </router-link>
                </div>

                <div class="ud-btn" @click.prevent="onDelete(tag._id)">
                    <a 
                    class="delete-btn" 
                    :href="`/tags/${tag._id}`">
                        <span class="icon">
                            <i class="fa-solid fa-trash"></i>
                        </span>

                        <span class="text">
                            Delete
                        </span>
                    </a>
                </div>
            </div>

            <span v-if="questionCount > 1" class="question-count">
                {{ questionCount }} questions
            </span>

            <span v-if="questionCount <= 1" class="question-count">
                {{ questionCount }} question
            </span>

            <ul class="questions-list">
                <li 
                v-for="(question, i) in questions"
                :key="i" 
                class="questions">
                    <router-link :to="{name: 'AdminQuestionDetail', params: { id: question._id}}" class="question-title">
                        {{ question.title }}
                    </router-link>

                    <p class="question-description">
                        {{ getTruncatedDecripition(question.description) }}
                    </p>

                    <ul class="question-tags-list">
                        <li
                        v-for="(questionTag, j) in question.tags"
                        :key="j" 
                        class="question-tags">
                            <router-link :to="{name: 'tagDetail', params: { id: questionTag._id}}" class="question-tag">
                                {{ questionTag.name }}
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import exportApis from '@/helpers/api/exportApis';

    export default {
        name: 'tagDetail',
        data() {
            return {
                tag: {},
                questions: [],
                questionCount: 0,
                isLoading: true
            }
        },
        async mounted() {
            this.fetchData();
        },
        methods: {
            async fetchData() {
                this.isLoading = true;
                
                setTimeout(async () => {
                    try {
                        this.tag = await exportApis.tags.getTag(this.$route.params.id);
                        this.questions = await exportApis.questions.getQuestionsByTagId(this.$route.params.id);
                        this.questionCount = this.questions.length;
                    } catch (error) {
                        console.error('Error fetching tag details:', error);
                    } finally {
                        this.isLoading = false;
                    }
                }, 1000);
            },
            getTruncatedDecripition: function(description) {
                if (description && description.length > 175) {
                    return description.substring(0, 175) + '...';
                }
                return description;
            },
            async onDelete(id) {
                const sure = window.confirm('Do you really want to delete this tag?');
                if (!sure) return;
                await exportApis.tags.deleteTag(id);
                this.$showMessage.success('Tag deleted successfully!');
                this.$router.push('/admin/tags');
            }
        },
        watch: {
            '$route.params.id': function() {
                this.fetchData();
            }
        }
    }
</script>

<style scoped>
.admin-tag-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
}

.tag-name-create-btn {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
    justify-content: space-between;
}

.tag-name {
    font-size: 2.2rem;
    color: #333;
}

.create-btn {
    display: inline-flex;
    align-items: center;
    background-color: #4BACB8;
    color: #fff;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 1rem;
    transition: all 0.2s ease;
}

.create-btn span {
    color: inherit;
}

.tag-description {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 20px;
    line-height: 1.5;
}

.ud-btn-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 1rem;
}

.ud-btn {
    text-align: center;
    margin: 0 5px;
}

.ud-btn:first-child {
    margin-left: 0;
}

.ud-btn:last-child {
    margin-right: 0;
}

.ud-btn a, .edit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 1em;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.2s;
    width: 100%;
}

.edit-btn {
    background-color: #f39c12;
    color: #fff;
}

.edit-btn span, i {
    color: inherit;
}

.edit-btn:hover {
    background-color: #e67e22;
}

.delete-btn {
    background-color: #e74c3c;
    color: #fff;
    cursor: pointer;
}

.delete-btn span, i {
    color: inherit;
}

.delete-btn:hover {
    background-color: #c0392b;
}

.icon {
    margin-right: 6px;
    font-size: 0.9rem;
}

.question-count {
    display: inline-block;
    background-color: #3498db;
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-bottom: 20px;
}

.questions-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.questions {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 20px;
    text-align: left;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.questions:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.question-title {
    font-size: 1.4rem;
    color: #2c3e50;
    text-decoration: none;
    font-weight: bold;
    display: block;
    margin-bottom: 10px;
    transition: color 0.2s;
}

.question-title:hover {
    color: #3498db;
}

.question-description {
    font-size: 1rem;
    color: #555;
    margin-bottom: 15px;
    line-height: 1.5;
}

.question-tags-list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.question-tags {
    margin-right: 10px;
    margin-bottom: 5px;
}

.question-tag {
    display: inline-block;
    background-color: #e9f4fd;
    color: #3498db;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 0.85rem;
    text-decoration: none;
    border: 1px solid #cce5ff;
    transition: all 0.2s;
}

.question-tag:hover {
    background-color: #3498db;
    color: white;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    margin: 20px 0;
}

.loader { 
    width: 48px; 
    height: 48px; 
    border-radius: 50%; 
    position: relative; 
    animation: rotate 1s linear infinite;
    margin-bottom: 15px;
}

.loader::before, .loader::after { 
    content: ""; 
    box-sizing: border-box; 
    position: absolute; 
    inset: 0px; 
    border-radius: 50%; 
    border: 5px solid #FFF; 
    animation: prixClipFix 2s linear infinite; 
} 

.loader::after { 
    transform: rotate3d(90, 90, 0, 180deg); 
    border-color: #3498db; 
} 

@keyframes rotate { 
    0% {transform: rotate(0deg)} 
    100% {transform: rotate(360deg)} 
} 

@keyframes prixClipFix { 
    0% {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)} 
    50% {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)} 
    75%, 100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)} 
}

@media (max-width: 768px) {
    .tag-name {
        font-size: 1.8rem;
    }
    
    .question-title {
        font-size: 1.2rem;
    }
    
    .questions {
        padding: 15px;
    }
}
</style>