<template>
    <li>
        <h3>{{ userName }}</h3>
        <h4>Rating: {{ rating }}/5</h4>
        <div>
            <p>{{ reviewText }}</p>
        </div>
    </li>
</template>

<script>
export default {
    props: ['userName', 'rating', 'reviewText']
}
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>