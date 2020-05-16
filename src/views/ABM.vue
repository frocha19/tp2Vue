<template>
  <div>
    <app-loading v-if="loading"></app-loading>
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<style></style>

<script>
import Loading from "@/components/Loading.vue";
export default {
  name: "DetalleInstrumento",
  components: {
    "app-loading": Loading
  },
  mounted() {
    this.getInstrumentoXId();
  },
  data() {
    return {
      instrumentosData: [],
      loading: true
    };
  },
  methods: {
    async getInstrumentos() {
      const testCollection = [];
      await this.$firebase
        .firestore()
        .collection("instrumentosDB")
        .get()
        .then(data => {
          data.forEach(doc => {
            this.ids.push(doc.id);
          });
        });
      await this.ids.forEach(id => {
        this.$firebase
          .firestore()
          .collection("instrumentosDB")
          .doc(id)
          .get()
          .then(doc => testCollection.push(doc.data()));
      });
      this.loading = false;
      this.instrumentosData = testCollection;
    }
  }
};
</script>
