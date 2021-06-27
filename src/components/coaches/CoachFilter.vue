<template>
    <base-card>
        <h2>Find Your Coach</h2>
        <div class="form-control">
            <label for="name">Name:</label>
            <input v-model.trim="filters.coachName" type="text" id="name" @input="setFilter" />
        </div>
        <span class="filter-option">
            <input type="checkbox" id="frontend" checked @change="setFilter" />
            <label for="frontend">Frontend</label>
        </span>
        <span class="filter-option">
            <input type="checkbox" id="backend" checked @change="setFilter" />
            <label for="backend">Backend</label>
        </span>
        <span class="filter-option">
            <input type="checkbox" id="career" checked @change="setFilter" />
            <label for="career">Career</label>
        </span>
    </base-card>
</template>

<script>
export default {
    emits: ['change-filter'],
    data() {
        return {
            filters: {
                frontend: true,
                backend: true,
                career: true,
                coachName: ''
            }
        }
    },
    methods: {
        setFilter(event) {
            if(event.target.id !== 'name') {
                const inputId = event.target.id;
                const isActive = event.target.checked;
                const updatedFilters = {
                    ...this.filters,
                    [inputId]: isActive 
                };
                this.filters = updatedFilters;
            }
            this.$emit('change-filter', this.filters);
        }
    },
}
</script>

<style scoped>
h2 {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.filter-option {
  margin-right: 1rem;
}

.filter-option label,
.filter-option input {
  vertical-align: middle;
}

.filter-option label {
  margin-left: 0.25rem;
}

.filter-option.active label {
  font-weight: bold;
}

.form-control {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}

.form-control label {
  font-weight: bold;
  margin-right: 0.5rem;
  display: block;
}

.form-control input {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

.form-control input:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>