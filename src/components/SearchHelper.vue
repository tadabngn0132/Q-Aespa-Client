<template>
    <div class="search-helper">
        <div class="search-helper-content">
            <div class="search-type">
                <p><code>javascript</code> relative word</p>
            </div>
            <div class="search-type">
                <p><code>[tag]</code> search within a tag</p>
            </div>
            <div class="search-type" v-if="isAdmin">
                <p><code>(fullname)</code> search by author</p>
            </div>
            <div class="search-type">
                <p><code>"word here"</code> exact phrase</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'SearchHelper',
    computed: {
        ...mapGetters('auth', ['isAdmin'])
    }
};
</script>

<style scoped>
.search-helper {
    width: 15em;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    border: 1px solid #e0e0e0;
    border-top: none;
    font-family: Arial, sans-serif;
}

.search-helper-content {
    padding: 15px;
    max-height: 350px;
    overflow-y: auto;
}

.search-type {
    margin-bottom: 9px;
    padding-bottom: 9px;
    text-align: left;
}

.search-type:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.search-type p {
    margin: 0;
    font-size: 14px;
    color: #555;
}

code {
    background-color: #f0f0f0;
    padding: 3px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13.25px;
    margin-right: 0.25em;
}
</style>