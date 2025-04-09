<template>
    <div class="vote-btn-container">
        <button class="up-vote" @click="upvote" :class="{ active: userVote === 'up' }">
            <i class="fa-solid fa-plus"></i>
        </button>
        <div class="score">
            {{ score }}
        </div>
        <button class="down-vote" @click="downvote" :class="{ active: userVote === 'down' }">
            <i class="fa-solid fa-minus"></i>
        </button>
    </div>
</template>

<script>
import exportApis from '@/helpers/api/exportApis';
import { mapGetters } from 'vuex';

export default {
    name: 'VoteButton',
    props: {
        question: {
            type: Object,
            required: false,
            default: () => {}
        },
        answer: {
            type: Object,
            required: false,
            default: () => {}
        },
        isQuestion: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            score: 0,
            userVote: null
        }
    },
    computed: {
        ...mapGetters('auth', ['isAuthenticated']),
        targetId() {
            return this.isQuestion ? this.question._id : this.answer._id;
        },
        targetType() {
            return this.isQuestion ? 'Question' : 'Answer';
        }
    },
    methods: {
        async upvote() {
            if (!this.isAuthenticated) {
                this.$showMessage.warning('You must be logged in to vote');
                return;
            }

            try {
                const userId = this.$store.state.auth.userId;
                const userVotes = await exportApis.votes.getVotesByUserId(userId);
                const existingVote = userVotes.find(vote => 
                    vote.targetId === this.targetId && vote.targetType === this.targetType
                );

                if (existingVote) {
                    if (existingVote.vote === 'up') {
                        await exportApis.votes.deleteVote(existingVote._id);
                        this.score -= 1;
                        this.userVote = null;
                    } else {
                        await exportApis.votes.updateVote(
                            existingVote._id, 
                            userId, 
                            this.targetId, 
                            this.targetType,
                            'up'
                        );
                        this.score += 2;
                        this.userVote = 'up';
                    }
                } else {
                    await exportApis.votes.createVote(
                        userId, 
                        this.targetId,
                        this.targetType,
                        'up'
                    );
                    this.score += 1;
                    this.userVote = 'up';                    
                }
            } catch (error) {
                console.error('Error upvoting:', error);
                this.$showMessage.error('Failed to upvote. Please try again');
            }
        },
        
        async downvote() {
            if (!this.isAuthenticated) {
                this.$showMessage.warning('You must be logged in to vote');
                return;
            }

            try {
                const userId = this.$store.state.auth.userId;
                const userVotes = await exportApis.votes.getVotesByUserId(userId);
                const existingVote = userVotes.find(vote => 
                    vote.targetId === this.targetId && vote.targetType === this.targetType
                );

                if (existingVote) {
                    if (existingVote.vote === 'down') {
                        await exportApis.votes.deleteVote(existingVote._id);
                        this.score += 1;
                        this.userVote = null;
                    } else {
                        await exportApis.votes.updateVote(
                            existingVote._id, 
                            userId, 
                            this.targetId,
                            this.targetType,
                            'down'
                        );
                        this.score -= 2;
                        this.userVote = 'down';
                    }
                } else {
                    await exportApis.votes.createVote(
                        userId, 
                        this.targetId,
                        this.targetType,
                        'down'
                    );
                    this.score -= 1;
                    this.userVote = 'down';
                }
            } catch (error) {
                console.error('Error downvoting:', error);
                this.$showMessage.error('Failed to downvote. Please try again');
            }
        },
        
        async fetchScore() {
            try {
                if (this.isQuestion && this.question && this.question._id) {
                    this.score = await exportApis.votes.countVote(this.question._id);
                } else if (!this.isQuestion && this.answer && this.answer._id) {
                    this.score = await exportApis.votes.countVote(this.answer._id);
                }
            } catch (error) {
                console.error('Error fetching vote score:', error);
            }
        },
        
        async checkUserVote() {
            if (this.isAuthenticated) {
                try {
                    const userId = this.$store.state.auth.userId;
                    const userVotes = await exportApis.votes.getVotesByUserId(userId);
                    
                    const existingVote = userVotes.find(vote => 
                        vote.targetId === this.targetId && vote.targetType === this.targetType
                    );
                    
                    if (existingVote) {
                        this.userVote = existingVote.vote;
                    } else {
                        this.userVote = null;
                    }
                } catch (error) {
                    console.error('Error checking user vote:', error);
                }
            }
        }
    },
    async mounted() {
        await this.fetchScore();
        await this.checkUserVote();
    },
    watch: {
        question: {
            handler() {
                this.fetchScore();
                this.checkUserVote();
            },
            deep: true
        },
        answer: {
            handler() {
                this.fetchScore();
                this.checkUserVote();
            },
            deep: true
        }
    }
}
</script>

<style scoped>
    .vote-btn-container {
        display: flex;
        flex-direction: column;
    }

    .vote-btn-container .up-vote,
    .vote-btn-container .down-vote {
        border-radius: 50%;
        border: 0.1em solid #f0f0f0;
        padding: 0.9em 1em;
        margin-bottom: 0.55em;
        outline: none;
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 2.5px 5px;
        transition: all 0.3s ease-in-out;
    }

    .vote-btn-container .down-vote {
        margin-top: 0.6em;
    }

    .vote-btn-container .up-vote:hover,
    .vote-btn-container .down-vote:hover {
        border: 0.1em solid #8BCAD9;
        background-color: #8BCAD9;
    }

    .vote-btn-container .up-vote:active,
    .vote-btn-container .down-vote:active {
        border: 0.1em solid #555;
        box-shadow: none;
        background-color: #8BCAD9;
    }
    
    .vote-btn-container .up-vote.active,
    .vote-btn-container .down-vote.active {
        background-color: #8BCAD9;
        border: 0.1em solid #8BCAD9;
        color: white;
    }

    .vote-btn-container .score {
        font-size: 19px;
        font-weight: bold;
        text-align: center;
    }
</style>