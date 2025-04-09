import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';

Vue.use(Router);

const routes = [
    {
        path: '/',
        redirect: '/student'
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/forgot-password',
        name: 'forgotPassword',
        component: () => import('@/views/auth/ForgotPassword.vue')
    },
    {
        path: '/admin',
        component: () => import('@/layouts/AdminLayout.vue'),
        meta: { 
            requiresAuth: true,
            adminOnly: true
        },
        children: [
            {
                path: '',
                name: 'AdminDashboard',
                component: () => import('@/views/admin/Dashboard.vue')
            },
            {
                path: '/admin/questions',
                name: 'AdminQuestions',
                component: () => import('@/views/admin/Questions.vue')
            },
            {
                path: '/admin/search',
                name: 'AdminSearchQuestion',
                component: () => import('@/views/admin/Questions.vue')
            }, 
            {
                path: '/admin/askquestion',
                name: 'askQuestion',
                component: () => import('@/views/admin/AskQuestion.vue')
            },
            {
                path: '/admin/editquestion',
                name: 'editQuestion',
                component: () => import('@/views/admin/EditQuestion.vue')
            },
            {
                path: '/admin/questions/:id',
                name: 'AdminQuestionDetail',
                component: () => import('@/views/admin/QuestionDetail.vue')
            },
            {
                path: '/admin/users',
                name: 'AdminUsers',
                component: () => import('@/views/admin/Users.vue')
            },
            {
                path: '/admin/searchuser',
                name: 'AdminSearchUser',
                component: () => import('@/views/admin/Users.vue')
            },
            {
                path: '/admin/users/:id',
                name: 'AdminUserDetail',
                component: () => import('@/views/admin/UserDetail.vue')
            },
            {
                path: '/admin/createuser',
                name: 'CreateUser',
                component: () => import('@/views/admin/CreateUser.vue')
            },
            {
                path: '/admin/edituser',
                name: 'UpdateUser',
                component: () => import('@/views/admin/UpdateUser.vue')
            },
            {
                path: '/admin/tags',
                name: 'AdminTags',
                component: () => import('@/views/admin/Tags.vue')
            },
            {
                path: '/admin/searchtag',
                name: 'AdminSearchUnavailableTag',
                component: () => import('@/components/UnavailableTag.vue')
            },
            {
                path: '/admin/tags/:id',
                name: 'tagDetail',
                component: () => import('@/views/admin/TagDetail.vue')
            },
            {
                path: '/admin/updatetag/:id',
                name: 'UpdateTag',
                component: () => import('@/views/admin/EditTag.vue')
            },
            {
                path: '/admin/createtag',
                name: 'CreateTag',
                component: () => import('@/views/admin/CreateTag.vue')
            },
            {
                path: '/admin/profile',
                name: 'AdminProfile',
                component: () => import('@/views/admin/Profile.vue')
            }
        ]
    },
    {
        path: '/student',
        component: () => import('@/layouts/StudentLayout.vue'),
        meta: { allowGuest: true },
        children: [
            {
                path: '',
                name: 'StudentHome',
                component: () => import('@/views/student/Home.vue')
            },
            {
                path: '/student/questions',
                name: 'StudentQuestions',
                component: () => import('@/views/student/Questions.vue')
            },
            {
                path: '/student/search',
                name: 'StudentSearchQuestion',
                component: () => import('@/views/student/Questions.vue')
            }, 
            {
                path: '/student/askquestion',
                name: 'studentAskQuestion',
                component: () => import('@/views/student/AskQuestion.vue'),
                meta: { 
                    requiresAuth: true
                }
            },
            {
                path: '/student/editquestion',
                name: 'studentEditQuestion',
                component: () => import('@/views/student/EditQuestion.vue')
            },
            {
                path: '/student/questions/:id',
                name: 'StudentQuestionDetail',
                component: () => import('@/views/student/QuestionDetail.vue')
            },
            {
                path: '/student/tags',
                name: 'StudentTags',
                component: () => import('@/views/student/Tags.vue')
            },
            {
                path: '/student/searchtag',
                name: 'StudentSearchUnavailableTag',
                component: () => import('@/components/UnavailableTag.vue')
            },
            {
                path: '/student/tags/:id',
                name: 'studentTagDetail',
                component: () => import('@/views/student/TagDetail.vue')
            },
            {
                path: '/student/profile',
                name: 'Profile',
                component: () => import('@/views/student/Profile.vue')
            }
        ]
    }
]

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: 'active',
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthenticated'];
    const userRole = store.getters['auth/userRole'];

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        return next('/login');
    }

    if (to.matched.some(record => record.meta.adminOnly) && userRole !== 'admin') {
        return next('/student');
    }

    if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
        if (userRole === 'admin') {
            return next('/admin');
        } else {
            return next('/student');
        }
    }

    next();
});

export default router;