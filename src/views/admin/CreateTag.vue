<template>
    <div class="create-tag-container">
        <tag-form
        @createOrUpdate="createOrUpdate"
        ></tag-form>
    </div>
</template>

<script>
import TagForm from '@/components/TagForm.vue';
import exportApis from '@/helpers/api/exportApis';

    export default {
        name: 'CreateTag',
        components: {
            'tag-form': TagForm
        },
        methods: {
            createOrUpdate: async function(tag) {
                try {
                    const res = await exportApis.tags.createTag(tag);
                    this.$showMessage.success('Tag created successfully!');
                    this.$router.push(`/admin/tags/${res._id}`);
                } catch (error) {
                    console.error('Error creating tag:', error);
                }
            }
        }
    }
</script>