<template>
    <div class="create-user-container">
        <user-form
        @createUser="createUser"
        :isEditing="false"></user-form>
    </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue';
import exportApis from '@/helpers/api/exportApis';
export default {
    name: 'CreateUser',
    components: {
        'user-form': UserForm
    },
    methods: {
        async createUser(user) {
            console.log('User data:', user);
            
            try {
                const createdUser = await exportApis.users.createUser(user);
                this.$showMessage.success('User created successfully!');
                this.$router.push(`/admin/users/${createdUser._id}`)
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }
    }
}
</script>