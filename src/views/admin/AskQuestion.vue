<template>
    <div class="ask-question-container">
        <h1>Ask a new question</h1>
        <question-form 
        @createOrUpdate="createOrUpdate"
        :tags="tags"></question-form>
    </div>
</template>

<script>
    import QuestionForm from '@/components/QuestionForm.vue';
    import exportApis from '@/helpers/api/exportApis';

    export default {
        name: 'askQuestion',
        components: {
            'question-form': QuestionForm
        }, 
        data() {
            return {
                tags: []
            }
        },
        async mounted() {
            this.tags = await exportApis.tags.getTags();
        },
        methods: {
            createOrUpdate: async function(question) {
                const userId = this.$store.state.auth.userId;

                if (!userId) {
                    this.$showMessage.warning('You need login to ask question.');
                    return;
                }

                const questionWithUserId = {
                    ...question,
                    userId: userId
                };

                try {
                    const res = await exportApis.questions.createQuestion(questionWithUserId);
                    this.$showMessage.success('Question created successfully!');
                    this.$router.push(`/admin/questions/${res._id}`);
                } catch (error) {
                    console.error('Error creating question:', error);
                }
            }
        }
    };
</script>