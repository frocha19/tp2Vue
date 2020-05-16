<template>
  <div>
    <app-loading v-if="loading"></app-loading>
    <b-container v-if="!loading" class="mt-2 tarjeta animated fadeIn">
      <b-row><h1 class="mx-auto">ABM Instrumentos</h1></b-row
      ><b-row>
        <b-button-group class="mx-auto">
          <b-button v-b-modal.modal-agregar variant="primary">Agregar</b-button>
          <b-button v-b-modal.modal-editar variant="warning">Editar</b-button>
          <b-button v-b-modal.modal-eliminar variant="danger">Elimar</b-button>
          <b-modal
            id="modal-agregar"
            ref="modal"
            title="Agregar"
            @show="resetModal"
            @ok="handleOk"
          >
            <form ref="form" @submit.stop.prevent="handleSubmit">
              <b-form-group>
                <b-form-input
                  id="instrumento"
                  type="text"
                  v-model="instrumento.intrumento"
                  placeholder="Instrumento"
                  title="Ingrese el nombre del instrumento..."
                  required
                ></b-form-input>
                <b-form-input
                  id="marca"
                  type="text"
                  v-model="instrumento.marca"
                  placeholder="Marca"
                  title="Ingrese la marca del instrumento..."
                  required
                ></b-form-input>
                <b-form-input
                  id="modelo"
                  type="text"
                  v-model="instrumento.modelo"
                  placeholder="Modelo"
                  title="Ingrese el modelo del instrumento..."
                  required
                ></b-form-input>
                <b-form-input
                  id="precio"
                  type="number"
                  v-model="instrumento.precio"
                  placeholder="Precio"
                  title="Ingrese el precio del instrumento..."
                  required
                ></b-form-input>
                <b-form-input
                  id="cantidadVendida"
                  type="number"
                  v-model="instrumento.cantidadVendida"
                  placeholder="Cantidad Vendida"
                  title="Ingrese ela cantidad vendida del instrumento..."
                  required
                ></b-form-input>
                <div>
                  <b-form-input
                    id="costoEnvio"
                    type="text"
                    v-model="instrumento.costoEnvio"
                    placeholder="Costo de Envio"
                    title="Ingrese el costo del envio, si es Gratis ingrese la letra g, del instrumento..."
                    required
                  ></b-form-input>
                </div>
                <b-form-input
                  id="descripcion"
                  type="text"
                  v-model="instrumento.descripcion"
                  placeholder="Descripcion"
                  title="Ingrese la descripcion del instrumento..."
                  required
                ></b-form-input>
              </b-form-group>
            </form>
          </b-modal>
          <b-modal id="modal-editar" title="Editar"></b-modal>
          <b-modal
            id="modal-eliminar"
            title="Elimar"
          ></b-modal> </b-button-group
      ></b-row>
      <div>
        Sorting By: <b>{{ sortBy }}</b
        >, Sort Direction: <b>{{ sortDesc ? "Descending" : "Ascending" }}</b>
      </div>
      <b-table
        id="my-table"
        small
        dark
        :per-page="perPage"
        :current-page="currentPage"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :fields="fields"
        :items="instrumentosData"
      >
        <b-tr>
          <b-th colspan="2"><span class="sr-only">acc</span></b-th>
        </b-tr>
      </b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination
    ></b-container>
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
    this.getInstrumentos();
  },
  data() {
    return {
      title: "",
      sortBy: "id",
      sortDesc: false,
      fields: [
        { key: "id", sortable: true },
        { key: "precio", sortable: true },
        { key: "marca", sortable: true },
        { key: "modelo", sortable: true },
        { key: "cantidadVendida", sortable: true },
        { key: "costoEnvio", sortable: true },
        { key: "descripcion", sortable: true },
        { key: "instrumento", sortable: true }
      ],
      perPage: 5,
      currentPage: 1,
      instrumentosData: [],
      ids: [],
      loading: true,
      instrumento: {
        id: "",
        instrumento: "",
        marca: "",
        modelo: "",
        imagen: "",
        precio: 0,
        costoEnvio: "",
        cantidadVendida: "",
        descripcion: ""
      }
    };
  },
  methods: {
    // checkFormValidity() {
    //   const valid = this.$refs.form.checkValidity();
    //   return valid;
    // },
    resetModal() {
      this.instrumento = {};
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    async handleSubmit() {
      let valor = 0;
      // Exit when the form isn't valid
      //   if (!this.checkFormValidity()) {
      //     return;
      //   }
      // Push the name to submitted names
      // Hide the modal manually
      this.instrumento.imagen = "nro1.jpg";
      this.instrumentosData.forEach(instru => {
        if (instru.id >= valor) {
          valor = instru.id;
          console.log(valor);
        }
      });
      this.instrumento.id = valor;
      await this.$firebase
        .firestore()
        .collection("instrumentosDB")
        .add(this.instrumento)
        .then(() => {
          this.$nextTick(() => {
            this.$bvModal.hide("modal-agregar");
            this.$router.go();
          });
        });
    },
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
  },
  computed: {
    rows() {
      return this.instrumentosData.length;
    }
  }
};
</script>
