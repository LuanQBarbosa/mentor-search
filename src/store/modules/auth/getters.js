export default {
    userId(state) {
        return state.userId;
    },
    token(state) {
        return state.token;
    },
    userData(state) {
        return state.userData;
    },
    isAuthenticated(state) {
        return !!state.token;
    },
    didAutoLogout(state) {
        return state.didAutoLogout;
    }
};
