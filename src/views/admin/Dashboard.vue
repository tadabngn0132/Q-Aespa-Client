<template>
    <div class="admin-dashboard">
        <h1 class="dashboard-title">Administrator Dashboard</h1>
        
        <div class="stats-container">
            <div class="stat-card">
            <div class="stat-icon">
                <i class="fa-solid fa-question"></i>
            </div>
            <div class="stat-content">
                <h3>Total Questions</h3>
                <p class="stat-number">{{ stats.questions }}</p>
            </div>
            </div>
            
            <div class="stat-card">
            <div class="stat-icon">
                <i class="fa-solid fa-reply"></i>
            </div>
            <div class="stat-content">
                <h3>Total Answers</h3>
                <p class="stat-number">{{ stats.answers }}</p>
            </div>
            </div>
            
            <div class="stat-card">
            <div class="stat-icon">
                <i class="fa-solid fa-tag"></i>
            </div>
            <div class="stat-content">
                <h3>Total Tags</h3>
                <p class="stat-number">{{ stats.tags }}</p>
            </div>
            </div>
            
            <div class="stat-card">
            <div class="stat-icon">
                <i class="fa-solid fa-user"></i>
            </div>
            <div class="stat-content">
                <h3>Total Users</h3>
                <p class="stat-number">{{ stats.users }}</p>
            </div>
            </div>
        </div>
        
        <div class="dashboard-sections">
            <div class="recent-section">
            <div class="section-header">
                <h2>Recent Questions</h2>
                <router-link to="/admin/questions" class="view-all">View All</router-link>
            </div>
            
            <div v-if="isLoading.questions" class="loading">
                <div class="loading-spinner"></div>
                <p>Loading questions...</p>
            </div>
            
            <div v-else-if="recentQuestions.length === 0" class="no-data">
                No questions found.
            </div>
            
            <ul v-else class="recent-list">
                <li v-for="question in recentQuestions" :key="question._id" class="recent-item">
                <div class="item-main">
                    <router-link :to="{ name: 'AdminQuestionDetail', params: { id: question._id } }" class="item-title">
                    {{ question.title }}
                    </router-link>
                    <span class="item-date">{{ formatDate(question.createdAt) }}</span>
                </div>
                <div class="item-meta">
                    <span class="item-author" v-if="question.userId && question.userId.name">
                    <i class="fa-solid fa-user"></i> {{ question.userId.name }}
                    </span>
                    <span class="item-tags" v-if="question.tags && question.tags.length">
                    <i class="fa-solid fa-tags"></i>
                    <span v-for="(tag, index) in question.tags" :key="index" class="tag-badge">
                        {{ tag.name }}
                    </span>
                    </span>
                </div>
                </li>
            </ul>
            </div>
            
            <div class="recent-section">
            <div class="section-header">
                <h2>Recent Users</h2>
                <router-link to="/admin/users" class="view-all">View All</router-link>
            </div>
            
            <div v-if="isLoading.users" class="loading">
                <div class="loading-spinner"></div>
                <p>Loading users...</p>
            </div>
            
            <div v-else-if="recentUsers.length === 0" class="no-data">
                No users found.
            </div>
            
            <ul v-else class="recent-list">
                <li v-for="user in recentUsers" :key="user._id" class="recent-item user-item">
                <div class="item-main">
                    <router-link :to="{ name: 'AdminUserDetail', params: { id: user._id } }" class="item-title">
                    {{ user.name }}
                    </router-link>
                    <span class="user-role" :class="user.role">{{ user.role }}</span>
                </div>
                <div class="item-meta">
                    <span class="item-email">
                    <i class="fa-solid fa-envelope"></i> {{ user.email }}
                    </span>
                </div>
                </li>
            </ul>
            </div>
        </div>
        
        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-buttons">
            <router-link to="/admin/askquestion" class="action-btn">
                <i class="fa-solid fa-plus"></i> New Question
            </router-link>
            <router-link to="/admin/createuser" class="action-btn">
                <i class="fa-solid fa-user-plus"></i> New User
            </router-link>
            <router-link to="/admin/createtag" class="action-btn">
                <i class="fa-solid fa-tag"></i> New Tag
            </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import exportApis from '@/helpers/api/exportApis';
import dayjs from 'dayjs';

export default {
    name: 'AdminDashboard',
    data() {
        return {
            stats: {
            questions: 0,
            answers: 0,
            tags: 0,
            users: 0
            },
            recentQuestions: [],
            recentUsers: [],
            isLoading: {
            questions: true,
            answers: true,
            tags: true,
            users: true
            }
        };
    },
    methods: {
        formatDate(timestamp) {
            return dayjs(timestamp).format('DD/MM/YYYY');
        },
        async fetchDashboardData() {
            try {
                this.isLoading.questions = true;
                const questions = await exportApis.questions.getQuestions();
                this.stats.questions = questions.length;
                this.recentQuestions = questions.slice(0, 5);
                this.isLoading.questions = false;
                
                this.isLoading.users = true;
                const users = await exportApis.users.getUsers();
                this.stats.users = users.length;
                this.recentUsers = users.slice(0, 5);
                this.isLoading.users = false;
                
                this.isLoading.tags = true;
                const tags = await exportApis.tags.getTags();
                this.stats.tags = tags.length;
                this.isLoading.tags = false;
                
                this.isLoading.answers = false;
                let totalAnswers = 0;
                try {
                    const answers = await exportApis.answers.getAllAnswers();
                    this.stats.answers = answers.length;
                } catch (err) {
                    console.log('Error fetching answers or the API not available yet');
                    this.stats.answers = 0;
                }
                this.isLoading.answers = false;
            
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                this.$showMessage.error('Error loading dashboard data');
                
                Object.keys(this.isLoading).forEach(key => {
                    this.isLoading[key] = false;
                });
            }
        }
    },
    mounted() {
        this.fetchDashboardData();
    }
};
</script>

<style scoped>
    .admin-dashboard {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        background-color: #f8f9fa;
        border-radius: 12px;
    }

    .dashboard-title {
        font-size: 28px;
        color: #2c3e50;
        margin-bottom: 2rem;
        padding-bottom: 0.75rem;
        border-bottom: 3px solid #8BCAD9;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .stats-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-bottom: 2.5rem;
    }

    .stat-card {
        background: linear-gradient(145deg, #ffffff, #f0f0f0);
        border-radius: 16px;
        padding: 1.75rem;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.8);
    }

    .stat-card:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 5px;
        bottom: 0;
        left: 0;
        background-color: #8BCAD9;
        transition: height 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    .stat-card:hover:before {
        height: 8px;
    }

    .stat-icon {
        background-color: rgba(139, 202, 217, 0.15);
        border-radius: 50%;
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.25rem;
        border: 2px dashed rgba(139, 202, 217, 0.5);
    }

    .stat-icon i {
        font-size: 1.75rem;
        color: #4BACB8;
    }

    .stat-content h3 {
        margin: 0;
        font-size: 1rem;
        color: #666;
        font-weight: 500;
        margin-bottom: 0.5rem;
    }

    .stat-number {
        font-size: 2.25rem;
        font-weight: 700;
        color: #2c3e50;
        letter-spacing: 1px;
    }

    .dashboard-sections {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-bottom: 2.5rem;
    }

    .recent-section {
        background-color: #fff;
        border-radius: 16px;
        padding: 1.75rem;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
        border: 1px solid #f0f0f0;
        transition: transform 0.3s ease;
        display: flex;
        flex-direction: column;
        max-height: 600px;
    }

    .recent-section:hover {
        transform: translateY(-5px);
    }

    .section-header {
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid rgba(139, 202, 217, 0.3);
    }

    .section-header h2 {
        font-size: 1.35rem;
        margin: 0;
        color: #2c3e50;
        font-weight: 600;
        display: flex;
        align-items: center;
    }

    .section-header h2:before {
        content: "";
        display: inline-block;
        width: 6px;
        height: 22px;
        background-color: #8BCAD9;
        margin-right: 10px;
        border-radius: 3px;
    }

    .view-all {
        color: #4BACB8;
        font-size: 0.9rem;
        text-decoration: none;
        transition: all 0.2s;
        font-weight: 500;
        display: flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        border-radius: 20px;
        background-color: rgba(139, 202, 217, 0.1);
    }

    .view-all:after {
        content: "→";
        margin-left: 5px;
        transition: transform 0.2s;
    }

    .view-all:hover {
        color: #2c3e50;
        background-color: rgba(139, 202, 217, 0.2);
    }

    .view-all:hover:after {
        transform: translateX(3px);
    }

    .recent-list {
        list-style: none;
        padding: 0;
        margin: 0;
        flex-grow: 1;
        overflow-y: auto;
        max-height: calc(100% - 60px);
    }

    .recent-item {
        padding: 1rem;
        border-bottom: 1px solid #f0f0f0;
        transition: all 0.2s;
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }

    .recent-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }

    .recent-item:hover {
        background-color: rgba(139, 202, 217, 0.05);
    }

    .item-main {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.75rem;
        width: 100%;
    }

    .item-title {
        font-size: 1.05rem;
        color: #2c3e50;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
        margin-right: 1rem;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        padding-left: 0.5rem;
        max-width: 70%;
    }

    .item-title:before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 70%;
        background-color: #8BCAD9;
        border-radius: 3px;
        opacity: 0.7;
        transition: height 0.2s, opacity 0.2s;
    }

    .item-title:hover {
        color: #4BACB8;
    }

    .item-title:hover:before {
        height: 90%;
        opacity: 1;
    }

    .item-date, .user-role {
        font-size: 0.8rem;
        color: #7f8c8d;
        white-space: nowrap;
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }

    .item-date:before {
        content: "\f017";
        font-family: "Font Awesome 6 Free";
        margin-right: 5px;
        font-weight: 400;
        color: #95a5a6;
    }

    .user-role {
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        text-transform: capitalize;
        font-weight: 600;
        letter-spacing: 0.5px;
        font-size: 0.75rem;
    }

    .user-role.admin {
        background-color: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }

    .user-role.student {
        background-color: rgba(16, 185, 129, 0.1);
        color: #10b981;
    }

    .item-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        font-size: 0.85rem;
        color: #666;
        width: 100%;
    }

    .item-author, .item-email {
        display: flex;
        align-items: center;
        font-weight: 500;
    }

    .item-author i, .item-email i, .item-tags i {
        margin-right: 0.5rem;
        color: #8BCAD9;
        font-size: 1rem;
    }

    .item-tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.25rem;
    }

    .tag-badge {
        background-color: rgba(139, 202, 217, 0.15);
        color: #4BACB8;
        padding: 0.25rem 0.6rem;
        border-radius: 20px;
        font-size: 0.75rem;
        margin-right: 0.25rem;
        margin-bottom: 0.25rem;
        font-weight: 500;
        border: 1px solid rgba(139, 202, 217, 0.3);
        transition: all 0.2s;
        display: inline-block;
    }

    .tag-badge:hover {
        background-color: rgba(139, 202, 217, 0.3);
    }

    .loading, .no-data {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .loading-spinner {
        width: 48px;
        height: 48px;
        border: 3px solid rgba(139, 202, 217, 0.2);
        border-top: 3px solid #4BACB8;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading p {
        color: #7f8c8d;
        font-weight: 500;
    }

    .no-data {
        padding: 2.5rem;
        text-align: center;
        color: #7f8c8d;
        font-style: italic;
        background-color: rgba(139, 202, 217, 0.05);
        border-radius: 8px;
    }

    .quick-actions {
        background-color: #fff;
        border-radius: 16px;
        padding: 1.75rem;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
        border: 1px solid #f0f0f0;
    }

    .quick-actions h2 {
        font-size: 1.35rem;
        margin: 0 0 1.5rem;
        color: #2c3e50;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid rgba(139, 202, 217, 0.3);
        font-weight: 600;
        display: flex;
        align-items: center;
    }

    .quick-actions h2:before {
        content: "";
        display: inline-block;
        width: 6px;
        height: 22px;
        background-color: #8BCAD9;
        margin-right: 10px;
        border-radius: 3px;
    }

    .action-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: space-around;
    }

    .action-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #4BACB8;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 30px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(75, 172, 184, 0.25);
        min-width: 160px;
        letter-spacing: 0.5px;
        border: 2px solid #4BACB8;
        position: relative;
        overflow: hidden;
    }

    .action-btn:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.1);
        transition: width 0.3s ease;
    }

    .action-btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(75, 172, 184, 0.3);
        background-color: #3A8F9A;
        border-color: #3A8F9A;
    }

    .action-btn:hover:before {
        width: 100%;
    }

    .action-btn i {
        margin-right: 8px;
        color: white;
        font-size: 1.1rem;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .stat-card {
        animation: fadeInUp 0.5s ease forwards;
        opacity: 0;
    }

    .stat-card:nth-child(1) { animation-delay: 0.1s; }
    .stat-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(3) { animation-delay: 0.3s; }
    .stat-card:nth-child(4) { animation-delay: 0.4s; }

    @media (max-width: 1200px) {
        .dashboard-sections {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 1024px) {
        .stats-container {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 992px) {
        .dashboard-sections {
            grid-template-columns: 1fr;
        }
        
        .recent-section {
            max-height: 500px;
        }
    }

    @media (max-width: 768px) {
        .admin-dashboard {
            padding: 1.5rem;
        }
        
        .action-buttons {
            flex-direction: column;
        }
        
        .action-btn {
            width: 100%;
        }
        
        .item-title {
            max-width: 100%;
            margin-bottom: 0.5rem;
            white-space: normal;
            text-overflow: unset;
        }
        
        .item-date, .user-role {
            margin-top: 0.25rem;
            align-self: flex-start;
        }
        
        .item-meta {
            flex-direction: column-reverse;
            align-items: flex-start;
        }
        
        .item-tags {
            margin-top: 0.5rem;
            width: 100%;
        }
    }

    @media (max-width: 480px) {
        .stats-container {
            grid-template-columns: 1fr;
        }
        
        .stat-card {
            padding: 1.25rem;
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
        }
        
        .recent-section {
            padding: 1.25rem;
        }
        
        .recent-item {
            padding: 0.75rem;
        }
    }
</style>