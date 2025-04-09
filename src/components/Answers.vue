<template>
    <div class="answers-container">
        <span v-if="answerCount > 1" class="answer-count">
            {{ answerCount }} answers
        </span>

        <span v-if="answerCount <= 1" class="answer-count">
            {{ answerCount }} answer
        </span>
        
        <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading answers...</p>
        </div>
        
        <ul 
            v-else-if="answers.length > 0" 
            class="answers-list">
                <li
                v-for="(answer, i) in answers"
                :key="i" 
                class="answers">
                <div class="answer-title">
                    <div class="user-infor">
                        <span class="user-name" v-if="answer.userId && answer.userId.name">
                            {{ answer.userId.name }}
                        </span>
                        <span class="user-email" v-if="answer.userId && answer.userId.email">
                            {{ answer.userId.email }}
                        </span>
                    </div>
                    <span 
                    v-if="answer.createdAt === answer.updatedAt" 
                    class="createdTime">
                        {{ 'answered at ' + formatDate(answer.createdAt) }}
                    </span>
                    <span v-else class="updatedTime">
                        {{ 'modified at ' + formatDate(answer.updatedAt) }}
                    </span>
                </div>
                <div class="description-vote-btn">
                    <vote-button
                    :answer="answer"
                    :isQuestion="false"></vote-button>

                    <span class="answer-description">
                        {{ answer.description }}
                    </span>
                </div>
                <div class="ud-btn" v-if="canEditAnswer(answer)">
                    <button class="edit-btn" @click="startEdit(answer)">Edit</button>
                    <button class="delete-btn" @click="deleteAnswer(answer._id)">Delete</button>
                </div>
            </li>
        </ul>

        <p v-else-if="!isLoading" class="no-answers">No answers yet. Be the first to answer!</p>

        <answer-form
        @createOrUpdate="createOrUpdate"
        :answer="editingAnswer"></answer-form>
    </div>
</template>

<script>
import exportApis from '@/helpers/api/exportApis';
import AnswerForm from './AnswerForm.vue';
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import VoteButton from './VoteButton.vue';

export default {
    name: 'Answers',
    components: {
        'answer-form': AnswerForm,
        'vote-button': VoteButton
    },
    props: {
        question: {
            type: Object,
            required: true,
            default: () => {
                return {
                    _id: ''
                }
            }
        }
    },
    computed: {
        ...mapGetters('auth', ['userRole'])
    },
    data() {
        return {
            answers: [],
            answerCount: 0,
            editingAnswer: {},
            isLoading: false
        }
    },
    methods: {
        startEdit(answer) {
            this.editingAnswer = { ...answer };
        },
        async createOrUpdate(answer) {
            const userId = this.$store.state.auth.userId;

            if (!userId) {
                this.$showMessage.warning('You must be logged in to create or edit answers');
                return;
            }

            const answerwithUserId = {
                ...answer,
                userId: userId
            };

            this.isLoading = true;

            try {
                if (answer._id) {
                    await exportApis.answers.updateAnswer(this.question._id, answer._id, answerwithUserId);
                    setTimeout(() => {
                        this.$showMessage.success('Answer updated successfully!');
                        this.refreshAnswers();
                    }, 500);
                } else {
                    await exportApis.answers.createAnswer(this.question._id, answerwithUserId);
                    setTimeout(() => {
                        this.$showMessage.success('Answer created successfully!');
                        this.refreshAnswers();
                    }, 500);
                }
            } catch (error) {
                console.error('Error handling answer:', error);
                this.isLoading = false;
                this.$showMessage.error('Error handling answer. Please try again.');
            }
        },
        async refreshAnswers() {
            try {
                this.answers = await exportApis.answers.getAnswers(this.question._id);
                this.answerCount = this.answers.length;
                this.editingAnswer = {};
            } catch (error) {
                console.error('Error refreshing answers:', error);
                this.$showMessage.error('Error refreshing answers. Please reload the page.');
            } finally {
                this.isLoading = false;
            }
        },
        async deleteAnswer(answerId) {
            const sure = window.confirm('Do you really want to delete this answer?');
            if (sure) {
                this.isLoading = true;
                try {
                    await exportApis.answers.deleteAnswer(this.question._id, answerId);
                    setTimeout(() => {
                        this.$showMessage.success('Answer deleted successfully!');
                        this.refreshAnswers();
                    }, 500);
                } catch (error) {
                    console.error('Error deleting answer:', error);
                    this.isLoading = false;
                    this.$showMessage.error('Error deleting answer. Please try again.');
                }
            }
        },
        canEditAnswer(answer) {
            if (this.userRole === 'admin') {
                return true;
            }

            const currentUserId = this.$store.state.auth.userId;
            
            if (answer.userId && typeof answer.userId === 'object') {
                return currentUserId && answer.userId._id === currentUserId;
            }
            
            return currentUserId && answer.userId === currentUserId;
        },
        formatDate(timestamp) {
            return dayjs(timestamp).format('DD/MM/YYYY HH:mm')
        }
    },
    watch: {
        'question._id': {
            immediate: true,
            async handler(newId) {
                if (newId) {
                    this.isLoading = true;
                    try {
                        setTimeout(async () => {
                            this.answers = await exportApis.answers.getAnswers(newId);
                            this.answerCount = this.answers.length;
                            this.isLoading = false;
                        }, 500);
                    } catch (error) {
                        console.error('Error fetching answers:', error);
                        this.isLoading = false;
                        this.$showMessage.error('Error fetching answers. Please reload the page.');
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
.answers-container {
    width: 100%;
    text-align: left;
    margin: 1.5em 0 0;
    padding: 0;
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #333;
}

.answer-count {
    display: block;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #2c3e50;
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 8px;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    margin: 1rem 0;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.answers-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
}

.answers {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 18px;
    margin-bottom: 18px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
    position: relative;
    display: flex;
    flex-direction: column; 
    gap: 10px;              
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-left: 4px solid #3498db;
}

.answers:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.answer-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 10px;
    border-bottom: 1px solid #eaeaea;
    width: 100%;
}

.user-infor {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}

.user-name {
    font-weight: 600;
    color: #2980b9;
    font-size: 15px;
}

.user-email {
    color: #7f8c8d;
    font-size: 13px;
    font-style: italic;
}

.createdTime, .updatedTime {
    font-size: 13px;
    color: #95a5a6;
    display: flex;
    align-items: center;
}

.updatedTime {
    color: #3498db;
}

.description-vote-btn {
    display: flex;
    margin: 10px 0;
    gap: 1em;
}

.answer-description {
    flex: 1;
    word-break: break-word;
    line-height: 1.5;
    font-size: 15px;
}

.ud-btn {
    display: flex;
    gap: 8px;
    margin-left: auto;
    margin-top: 8px;
}

.edit-btn, .delete-btn {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 8px 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 14px;
}

.edit-btn {
    color: #2196F3;
    border-color: #2196F3;
}

.edit-btn:hover {
    background-color: #2196F3;
    color: white;
}

.delete-btn {
    color: #F44336;
    border-color: #F44336;
}

.delete-btn:hover {
    background-color: #F44336;
    color: white;
}

.no-answers {
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
    font-style: italic;
    background-color: #f8f9fa;
    border-radius: 10px;
    margin: 1rem 0;
}

@media (max-width: 768px) {
    .answers {
        padding: 15px;
    }
    
    .answer-title {
        flex-direction: column;
        gap: 8px;
    }
    
    .createdTime, .updatedTime {
        align-self: flex-start;
    }
    
    .ud-btn {
        margin-top: 15px;
        width: 100%;
        justify-content: center;
    }
    
    .edit-btn, .delete-btn {
        flex: 1;
        text-align: center;
    }
}
</style>