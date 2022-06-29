<template>
  <div id="app">
    <header class="pt-2 sticky-top bg-dark text-light">
      <h2>Comparatore Trasporti di Viaggioo</h2>
      Permette di confrontare automaticamente le diverse opzioni di viaggio per
      viaggi con molteplici trasporti.
      <hr />
    </header>
    <main class="m-4">
      <div v-if="setup" class="text-center">
        <h3 class="mt-4">Step 1: Configurazione trasporti</h3>
        <p>
          Inserire almeno due trasporti e per ogni trasporto le diverse opzioni
          di data e prezzo.
        </p>
        <div v-for="(step, stepIndex) of steps" :key="stepIndex">
          <!-- Using value -->
          <b-button
            v-b-modal="'collapse-' + stepIndex"
            class="m-1 col-12 col-md-3"
            >{{ step.name }}</b-button
          >

          <!-- Element to collapse -->
          <b-modal
            :id="'collapse-' + stepIndex"
            :title="step.name"
            size="lg"
            hide-footer
            centered
          >
            <div class="p-md-4 p-2">
              <h4 class="mb-2">Nome:</h4>

              <div class="row mb-2">
                <div class="col">
                  <b-input
                    v-model="step.name"
                    :state="
                      step.name != null && step.name.trim() != '' ? true : false
                    "
                  ></b-input>
                </div>
              </div>
              <h4 class="mb-2">Opzioni:</h4>
              <div
                v-for="(option, index) of step.options"
                :key="index"
                class="row mb-1"
              >
                <div class="col">
                  <span v-if="index == 0">Data:</span>
                  <b-input
                    :state="option.date ? true : false"
                    type="date"
                    v-model="option.date"
                  ></b-input>
                </div>
                <div class="col">
                  <span v-if="index == 0">Costo:</span>

                  <div class="row">
                    <div class="col-9">
                      <b-input
                        type="number"
                        :state="option.price > 0 ? true : false"
                        min="0"
                        v-model="option.price"
                      ></b-input>
                    </div>

                    <b-button
                      class="col-3"
                      variant="danger"
                      @click="() => deleteOption(stepIndex, index)"
                    >
                      <b-icon-trash></b-icon-trash>
                    </b-button>
                  </div>
                </div>
              </div>
              <b-button
                @click="() => aggiungiOpzione(stepIndex)"
                variant="primary"
                class="mt-4"
                >Aggiungi Opzione</b-button
              >

              <b-button
                @click="() => eliminaTrasporto(stepIndex)"
                variant="danger"
                class="mt-4 ms-2"
                >Elimina Trasporto</b-button
              >
            </div>
          </b-modal>
          <div v-if="stepIndex != steps.length - 1">
            <b-icon-arrow-down></b-icon-arrow-down>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-3">
            <hr />
            <b-input-group append="Durata Massima (Giorni)">
              <b-form-input v-model="max"></b-form-input>
            </b-input-group>
          </div>
        </div>

        <div class="row justify-content-center mt-2">
          <div class="col-md-3">
            <b-input-group class="mb-2">
              <b-input-group-prepend is-text>
                <b-form-checkbox
                  type="checkbox"
                  v-model="same_day"
                ></b-form-checkbox>
              </b-input-group-prepend>
              <b-form-input
                readonly
                value="Ammetti trasporti nello stesso giorno"
              ></b-form-input>
            </b-input-group>
            <hr />
          </div>
        </div>
        <div class="row justify-content-center">
          <b-button
            variant="primary"
            class="m-2 p-2 col-md-3"
            @click="() => aggiungiTrasporto()"
          >
            Aggiungi Trasporto</b-button
          >
        </div>
        <div class="row justify-content-center">
          <b-button
            variant="success"
            class="m-2 p-2 col-md-3"
            :disabled="steps.length < 2"
            size="lg"
            @click="confermaTrasporti"
          >
            Conferma
          </b-button>
          <small v-if="steps.length < 2">
            Sono necessarie almeno due trasporti
          </small>
        </div>
      </div>
      <div v-else>
        <b-button @click="setup = true" class="mt-4"
          >&larr; Torna alla Configurazione</b-button
        >
        <h3 class="mt-4">Step 2: Analisi</h3>
        Seleziona dalla lista il tipo di percorso desiderato

        <v-select
          @input="sort"
          :options="options"
          :reduce="(value) => value.option"
        ></v-select>

        <Table :items="formattedCombinations" />
      </div>
    </main>
  </div>
</template>

<script>
import Table from "./components/Table.vue";
import { Comparator, SORT_OPTION } from "./services/comparator";

export default {
  name: "App",
  data() {
    return {
      setup: true,
      comparator: null,
      max: 20,
      same_day: false,
      steps: [
        {
          name: "Volo Milano => Marraketch",
          options: [
            {
              date: "2022-08-15",
              price: 73,
            },
            {
              date: "2022-08-17",
              price: 68,
            },
            {
              date: "2022-08-18",
              price: 51,
            },
            {
              date: "2022-08-19",
              price: 46,
            },
            {
              date: "2022-08-20",
              price: 70,
            },
            {
              date: "2022-08-21",
              price: 36,
            },
            {
              date: "2022-08-22",
              price: 25,
            },
            {
              date: "2022-08-23",
              price: 25,
            },
            {
              date: "2022-08-24",
              price: 24,
            },
          ],
        },
        {
          name: "Volo Marraketch => Valencia",
          options: [
            {
              date: "2022-08-23",
              price: 112,
            },
            {
              date: "2022-08-26",
              price: 149,
            },
            {
              date: "2022-08-27",
              price: 172,
            },
            {
              date: "2022-08-28",
              price: 148,
            },
            {
              date: "2022-08-30",
              price: 130,
            },
          ],
        },
        {
          name: "Volo Valencia => Milano",
          options: [
            {
              date: "2022-08-30",
              price: 107,
            },
            {
              date: "2022-08-31",
              price: 93,
            },
            {
              date: "2022-09-01",
              price: 82,
            },
            {
              date: "2022-09-02",
              price: 86,
            },
          ],
        },
      ],
    };
  },
  components: {
    Table,
  },
  created() {},
  computed: {
    combinations() {
      return this.comparator.combinations;
    },
    formattedCombinations() {
      return this.combinations.map((combination) => {
        let obj = {};
        combination.forEach((value, index) => {
          let stepName = this.comparator.steps[index].name;
          obj[stepName] = value.date + "  (" + value.price + "€)";
        });

        obj["Prezzo"] = this.comparator.getCombinationPrice(combination) + "€";
        obj["Durata"] =
          this.comparator.getCombinationDays(combination) + " Giorni";

        return obj;
      });
    },
    options() {
      return [
        { label: "Il più costoso", option: SORT_OPTION.expensive },
        { label: "Il meno costoso", option: SORT_OPTION.cheapest },
        { label: "Il più lungo", option: SORT_OPTION.longest },
        { label: "Il più corto", option: SORT_OPTION.shortest },
        {
          label: "Il più lungo e meno costoso",
          option: SORT_OPTION.longestCheapest,
        },
        {
          label: "Il più corto e meno costoso",
          option: SORT_OPTION.shortestCheapest,
        },
      ];
    },
  },
  methods: {
    sort(value) {
      console.log(value);
      this.comparator.sort(value);
    },
    aggiungiTrasporto(nome = null) {
      const step = {
        name: nome ? nome : "Trasporto " + (this.steps.length + 1),
        options: [],
      };
      this.steps.push(step);
    },
    eliminaTrasporto(stepIndex) {
      this.$bvModal
        .msgBoxConfirm(
          "Tutti i dati relativi alla trasporto andranno persi, proseguire?"
        )
        .then((value) => {
          if (value) this.steps.splice(stepIndex, 1);
        });
    },
    aggiungiOpzione(trasporto, data = null, prezzo = 0) {
      this.steps[trasporto].options.push({ date: data, price: prezzo });
    },
    confermaTrasporti() {
      this.setup = false;
      this.comparator = new Comparator(this.same_day, this.max);
      this.comparator.init(this.steps);
    },
    deleteOption(step, option) {
      this.steps[step].options.splice(option, 1);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
