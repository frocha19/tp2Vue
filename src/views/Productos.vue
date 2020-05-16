<template>
  <div class="productos">
    <b-container>
      <b-card>
        <div
          class="cards"
          v-for="instrumento in instrumentosData"
          :key="instrumento.id"
        >
          <instrumento-item :instrumentoParam="instrumento"></instrumento-item>
        </div>
      </b-card>
    </b-container>
  </div>
</template>
<script>
// @ is an alias to /src
import Instrumento from "@/components/Instrumento.vue";

export default {
  name: "Productos",
  components: {
    "instrumento-item": Instrumento
  },
  mounted() {
    this.getInstrumentos();
  },
  data() {
    return {
      instrumentosData: [],
      ids: []
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
      this.instrumentosData = testCollection;
    }
  }
};
</script>
