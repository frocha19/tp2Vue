<template>
  <div>
    <app-loading v-if="loading"></app-loading>
    <div v-if="!loading" class="productos">
      <b-container>
        <b-card>
          <div
            class="cards animated fadeIn"
            v-for="instrumento in instrumentosData"
            :key="instrumento.id"
          >
            <instrumento-item
              :instrumentoParam="instrumento"
            ></instrumento-item>
          </div>
        </b-card>
      </b-container>
    </div>
  </div>
</template>

<style>
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.fast {
  -webkit-animation-duration: 0.4s;
  animation-duration: 0.4s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fadeIn {
  animation-name: fadeIn;
}
</style>

<script>
import Instrumento from "@/components/Instrumento.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "Productos",
  components: {
    "instrumento-item": Instrumento,
    "app-loading": Loading
  },
  mounted() {
    this.getInstrumentos();
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
