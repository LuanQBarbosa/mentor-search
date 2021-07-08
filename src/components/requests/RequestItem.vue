<template>
    <li v-if="type === 'message'">
        <div>
            <a :href="emailLink">{{ email }}</a>
        </div>
        <p>{{ message }}</p>
        <div class="button-div">
          <base-button mode="danger" @click="deleteRequest">DELETE</base-button>
        </div>
    </li>
    <li v-else>
        <div>
            <h3>{{ name }} wants to become your student!</h3>
            <a :href="emailLink">{{ email }}</a>
        </div>
        <div class="button-div">
          <base-button mode="success" @click="acceptStudent">ACCEPT</base-button>
          <base-button mode="danger" @click="deleteRequest">DECLINE</base-button>
        </div>
    </li>
</template>

<script>
import BaseButton from '../ui/BaseButton.vue';
export default {
	components: { BaseButton },
    props: ['email', 'message', 'id', 'name', 'userId', 'type'],
    computed: {
        emailLink() {
            return 'mailto:' + this.email;
        },
        coachData() {
          const userId = this.$store.getters.userId;
          const coaches = this.$store.getters['coaches/coaches'];

          return coaches.find((coach) => coach.id === userId);
        }
    },
    methods: {
        async deleteRequest() {
            this.$emit('isLoading');
            try {
                await this.$store.dispatch('requests/deleteRequest', { id: this.id });
            } catch (error) {
                this.error = error.message || 'Something failed!';
            }
            setTimeout(() => this.$emit('finishedLoading'), 2000)
            // this.$emit('finishedLoading');
        },
        async acceptStudent() {
            const studentsList = this.coachData.studentsList || [];
            studentsList.push(this.userId);

            const data = {
                desc: this.coachData.description,
                rate: this.coachData.hourlyRate,
                areas: this.coachData.areas,
                studentsList,
                reviewsList: this.coachData.reviewsList || []
            }

            await this.$store.dispatch('coaches/registerCoach', data);
            await this.$store.dispatch('coaches/loadCoaches', { forceRefresh: true });

            this.deleteRequest();
        }
    },
}
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #ccc;
  padding: 1rem;
}

a {
  color: #3d008d;
  text-decoration: none;
  font-weight: bold;
}

a:hover,
a:active {
  color: #8d007a;
}

p {
  margin: 0.5rem 0 0 0;
}

.button-div {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
}
</style>