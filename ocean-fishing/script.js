// JS is injected through this script element
// I don't know if there's a more elegant method
const script = document.createElement('script')
script.type = 'text/javascript'

// Icons will be replaced by the icons of the similar bait
const NEW_BAITS = {
  ragworm: {
    _id: 29714,
    name_en: 'Ragworm',
    name_ja: 'イワイソメ',
    name_de: 'Steinwurm',
    name_fr: 'Teigne',
    name_ko: '바위털갯지렁이',
    icon: 'Blue Bobbit'
  },
  krill: {
    _id: 29715,
    name_en: 'Krill',
    name_ja: 'クリル',
    name_de: 'Krill',
    name_fr: 'Krill',
    name_ko: '크릴',
    icon: 'Northern Krill'
  },
  plumpWorm: {
    _id: 29716,
    name_en: 'Plump Worm',
    name_ja: 'ファットワーム',
    name_de: 'Dickwurm',
    name_fr: 'Ver charnu',
    name_ko: '굵은지렁이',
    icon: 'Spoon Worm'
  }
}

// I used Google Translate here
const OCEAN_FISHING_ZONE = {
  _id: 999999,
  name_en: 'Ocean Fishing',
  name_ja: '海釣り',
  name_de: 'Hochseefischen',
  name_fr: 'Pêche en mer',
  name_ko: '바다 낚시'
}

const OCEAN_FISHING_LOCATIONS = [{
  _id: 238,
  name_en: 'Galadion Spectral Current',
  name_ja: 'ガラディオン湾沖合：幻海流',
  name_de: 'Galadion-Bucht - Phantomströmung',
  name_fr: 'Courant spectral (large de la baie de Galadion)',
  name_ko: '갈라디온 만 먼바다: 환해류',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 238,
  map_coords: [0, 0, 0]
}, {
  _id: 240,
  name_en: 'Southern Merlthor Spectral Current',
  name_ja: 'メルトール海峡南：幻海流',
  name_de: 'Merlthorstraße (Süd) - Phantomströmung',
  name_fr: 'Courant spectral (détroit sud de Merlthor)',
  name_ko: '멜토르 해협 남쪽: 환해류',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 240,
  map_coords: [0, 0, 0]
}, {
  _id: 244,
  name_en: 'Northern Merlthor Spectral Current',
  name_ja: 'メルトール海峡北：幻海流',
  name_de: 'Merlthorstraße (Nord) - Phantomströmung',
  name_fr: 'Courant spectral (détroit nord de Merlthor)',
  name_ko: '멜토르 해협 북쪽: 환해류',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 244,
  map_coords: [0, 0, 0]
}, {
  _id: 242,
  name_en: 'Rhotano Spectral Current',
  name_ja: 'ロータノ海沖合：幻海流',
  name_de: 'Rhotano-See - Phantomströmung',
  name_fr: 'Courant spectral (large de la mer de Rhotano)',
  name_ko: '로타노 해 먼바다: 환해류',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 242,
  map_coords: [0, 0, 0]
}, {
  _id: 247,
  name_en: 'Cieldalaes Spectral Current',
  name_ja: 'シェルダレー諸島沖合：幻海流',
  name_de: 'Cieldaläen - Phantomströmung',
  name_fr: 'Courant spectral (large des îles de Cieldalaes)',
  name_ko: 'Cieldalaes Spectral Current',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 247,
  map_coords: [0, 0, 0]
}, {
  _id: 249,
  name_en: 'Bloodbrine Spectral Current',
  name_ja: '緋汐海沖合：幻海流',
  name_de: 'Schwerblütiges Meer - Phantomströmung',
  name_fr: 'Courant spectral (large de la mer Pourpre)',
  name_ko: 'Bloodbrine Spectral Current',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 249,
  map_coords: [0, 0, 0]
}, {
  _id: 251,
  name_en: 'Rothlyt Spectral Current',
  name_ja: 'ロズリト湾沖合：幻海流',
  name_de: 'Rothlyt-Meerbusen - Phantomströmung',
  name_fr: 'Courant spectral (large du golfe de Rothlyt)',
  name_ko: 'Rothlyt Spectral Current',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 251,
  map_coords: [0, 0, 0]
}]

// All fish will have no time/weather conditions, but blue fish
// have the additional __isBlueFish__ and __routes__ attributes
// which will be used to calculate their windows
function fillFishData (fishData) {
  const obj = Object.assign({
    _id: null,
    previousWeatherSet: [],
    weatherSet: [],
    startHour: 0,
    endHour: 24,
    location: null,
    bestCatchPath: [],
    predators: {},
    patch: 5.2,
    folklore: null,
    collectable: false,
    fishEyes: false,
    snagging: null,
    hookset: null,
    tug: null,
    gig: null,
    aquarium: null,
    dataMissing: null
  }, fishData)
  const oceanFishingLocation = OCEAN_FISHING_LOCATIONS.find(location => location.name_en === obj.location)
  obj.location = oceanFishingLocation ? oceanFishingLocation._id : obj.location
  obj.hookset = obj.tug == 'light' ? 'Precision' : 'Powerful'

  return obj
}

const OCEAN_FISHES = [{
  // Heavenskey
  _id: 29749,
  location: 'Galadion Spectral Current',
  bestCatchPath: [29714],
  tug: 'light'
}, {
  // Navigator's Print
  _id: 29752,
  location: 'Galadion Spectral Current',
  bestCatchPath: [29715],
  tug: 'light'
}, {
  // Sothis
  _id: 29788,
  location: 'Galadion Spectral Current',
  bestCatchPath: [2603],
  predators: {'29749': 2, '29752': 1},
  tug: 'heavy',
  __isBlueFish__: true,
  __routes__: ['ND', 'RS'],
}, {
  // Hi-aetherlouse
  _id: 29761,
  location: 'Southern Merlthor Spectral Current',
  bestCatchPath: [29716],
  tug: 'light'
}, {
  // Great Grandmarlin
  _id: 29758,
  location: 'Southern Merlthor Spectral Current',
  bestCatchPath: [29716, 29761],
  tug: 'medium'
}, {
  // Coral Manta
  _id: 29789,
  location: 'Southern Merlthor Spectral Current',
  bestCatchPath: [2613],
  predators: {'29758': 1},
  tug: 'heavy',
  __isBlueFish__: true,
  __routes__: ['NS', 'RD']
}, {
  // Gugrusaurus
  _id: 29781,
  location: 'Northern Merlthor Spectral Current',
  bestCatchPath: [29716],
  tug: 'heavy'
}, {
  // Elasmosaurus
  _id: 29791,
  location: 'Northern Merlthor Spectral Current',
  bestCatchPath: [2619],
  predators: {'29781': 3},
  tug: 'heavy',
  __isBlueFish__: true,
  __routes__: ['BS', 'ND']
}, {
  // Deep-sea Eel
  _id: 29769,
  location: 'Rhotano Spectral Current',
  bestCatchPath: [29716],
  tug: 'medium'
}, {
  // Silencer
  _id: 29768,
  location: 'Rhotano Spectral Current',
  bestCatchPath: [29714],
  tug: 'light'
}, {
  // Stonescale
  _id: 29790,
  location: 'Rhotano Spectral Current',
  bestCatchPath: [2591],
  predators: {'29769': 1, '29768': 1},
  tug: 'heavy',
  __isBlueFish__: true,
  __routes__: ['RS', 'TN']
}, {
  // Jetborne Manta
  _id: 32070,
  location: 'Cieldalaes Spectral Current',
  bestCatchPath: [29716],
  patch: 5.4,
  tug: 'heavy'
}, {
  // Mistbeard's Cup
  _id: 32067,
  location: 'Cieldalaes Spectral Current',
  bestCatchPath: [29715],
  patch: 5.4,
  tug: 'medium'
}, {
  // Hafgufa
  _id: 32074,
  location: 'Cieldalaes Spectral Current',
  bestCatchPath: [27590],
  patch: 5.4,
  predators: {'32070': 2, '32067': 1},
  tug: 'heavy',
  __isBlueFish__: true,
  __routes__: ['BS', 'TS']
}, {
  // Beatific Vision
  _id: 32089,
  location: 'Bloodbrine Spectral Current',
  bestCatchPath: [29715],
  patch: 5.4,
  tug: 'medium'
}, {
  // Seafaring Toad
  _id: 32094,
  location: 'Bloodbrine Spectral Current',
  bestCatchPath: [2587],
  patch: 5.4,
  predators: {'32089': 3},
  tug: 'heavy',
  __isBlueFish__: true,
  __routes__: ['BD']
}, {
  // Rothlyt Mussel
  _id: 32107,
  location: 'Rothlyt Spectral Current',
  bestCatchPath: [29714],
  patch: 5.4,
  tug: 'heavy'
}, {
  // Trollfish
  _id: 32110,
  location: 'Rothlyt Spectral Current',
  bestCatchPath: [29714, 32107],
  patch: 5.4,
  tug: 'light'
}, {
  // Placodus
  _id: 32114,
  location: 'Rothlyt Spectral Current',
  bestCatchPath: [29714, 32107],
  patch: 5.4,
  predators: {'32110': 1},
  tug: 'heavy',
  __isBlueFish__: true,
  __routes__: ['TS']
}].map(fillFishData)

const oceanFishing = {
  _id: 999999,
  name_en: 'Ocean Fishing',
  name_ja: 'Ocean Fishing',
  name_de: 'Ocean Fishing',
  name_fr: 'Ocean Fishing',
  name_ko: 'Ocean Fishing',
  territory_id: 999999,
  placename_id: 231,
  map_coords: [0, 0, 0]
}

script.innerHTML = `
;(() => {
  const _9HR = 32400000
  const _45MIN = 2700000
  const LULU_EPOCH = 1593270000000 + _9HR
  const DEST_CYCLE = 'BTNR'
  const TIME_CYCLE = 'SSSSNNNNDDDD'
  const EORZEAN_RATIO = 1440 / 70

  function toET (date) { return new Date(Math.floor(date.getTime() * EORZEAN_RATIO)) }
  function fromET (date) { return new Date(Math.floor(date.getTime() / EORZEAN_RATIO)) }
  function fromEpoch (day, hour) { return new Date(LULU_EPOCH + day * 86400000 + hour * 3600000 - _9HR) }

  function calculateVoyages (date, count, filter) {
    date = new Date(date.getTime() + _9HR - _45MIN) // Subtract 45 minutes to catch ongoing voyages
    let day = Math.floor((date.getTime() - LULU_EPOCH) / 86400000)
    let hour = date.getUTCHours()

    hour += (hour & 1) ? 2 : 1
    if (hour > 23) {
      day += 1
      hour -= 24
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

  function createBlueFish (fishData) {
    const fish = new Fish(fishData)
    if (fishData.__isBlueFish__) {
      fish.alwaysAvailable = false
      fish.isFishAlwaysUpUsingFishEyes = () => false
      fish.uptime = () => 45 / 1440
    }
    return fish
  }

  // Intercept the FishWatcher's range calculation thinggy
  const oldUpdateRangesForFish = fishWatcher.updateRangesForFish
  fishWatcher.updateRangesForFish = function (fish) {
    if (!fish.__isBlueFish__) {
      return oldUpdateRangesForFish.apply(fishWatcher, arguments)
    }

    let startOfWindow = null
    let latestWindow = _(fish.catchableRanges).last()
    if (latestWindow) {
      startOfWindow = new Date(+latestWindow.end())
      startOfWindow = dateFns.utc.addHours(startOfPeriod(startOfWindow), 24) // Adding 24 bells = 70 minutes will get us out of the current window
    } else {
      startOfWindow = new Date(eorzeaTime.getCurrentEorzeaDate())
    }

    const nextWindows = calculateVoyages(fromET(startOfWindow), this.maxWindows, fish.__routes__)
    let index = 0
    while (fish.catchableRanges.length < this.maxWindows) {
      const startTime = toET(nextWindows[index].time)
      const range = moment(startTime).twix(new Date(startTime.getTime() + Math.floor(2700000 * EORZEAN_RATIO)))
      fish.addCatchableRange(range)
      ++index
    }
  }

  // Inject new baits and give them the correct icons
  const NEW_BAITS = ${JSON.stringify(NEW_BAITS)}
  for (const bait of Object.keys(NEW_BAITS)) {
    const baitInfo = NEW_BAITS[bait]
    baitInfo.icon = Object.values(DATA.ITEMS).find(bait => bait.name_en === baitInfo.icon).icon
    DATA.ITEMS[baitInfo._id] = baitInfo
  }

  // Inject new fishing spots
  const OCEAN_FISHING_ZONE = ${JSON.stringify(OCEAN_FISHING_ZONE)}
  DATA.ZONES[OCEAN_FISHING_ZONE._id] = OCEAN_FISHING_ZONE

  const OCEAN_FISHING_LOCATIONS = ${JSON.stringify(OCEAN_FISHING_LOCATIONS)}
  for (const oceanFishingLocation of OCEAN_FISHING_LOCATIONS) {
    DATA.FISHING_SPOTS[oceanFishingLocation._id] = oceanFishingLocation
    DATA.WEATHER_RATES[oceanFishingLocation.territory_id] = { zone_id: OCEAN_FISHING_ZONE._id }
  }

  // Inject new fish, including intuitions
  const OCEAN_FISHES = ${JSON.stringify(OCEAN_FISHES)}
  for (const fishData of OCEAN_FISHES) {
    DATA.ITEMS[fishData._id] = FISH_INFO.find(x => x.id === fishData._id)
    for (const id in fishData.predators) {
      DATA.ITEMS[id] = (DATA.ITEMS[id] || FISH_INFO.find(x => x.id === +id))
    }

    DATA.FISH[fishData._id] = fishData
    const fish = createBlueFish(fishData)
    Fishes.push(fish)
    muxinIntuitionReqs(Fishes[Fishes.length - 1], Fishes.length - 1, Fishes)
  }
})()
`

document.body.appendChild(script)
