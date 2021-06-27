<template>
    <form @submit.prevent="submitForm">
        <div class="form-control" :class="{ invalid: !description.isValid }">
            <label for="description">Description</label>
            <textarea id="description" rows="5" v-model="description.val" @blur="clearValidity('description')"></textarea>
            <small v-if="!description.isValid">Description must not be empty.</small>
        </div>
        <div class="form-control" :class="{ invalid: !rate.isValid }">
            <label for="rate">Hourly Rate</label>
            <input type="number" id="rate" v-model.number="rate.val" @blur="clearValidity('rate')">
            <small v-if="!rate.isValid">Rate must be grater than 0.</small>
        </div>
        <div class="form-control" :class="{ invalid: !areas.isValid }">
            <h3>Areas of Expertise</h3>
            <div>
                <input type="checkbox" id="frontend" value="frontend" v-model="areas.val" @blur="clearValidity('areas')">
                <label for="frontend">Frontend Development</label>
            </div>
            <div>
                <input type="checkbox" id="backend" value="backend" v-model="areas.val" @blur="clearValidity('areas')">
                <label for="backend">Backend Development</label>
            </div>
            <div>
                <input type="checkbox" id="career" value="career" v-model="areas.val" @blur="clearValidity('areas')">
                <label for="career">Career Advisory</label>
            </div>
            <small v-if="!areas.isValid">At least one expertise must be selected.</small>
        </div>
        <p v-if="!formIsValid">Please fix the above errors and submit again.</p>
        <base-button>Register</base-button>
    </form>
</template>

<script>
export default {
    emits: ['save-data'],
    data() {
        return {
            description: {
                val: '',
                isValid: true
            },
            rate: {
                val: null,
                isValid: true
            },
            areas: {
                val: [],
                isValid: true
            },
            formIsValid: true
        }
    },
    methods: {
        clearValidity(input) {
          this[input].isValid = true;
        },
        validateForm() {
            this.formIsValid = true;
            if(this.description.val === '') {
              this.description.isValid = false;
              this.formIsValid = false;
            }
            if(!this.rate.val || this.rate.val < 0) {
              this.rate.isValid = false;
              this.formIsValid = false;
            }
            if(this.areas.val.length === 0) {
              this.areas.isValid = false;
              this.formIsValid = false;
            }
        },
        submitForm() {
            this.validateForm();

            if(!this.formIsValid) {
              return;
            }
            
            const formData = {
                desc: this.description.val,
                rate: this.rate.val,
                areas: this.areas.val
            };

            this.$emit('save-data', formData);
        }
    },
}
</script>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid small {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>