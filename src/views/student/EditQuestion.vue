<template>
    <div class="edit-question-container">
        <h1>Edit Question</h1>
        <question-form 
        @createOrUpdate="createOrUpdate"
        :question="question"
        :tags="tags"></question-form>
    </div>
</template>

<script>
    import QuestionForm from '@/components/QuestionForm.vue';
    import exportApis from '@/helpers/api/exportApis';

    export default {
        name: 'studentEditQuestion',
        components: {
            'question-form': QuestionForm
        },
        data() {
            return {
                question: {},
                tags: []
            };
        },
        async mounted() {
            this.question = await exportApis.questions.getQuestion(this.$route.params.id);
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
                    await exportApis.questions.updateQuestion(questionWithUserId);
                    this.$showMessage.success('Question updated successfully!');
                    this.$router.push(`/admin/questions/${question._id}`)
                } catch (error) {
                    console.error('Error updating question:', error);
                }
            }
        }
    };
</script>