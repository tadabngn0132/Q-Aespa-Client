<template>
    <div class="user-detail-container">
        <div class="user-detail">
            <div class="user-name-create-btn">
                <h1 class="user-name">{{ user.name }}</h1>
                <router-link :to="{path: '/admin/createuser'}" class="create-btn">
                    <i class="fa-solid fa-plus"></i>
                    <span>
                        Create User
                    </span>
                </router-link>
            </div>

            <div class="user-email-ud-btn-container">
                <p class="user-email">{{ user.email }}</p>
    
                <div class="ud-btn-container">
                    <div class="ud-btn">
                        <router-link 
                        class="edit-btn" 
                        :to="{name: 'UpdateUser', params: { id: user._id }}">
                        <span class="icon">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </span>    
                        <span class="text">
                                Edit
                            </span>
                        </router-link>
                    </div>
    
                    <div class="ud-btn" @click.prevent="onDelete(user._id)">
                        <a class="delete-btn" :href="`/users/${user._id}`">
                            <span class="icon">
                                <i class="fa-solid fa-trash"></i> 
                            </span>
                            <span class="text">
                                Delete
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import exportApis from '@/helpers/api/exportApis';

export default {
    name: 'AdminUserDetail',
    data() {
        return {
            user: ''
        }
    },
    methods: {
        async onDelete(id) {
            const sure = window.confirm('Do you really want to delete this user!');
            if (!sure) return;
            await exportApis.users.deleteUser(id);
            this.$showMessage.success('User deleted successfully!');
            this.$router.push('/admin/users');
        }
    },
    async mounted() {
        this.user = await exportApis.users.getUser(this.$route.params.id)
    }
}
</script>

<style scoped>
.user-detail-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.user-detail {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    transition: all 0.3s ease;
}

.user-detail:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.user-name-create-btn {
    display: flex;
    align-items: flex-end;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
    justify-content: space-between;
}

.user-name {
    font-size: 2rem;
    color: #333;
}

.create-btn {
    display: inline-flex;
    gap: 0.5em;
    align-items: center;
    text-decoration: none;
    background-color: #3498db;
    color: #fff;
    padding: 8px 15px 10px;
    border-radius: 1em;
}

.create-btn:hover {
    background-color: #2980b9;
}

.create-btn span,
.create-btn i {
    color: inherit;
    font-size: 15px;
}

.create-btn i {
    margin-top: 3px;
}

.user-email-ud-btn-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 0.5rem;
}

.user-email {
    font-size: 1.2rem;
    color: #666;
}

.ud-btn-container {
    display: flex;
    justify-self: flex-end;
}

.ud-btn {
    margin-left: 10px;
}

.edit-btn, .delete-btn {
    display: inline-block;
    align-items: center;
    padding: 8px 15px 10px;
    border-radius: 1em;
    text-decoration: none;
    transition: all 0.3s ease;
}

.edit-btn {
    background-color: #f39c12;
    color: white;
}

.edit-btn:hover {
    background-color: #e67e22;
}

.delete-btn {
    background-color: #e74c3c;
    color: white;
}

.delete-btn:hover {
    background-color: #c0392b;
}

.icon {
    margin-right: 0.25em;
}

.text, .icon i {
    font-size: 14px;
    color: #fff;
}

@media (max-width: 768px) {
    .user-detail-container {
        padding: 1rem;
    }
    
    .user-detail {
        padding: 1.5rem;
    }
    
    .user-name {
        font-size: 1.6rem;
    }
    
    .user-email {
        font-size: 1rem;
    }
}
</style>