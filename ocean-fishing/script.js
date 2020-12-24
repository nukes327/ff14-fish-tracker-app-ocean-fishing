const script = document.createElement('script')
script.type = 'text/javascript'

const newBaits = {
  ragworm: {
    "_id": 999901,
    "name_en": "Ragworm",
    "name_ja": "Ragworm",
    "name_de": "Ragworm",
    "name_fr": "Ragworm",
    "name_ko": "Ragworm",
    "icon": "027004" // Blue Bobbit
  },
  krill: {
    "_id": 999902,
    "name_en": "Krill",
    "name_ja": "Krill",
    "name_de": "Krill",
    "name_fr": "Krill",
    "name_ko": "Krill",
    "icon": "027023" // Northern Krill
  },
  plumpWorm: {
    "_id": 999903,
    "name_en": "Plump Worm",
    "name_ja": "Plump Worm",
    "name_de": "Plump Worm",
    "name_fr": "Plump Worm",
    "name_ko": "Plump Worm",
    "icon": "027015" // Spoon Worm
  }
}

function fillData (fishData) {
  const obj = Object.assign({
    "_id": null,
    "previousWeatherSet": [],
    "weatherSet": [],
    "startHour": 0,
    "endHour": 24,
    "location": 999999,
    "bestCatchPath": [],
    "predators": {},
    "patch": 5.0,
    "folklore": null,
    "collectable": false,
    "fishEyes": false,
    "snagging": null,
    "hookset": "Powerful",
    "tug": "heavy",
    "gig": null,
    "aquarium": null,
    "dataMissing": null
  }, fishData)
  obj.hookset = obj.tug == "light" ? "Precision" : "Powerful"
  return obj
}

const oceanFishes = [fillData({
  // Heavenskey
  "_id": 29749,
  "bestCatchPath": [999901],
  "tug": "light"
}), fillData({
  // Navigator's Print
  "_id": 29752,
  "bestCatchPath": [999902],
  "tug": "light"
}), fillData({
  // Sothis
  "_id": 29788,
  "bestCatchPath": [2603],
  "predators": {"29749": 2, "29752": 1},
  "tug": "heavy",
  "__routes__": ["ND", "RS"],
}), fillData({
  // Hi-aetherlouse
  "_id": 29761,
  "bestCatchPath": [999903],
  "tug": "light"
}), fillData({
  // Great Grandmarlin
  "_id": 29758,
  "bestCatchPath": [999903, 29761],
  "tug": "medium"
}), fillData({
  // Coral Manta
  "_id": 29789,
  "bestCatchPath": [2613],
  "predators": {"29758": 1},
  "tug": "heavy",
  "__routes__": ["NS", "RD"]
}), fillData({
  // Gugrusaurus
  "_id": 29781,
  "bestCatchPath": [999903],
  "tug": "heavy"
}), fillData({
  // Elasmosaurus
  "_id": 29791,
  "bestCatchPath": [2619],
  "predators": {"29781": 3},
  "tug": "heavy",
  "__routes__": ["BS", "ND"]
}), fillData({
  // Deep-sea Eel
  "_id": 29769,
  "bestCatchPath": [999903],
  "tug": "medium"
}), fillData({
  // Silencer
  "_id": 29768,
  "bestCatchPath": [999901],
  "tug": "light"
}), fillData({
  // Stonescale
  "_id": 29790,
  "bestCatchPath": [2591],
  "predators": {"29769": 1, "29768": 1},
  "tug": "heavy",
  "__routes__": ["RS", "TN"]
}), fillData({
  // Jetborne Manta
  "_id": 32070,
  "bestCatchPath": [999903],
  "tug": "heavy"
}), fillData({
  // Mistbeard's Cup
  "_id": 32067,
  "bestCatchPath": [999902],
  "tug": "medium"
}), fillData({
  // Hafgufa
  "_id": 32074,
  "bestCatchPath": [27590],
  "predators": {"32070": 2, "32067": 1},
  "tug": "heavy",
  "__routes__": ["BS", "TS"]
}), fillData({
  // Beatific Vision
  "_id": 32089,
  "bestCatchPath": [999902],
  "tug": "medium"
}), fillData({
  // Seafaring Toad
  "_id": 32094,
  "bestCatchPath": [2587],
  "predators": {"32089": 3},
  "tug": "heavy",
  "__routes__": ["BD"]
}), fillData({
  // Rothlyt Mussel
  "_id": 32107,
  "bestCatchPath": [999901],
  "tug": "heavy"
}), fillData({
  // Trollfish
  "_id": 32110,
  "bestCatchPath": [999901, 32107],
  "tug": "light"
}), fillData({
  // Placodus
  "_id": 32114,
  "bestCatchPath": [999901, 32107],
  "predators": {"32110": 1},
  "tug": "heavy",
  "__routes__": ["TS"]
})]

const oceanFishing = {
  "_id": 999999,
  "name_en": "Ocean Fishing",
  "name_ja": "Ocean Fishing",
  "name_de": "Ocean Fishing",
  "name_fr": "Ocean Fishing",
  "name_ko": "Ocean Fishing",
  "territory_id": 818,
  "placename_id": 231,
  "map_coords": [37.73583984375, 7.005859375, 300]
}

script.innerHTML = `
  const _9HR = 32400000
  const LULU_EPOCH = 1593270000000 + _9HR
  const DEST_CYCLE = 'BTNR'
  const TIME_CYCLE = 'SSSSNNNNDDDD'
  const EORZEAN_RATIO = 1440 / 70

  function toET (date) {
    return new Date(Math.floor(date.getTime() * EORZEAN_RATIO))
  }

  function fromET (date) {
    return new Date(Math.floor(date.getTime() / EORZEAN_RATIO))
  }

  function calculateVoyages (date, count, filter) {
    date = new Date(date.getTime() + 32400000)
    let day = Math.floor((date.getTime() - LULU_EPOCH) / 86400000)
    let hour = date.getUTCHours()

    // Adjust time to fall on the next voyage, including any ongoing
    if (date.getUTCMinutes() < 45) {
      hour -= 1
    }
    hour += (hour & 1) ? 2 : 1
    if (hour === 0) {
      day -= 1
      hour = 24
    } else if (hour === 25) {
      day += 1
      hour = 1
    }

    // Find the current voyage
    const voyageNumber = hour >> 1
    let destIndex = (day + voyageNumber) % 4
    let timeIndex = (day + voyageNumber) % 12

    // Loop until however many voyages are found
    const upcomingVoyages = []
    while (upcomingVoyages.length < count) {
      const destinationCode = DEST_CYCLE[destIndex] + TIME_CYCLE[timeIndex]
      if (!filter || filter.includes(destinationCode)) {
        upcomingVoyages.push({ time: fromEpoch(day, hour), destinationCode })
      }
      if (hour === 23) {
        day += 1
        hour = 1
        destIndex = (destIndex + 2) % 4
        timeIndex = (timeIndex + 2) % 12
      } else {
        hour += 2
        destIndex = (destIndex + 1) % 4
        timeIndex = (timeIndex + 1) % 12
      }
    }

    return upcomingVoyages
  }

  function fromEpoch (day, hour) {
    return new Date(LULU_EPOCH + day * 86400000 + hour * 3600000 - _9HR)
  }

  function createBlueFish (fishData) {
    const fish = new Fish(fishData);
    if (!fishData.predators || Object.keys(fishData.predators).length === 0) {
      return fish;
    }

    fish.__isBlueFish__ = true;
    fish.alwaysAvailable = false;
    fish.isFishAlwaysUpUsingFishEyes = () => false;
    fish.uptime = () => 45 / 1440;

    return fish;
  }

  // Intercept the FishWatcher's range calculation thinggy
  const oldUpdateRangesForFish = fishWatcher.updateRangesForFish
  fishWatcher.updateRangesForFish = function (fish) {
    if (!fish.__isBlueFish__) {
      return oldUpdateRangesForFish.apply(fishWatcher, arguments);
    }

    let startOfWindow = null;
    let latestWindow = _(fish.catchableRanges).last();
    if (latestWindow) {
      startOfWindow = new Date(+latestWindow.end());
      startOfWindow = dateFns.utc.addHours(startOfPeriod(startOfWindow), 24); // Adding 24 bells = 70 minutes will get us out of the current window
    } else {
      startOfWindow = new Date(eorzeaTime.getCurrentEorzeaDate());
    }

    const nextWindows = calculateVoyages(fromET(startOfWindow), this.maxWindows, fish.__routes__);
    let index = 0;
    while (fish.catchableRanges.length < this.maxWindows) {
      const startTime = toET(nextWindows[index].time);
      const range = moment(startTime).twix(new Date(startTime.getTime() + Math.floor(2700000 * EORZEAN_RATIO)));
      fish.addCatchableRange(range);
      ++index;
    }
  }

  // Inject new baits
  const newBaits = ${JSON.stringify(newBaits)};
  DATA.ITEMS[newBaits.ragworm._id] = newBaits.ragworm;
  DATA.ITEMS[newBaits.krill._id] = newBaits.krill;
  DATA.ITEMS[newBaits.plumpWorm._id] = newBaits.plumpWorm;

  // Inject new fishing spot
  DATA.FISHING_SPOTS[${oceanFishing._id}] = ${JSON.stringify(oceanFishing)};

  // Inject new fish, including intuitions
  const oceanFishes = ${JSON.stringify(oceanFishes)};
  for (const fishData of oceanFishes) {
    DATA.ITEMS[fishData._id] = FISH_INFO.find(x => x.id === fishData._id);
    for (const id in fishData.predators) {
      DATA.ITEMS[id] = (DATA.ITEMS[id] || FISH_INFO.find(x => x.id === +id));
    }

    DATA.FISH[fishData._id] = fishData;
    const fish = createBlueFish(fishData);
    Fishes.push(fish);
    muxinIntuitionReqs(Fishes[Fishes.length - 1], Fishes.length - 1, Fishes);
  }
`

document.body.appendChild(script)
