<template>
    <div class="admin-layout" @click="closeNav">
        <header>
            <div class="avatar-search-bar">
                <router-link to="/admin">
                    <div class="page-logo--role">
                        <img :src="logo" :alt="altLogo">
                        <span>ADMIN</span>
                    </div>
                </router-link>

                <search-bar 
                @getKeyword="getKeyword"
                :forTag="false"
                ></search-bar>
            </div>

            <nav class="original-nav">
                <ul>
                    <li>
                        <router-link class="router-link" to="/admin" exact-active-class="router-link-active">
                            Dashboard
                        </router-link>
                    </li>
                    <li>
                        <router-link class="router-link" to="/admin/questions" exact-active-class="router-link-active">
                            Questions
                        </router-link>
                    </li>
                    <li>
                        <router-link class="router-link" to="/admin/users" exact-active-class="router-link-active">
                            Users
                        </router-link>
                    </li>
                    <li>
                        <router-link class="router-link" to="/admin/tags" exact-active-class="router-link-active">
                            Tags
                        </router-link>
                    </li>
                    <li>
                        <router-link class="router-link" to="/admin/profile" exact-active-class="router-link-active">
                            Profile
                        </router-link>
                    </li>
                </ul>
            </nav>

            <div class="auth--nav-icon">
                <div class="authen-logout" v-if="isAuthenticated">
                    <p>
                        Welcome, {{ currentUser ? currentUser.name || currentUser.email : '' }}
                    </p>
                    <button @click="logout">Logout</button>
                </div>
    
                <div class="nav-bar-btn" id="bar-btn" @click="onClickBarIcon">
                    <i class="fa-solid fa-layer-group fa-xl"></i>
                </div>
            </div>

            <nav class="bar-icon--nav" id="nav--bar-icon" @click="closeNav">
                <ul class="nav-list">
                    <li class="nav-items">
                        <router-link class="router-link" to="/admin" exact-active-class="nav-router-link-active">
                            <span>Dashboard</span>
                        </router-link>
                    </li>
                    <li class="nav-items">
                        <router-link class="router-link" to="/admin/questions" exact-active-class="nav-router-link-active">
                            <span>Questions</span>
                        </router-link>
                    </li>
                    <li class="nav-items">
                        <router-link class="router-link" to="/admin/users" exact-active-class="nav-router-link-active">
                            <span>Users</span>
                        </router-link>
                    </li>
                    <li class="nav-items">
                        <router-link class="router-link" to="/admin/tags" exact-active-class="nav-router-link-active">
                            <span>Tags</span>
                        </router-link>
                    </li>
                    <li class="nav-items">
                        <router-link class="router-link" to="/admin/profile" exact-active-class="nav-router-link-active">
                            <span>Profile</span>
                        </router-link>
                    </li>
                    <li class="nav-items">
                        <a class="router-link" id="logout-nav" @click="logout" v-if="isAuthenticated">
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>

        <div class="content-wrapper">
            <main>
                <router-view/>
            </main>
    
            <footer>
                &copy; 2025 Q&Aespa System
            </footer>
        </div>
    </div>
</template>

<script>
    import SearchBar from '@/components/SearchBar.vue';
import exportApis from '@/helpers/api/exportApis';
    import { mapGetters } from 'vuex';
    
    export default {
        name: 'AdminLayout',
        components: {
            'search-bar': SearchBar
        },
        data() {
            return {
                logo: 'https://betterthingsbyaespa.com/images/logo-2.webp',
                altLogo: 'Logo',
                isNavVisible: false,
                keyword: '',
                isSearching: false,
                foundTag: null,
                currentTagId: ''
            }
        },
        computed: {
            ...mapGetters('auth', ['isAuthenticated', 'currentUser'])
        },
        methods: {
            onClickBarIcon: function(event) {
                event.stopPropagation();

                this.isNavVisible = !this.isNavVisible;

                const barBtn = document.getElementById('bar-btn')
                const navBarIcon = document.getElementById('nav--bar-icon');

                if (this.isNavVisible) {
                    navBarIcon.style.display = 'flex';
                    barBtn.style.color = 'var(--secondary-color)';
                } else {
                    navBarIcon.style.display = 'none';
                    barBtn.style.color = 'var(--secondary-text-color)';
                }  
            },
            closeNav: function() {
                if (this.isNavVisible) {
                    this.isNavVisible = false;
                    const barBtn = document.getElementById('bar-btn')
                    const navBarIcon = document.getElementById('nav--bar-icon');
                    navBarIcon.style.display = 'none';
                    barBtn.style.color = 'var(--secondary-text-color)';
                }
            },
            logout() {
                this.$store.dispatch('auth/logout');
            },
            getKeyword: async function(keyword, type) {
                console.log("getKeyword called with:", keyword, type);
                
                if (keyword === '') {
                    this.keyword = '';
                    this.isSearching = false;
                    this.foundTag = null;
                    this.currentTagId = '';
                    
                    // Clear the URL parameters when clearing search
                    this.$router.replace({
                        query: {}
                    });
                    return;
                }
                
                this.keyword = keyword;
                this.isSearching = true;

                if (type === 'relativeQuestion' || type === 'exactQuestion') {
                    console.log("Searching for question:", keyword, type);
                    this.$router.push({
                        name: 'AdminSearchQuestion',
                        query: { 
                            keyword: this.keyword,
                            type: type
                        }
                    });
                } else if (type === 'relativeUser') {
                    console.log("Searching for user:", keyword);
                    this.$router.push({
                        name: 'AdminSearchUser',
                        query: { 
                            keyword: this.keyword,
                            type: type
                        }
                    });
                } else if (type === 'exactTag') {
                    console.log("Searching for tag:", keyword);
                    try {
                        const tagResponse = await exportApis.tags.getTagByTagName(keyword);
                        console.log("Tag search response:", tagResponse);
                        
                        if (!tagResponse || !tagResponse._id) {
                            console.log("Tag not found, showing unavailable tag page");
                            this.$router.push({
                                name: 'AdminSearchUnavailableTag',
                                query: { 
                                    keyword: this.keyword,
                                    type: type
                                }
                            });
                        } else {
                            console.log("Tag found, navigating to tag page");
                            this.foundTag = tagResponse;
                            this.currentTagId = tagResponse._id;
                            
                            this.$router.push({
                                path: `/admin/tags/${tagResponse._id}`,
                                query: { 
                                    keyword: this.keyword,
                                    type: type
                                }
                            });
                        }
                    } catch (error) {
                        console.error("Error searching for tag:", error);
                        this.$showMessage.error("Error searching for tag: " + error.message);
                    }
                }
            }
        },
        mounted() {
            const navBarIcon = document.getElementById('nav--bar-icon');
            navBarIcon.style.display = 'none';

            document.addEventListener('click', this.closeNav);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.closeNav);
        }
    }    
</script>

<style>
    .admin-layout {
        --text-color: #000;
        --secondary-text-color: #fff;
        --secondary-color: #8BCAD9;
        --background-color: #333;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-decoration: none;
        color: var(--text-color);
    }

    .admin-layout header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--background-color);
        padding: 1em;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
    }

    .admin-layout .avatar-search-bar {
        display: flex;
        align-items: center;
        gap: 1em;
    }

    .admin-layout header .page-logo--role {
        display: flex;
        align-items: flex-start;
    }

    .admin-layout header .page-logo--role img {
        width: 100px;
        height: 40px;
    }

    .admin-layout header .page-logo--role img:hover {
        opacity: 0.8;
    }

    .admin-layout header .page-logo--role span {
        color: var(--secondary-color);
        font-size: 13px;
        font-weight: bold;
        align-self: flex-start;
    }

    .admin-layout header nav.original-nav {
        display: flex;
        margin-right: 7.5em;
    }

    .auth--nav-icon {
        display: flex;
        gap: 0.5em;
    }

    .login-register-logout {
        display: flex;
        align-items: center;
    }

    .authen-logout {
        display: flex;
        align-items: center;
        gap: 1em;
    }

    .authen-logout p {
        color: var(--secondary-text-color);
        font-size: 0.9em;
    }

    .authen-logout button {
        display: block;
        background-color: var(--secondary-color);
        color: var(--background-color);
        border: none;
        padding: 0.5em 1em;
        border-radius: 0.3em;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .authen-logout button:hover {
        opacity: 0.8;
        transform: scale(1.05);
    }

    #logout-nav {
        display: none;
    }

    .login-register {
        display: flex;
        gap: 1em;
    }

    .auth-link {
        color: var(--secondary-text-color);
        padding: 0.5em 1em;
        border-radius: 0.3em;
        transition: all 0.3s ease;
    }

    .auth-link:first-child, .auth-link:last-child:hover {
        background-color: transparent;
        border: 1px solid var(--secondary-color);
        transition: all 0.3s ease-in-out;
    }

    .auth-link:last-child,.auth-link:last-child:hover {
        background-color: var(--secondary-color);
        border: 0 solid var(--secondary-color);
        color: var(--background-color);
        font-weight: bold;
    }

    .auth-link:hover {
        opacity: 0.9;
        transform: translateY(-3px);
    }

    .admin-layout header nav ul {
        list-style-type: none;
        display: flex;
    }

    .admin-layout header nav ul li .router-link {
        padding: 0.8em 1em;
        color: var(--secondary-text-color);
        border-bottom: 0.1em solid var(--header-background-color) ;
        transition: all 0.3s ease-in-out;
    }

    .admin-layout header nav ul li .router-link:hover {
        border-bottom: 0.1em solid var(--secondary-color);
        color: var(--secondary-color);
    }

    .admin-layout header nav ul li .router-link-active {
        border-bottom: 0.1em solid var(--secondary-color);
        color: var(--secondary-color);
    }

    .admin-layout .content-wrapper {
        margin-top: calc(2em + 40px)
    }

    .admin-layout .content-wrapper main {
        min-height: 90vh;
        margin: 1em 0 2em;
    }

    .admin-layout .content-wrapper footer {
        background-color: var(--background-color);
        width: 100%;
        color: var(--secondary-text-color);
        padding: 1em;
    }

    .admin-layout header nav.bar-icon--nav,
    .nav-bar-btn {
        display: none;
    }    
    
    @media screen and (max-width: 1024px) {
        .admin-layout header nav.original-nav {
            display: none;
        }

        .nav-bar-btn {
            display: flex;
            color: var(--secondary-text-color);
            padding: 1em 0.25em;
            cursor: pointer;
        }
        
        .nav-bar-btn i {
            color: inherit;
        }

        .nav-bar-btn:hover,
        .nav-bar-btn-active {
            color: #8BCAD9;
        }

        .admin-layout header nav.bar-icon--nav{
            position: absolute;
            top: calc(2em + 40px);
            background-color: var(--background-color);
            left: 0;
            margin-top: 0;
            width: 100%;
            border-radius:  0 0 1em 0;
        }

        .admin-layout header nav.bar-icon--nav .nav-list {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .admin-layout header nav.bar-icon--nav .nav-list .nav-items {
            width: 100%;
        }

        .admin-layout header nav.bar-icon--nav .nav-list 
        .nav-items .router-link {
            text-align: left;
            display: block;
            width: 100%;
            padding: 1em;
            border-left: 0.1em solid var(--background-color);
            transition: all 0.3s ease-in-out;
        }

        .admin-layout header nav.bar-icon--nav .nav-list 
        .nav-items .router-link span {
            color: var(--secondary-text-color);
        }

        .admin-layout header nav.bar-icon--nav .nav-list 
        .nav-items .router-link:hover {
            border-color: #8BCAD9;
            border-left: 0.3em solid #8BCAD9;
            border-radius: 1em 0 1em 0;
        }

        .admin-layout header nav.bar-icon--nav .nav-list 
        .nav-items .router-link:hover span {
            color: #8BCAD9;
            font-weight: 600;
        }

        .admin-layout header nav.bar-icon--nav .nav-list 
        .nav-items .nav-router-link-active {
            border-color: #8BCAD9;
            border-left: 0.3em solid #8BCAD9;
            border-bottom: 0.1em solid #8BCAD9;
            border-radius: 1em 0 1em 0;
            color: #8BCAD9;
            font-weight: 600;
        }

        .admin-layout header nav.bar-icon--nav .nav-list 
        .nav-items .nav-router-link-active span {
            color: inherit;
        }
    }

    @media screen and (max-width: 768px) {
        .login-register-logout {
            margin-right: 1em;
        }
        
        .authen-logout {
            gap: 0.5em;
            margin-right: 0.5em;
        }
        
        .login-register {
            gap: 0.5em;
        }
        
        .auth-link {
            text-align: center;
            font-size: 0.9em;
            padding: 0.4em 0.8em;
        }
    }

    @media screen and (max-width: 480px) {
        .login-register-logout {
            margin-right: 0.5em;
        }

        .auth--nav-icon {
            gap: 0;
        }

        .authen-logout p {
            display: none;
        }

        .authen-logout button {
            display: none;
        }

        #logout-nav {
            display: block;
        }
    }
</style>