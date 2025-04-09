<template>
    <div class="admin-profile">
        <profile></profile>
    </div>
</template>

<script>
import Profile from '@/components/Profile.vue';

export default {
    name: 'AdminProfile',
    components: {
        'profile': Profile
    }
}
</script>