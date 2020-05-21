<template
  ><div>
    <app-loading v-if="loading"></app-loading>
    <b-container v-if="!loading" class="mt-5 tarjeta animated fadeIn">
      <b-row>
        <b-col class="mt-2">
          <img :src="instrumentoEncontrado.imagen" width="80%" height="80%" />
        </b-col>
        <b-col class="mt-2">
          <b-row>
            <h6>{{ instrumentoEncontrado.cantidadVendida }} vendidos</h6>
          </b-row>
          <b-row>
            <h1>{{ instrumentoEncontrado.instrumento }}</h1>
          </b-row>
          <b-row>
            <h2>$ {{ instrumentoEncontrado.precio }}</h2>
          </b-row>
          <b-row>
            <h4>Marca: {{ instrumentoEncontrado.marca }}</h4>
          </b-row>
          <b-row>
            <h4>Modelo: {{ instrumentoEncontrado.modelo }}</h4>
          </b-row>
          <b-row>
            <div v-if="instrumentoEncontrado.costoEnvio == 'G'">
              <img :src="'/images/camion.png'" width="12%" class="mb-1" />
              <span class="envioGratis">Envío gratis a todo el país</span>
            </div>
            <div v-else>
              <h4 class="envioPago">
                Costo de Envio Interior de Argentina: ${{
                  instrumentoEncontrado.costoEnvio
                }}
              </h4>
            </div>
          </b-row>
        </b-col>
        <b-row class="ml-5 mr-5">
          <h4>Descripción: {{ instrumentoEncontrado.descripcion }}</h4>
        </b-row>
      </b-row>
      <b-row>
        <b-button class="mx-auto" href="/productos" variant="outline-primary">Volver</b-button>
      </b-row>
    </b-container>
  </div>
</template>
<style>
.envioGratis {
  color: green;
}
.envioPago {
  color: orange;
}
.tarjeta {
  background-color: cyan;
  border-radius: 20px;
}
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
      instrumentoEncontrado: [],
      loading: true
    };
  },
  /*methods: {
    async getInstrumentoXId() {
      let parametro = [];
      await this.$firebase
        .firestore()
        .collection("instrumentosDB")
        .where("id", "==", this.$route.params.id)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(doc => (parametro = doc.data()));
        });
      this.loading = false;
      this.instrumentoEncontrado = parametro;
    }
  }*/
};
</script>