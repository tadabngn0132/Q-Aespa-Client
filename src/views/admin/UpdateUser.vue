<template>
    <div class="create-user-container">
        <user-form
        @editUser="editUser"
        :isEditing="true"
        :user="user"></user-form>
    </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue';
import exportApis from '@/helpers/api/exportApis';
export default {
    name: 'UpdateUser',
    components: {
        'user-form': UserForm
    },
    data() {
        return {
            user: {}
        }
    },
    methods: {
        async editUser(user) {
            console.log('User data:', user);
            
            try {
                const updatedUser = await exportApis.users.updateUser(this.user._id, user);
                this.$showMessage.success('User updated successfully!');
                this.$router.push(`/admin/users/${updatedUser._id}`);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    },
    async mounted() {
        this.user = await exportApis.users.getUser(this.$route.params.id)
    }
}
</script>