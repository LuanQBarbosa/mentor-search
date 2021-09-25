<template>
    <div>
        <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <header>
                    <h2>Messages Received</h2>
                </header>
                <base-spinner v-if="isLoading"></base-spinner>
                <ul v-else-if="hasRequests && !isLoading">
                    <template v-for="req in receivedRequests">
                        <request-item
                            v-if="req.type === 'message'"
                            :key="req.id"
                            :email="req.userEmail"
                            :message="req.message"
                            :type="req.type"
                            :id="req.id"
                            @isLoading="isLoading = true"
                            @finishedLoading="isLoading = false"
                        ></request-item>
                        <!-- <request-item
                            v-else
                            :key="req.id"
                            :email="req.userEmail"
                            :name="req.userName"
                            :userId="req.userId"
                            :type="req.type"
                            :id="req.id"
                            @isLoading="isLoading = true"
                            @finishedLoading="isLoading = false"
                        ></request-item> -->
                    </template>
                    <!-- <request-item
                        v-for="req in receivedRequests"
                        :key="req.id"
                        :email="req.userEmail"
                        :message="req.message"
                        :id="req.id"
                    ></request-item> -->
                </ul>
                <h3 v-else>You haven't received any messages yet!</h3>
            </base-card>
        </section>
    </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';

export default {
    data() {
        return {
            isLoading: false,
            error: null
        }
    },
    computed: {
        receivedRequests() {
            return this.$store.getters['requests/requests'];
        },
        hasRequests() {
            return this.$store.getters['requests/hasRequests'];
        }
    },
    methods: {
        async loadRequests() {
            this.isLoading = true;
            try {
                await this.$store.dispatch('requests/fetchRequests');
            } catch (error) {
                this.error = error.message || 'Something failed!';
            }
            this.isLoading = false;
        },
        handleError() {
            this.error = null;
        }
    },
    created() {
        this.loadRequests();
    },
    components: {
        RequestItem
    }
}
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>