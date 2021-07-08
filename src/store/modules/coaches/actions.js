export default {
    async registerCoach(context, data) {
        const userId = context.rootGetters.userId;
        const token = context.rootGetters.token;
        const userData = context.rootGetters.userData;

        const coachData = {
            firstName: data.firstName || userData.firstName,
            lastName: data.lastName || userData.lastName,
            description: data.desc,
            hourlyRate: data.rate,
            areas: data.areas,
            studentsList: data.studentsList || [],
            reviewsList: data.reviewsList || []
        };

        const response = await fetch(`https://vue-http-demo-6c0d1-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`, {
            method: 'PUT',
            body: JSON.stringify(coachData)
        });
        
        if(!response.ok) {
            // error ...
        }
        // const responseData = await response.json();

        context.commit('registerCoach', {
            id: userId,
            ...coachData
        });
    },
    async loadCoaches(context, payload) {
        if(!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }

        const response = await fetch(`https://vue-http-demo-6c0d1-default-rtdb.firebaseio.com/coaches.json`);
        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch!');
            throw error;
        }

        const coaches = [];
        for(const key in responseData) {
            const coach = {
                id: key,
                firstName: responseData[key].firstName,
                lastName: responseData[key].lastName,
                description: responseData[key].description,
                hourlyRate: responseData[key].hourlyRate,
                areas: responseData[key].areas,
                studentsList: responseData[key].studentsList || [],
                reviewsList: responseData[key].reviewsList || []
            };
            coaches.push(coach);
        }

        context.commit('setCoaches', coaches);
        context.commit('setFetchTimestamp');
    }
};
