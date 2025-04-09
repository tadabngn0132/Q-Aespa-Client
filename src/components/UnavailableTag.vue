<template>
    <div class="admin-tag-detail">
        <h1 class="tag-name">#{{ tagName }}</h1>

        <span class="question-count">
            0 question
        </span>

        <div class="guide">
            <span>There are no tags with the name <code>{{ tagName }}</code>.</span>
            <router-link v-if="isAdmin" :to="{ path: '/admin/tags' }" class="to-tags">
                View available tags for this site.
            </router-link>
            <router-link v-else :to="{ path: '/student/tags' }" class="to-tags">
                View available tags for this site.
            </router-link>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'tagDetail',
        data() {
            return {
                tagName: ''
            }
        },
        computed: {
            ...mapGetters('auth', ['isAdmin'])
        },
        async mounted() {
            this.tagName = this.$route.query.keyword
        },
        watch: {
            '$route.query.keyword': {
                immediate: true,
                handler(newtagName) {
                    this.tagName = newtagName;
                }
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

.tag-name {
    font-size: 2.2rem;
    margin-bottom: 10px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
    color: #333;
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

.to-tags {
    color: #3498db;
}

code {
    font-size: 13.5px;
    padding: 0.2em 0.25em;
    background-color: #e0e0e0;
    border-radius: 5px;
}

@media (max-width: 768px) {
    .tag-name {
        font-size: 1.8rem;
    }
}
</style>