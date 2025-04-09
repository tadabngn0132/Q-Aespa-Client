<template>
    <div class="admin-tag-container">
        <div class="tag-title-create-btn">
            <h1 class="tags-title">Tags</h1>
            <router-link 
            to="CreateTag"
            class="create-btn">
                <span>Create Tag</span>
            </router-link>
        </div>

        <p class="tags-specification">
            {{ tagSpecification }}
        </p>

        <div class="search-sort">
            <search-bar
            @filterTag="filterTag"
            :forTag="true"
            :resetSearch="resetSearch"></search-bar>

            <sort-bar
            @sortChanged="sortChanged"
            :forTag="true"></sort-bar>
        </div>

        <ul class="tags-list">
            <li 
            v-for="(tag, i) in tags" 
            :key="i" 
            class="tags">
                <router-link class="router-link" :to="{name: 'tagDetail', params: { id: tag._id}}">
                    {{ tag.name }}
                </router-link>

                <span class="tag-desctiption">
                    {{ getTruncatedDescription(tag.description) }}
                </span>

                <div class="question-quantity-created-time">
                    <span class="question-quantity">
                        {{ tag.questionQuantity }} questions
                    </span>
                    <span class="created-time">
                        created {{ formatRelativeTime(tag.createdAt) }}
                    </span>
                </div>

                <div class="ud-btn-container">
                    <div class="ud-btn">
                        <router-link 
                        class="ud-btn edit-btn" 
                        :to="{name: 'UpdateTag', params: { id: tag._id}}">
                            <span class="icon">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </span>

                            <span class="text">
                                Edit
                            </span>
                        </router-link>
                    </div>
    
                    <div class="ud-btn" @click.prevent="onDelete(tag._id)">
                        <a 
                        class="delete-btn" 
                        :href="`/tags/${tag._id}`">
                            <span class="icon">
                                <i class="fa-solid fa-trash"></i>
                            </span>

                            <span class="text">
                                Delete
                            </span>
                        </a>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import SortBar from '@/components/SortBar.vue';
    import SearchBar from '@/components/SearchBar.vue';
    import exportApis from '@/helpers/api/exportApis';
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';

    dayjs.extend(relativeTime);

    export default {
        name: 'AdminTags',
        components: {
            'sort-bar': SortBar,
            'search-bar': SearchBar
        },
        data() {
            return {
                tagSpecification: 'A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.',
                tags: [],
                originalTags: [],
                sortType: '',
                resetSearch: false
            }
        },
        methods: {
            getTruncatedDescription: function(description) {
                if (description && description.length > 150) {
                    return description.substring(0, 150) + '...';
                }
                return description;
            },
            async onDelete(id) {
                const sure = window.confirm('Do you really want to delete this tag?');
                if (!sure) return;
                await exportApis.tags.deleteTag(id);
                this.$showMessage.success('Tag deleted successfully!');
                const newTags = this.tags.filter(tag => tag._id !== id);
                this.tags = newTags;
            },
            async sortChanged(sortType) {
                this.resetSearch = true;

                if (sortType === 'Newest') {
                    this.tags = await exportApis.tags.getTags();
                    this.originalTags = this.tags;
                    this.sortType = 'Newest';
                    this.originalSortType = this.sortType;
                    this.resetSearch = false;
                } else if (sortType === 'Name') {
                    this.tags = await exportApis.tags.getTagsSort('name');
                    this.originalTags = this.tags;
                    this.sortType = 'Name';
                    this.resetSearch = false;
                } else if (sortType === 'Popular') {
                    this.tags = await exportApis.tags.getTagsSort('popular');
                    this.originalTags = this.tags;
                    this.sortType = 'Popular';
                    this.resetSearch = false;
                }
            },
            formatRelativeTime(timestamp) {
                return dayjs(timestamp).fromNow();
            },
            filterTag(tagname) {
                if (!tagname) {
                    this.tags = this.originalTags;
                    return;
                }
                
                const foundTags = this.tags.filter(tag => 
                    tag.name.toLowerCase().includes(tagname.toLowerCase())
                );

                this.tags = foundTags;
            }
        },
        async mounted() {
            this.tags = await exportApis.tags.getTags();
            this.originalTags = this.tags;
        }
    }
</script>

<style scoped>
    .admin-tag-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: 'Arial', sans-serif;
    }
    
    .tag-title-create-btn {
        display: flex;
        justify-content: space-between;
        border-bottom: 0.01em solid #3498db;
        align-items: center;
        margin-bottom: 1em;
    }

    .tag-title-create-btn .tags-title {
        margin-bottom: 0;
        font-size: 2.2rem;
        color: #333;
        padding-bottom: 0.5em;
    }

    .tag-title-create-btn .create-btn {
        display: inline-flex;
        align-items: center;
        background-color: #4BACB8;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 1rem;
        transition: all 0.2s ease;
    }
    
    .tag-title-create-btn .create-btn span {
        color: #fff;
    }

    .tag-title-create-btn .create-btn:hover {
        background-color: #3A8F9A;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .tag-title-create-btn .create-btn:active {
        transform: translateY(0);
    }

    .tags-specification {
        background-color: #f8f9fa;
        border-left: 0.35em solid #3498db;
        padding: 15px;
        margin-bottom: 2.5em;
        color: #555;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: 0 4px 4px 0;
    }

    .tags-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .tags {
        background-color: #ffffff;
        border-radius: 1em;
        padding: 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        flex-direction: column;
        border: 1px solid #eaeaea;
    }

    .tags:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .question-quantity-created-time {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
        font-size: 0.85rem;
        color: #777;
    }

    .question-quantity {
        display: flex;
        align-items: center;
        color: inherit;
    }

    .created-time {
        display: flex;
        align-items: center;
        font-style: italic;
        color: inherit;
    }

    .router-link {
        font-size: 1.3rem;
        color: #3498db;
        text-decoration: none;
        font-weight: bold;
        margin-bottom: 10px;
        display: block;
        transition: color 0.2s;
    }

    .router-link:hover {
        color: #2980b9;
        text-decoration: underline;
    }

    .tags span.tag-desctiption {
        color: #666;
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 1em;
    }

    .search-sort {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2em;
        gap: 1em;
    }

    .ud-btn-container {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
        border-top: 1px solid #eaeaea;
        padding-top: 1rem;
        margin-top: auto;
    }

    .ud-btn {
        text-align: center;
        margin: 0 5px;
    }

    .ud-btn:first-child {
        margin-left: 0;
    }

    .ud-btn:last-child {
        margin-right: 0;
    }

    .ud-btn a, .edit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        padding: 8px 12px;
        border-radius: 1em;
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.2s;
        width: 100%;
    }

    .edit-btn {
        background-color: #f39c12;
        color: #fff;
    }

    .edit-btn span, i {
        color: inherit;
    }

    .edit-btn:hover {
        background-color: #e67e22;
    }

    .delete-btn {
        background-color: #e74c3c;
        color: #fff;
        cursor: pointer;
    }

    .delete-btn span, i {
        color: inherit;
    }

    .delete-btn:hover {
        background-color: #c0392b;
    }

    .icon {
        margin-right: 6px;
        font-size: 0.9rem;
    }


    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .tags {
        animation: fadeIn 0.3s ease-in-out;
    }

    .tags:nth-child(1) { animation-delay: 0.05s; }
    .tags:nth-child(2) { animation-delay: 0.1s; }
    .tags:nth-child(3) { animation-delay: 0.15s; }
    .tags:nth-child(4) { animation-delay: 0.2s; }
    .tags:nth-child(5) { animation-delay: 0.25s; }
    .tags:nth-child(6) { animation-delay: 0.3s; }
    .tags:nth-child(7) { animation-delay: 0.35s; }
    .tags:nth-child(8) { animation-delay: 0.4s; }

    @media (max-width: 768px) {
        .tags-list {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
        
        .tags-title {
            font-size: 1.8rem;
        }
        
        .tags-specification {
            font-size: 0.9rem;
        }
        }

        @media (max-width: 480px) {
        .tags-list {
            grid-template-columns: 1fr;
        }

        .tag-title-create-btn {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .tag-title-create-btn .tags-title {
            margin-bottom: 0.5em;
        }
        
        .tag-title-create-btn .create-btn {
            font-size: 0.9rem;
            padding: 8px 16px;
        }
    }

    @media (max-width: 576px) {
        .ud-btn-container {
            flex-direction: column;
        }
        
        .ud-btn {
            margin: 5px 0;
        }
        
        .ud-btn:first-child {
            margin-top: 0;
        }
        
        .ud-btn:last-child {
            margin-bottom: 0;
        }
        
        .text {
            font-size: 0.85rem;
        }

        .question-quantity-created-time {
            flex-direction: column;
            gap: 0.25em;
        }
    }
</style>