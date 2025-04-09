<template>
    <div class="search-bar">
        <div v-if="forTag" class="icon-search-tag-bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
            type="text" 
            v-model="tagname" 
            placeholder="Filter by tag name" 
            @input="handleInputChange"
            class="search-tag-input"
            />
        </div>

        <input 
        v-if="!forTag"
        type="text" 
        v-model="displayKeyword" 
        placeholder="Search..." 
        @keyup.enter="validateAndSearch"
        @focus="isFocus = true"
        @blur="isFocus = false"
        class="search-input"
        id="search-bar-all"
        />

        <button v-if="!forTag" @click="validateAndSearch" class="search-btn">
            <i class="fa-solid fa-magnifying-glass"></i>
        </button>

        <div v-if="!forTag && isFocus" class="popover"></div>
        <div v-if="!forTag && isFocus" class="search-helper-container">
            <search-helper></search-helper>
        </div>
    </div>
</template>

<script>
    import SearchHelper from './SearchHelper.vue';

    export default {
        name: 'SearchBar',
        components: {
            'search-helper': SearchHelper
        },
        props: {
            forTag: {
                type: Boolean,
                required: true
            },
            resetSearch: {
                type: Boolean,
                required: false
            }
        },
        data() {
            return {
                keyword: '',
                tagname: '',
                type: '',
                displayKeyword: '',
                lastSearched: { keyword: '', type: '' },
                isFocus: false
            };
        },
        methods: {
            validateAndSearch() {
                this.isFocus = false;

                if (this.displayKeyword.trim()) {
                    const trimmedKeyword = this.displayKeyword.trim();
                    console.log("Search attempt with:", trimmedKeyword);
                    
                    let extractedKeyword = '';
                    let searchType = '';

                    if (trimmedKeyword.match(/^\[.*\]$/)) {
                        extractedKeyword = trimmedKeyword.slice(trimmedKeyword.indexOf('[')+1, trimmedKeyword.lastIndexOf(']')).trim();
                        searchType = 'exactTag';
                    } else if (trimmedKeyword.match(/^\(.*\)$/)) {
                        extractedKeyword = trimmedKeyword.slice(trimmedKeyword.indexOf('(')+1, trimmedKeyword.lastIndexOf(')')).trim();
                        searchType = 'relativeUser';
                    } else if (trimmedKeyword.match(/^".*"$/)) {
                        extractedKeyword = trimmedKeyword.slice(trimmedKeyword.indexOf('"')+1, trimmedKeyword.lastIndexOf('"')).trim();
                        searchType = 'exactQuestion';
                    } else {
                        extractedKeyword = trimmedKeyword;
                        searchType = 'relativeQuestion';
                    }

                    console.log("Extracted keyword:", extractedKeyword, "Type:", searchType);
                    
                    const isSameSearch = (
                        this.lastSearched.keyword === extractedKeyword && 
                        this.lastSearched.type === searchType &&
                        this.$route.query.keyword === extractedKeyword &&
                        this.$route.query.type === searchType
                    );
                    
                    if (isSameSearch) {
                        console.log('Same search detected, forcing refresh');
                        this.$emit('getKeyword', '', '');
                        setTimeout(() => {
                            this.$emit('getKeyword', extractedKeyword, searchType);
                        }, 50);
                    } else {
                        this.$emit('getKeyword', extractedKeyword, searchType);
                    }
                    
                    this.lastSearched = {
                        keyword: extractedKeyword,
                        type: searchType
                    };
                    
                    this.keyword = extractedKeyword;
                    this.type = searchType;
                }
            },
            handleInputChange() {
                setTimeout(() => {
                    this.$emit('filterTag', this.tagname.trim());
                }, 750);
            },
            formatKeywordForDisplay(keyword, type) {
                if (!keyword) return '';
                
                switch(type) {
                    case 'exactQuestion':
                        return `"${keyword}"`;
                    case 'relativeUser':
                        return `(${keyword})`;
                    case 'exactTag':
                        return `[${keyword}]`;
                    default:
                        return keyword;
                }
            },
            resetSearchState() {
                this.displayKeyword = '';
                this.keyword = '';
                this.type = '';
                this.lastSearched = { keyword: '', type: '' };
            }
        },
        created() {
            const urlKeyword = this.$route.query.keyword || this.$route.query.tagName || this.$route.query.fullname || '';
            const urlType = this.$route.query.type;
            
            if (urlKeyword) {
                this.displayKeyword = this.formatKeywordForDisplay(urlKeyword, urlType);
                this.keyword = urlKeyword;
                this.type = urlType;
                this.lastSearched = {
                    keyword: urlKeyword,
                    type: urlType
                };
            }
        },
        watch: {
            '$route': {
                handler(newRoute) {
                    console.log("Route changed:", newRoute.path);
                    
                    if (!newRoute.query.keyword && !newRoute.query.tagName && !newRoute.query.fullname) {
                        console.log("Resetting search state");
                        this.resetSearchState();
                        return;
                    }
                    
                    const keyword = newRoute.query.keyword || newRoute.query.tagName || newRoute.query.fullname || '';
                    const type = newRoute.query.type;
                    
                    if (keyword) {
                        console.log("Updating display keyword:", keyword, type);
                        this.displayKeyword = this.formatKeywordForDisplay(keyword, type);
                        this.keyword = keyword;
                        this.type = type;
                        this.lastSearched = {
                            keyword: keyword,
                            type: type
                        };
                    }
                },
                deep: true,
                immediate: true
            },
            resetSearch: {
                immediate: true,
                handler(newVal) {
                    if (newVal === true) {
                        this.tagname = '';
                    }
                }
            }
        }
    };
</script>

<style scoped>
    .search-bar {
        position: relative;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .icon-search-tag-bar {
        display: flex;
        align-items: center;
        background-color: #fff;
        color: #777;
        border: 0.1em solid #e1e1e1;
        padding: 0.15em 1em 0.15em 0.75em;
        border-radius: 0.75em;
        width: 15em;
        transition: all 0.25s ease-in-out;
    }

    .icon-search-tag-bar i {
        color: inherit;
    }

    .popover {
        position: absolute;
        top: calc(100% + 2px);
        left: 6em;
        z-index: 1000;
        width: 0;
        height: 0;
        border-left: 0.45em solid transparent;
        border-right: 0.45em solid transparent;
        border-bottom: 0.5em solid #fff;
    }

    .search-helper-container {
        position: absolute;
        top: calc(100% + 9px);
        left: 0;
        z-index: 1001;
        width: fit-content;
    }
    
    .search-input {
        padding: 0.65em 1em;
        border-radius: 1em 0 0 1em;
        box-shadow: rgba(255, 255, 255, 0.15) 1.95px 1.95px 2.6px;
        border: 0.15em solid #333;
        border-right: none;
        outline: none;
    }

    .search-input:focus {
        border: 0.15em solid #8BCAD9;
        border-right: none;
    }

    .search-tag-input {
        padding: 0.65em 1em 0.65em 0.75em;
        border-radius: 1em 1em;
        box-shadow: rgba(255, 255, 255, 0.15) 1.95px 1.95px 2.6px;
        border: 0.1em solid #fff;
        width: 100%;
        outline: none;
    }

    .icon-search-tag-bar:has(.search-tag-input:focus) {
        border: 0.1em solid #8BCAD9;
    }

    .search-btn {
        padding: 0.65em 1em 0.65em 0.9em;
        border-radius: 0 1em 1em 0;
        box-shadow: rgba(255, 255, 255, 0.15) 1.95px 1.95px 2.6px;
        border: 0.15em solid #333;
        border-left: none;
        cursor: pointer;
    }

    .search-input:focus ~ .search-btn {
        border: 0.15em solid #8BCAD9;
        border-left: none;
    }

    .search-btn:active {
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        transform: scale(0.975);
    }

    @media screen and (max-width: 450px) {
        .search-input {
            width: 12em;
        }
    }
</style>