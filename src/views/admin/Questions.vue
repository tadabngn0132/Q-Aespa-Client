<template>
    <div class="questions-container">
        <div class="title-page-sort-bar">
            <h1 
            v-if="!sortType && isSearching === false" class="questions-title">Newest Questions</h1>
            <h1 
            v-if="sortType === 'Newest' && isSearching === false" class="questions-title">
                Newest Questions
            </h1>
            <h1 
            v-if="sortType === 'Oldest' && isSearching === false" class="questions-title">
                Oldest Questions
            </h1>
            <h1 
            v-if="sortType === 'Unanswered' && isSearching === false" class="questions-title">
                Unanswered Questions
            </h1>
            <h1 
            v-if="sortType === 'Score' && isSearching === false" class="questions-title">
                Highest scored questions
            </h1>
            <h1 
            v-if="isSearching === true" class="questions-title">
            Search Results
            </h1>
            
            <sort-bar
            v-if="!isSearching"
            @sortChanged="sortChanged"
            :forTag="false"></sort-bar>

        </div>

        <p v-if="isSearching === true" class="results-for">Results for {{ keyword }}</p>
        
        <!-- <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading questions...</p>
        </div> -->

        <div v-if="isLoading" class="loading-container">
            <div class="loader"></div>
            <p>Loading questions...</p>
        </div>
        
        <div v-else-if="questions.length === 0" class="no-questions">
            <p>No questions have been asked yet.</p>
            <router-link class="create-first-btn" to="askQuestion">
                Ask first question
            </router-link>
        </div>
        
        <table v-else class="question-list-cud-btn">
            <thead>
                <tr>
                    <th v-if="questionCount > 1" class="questionCount">
                        {{ questionCount }} questions
                    </th>
                    <th v-else class="questionCount">
                        {{ questionCount }} question
                    </th>
                    <th colspan="2">
                        <router-link class="create-btn" to="askQuestion">
                            Ask Question
                        </router-link>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(question, i) in questions" :key="i">
                    <td class="question-title-show">
                        <div class="question-title">
                            <div class="user-infor">
                                <span class="user-name" v-if="question.userId && question.userId.name">
                                    {{ question.userId.name }}
                                </span>
                                <span class="user-email" v-if="question.userId && question.userId.email">
                                    <i class="fa-solid fa-envelope"></i> {{ question.userId.email }}
                                </span>
                            </div>
                            <span 
                            v-if="question.createdAt === question.updatedAt" 
                            class="createdTime">
                                asked at {{ formatRelativeTime(question.createdAt) }}
                            </span>
                            <span v-else class="updatedTime">
                                modified at {{ formatRelativeTime(question.updatedAt) }}
                            </span>
                        </div>
                        <router-link class="to-question-detail" :to="{name: 'AdminQuestionDetail', params: { id: question._id }}">
                            {{ question.title }}
                        </router-link>
                        <p class="description">{{ getTruncatedDescription(question.description) }}</p>
                        <div class="tags-stat">
                            <ul class="tags-list" v-if="question.tags && question.tags.length > 0">
                                <li class="tags" v-for="(tag, j) in question.tags" :key="j">
                                    <router-link class="tag" :to="{name: 'tagDetail', params: { id: tag._id }}">
                                        {{ tag.name }}
                                    </router-link>
                                </li>
                            </ul>
                            <div class="stat">
                                <span v-if="question.score <= 1" class="vote-score">
                                    {{ question.score }} score
                                </span>
                                <span v-if="question.score > 1" class="vote-score">
                                    {{ question.score }} scores
                                </span>
                                <span v-if="question.answerCount <= 1" class="answer-quantity">
                                    {{ question.answerCount }} answer
                                </span>
                                <span v-if="question.answerCount > 1" class="answer-quantity">
                                    {{ question.answerCount }} answers
                                </span>
                            </div>
                        </div>
                    </td>
                    <td class="ud-btn-container">
                        <router-link class="ud-btn edit-btn" :to="{name: 'editQuestion', params: { id: question._id }}">
                            <span class="icon">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </span>
                            <span class="text">
                                Edit
                            </span>
                        </router-link>
                    </td>
                    <td class="ud-btn-container" @click.prevent="onDelete(question._id)">
                        <a class="ud-btn delete-btn" :href="`/questions/${question._id}`">
                            <span class="icon">
                                <i class="fa-solid fa-trash"></i>
                            </span>
                            <span class="text">
                                Delete
                            </span>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import exportApis from '@/helpers/api/exportApis';
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
    import SortBar from '@/components/SortBar.vue';

    dayjs.extend(relativeTime);

    export default {
        name: 'AdminQuestions',
        components: {
            'sort-bar': SortBar
        },
        data() {
            return {
                questions: [],
                questionCount: 0,
                isLoading: true,
                keyword: '',
                isSearching: false,
                sortType: '',
                searchType: ''
            };
        },
        methods: {
            getTruncatedDescription(description) {
                if (description && description.length > 140) {
                    return description.substring(0, 140) + '...';
                }
                return description;
            },
            async onDelete(id) {
                const sure = window.confirm('Do you really want to delete this question?');
                if (!sure) return;
                
                this.isLoading = true;
                try {
                    await exportApis.questions.deleteQuestion(id);
                    
                    setTimeout(() => {
                        this.$showMessage.success('Question deleted successfully!');
                        const newQuestions = this.questions.filter(question => question._id !== id);
                        this.questions = newQuestions;
                        this.questionCount = this.questions.length;
                        this.isLoading = false;
                    }, 500);
                } catch (error) {
                    console.error('Error deleting question:', error);
                    this.isLoading = false;
                    this.$showMessage.error('Error deleting question. Please try again.');
                }
            },
            formatRelativeTime(timestamp) {
                return dayjs(timestamp).fromNow();
            },
            async loadQuestions() {
                this.isLoading = true;
                try {
                    setTimeout(async () => {
                        if (this.keyword === '' || this.keyword === undefined) {
                            this.isSearching = false;
                            this.questions = await exportApis.questions.getQuestions();
                        } else if (this.searchType === 'relativeQuestion') {
                            this.isSearching = true;
                            this.questions = await exportApis.questions.searchQuestion(this.keyword);
                        } else if (this.searchType === 'exactQuestion') {
                            this.isSearching = true;
                            this.questions = await exportApis.questions.searchQuestionExact(this.keyword, this.searchType);
                        }
                        this.questionCount = this.questions.length;
                        this.isLoading = false;
                    }, 500);
                } catch (error) {
                    console.error('Error loading questions:', error);
                    this.isLoading = false;
                    this.$showMessage.error('Error loading questions. Please try again.');
                }
            },
            async sortChanged(sortType) {
                this.isLoading = true;

                setTimeout(async () => {
                    if (sortType === 'Newest') {
                        this.questions = await exportApis.questions.getQuestions();
                        this.sortType = 'Newest';
                    } else if (sortType === 'Oldest') {
                        this.questions = await exportApis.questions.getQuestionsSort('asc');
                        this.sortType = 'Oldest';
                    } else if (sortType === 'Unanswered') {
                        this.questions = await exportApis.questions.getQuestionsSort('unanswered');
                        this.sortType = 'Unanswered';
                    } else if (sortType === 'Score') {
                        this.questions = await exportApis.questions.getQuestionsSort('score');
                        this.sortType = 'Score';
                    }
                    this.questionCount = this.questions.length;
                    this.isLoading = false;
                }, 500)
            }
        },
        watch: {
            '$route.query.keyword': {
                immediate: true,
                handler(newKeyword) {
                    this.keyword = newKeyword || '';
                    this.loadQuestions();
                }
            },

            '$route.query.type': {
                immediate: true,
                handler(newType) {
                    this.searchType = newType || '';
                    this.loadQuestions();
                }
            }
        },
        mounted() {
            this.keyword = this.$route.query.keyword;
            this.searchType = this.$route.query.type;
            
            // this.loadQuestions();
        }
    }
</script>

<style scoped>
    .questions-container {
        margin: 0;
        padding: 0 1em;
    }

    .questions-container .title-page-sort-bar {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 1.25em;
    }

    .tags-stat {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .stat {
        display: flex;
        align-items: center;
        gap: 0.75em;
        margin-bottom: 4px;
        font-size: 14px;
    }

    .vote-score {
        color: #555;
    }

    .answer-quantity {
        padding: 3px 8px;
        border-radius: 4px;
        color: #fff;
        background-color: #4BACB8;
    }

    .questions-container .questions-title {
        text-align: left;
        font-weight: normal;
    }

    .questions-container .description {
        margin-bottom: 0.25em;
    }

    .questions-container .results-for {
        justify-self: left;
        font-size: 13.5px;
        margin-bottom: 0.25em;
        color: #626262;
    }

    .questions-container .question-list-cud-btn {
        width: 100%;
        border-collapse: collapse;
        text-align: justify;
    }

    .questions-container .question-list-cud-btn
    thead tr , .questions-container .question-list-cud-btn
    tbody tr {
        border-bottom: 0.01em solid #d2d2d2;
    }

    .questions-container .question-list-cud-btn
    thead tr th , .questions-container .question-list-cud-btn
    tbody tr td {
        color: #333;
        padding: 1em 0;
    }

    .questions-container .question-list-cud-btn
    thead tr th , .questions-container .question-list-cud-btn
    tbody tr td:first-child {
        margin-right: 1em;
    }

    .questions-container .question-list-cud-btn
    thead tr th:first-child {
        font-weight: normal;
    }

    .questions-container .question-list-cud-btn
    thead tr th:last-child {
        text-align: right;
        font-weight: normal;
    }

    .questions-container .question-list-cud-btn
    thead tr th .create-btn {
        background-color: #4BACB8;
        color: #fff;
        padding: 0.55em 1.5em;
        border-radius: 0.75em;
    }

    .questions-container .question-list-cud-btn
    thead tr th .create-btn:hover {
        background-color: #3A8F9A;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.question-title-show {
        display: flex;
        flex-direction: column;
        gap: 0.4em;
    }
    
    .questions-container .question-list-cud-btn
    tbody tr td.question-title-show .to-question-detail {
        font-size: 18px;
        color: #1B75D0;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.question-title-show ul.tags-list {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 0.25em;
        gap: 0.75em;
        max-width: 25em;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.question-title-show ul.tags-list 
    li.tags {
        transition: all 0.3s ease-in-out;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.question-title-show ul.tags-list 
    li.tags .tag {
        background-color: #e0e0e0;
        padding: 0.25em 0.5em;
        border-radius: 0.25em;
        font-size: 13.5px;
        font-weight: bold;
        color: #444;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.question-title-show ul.tags-list 
    li.tags:hover {
        transform: translateY(-3px);
    }

    .questions-container .question-list-cud-btn
    tbody tr td.question-title-show ul.tags-list 
    li.tags .tag:hover {
        background-color: #d0d0d0;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.question-title-show 
    .to-question-detail:hover {
        color: #155BA0;
    }
    
    .questions-container .question-list-cud-btn
    tbody tr td.ud-btn-container {
        width: 7.5em;
        text-align: center;
        margin: 0;
        padding: 0;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.ud-btn-container .ud-btn {
        background-color: #F9A826;
        color: #fff;
        padding: 0.75em 1.25em;
        border-radius: 0.5em;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.ud-btn-container .ud-btn:hover {
        background-color: #E8950F;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.ud-btn-container .ud-btn.delete-btn {
        background-color: #E57373;
        color: #fff;
    }
    
    .questions-container .question-list-cud-btn
    tbody tr td.ud-btn-container .ud-btn.delete-btn:hover {
        background-color: #D32F2F;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.ud-btn-container .ud-btn
    span, .questions-container .question-list-cud-btn
    tbody tr td.ud-btn-container .ud-btn i {
        color: inherit;
    }

    .questions-container .question-list-cud-btn
    tbody tr td.ud-btn-container .ud-btn
    span:first-child {
        margin-right: 0.25em;
    }

    .question-title {
        display: flex;
        flex-direction: column;
        gap: 0.25em;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        width: 100%;
    }

    .user-infor {
        display: flex;
        align-items: center;
        gap: 0.75em;
    }

    .user-name {
        font-weight: 600;
        color: #2980b9;
        font-size: 15px;
    }

    .user-email {
        color: #7f8c8d;
        font-size: 12px;
        font-style: italic;
    }

    .user-email i {
        color: inherit;
    }

    .createdTime, .updatedTime {
        font-size: 12px;
        color: #95a5a6;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .createdTime i, .updatedTime i {
        margin-right: 2px;
    }

    .updatedTime {
        color: #3498db;
    }

    .updatedTime i {
        color: #3498db;
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        margin: 1rem 0;
    }

    /* .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4BACB8;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    } */

    .loader {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        border: 3px solid;
        border-color: #2980b9 #2980b9 transparent transparent;
        box-sizing: border-box;
        margin-bottom: 1rem;
        animation: rotation 1s linear infinite;
    }
    .loader::after,
    .loader::before {
        content: '';  
        box-sizing: border-box;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border: 3px solid;
        border-color: transparent transparent #4BACB8 #4BACB8;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        box-sizing: border-box;
        animation: rotationBack 0.5s linear infinite;
        transform-origin: center center;
    }
    .loader::before {
        width: 32px;
        height: 32px;
        border-color: #2980b9 #2980b9 transparent transparent;
        animation: rotation 1.5s linear infinite;
    }
        
    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
        } 
        @keyframes rotationBack {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(-360deg);
        }
    }
    

    .no-questions {
        text-align: center;
        padding: 2rem;
        background-color: #f8f9fa;
        border-radius: 8px;
        margin-top: 1rem;
        color: #7f8c8d;
    }

    .create-first-btn {
        display: inline-block;
        background-color: #4BACB8;
        color: white;
        padding: 0.75em 1.5em;
        border-radius: 0.75em;
        margin-top: 1em;
        font-weight: 500;
        transition: background-color 0.3s ease;
    }

    .create-first-btn:hover {
        background-color: #3A8F9A;
    }

    @media screen and (max-width: 1024px) {
        .questions-container .question-list-cud-btn
        tbody tr td.ud-btn-container {
            width: 4.5em;
        }
        
        .questions-container .question-list-cud-btn
        tbody tr td.ud-btn-container .ud-btn {
            padding: 0.8em 0.9em;
            border-radius: 50%;
            transition: all 0.3s ease-in-out;
        }
        
        .questions-container .question-list-cud-btn
        tbody tr td.ud-btn-container .ud-btn:hover {
            font-size: larger;
        }
        
        .questions-container .question-list-cud-btn
        tbody tr td.ud-btn-container .ud-btn
        span.text {
            display: none;
        }

        .questions-container .question-list-cud-btn
        tbody tr td.ud-btn-container .ud-btn
        span:first-child {
            margin-right: 0;
        }
    }

    @media screen and (max-width: 768px) {
        .question-title {
            flex-direction: column;
            gap: 6px;
        }
        
        .createdTime, .updatedTime {
            margin-top: 4px;
        }
        
        .questions-container .question-list-cud-btn tbody tr td.question-title-show {
            padding-right: 8px;
        }
    }
</style>