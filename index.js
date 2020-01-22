const axios = require("axios")

let history = 30

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

function fetchHitsForMultipleIds(consumers) {
  consumers.forEach((consumer) => {
    fetchDailyHits(history, consumer)
  })
}

function fetchDailyHits(days, consumer) {
  let consumerId = consumer.consumerId
  let consumerName = consumer.name

  let urlToFetch = `https://api.foursquare.com/v2/apps/dailystats/?v=20191202&days=${days}&consumerIds=${consumerId}&byEndpoint=true&oauth_token=DOFQSWVZGSAB5O52HSBZSBCOOTQPDOGBEEANR3DSGF5PEPV2`

  try {
    axios.get(urlToFetch).then((response) => {
      let data = response.data
      let stats = data.response.stats

      if (stats === undefined) {
        console.log({ consumerName, "consumerId": consumerId, "endpoints": "No stats for user" })
      }

      let dailyStats = stats[0].dailyStats

      filterDailyHits(consumer, dailyStats)
    })

  } catch (error) {

    console.log(error)
  }
}

function filterDailyHits(consumer, data) {
  const filteredStats = []

  if (data.length != 0) {
    data.filter((stat) => {
      if (stat.totalCount > 0) {
        filteredStats.push(stat)
      }
    })
    // reduce endpoints
    const totalEndpoints = filteredStats.reduce((total, stat) => {
      stat.endpointStats.forEach((endpoint) => {
        total.push(endpoint)
      })
      return total
    }, [])

    const uniqueEndpoints = totalEndpoints.reduce((total, endpoint) => {
      let path = endpoint.path
      if (!total[path]) {
        total[path] = endpoint.count
      } else {
        total[path] += endpoint.count
      }
      return total
    }, {})

    console.log({
      "name": consumer.name, "consumerId": consumer.consumerId, "endpoints": uniqueEndpoints
    })

  } else {

    console.log({ "name": consumer.name, "consumerId": consumer.consumerId, "endpoints": `No activity` })
  }
}

fetchHitsForMultipleIds(myClients)
// fetchDailyHits(30, "5FVCWV5PEP2FPNAIBHO3CT4K04LWBJI5GH2F3PJ5LJQVXUEK")
