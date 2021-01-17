// JS is injected through this script element
// I don't know if there's a more elegant method
const script = document.createElement('script')
script.type = 'text/javascript'

// This is how many minutes the window will be up starting when the boat begins boarding
// The last boat ends around :40-:42
const WINDOW_LENGTH = 45

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

const OCEAN_FISHING_ZONE = {
  _id: 999999,
  name_en: 'Ocean Fishing',
  name_ja: 'オーシャンフィッシング',
  name_de: 'Auf großer Fahrt',
  name_fr: 'Pêche en mer',
  name_ko: '바다 낚시' // I used Google Translate here
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
  map_coords: [21.5, 21.5, 2500]
}, {
  _id: 240,
  name_en: 'Southern Merlthor Spectral Current',
  name_ja: 'メルトール海峡南：幻海流',
  name_de: 'Merlthorstraße (Süd) - Phantomströmung',
  name_fr: 'Courant spectral (détroit sud de Merlthor)',
  name_ko: '멜토르 해협 남쪽: 환해류',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 240,
  map_coords: [21.5, 21.5, 2500]
}, {
  _id: 244,
  name_en: 'Northern Merlthor Spectral Current',
  name_ja: 'メルトール海峡北：幻海流',
  name_de: 'Merlthorstraße (Nord) - Phantomströmung',
  name_fr: 'Courant spectral (détroit nord de Merlthor)',
  name_ko: '멜토르 해협 북쪽: 환해류',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 244,
  map_coords: [21.5, 21.5, 2500]
}, {
  _id: 242,
  name_en: 'Rhotano Spectral Current',
  name_ja: 'ロータノ海沖合：幻海流',
  name_de: 'Rhotano-See - Phantomströmung',
  name_fr: 'Courant spectral (large de la mer de Rhotano)',
  name_ko: '로타노 해 먼바다: 환해류',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 242,
  map_coords: [21.5, 21.5, 2500]
}, {
  _id: 247,
  name_en: 'Cieldalaes Spectral Current',
  name_ja: 'シェルダレー諸島沖合：幻海流',
  name_de: 'Cieldaläen - Phantomströmung',
  name_fr: 'Courant spectral (large des îles de Cieldalaes)',
  name_ko: 'Cieldalaes Spectral Current',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 247,
  map_coords: [21.5, 21.5, 2500]
}, {
  _id: 249,
  name_en: 'Bloodbrine Spectral Current',
  name_ja: '緋汐海沖合：幻海流',
  name_de: 'Schwerblütiges Meer - Phantomströmung',
  name_fr: 'Courant spectral (large de la mer Pourpre)',
  name_ko: 'Bloodbrine Spectral Current',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 249,
  map_coords: [21.5, 21.5, 2500]
}, {
  _id: 251,
  name_en: 'Rothlyt Spectral Current',
  name_ja: 'ロズリト湾沖合：幻海流',
  name_de: 'Rothlyt-Meerbusen - Phantomströmung',
  name_fr: 'Courant spectral (large du golfe de Rothlyt)',
  name_ko: 'Rothlyt Spectral Current',
  territory_id: OCEAN_FISHING_ZONE._id,
  placename_id: 251,
  map_coords: [21.5, 21.5, 2500]
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
  __requirement__: 'Night',
  __pfnUrl__: 'https://ffxiv.pf-n.co/ocean-fishing?filter=sothis'
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
  predators: {'29758': 2},
  tug: 'heavy',
  __isBlueFish__: true,
  __routes__: ['NS', 'RD'],
  __requirement__: 'Night',
  __pfnUrl__: 'https://ffxiv.pf-n.co/ocean-fishing?filter=coral_manta'
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
  __routes__: ['BS', 'ND'],
  __requirement__: 'Day',
  __pfnUrl__: 'https://ffxiv.pf-n.co/ocean-fishing?filter=elasmosaurus'
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
  __routes__: ['RS', 'TN'],
  __requirement__: 'Sunset',
  __pfnUrl__: 'https://ffxiv.pf-n.co/ocean-fishing?filter=stonescale'
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
  __routes__: ['BS', 'TS'],
  __requirement__: 'Night',
  __pfnUrl__: 'https://ffxiv.pf-n.co/ocean-fishing?filter=hafgufa'
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
  __routes__: ['BD'],
  __requirement__: 'Day',
  __pfnUrl__: 'https://ffxiv.pf-n.co/ocean-fishing?filter=seafaring_toad'
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
  __routes__: ['TS'],
  __requirement__: 'Sunset',
  __pfnUrl__: 'https://ffxiv.pf-n.co/ocean-fishing?filter=placodus'
}].map(fillFishData)

script.innerHTML = `
;(() => {
  const _45MIN = 2700000
  const EORZEAN_RATIO = 1440 / 70

  function toET (date) { return new Date(Math.floor(date.getTime() * EORZEAN_RATIO)) }
  function fromET (date) { return new Date(Math.floor(date.getTime() / EORZEAN_RATIO)) }

  const PATTERN = ['BD', 'TD', 'ND', 'RD', 'BS', 'TS', 'NS', 'BN', 'TN', 'NN', 'RN', 'BD', 'TD', 'ND', 'RD', 'BS', 'TS', 'NS', 'RS', 'TN', 'NN', 'RN', 'BD', 'TD', 'ND', 'RD', 'BS', 'TS', 'NS', 'RS', 'BN', 'NN', 'RN', 'BD', 'TD', 'ND', 'RD', 'BS', 'TS', 'NS', 'RS', 'BN', 'TN', 'RN', 'BD', 'TD', 'ND', 'RD', 'BS', 'TS', 'NS', 'RS', 'BN', 'TN', 'NN', 'BD', 'TD', 'ND', 'RD', 'BS', 'TS', 'NS', 'RS', 'BN', 'TN', 'NN', 'RN', 'TD', 'ND', 'RD', 'BS', 'TS', 'NS', 'RS', 'BN', 'TN', 'NN', 'RN', 'BD', 'ND', 'RD', 'BS', 'TS', 'NS', 'RS', 'BN', 'TN', 'NN', 'RN', 'BD', 'TD', 'RD', 'BS', 'TS', 'NS', 'RS', 'BN', 'TN', 'NN', 'RN', 'BD', 'TD', 'ND', 'BS', 'TS', 'NS', 'RS', 'BN', 'TN', 'NN', 'RN', 'BD', 'TD', 'ND', 'RD', 'TS', 'NS', 'RS', 'BN', 'TN', 'NN', 'RN', 'BD', 'TD', 'ND', 'RD', 'BS', 'NS', 'RS', 'BN', 'TN', 'NN', 'RN', 'BD', 'TD', 'ND', 'RD', 'BS', 'TS', 'RS', 'BN', 'TN', 'NN', 'RN']

  function calculateVoyages (date, count, filter) {
    const startIndex = Math.floor((date.getTime() - _45MIN) / 7200000)
    const results = []
    for (let i = 0; results.length < count; ++i) {
      const destinationCode = PATTERN[(startIndex + i) % 144]
      if (!filter || filter.includes(destinationCode)) {
        results.push({
          time: new Date((startIndex + i + 1) * 7200000),
          destinationCode
        })
      }
    }
    return results
  }

  function createBlueFish (fishData) {
    const fish = new Fish(fishData)
    if (fishData.__isBlueFish__) {
      fish.alwaysAvailable = false
      fish.isFishAlwaysUpUsingFishEyes = () => false
      fish.uptime = () => ${WINDOW_LENGTH} * fishData.__routes__.length / 1440
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
      const range = moment(startTime).twix(new Date(startTime.getTime() + Math.floor(${WINDOW_LENGTH * 60000} * EORZEAN_RATIO)))
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
    DATA.WEATHER_RATES[oceanFishingLocation.territory_id] = {
      zone_id: OCEAN_FISHING_ZONE._id,
      map_id: OCEAN_FISHING_ZONE._id,
      map_scale: 100 // Idk how these work, but map_scale: 100 with coords: [21.5, 21.5, 2500] looks good for this map
    }
  }
  FishingSpotMap.mapUrls[OCEAN_FISHING_ZONE._id] = 'https://xivapi.com/m/o1a1/o1a1.00.jpg'

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

  // Modify the fish template to display the route required for blue fish
  const templateScript = document.getElementById('fish-template')
  const newTemplateString = $(templateScript).text()
    .replace(
      /{{\\?[^{}]*?}}\\s*All Day\\s*{{\\?\\?}}[\\s\\S]*?{{\\?}}/,
      \`
        {{? it.data.__isBlueFish__ }}
          {{=it.data.__requirement__}}
        {{?? it.data.startHour === 0 && it.data.endHour === 24}}
          All Day
        {{??}}
          {{=it.data.startHour + ' - ' + it.data.endHour}}
        {{?}}
      \`
    )
    .replace(
      /{{\\?\\s*?it\\.data\\.conditions\\.previousWeatherSet.*?}}/,
      m => {console.log(m); return \`
        {{? it.data.__isBlueFish__ }}
          <a href="{{=it.data.__pfnUrl__}}" target="_blank">pf-n.co</a>
        {{?}}
      \` + m}
    )

  ViewModel.layout.templates.fishEntry = doT.template(newTemplateString)
})()
`

document.body.appendChild(script)
