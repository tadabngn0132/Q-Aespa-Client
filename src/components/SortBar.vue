<template>
    <div class="sort-bar-container">
        <ul v-if="!forTag" class="sort-items-list">
            <li 
            v-for="sortType in ['Newest', 'Oldest', 'Unanswered', 'Score']" 
            :key="sortType"
            :class="['sort-items', { active: activeSort === sortType }]"
            @click="setSort(sortType)"
            >
                {{ sortType }}
            </li>
        </ul>

        <ul v-else class="sort-items-list">
            <li 
            v-for="sortType in ['Newest', 'Name', 'Popular']" 
            :key="sortType"
            :class="['sort-items', { active: activeSort === sortType }]"
            @click="setSort(sortType)"
            >
                {{ sortType }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'SortBar',
        props: {
            forTag: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                activeSort: 'Newest'
            }
        },
        methods: {
            setSort(sortType) {
                this.activeSort = sortType;
                this.$emit('sortChanged', sortType);
            }
        }
    }
</script>

<style scoped>
.sort-bar-container {
    margin: 0;
    padding: 0.35rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: fit-content;
}

.sort-items-list {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.sort-items {
    padding: 0.35rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: #555;
    transition: all 0.2s ease;
}

.sort-items:hover {
    background-color: #f0f0f0;
    color: #333;
}

.sort-items.active {
    background-color: #4BACB8;
    color: white;
    border-color: #4BACB8;
}
</style>