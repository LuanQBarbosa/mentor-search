export default {
    setUser(state, payload) {
        state.token = payload.token;
        state.userId = payload.userId;
        state.userData = payload.userData;
        state.didAutoLogout = false;
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
    }
};