let timer;

export default {
    async login(context, payload) {
        payload.mode = 'login';
        return context.dispatch('auth', payload);
    },
    async signup(context, payload) {
        payload.mode = 'signup';
        return context.dispatch('auth', payload);
    },
    async auth(context, payload) {
        const mode = payload.mode;
        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBxTDHFjp3ci3vuG55kRsguys3235jNqwM`;
        if(mode === 'signup') {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBxTDHFjp3ci3vuG55kRsguys3235jNqwM`;
        }

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            })
        });
        const responseData = await response.json();

        if(!response.ok) {
            console.log(responseData);
            let error = null;
            if(responseData.error.message === 'EMAIL_EXISTS') {
                error = new Error('Email already registered.');
            } else {
                error = new Error(responseData.message || 'Failed to autheticate. Check your login data.');
            }
            throw error;
        }

        let userData = null;
        if(mode === 'login') {
            const newResponse = await fetch(`https://vue-http-demo-6c0d1-default-rtdb.firebaseio.com/users/${responseData.localId}.json`);
            userData = await newResponse.json();
        } else {
            await fetch(`https://vue-http-demo-6c0d1-default-rtdb.firebaseio.com/users/${responseData.localId}.json?auth=${responseData.idToken}`, {
                method: 'PUT',
                body: JSON.stringify(payload.userData)
            });
            userData = payload.userData;
        }

        const expiresIn = +responseData.expiresIn * 1000;
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', expirationDate);

        timer = setTimeout(function() {
            context.dispatch('autoLogout');
        }, expiresIn);

        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId,
            userData: userData
        });
    },
    tryLogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const expiresIn = +tokenExpiration - new Date().getTime();

        if(expiresIn < 0) {
            return;
        }

        timer = setTimeout(function() {
            context.dispatch('autoLogout');
        }, expiresIn);
        
        if(token && userId) {
            context.commit('setUser', {
                token,
                userId
            });
        }
    },
    logout(context) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer);

        context.commit('setUser', {
            token: null,
            userId: null
        });
    },
    autoLogout(context) {
        context.dispatch('logout');
        context.commit('setAutoLogout');
    }
};
