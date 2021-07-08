export default {
    async contactCoach(context, payload) {
        const userData = context.rootGetters.userData;
        const userId = context.rootGetters.userId;

        let newRequest = null;

        if(payload.type === 'message') {
            newRequest = {
                userEmail: userData.email,
                message: payload.message,
                type: 'message'
            };
        } else {
            newRequest = {
                userId,
                userEmail: userData.email,
                userName: userData.firstName + ' ' + userData.lastName,
                type: 'mentorship'
            };
        }

        const response = await fetch(`https://vue-http-demo-6c0d1-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`, {
            method: 'POST',
            body: JSON.stringify(newRequest)
        });
        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to send request.');
            throw error;
        }
        
        newRequest.id = responseData.name;
        newRequest.coachId = payload.coachId;
        context.commit('addRequest', newRequest);
    },
    async fetchRequests(context) {
        const coachId = context.rootGetters.userId;
        const token = context.rootGetters.token;

        const response = await fetch(`https://vue-http-demo-6c0d1-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`);
        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch request.');
            throw error;
        }

        const requests = [];
        for(const key in responseData) {
            let request = null;
            if(responseData[key].type === 'message') {
                request = {
                    id: key,
                    coachId,
                    userEmail: responseData[key].userEmail,
                    message: responseData[key].message,
                    type: responseData[key].type
                };
            } else {
                request = {
                    id: key,
                    coachId,
                    userEmail: responseData[key].userEmail,
                    userName: responseData[key].userName,
                    userId: responseData[key].userId,
                    type: responseData[key].type
                };
            }
            requests.push(request);
        }

        context.commit('setRequests', requests);
    },
    async deleteRequest(context, payload) {
        const coachId = context.rootGetters.userId;
        const token = context.rootGetters.token;
        
        const response = await fetch(`https://vue-http-demo-6c0d1-default-rtdb.firebaseio.com/requests/${coachId}/${payload.id}.json?auth=${token}`, {
            method: 'DELETE'
        });

        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to send request.');
            throw error;
        }

        context.dispatch('fetchRequests');
    }
};