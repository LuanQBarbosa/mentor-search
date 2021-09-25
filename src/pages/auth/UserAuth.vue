<template>
    <div>
        <base-dialog :show="!!error" title="An error ocurred" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <base-dialog :show="isLoading" title="Authenticating..." fixed>
            <base-spinner></base-spinner>
        </base-dialog>
        <base-card>
            <transition name="loginform" mode="out-in">
                <form v-if="mode === 'login'" @submit.prevent="submitForm">
                    <div class="form-control">
                        <label for="email">E-Mail</label>
                        <input v-model.trim="loginEmail" type="email" id="email">
                    </div>
                    <div class="form-control">
                        <label for="password">Password</label>
                        <input v-model.trim="loginPassword" type="password" id="password">
                    </div>
                    <p v-if="!formIsValid">Please enter a valid email and password (must be at least 6 characters long).</p>
                    <base-button>{{ submitButtonCaption }}</base-button>
                    <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchModeButtonCaption }}</base-button>
                </form>
                <form v-else-if="mode === 'signup'" @submit.prevent="submitForm">
                    <div class="form-control">
                        <label for="firstName">First Name</label>
                        <input v-model.trim="firstName" type="text" id="firstName" :class="{ 'invalid-input': !formIsValid.firstName }">
                        <small v-if="!formIsValid.firstName" class="invalid-message">Cannot be empty.</small>
                    </div>
                    <div class="form-control">
                        <label for="lastName">Last Name</label>
                        <input v-model.trim="lastName" type="text" id="lastName" :class="{ 'invalid-input': !formIsValid.lastName }">
                        <small v-if="!formIsValid.lastName" class="invalid-message">Cannot be empty.</small>
                    </div>
                    <div class="form-control">
                        <label for="date">Birth Date</label>
                        <input v-model.trim="birthDay" type="date" id="date" max="2003-12-31" :class="{ 'invalid-input': !formIsValid.birthDay }">
                        <small v-if="!formIsValid.birthDay" class="invalid-message">You must inform your birthday.</small>
                    </div>
                    <div class="form-control">
                        <label for="email">E-Mail</label>
                        <input v-model.trim="email" type="email" id="email" :class="{ 'invalid-input': !formIsValid.email }">
                        <small v-if="!formIsValid.email" class="invalid-message">Invalid email.</small>
                    </div>
                    <div class="form-control">
                        <label for="password">Password</label>
                        <small :class="{ 'invalid-message': !formIsValid.password }">Must be between 8 and 16 characters and contain at least one number.</small>
                        <input v-model.trim="password" type="password" id="password" :class="{ 'invalid-input': !formIsValid.password }">
                    </div>
                    <div class="form-control">
                        <label for="confirmPassword">Confirm Password</label>
                        <input v-model.trim="confirmPassword" type="password" id="confirmPassword" :class="{ 'invalid-input': !formIsValid.confirmPassword }">
                        <small v-if="!formIsValid.confirmPassword" class="invalid-message">Both passwords must match.</small>
                    </div>
                    <base-button>{{ submitButtonCaption }}</base-button>
                    <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchModeButtonCaption }}</base-button>
                </form>
            </transition>
        </base-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            firstName: '',
            lastName: '',
            birthDay: '',
            email: '',
            password: '',
            confirmPassword: '',
            formIsValid: {
                firstName: true,
                lastName: true,
                birthDay: true,
                email: true,
                password: true,
                confirmPassword: true
            },
            loginEmail: '',
            loginPassword: '',
            mode: 'login',
            isLoading: false,
            error: null
        };
    },
    computed: {
        submitButtonCaption() {
            if(this.mode === 'login') {
                return 'Login';
            } else {
                return 'Signup';
            }
        },
        switchModeButtonCaption() {
            if(this.mode === 'login') {
                return 'Signup instead!';
            } else {
                return 'Login instead!';
            }
        },
        today() {
            const currentDay = new Date();
            const dd = currentDay.getDate() < 10 ? '0' + currentDay.getDate() : currentDay.getDate();
            const mm = currentDay.getMonth()+1 < 10 ? '0' + (currentDay.getMonth()+1) : currentDay.getMonth()+1;
            const yyyy = currentDay.getFullYear();

            return `${yyyy}-${mm}-${dd}`;
        }
    },
    methods: {
        async submitForm() { 
            let userData = null;
            if(this.mode === 'signup') {
                this.formIsValid = {
                    firstName: true,
                    lastName: true,
                    birthDay: true,
                    email: true,
                    password: true,
                    confirmPassword: true
                };
    
                let hasInvalidInput = false;
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!this.email || !re.test(String(this.email).toLowerCase())) {
                    this.formIsValid.email = false;
                    hasInvalidInput = true;
                }
                if(this.firstName === '') {
                    this.formIsValid.firstName = false;
                    hasInvalidInput = true;
                }
                if(this.lastName === '') {
                    this.formIsValid.lastName = false;
                    hasInvalidInput = true;
                }
                if(!this.birthDay) {
                    this.formIsValid.birthDay = false;
                    hasInvalidInput = true;
                }
                if(this.password.length < 8 || this.password.length > 16 || !/\d/.test(this.password)) {
                    this.formIsValid.password = false;
                    hasInvalidInput = true;
                }
                if(this.password !== this.confirmPassword) {
                    this.formIsValid.confirmPassword = false;
                    hasInvalidInput = true;
                }
    
                if(hasInvalidInput) {
                    return;
                }

                userData = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    birthDay: this.birthDay,
                    email: this.email
                }
            }          

            const actionPayload = {
                email: this.mode === 'login' ? this.loginEmail : this.email,
                password: this.mode === 'login' ? this.loginPassword : this.password,
                userData
            }

            this.isLoading = true;
            try {
                if(this.mode === 'login') {
                    await this.$store.dispatch('login', actionPayload);
                } else {
                    await this.$store.dispatch('signup', actionPayload);
                }

                const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
                this.$router.replace(redirectUrl);
            } catch(err) {
                this.error = err.message || 'Failed to authenticate, try later.';
            }
            this.isLoading = false;
        },
        switchAuthMode() {
            if(this.mode === 'login') {
                this.mode = 'signup';
            } else {
                this.mode = 'login';
            }
        },
        handleError() {
            this.error = null;
        }
    },
}
</script>

<style scoped>
form {
  margin: 1rem;
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

.invalid-message {
    color: red
}

.invalid-input {
    border-color: red
}

.loginform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.loginform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.loginform-enter-active {
    transition: all 0.3s ease-out;
}

.loginform-leave-active {
    transition: all 0.3s ease-in;
}

.loginform-enter-to,
.loginform-leave-from {
    opacity: 1;
    transform: translateX(0);
}
</style>