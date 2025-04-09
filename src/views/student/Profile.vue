<template>
    <div class="student-profile">
        <profile></profile>
    </div>
</template>

<script>
import Profile from '@/components/Profile.vue';

export default {
    name: 'StudentProfile',
    components: {
        'profile': Profile
    }
}
</script>