const axios = require("axios")

let history = 30

let months = {
  "1": "Jan",
  "2": "Feb",
  "3": "Mar",
  "4": "Apr",
  "5": "May",
  "6": "Jun",
  "7": "Jul",
  "8": "Aug",
  "9": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec"
}

let myClients = [
  { "consumerId": "FKXEEBAKS22ILUWEGFK2TI33RW1S45MLUMCQZ1IRA3QMTUQA", "name": "Itemize" },
  { "consumerId": "OBVXKGT02QS1IUOJFXPZCLJE5PKRENVIX1103PGSJMXDVPQK", "name": "Hands Producao E Veiculacao de Media Ltda" },
  { "consumerId": "114WKEOF1QJ3JRNJYGQA4X3BPQRZZFL4TBKO3ZX43J1NY4TN", "name": "MyFitnessPal" },
  { "consumerId": "5FVCWV5PEP2FPNAIBHO3CT4K04LWBJI5GH2F3PJ5LJQVXUEK", "name": "Viber Media Inc" },
  { "consumerId": "BJTJQAC2LSYLTLPYK501FXBZTITAORIV1WQWY013ZTMLKMGV", "name": "Atlis" },
  { "consumerId": "54J44OEAA3APGYGIVART2CZRE1QF2RJP3LWSRPFTD5H1PO11", "name": "NTENT" },
  { "consumerId": "0FPIV231TYEKPSATPGC5OXH4DSFLIYVMKASAAW1SKQUFEDTF", "name": "Conde Nast Traveler" },
  { "consumerId": "CETMZBN5OHSWVRQJGIAA1J25I01OEN535OXMOKRGJOOGBFXG", "name": "Conde Nast Amenity Map" },
  { "consumerId": "BCTFBU31G2OJGGPU5W5MSAJGPFDH2NREK3CBAC0PXJVN052G", "name": "DoorDash" },
  { "consumerId": "U5FDUJDVOQT03LJKYOVBEIRGTWVAOL4OF3O4XEQM2ZZ31Z41", "name": "DoorDash Test" },
  { "consumerId": "O3QSN5IVNMKZZGTB0U5SJ5AWF2UXN35YIVSP2G3B2VAL1OTW", "name": "Northcube - LifeCycle" },
  { "consumerId": "MMLMKZKIDZJXJTBNRLUMP4EUPQKOEJQEXOPVVKU111SBJQQM", "name": "Taxibeat" },
  { "consumerId": "AU5IZGHUUQHTQGS12FZ2WXWFEL33RVSW2DC11FVWOZMLZFDL", "name": "TaxibeatiOSPass" },
  { "consumerId": "0ULMSAMHVOBG2FSC2QO0JSTNIEVDRHN4G4QWY2LKCD503RNI", "name": "Taxibeat" },
  { "consumerId": "ZHP1O1ZIKQJAEUJDUWSUMXNP0N25EKZNR455OJV5RVSD5PTL", "name": "Postmates" },
  { "consumerId": "W1EW1GWD3A4YFOX0NWWNOUKNBDUZSQZGULNMY55P5OUAYF1Y", "name": "Full Contact" },
  { "consumerId": "O5C1I3JZWT4W5QZPNHD1X0MO5TJKKIE0AAC1EWBCRPKXJ4QC", "name": "Full Contact Beta" },
  { "consumerId": "DIXNMNZOGK4MMF2YLNK5KGEC0QGGKFLKY0WOO1VL205XM5GP", "name": "Full Contact Dev" },
  { "consumerId": "U4SZROLHEAVDDQHC04MKEYK2ML511HOFT4CZZFLS5C3GJCU2", "name": "Full Contact Alpha" },
  { "consumerId": "EGFXVQGOPN2ABTSFRBUTNAFCRWXL3NGWSBHQEOGYR2IEL0GX", "name": "Vero" },
  { "consumerId": "O4HRWENKPWQ2Q0GTVEG1P5ULRY2PO5XALRJHHNJIK5UNPGV0", "name": "Deloitte - The Wombat App" }
]

function fetchHitsForConsumers(consumers) {
  consumers.forEach((consumer) => {
    fetchHits(history, consumer)
  })
}

function fetchHits(days, consumer) {
  let consumerId = consumer.consumerId
  let consumerName = consumer.name

  let urlToFetch = `https://api.foursquare.com/v2/apps/dailystats/?v=20191202&days=${days}&consumerIds=${consumerId}&byEndpoint=true&oauth_token=DOFQSWVZGSAB5O52HSBZSBCOOTQPDOGBEEANR3DSGF5PEPV2`

  axios.get(urlToFetch).then((response) => {
    let data = response.data
    filterDailyHits(consumer, data)
  }).catch((error) => {
    console.log(error.response)
  })
}

function filterDailyHits(consumer, data) {
  const newStats = []
  let stats = data.response.stats
  let consumerInfo = stats[0]

  if (stats == undefined) {
    console.log({ consumerName, "consumerId": consumerId, "endpoints": "No stats for user" })
  }

  let dailyStats = consumerInfo.dailyStats

  if (dailyStats == undefined) {
    console.log({ consumerName, "consumerId": consumerId, "endpoints": "No stats for user" })
  }

  if (dailyStats.length != 0) {
    dailyStats.filter((stat) => {
      if (stat.totalCount > 0) {
        const newStat = {}
        const month = months[stat.date.split("-")[1].slice(1)]
        const year = stat.date.split("-")[0]
        newStat.month = `${month}-${year}`
        newStat.endpoints = stat.endpointStats
        newStats.push(newStat)
      }
    })

    const endpointsByMonth = newStats.reduce((total, stat) => {
      let month = stat.month
      let endpoints = stat.endpoints

      if (!total[month]) {
        total[month] = endpoints
      } else {
        endpoints.forEach((endpoint) => {
          total[month].push(endpoint)
        })
      }
      return total
    }, {})

    const uniqueEndpointsByMonth = Object.keys(endpointsByMonth).map((month) => {
      let stat = {}
      stat.month = month
      stat.paths = endpointsByMonth[month].reduce((total, endpoint) => {
        let path = endpoint.path
        let count = endpoint.count
        if (!total[path]) {
          total[path] = count
        } else {
          total[path] += count
        }

        return total
      }, {})

      return stat
    })

    console.log({ "name": consumer.name, "consumer_id": consumer.consumerId, "total_calls": consumerInfo.totalCount, "monthly_usage": uniqueEndpointsByMonth })

  } else {
    console.log({ "name": consumer.name, "consumer_id": consumer.consumerId, "total_calls": 0, "monthly_usage": 'No activity' })
  }
}

fetchHitsForConsumers(myClients)