//Prodotto cartesiano array
function cartesian(...a) {
  return a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
}

export class Comparator {
  constructor(same_day_trip = false, max_length = null) {
    this.same_day_trip = same_day_trip;
    this.max_length = max_length;
    this.steps = [];
    this.combinations = [];
    this.sorted_by = null;
    this.init();
  }

  sort(option = SORT_OPTION.cheapest) {
    this.combinations.sort(option);
    this.sorted_by = option;
  }

  clear() {
    if (this.combinations.length > 1)
      this.combinations = this.combinations.filter((combination) =>
        this.isValidCombination(combination)
      );
  }

  getCombinationPrice(combination) {
    return combination.reduce((sum, actual) => {
      console.log(actual.price);
      return (sum += parseFloat(actual.price));
    }, 0);
  }

  init(steps) {
    this.steps = steps;
    this.combinations = this.combine(this.steps);
    this.clear();
  }

  combine(arr = []) {
    if (arr.length == 0) return [];
    if (arr.length == 1) return arr[0].options;

    let stepsCombinations = [];

    let stepsCopy = Array.from(arr);
    let first = stepsCopy.shift();
    stepsCombinations = stepsCopy.reduce((combination, step) => {
      return cartesian(combination, step.options);
    }, first.options);
    return stepsCombinations;
  }

  isValidCombination(combination = []) {
    let valid = true;
    if (this.getCombinationDays(combination) > this.max_length) return false;
    if (combination.length > 1) {
      for (let i = 1; i < combination.length; i++) {
        let next = new Date(combination[i].date).getTime();
        let previous = new Date(combination[i - 1].date).getTime();
        if (!((this.same_day_trip && previous <= next) || previous < next)) {
          valid = false;
          break;
        }
      }
    }
    return valid;
  }

  getCombinationDays(combination) {
    if (combination.length < 2) return 0;
    let ms =
      new Date(combination[combination.length - 1].date).getTime() -
      new Date(combination[0].date).getTime();
    return ms / (1000 * 60 * 60 * 24);
  }
}

export const SORT_OPTION = Object.freeze({
  cheapest: (previous, actual) => {
    const previousTotal = previous.reduce((sum, act) => (sum += act.price), 0);
    const actualTotal = actual.reduce((sum, act) => (sum += act.price), 0);
    if (actualTotal > previousTotal) return -1;
    if (actualTotal < previousTotal) return 1;
    return 0;
  },
  expensive: (previous, actual) => {
    const previousTotal = previous.reduce((sum, act) => (sum += act.price), 0);
    const actualTotal = actual.reduce((sum, act) => (sum += act.price), 0);
    if (actualTotal < previousTotal) return -1;
    if (actualTotal > previousTotal) return 1;
    return 0;
  },
  longest: (previous, actual) => {
    let previousTime =
      new Date(previous[previous.length - 1].date).getTime() -
      new Date(previous[0].date).getTime();
    let actualTime =
      new Date(actual[actual.length - 1].date).getTime() -
      new Date(actual[0].date).getTime();
    if (actualTime < previousTime) return -1;
    if (actualTime > previousTime) return 1;
    return 0;
  },
  shortest: (previous, actual) => {
    let previousTime =
      new Date(previous[previous.length - 1].date).getTime() -
      new Date(previous[0].date).getTime();
    let actualTime =
      new Date(actual[actual.length - 1].date).getTime() -
      new Date(actual[0].date).getTime();

    if (actualTime > previousTime) return -1;
    if (actualTime < previousTime) return 1;
    return 0;
  },
  shortestCheapest: (previous, actual) => {
    let previousTime =
      new Date(previous[previous.length - 1].date).getTime() -
      new Date(previous[0].date).getTime();
    let actualTime =
      new Date(actual[actual.length - 1].date).getTime() -
      new Date(actual[0].date).getTime();

    if (actualTime > previousTime) return -1;
    if (actualTime < previousTime) return 1;

    //Se hanno la stessa durata scelgo il meno costoso
    const previousTotal = previous.reduce((sum, act) => (sum += act.price), 0);
    const actualTotal = actual.reduce((sum, act) => (sum += act.price), 0);
    if (actualTotal > previousTotal) return -1;
    if (actualTotal < previousTotal) return 1;
    return 0;
  },
  longestCheapest: (previous, actual) => {
    let previousTime =
      new Date(previous[previous.length - 1].date).getTime() -
      new Date(previous[0].date).getTime();
    let actualTime =
      new Date(actual[actual.length - 1].date).getTime() -
      new Date(actual[0].date).getTime();

    if (actualTime < previousTime) return -1;
    if (actualTime > previousTime) return 1;

    //Se hanno la stessa durata scelgo il meno costoso
    const previousTotal = previous.reduce((sum, act) => (sum += act.price), 0);
    const actualTotal = actual.reduce((sum, act) => (sum += act.price), 0);
    if (actualTotal > previousTotal) return -1;
    if (actualTotal < previousTotal) return 1;
    return 0;
  },
});
