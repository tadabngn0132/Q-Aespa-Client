<template>
    <div class="student-home">
        <div class="welcome-container">
            <h1>Welcome to Q&Aespa</h1>
            <p>A place to ask questions, share knowledge, and find solutions.</p>
            
            <div class="action-buttons">
            <router-link to="/student/askquestion" class="ask-button">
                <i class="fa-solid fa-plus"></i> Ask a Question
            </router-link>
            
            <router-link to="/student/questions" class="browse-button">
                <i class="fa-solid fa-list"></i> Browse Questions
            </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'StudentHome'
    }
</script>

<style scoped>
    .student-home {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
    }

    .welcome-container {
        background-color: #f8f9fa;
        border-radius: 12px;
        padding: 2rem;
        max-width: 650px;
        width: 100%;
        text-align: center;
    }

    h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 1rem;
        font-weight: 600;
    }

    p {
        font-size: 1.2rem;
        color: #6c757d;
        margin-bottom: 1.5rem;
    }

    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .ask-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #4BACB8;
        color: white;
        padding: 1rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        transition: background-color 0.3s;
    }

    .ask-button i {
        color: inherit;
    }

    .ask-button:hover {
        background-color: #3A8F9A;
    }

    .browse-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        color: #4BACB8;
        padding: 1rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        border: 1px solid #e9ecef;
        transition: background-color 0.3s;
    }

    .browse-button i {
        color: inherit;
    }

    .browse-button:hover {
        background-color: #f1f3f5;
    }

    .ask-button i, .browse-button i {
        margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
        .welcome-container {
            margin: 0 1rem;
            padding: 1.5rem;
        }

        h1 {
            font-size: 2rem;
        }

        p {
            font-size: 1rem;
        }
    }
</style>