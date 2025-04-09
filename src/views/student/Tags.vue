<template>
    <div class="admin-tag-container">
        <h1 class="tags-title">Tags</h1>

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
                <router-link class="router-link" :to="{name: 'studentTagDetail', params: { id: tag._id}}">
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
            </li>
        </ul>
    </div>
</template>

<script>
    import SortBar from '@/components/SortBar.vue';
    import exportApis from '@/helpers/api/exportApis';
    import SearchBar from '@/components/SearchBar.vue';
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
            async sortChanged(sortType) {
                this.resetSearch = true;

                if (sortType === 'Newest') {
                    this.tags = await exportApis.tags.getTags();
                    this.originalTags = this.tags;
                    this.sortType = 'Newest';
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

    .tags-title {
        margin-bottom: 0.25em;
        font-size: 2.2rem;
        color: #333;
        padding-bottom: 0.5em;
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
        .question-quantity-created-time {
            flex-direction: column;
            gap: 0.25em;
        }
    }
</style>