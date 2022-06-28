<template>
  <div>
    <b-table striped hover :items="items" stacked="md"></b-table>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: ["items"],
  data() {
    return {
      // items: [
      //   { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
      //   { age: 21, first_name: "Larsen", last_name: "Shaw" },
      //   { age: 89, first_name: "Geneva", last_name: "Wilson" },
      //   { age: 38, first_name: "Jami", last_name: "Carney" },
      // ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
