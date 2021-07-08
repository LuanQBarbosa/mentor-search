<template>
    <div>
        <section>
            <base-card>
                <div class="mentor-name">
                    <h2>{{ fullName }}</h2>
                    <transition name="fade">
                        <base-button v-if="showRequestButton" @click="sendMentorshipRequest">Request Mentorshipt!</base-button>
                    </transition>
                </div>
                <h3>${{ rate }}/hour</h3>
            </base-card>
        </section>
        <section>
            <base-card>
                <base-badge v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>
                <p>{{ description }}</p>
            </base-card>
        </section>
        <section>
            <base-card v-if="!isUserCoach">
                <header>
                    <h2>Interested? Reach out now!</h2>
                    <base-button v-if="showContactButton" :to="contactLink" link>Contact</base-button>
                </header>
                <router-view v-slot="slotProps">
                    <transition name="route" mode="out-in">
                        <component :is="slotProps.Component"></component>
                    </transition>
                </router-view>
            </base-card>
            <base-card v-else-if="!isReviewSubmitted">
                <header>
                    <h2>Write a review for your Coach!</h2>
                </header>
                <form @submit.prevent="submitReview">
                    <div class="form-control">
                        <label for="rating">Rating</label>
                        <input type="number" min="1" max="5" name="rating" id="rating" v-model.number="rating">
                    </div>
                    <div class="form-control">
                        <label for="message">Review</label>
                        <textarea id="message" rows="5" v-model.trim="review"></textarea>
                    </div>
                    <p v-if="!reviewIsValid" class="errors">Please enter a non-empty review and a rating between 1 and 5.</p>
                    <div class="actions">
                        <base-button>Submit Review</base-button>
                    </div>
                </form>
            </base-card>
        </section>
        <section v-if="selectedCoach.reviewsList.length > 0">
            <base-card>
                <ul>
                    <coach-review 
                        v-for="review in selectedCoach.reviewsList"
                        :key="review.userId"
                        :userName="review.userName"
                        :rating="review.rating"
                        :reviewText="review.review"
                    ></coach-review>
                </ul>
            </base-card>
        </section>
    </div>
</template>

<script>
import CoachReview from '../../components/coaches/CoachReview.vue';

export default {
    props: ['id'],
    data() {
        return {
            selectedCoach: null,
            shouldShowButton: true,

            review: '',
            rating: 5,
            reviewIsValid: true
        };
    },
    computed: {
        fullName() {
            return this.selectedCoach.firstName + ' ' + this.selectedCoach.lastName;
        },
        areas() {
            return this.selectedCoach.areas;
        },
        rate() {
            return this.selectedCoach.hourlyRate;
        },
        description() {
            return this.selectedCoach.description;
        },
        studentsList() {
            return this.selectedCoach.studentsList;
        },
        contactLink() {
            return this.$route.path + '/contact';
        },
        showContactButton() {
            return this.$route.path.split('/').pop() !== 'contact';
        },
        isUserCoach() {
            return this.selectedCoach.studentsList.includes(this.$store.getters.userId);
        },
        showRequestButton() {
            return this.shouldShowButton && this.$store.getters.isAuthenticated && !this.isUserCoach;
        },
        userId() {
            return this.$store.getters.userId;
        },
        isReviewSubmitted() {
            return this.selectedCoach.reviewsList.some((review) => review.userId === this.userId);
        }
    },
    methods: {
        sendMentorshipRequest() {
            this.$store.dispatch('requests/contactCoach', {
                coachId: this.id,
                type: 'mentorship'
            });

            this.shouldShowButton = false;
        },
        async submitReview() {
            this.reviewIsValid = true;
            if(!this.rating || this.rating < 1 || this.rating > 5 || !this.review) {
                this.reviewIsValid = false;
                return;
            }

            const userData = this.$store.getters.userData;

            const review = {
                userName: userData.firstName + ' ' + userData.lastName,
                userId: this.userId,
                rating: this.rating,
                review: this.review
            }

            const reviewsList = this.selectedCoach.reviewsList || [];
            reviewsList.push(review);

            const data = {
                firstName: this.selectedCoach.firstName,
                lastName: this.selectedCoach.lastName,
                desc: this.selectedCoach.description,
                rate: this.selectedCoach.hourlyRate,
                areas: this.selectedCoach.areas,
                studentsList: this.selectedCoach.studentsList || [],
                reviewsList
            }

            await this.$store.dispatch('coaches/registerCoach', data);
            await this.$store.dispatch('coaches/loadCoaches', { forceRefresh: true });
        }
    },
    created() {
        this.selectedCoach = this.$store.getters['coaches/coaches'].find((coach) => coach.id === this.id);
    },
    components: {
        CoachReview
    }
}
</script>

<style scoped>
.mentor-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>