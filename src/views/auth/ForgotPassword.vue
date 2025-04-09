<template>
    <div class="forgot-password">
        <forgot-password-form></forgot-password-form>
    </div>
</template>

<script>
import ForgotPassword from '@/components/ForgotPasswordForm.vue';

export default {
    name: 'forgotPassword',
    components: {
        'forgot-password-form': ForgotPassword
    }
}
</script>