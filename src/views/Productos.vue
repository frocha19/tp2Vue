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
      instrumentosData: []
    };
  },
  methods: {
    async getInstrumentos() {
      const ids = [
        "6FTZrSvBIkBYzgTs8Hx9",
        "7tLIgAOu51uDdJLgTxvc",
        "AOtWmAKEBXtbJmOgFJqK",
        "JG78WLYLE5dp9d7TUUZ3",
        "UDn138EcMP8dQPfwKwS8",
        "UrQL3H09ZSPOAyPyBxOc",
        "V6YHHCsrXKyCbG3PAtmC",
        "ix6eSVStBna95PvD1KyE",
        "n95rSKgEDGT2KAxjFEer",
        "nlUQPG4YxmIynP8O5Bxd"
      ];
      const testCollection = [];
      await ids.forEach(id => {
        this.$firebase
          .firestore()
          .collection("instrumentosDB")
          .doc(id)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              testCollection.push(doc.data());
              // console.log(this.instrumentosData);
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });
      });
      this.instrumentosData = testCollection;
      console.log(this.instrumentosData);
      // db.collection("instrumentosDB")
      //   .doc("nlUQPG4YxmIynP8O5Bxd")
      //   .get()
      //   .then((data) => {
      //     data.forEach((doc) => {
      //       console.log(doc.data);
      //       // this.instrumentosData.push({ [doc.id]: doc.data() });
      //     });
      //     console.log(this.instrumentosData);
      //     // this.testCollection = data;
      //   });
      // console.log(this.instrumentosData);
      // const res = await fetch("/instrumentos.json");
      // const resJson = await res.json();
      // this.instrumentosData = resJson.instrumentos;
      // this.getTodo();
    }
    // getTodo() {
    //   const db = this.$firebase.firestore();
    //   console.log(this.instrumentosData);
    //   for (let i = 0; i < this.instrumentosData.length; i++) {
    //     console.log(this.instrumentosData[i]);
    //     db.collection("instrumentosDB").add(this.instrumentosData[i]);
    //   }
    //   const db = this.$firebase.firestore();
    //   db.collection("instrumentosDB").get()
    //   .then(snap => {
    //     const testCollection = [];
    //     snap.forEach(doc => {
    //       testCollection.push({ [doc.id]: doc.data() });
    //     });
    //     this.testCollection = testCollection;
    //     console.log(testCollection);
    //   });
    // }
  }
};
</script>
