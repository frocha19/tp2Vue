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
            @ok="handleDel"
          >
            <form ref="form2">
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
import Loading from "@/components/Loading.vue";
import Instrumento from "@/components/Instrumento.vue";
import InstrumentoDataService from "@/service/InstrumentoDataService.js";

export default {
  name: "DetalleInstrumento",
  components: {
    "instrumento-item": Instrumento,
    "app-loading": Loading
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
  mounted() {
    alert(
      "Arreglar el Size de la imagen, este error tira el Spring: The field file exceeds its maximum permitted size of 1048576 bytes. Y las validaciones"
    );
    this.getInstrumentos();
  },
  methods: {
    async getInstrumentos() {
      this.loading = false;
      await InstrumentoDataService.getAll()
        .then(response => {
          this.instrumentosData = response.data;
        })
        .catch(e => {
          console.log(e);
        });
      this.rellenarList();
    },
    refreshList() {
      this.getInstrumentos();
      this.currentTutorial = null;
      this.currentIndex = -1;
    },
    resetModal() {
      this.instrumento = {};
    },
    handleDel(event) {
      this.loading = true;
      event.preventDefault();
      this.handleDelete();
    },
    async handleDelete() {
      await InstrumentoDataService.delete(this.selected.id)
        .then(() => {
          alert("Registro Eliminado");
          this.$bvModal.hide("modal-eliminar");
        })
        .catch(e => {
          console.log(e);
        });
      this.$router.go();
    },
    handleOk(bvModalEvt) {
      this.loading = true;
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    async handleSubmit() {
      this.upload();
      this.instrumento.imagen = "/images/" + this.selectedFile.name;
      await InstrumentoDataService.create(this.instrumento)
        .then(() => {
          alert("Registro Agregado");
          this.$bvModal.hide("modal-agregar");
        })
        .catch(e => {
          console.log(e);
        });
      this.$router.go();
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    async upload() {
      let formData = new FormData();
      formData.append("file", this.selectedFile);
      await fetch("http://localhost:9000/api/v1/instrumento/uploadImg", {
        mode: "no-cors",
        method: "POST",
        body: formData
      })
        .then(response => {
          this.instrumento.imagen = response;
          return response;
        })
        .catch(e => {
          console.log(e);
        });
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
