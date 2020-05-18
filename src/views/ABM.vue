<template>
  <div>
    <app-loading v-if="loading"></app-loading>
    <b-container v-if="!loading" class="mt-2 tarjeta animated fadeIn">
      <b-row><h1 class="mx-auto">ABM Instrumentos</h1></b-row
      ><b-row>
        <b-button-group class="mx-auto">
          <b-button v-b-modal.modal-agregar variant="primary">Agregar</b-button>
          <b-button v-b-modal.modal-editar variant="warning">Editar</b-button>
          <b-button v-b-modal.modal-eliminar variant="danger"
            >Eliminar</b-button
          >
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
                  v-model="instrumento.instrumento"
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
                <div id="image">
                  <input type="file" @change="onFileSelected" required />
                </div>
              </b-form-group>
            </form>
          </b-modal>
          <b-modal id="modal-editar" title="Editar"></b-modal>
          <b-modal
            size="xl"
            id="modal-eliminar"
            title="Eliminar"
            @show="resetModal"
          >
            <form ref="form2" @click="handleDel">
              <b-form-select
                v-model="selected"
                :options="options"
              ></b-form-select>
              <div class="miniCard">
                <instrumento-item
                  v-if="selected != null"
                  :instrumentoParam="selected"
                ></instrumento-item>
              </div>
            </form>
          </b-modal> </b-button-group
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

<style>
.minicard {
  width: 80%;
  margin: 0 auto;
}
</style>

<script>
import firebase from "firebase";
import Loading from "@/components/Loading.vue";
import Instrumento from "@/components/Instrumento.vue";
export default {
  name: "DetalleInstrumento",
  components: {
    "instrumento-item": Instrumento,
    "app-loading": Loading
  },
  mounted() {
    this.getInstrumentos();
  },
  data() {
    return {
      selected: null,
      options: [{ value: null, text: "Please select an option" }],
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
      },
      selectedFile: null,
      UploadValue: 0,
      picture: null
    };
  },
  methods: {
    resetModal() {
      this.instrumento = {};
    },
    handleDel(event) {
      event.preventDefault();
      this.handleDelete();
    },
    async handleDelete() {
      console.log(this.selected);
      await this.$firebase
        .firestore()
        .collection("instrumentosDB")
        .where("id", "==", this.selected.id)
        .delete()
        .then(function() {
          console.info("Registro borrado...");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    handleOk(bvModalEvt) {
      this.loading = true;
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    async handleSubmit() {
      let valor = 0;
      this.instrumentosData.forEach(instru => {
        if (instru.id >= valor) {
          valor = instru.id;
        }
      });
      this.instrumento.id = valor + 1;
      this.instrumento.imagen = `nro${this.instrumento.id}.png`;
      await this.onUpload(this.instrumento.id);
      await this.$firebase
        .firestore()
        .collection("instrumentosDB")
        .add(this.instrumento)
        .then(() => {
          this.$nextTick(() => {
            this.$bvModal.hide("modal-agregar");
          });
        });
      setTimeout(() => this.$router.go(), 4000);
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
      this.instrumentosData = testCollection;
      setTimeout(() => this.rellenarList(), 1500);
      this.loading = false;
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    async onUpload(valorId) {
      const storageRef = firebase.storage().ref(`/images/nro${valorId}.png`);
      const task = storageRef.put(this.selectedFile);
      task.on(
        "state_changed",
        snapshot => {
          let percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.UploadValue = percentage;
        },
        error => console.log(error.message),
        () => {
          this.UploadValue = 100;
          task.snapshot.ref.getDownloadURL().then(url => {
            console.log(url);
          });
        }
      );
    },
    rellenarList() {
      this.instrumentosData.forEach(data => {
        data.disabled = true;
        this.options.push({ ["text"]: data.instrumento, ["value"]: data });
      });
    }
  },
  computed: {
    rows() {
      return this.instrumentosData.length;
    }
  }
};
</script>
