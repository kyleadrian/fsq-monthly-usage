const axios = require("axios")

const days = [{
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
  "12": "Dec",
}]

function fetchDailyHits(days, consumerIds) {
  let urlToFetch = `https://api.foursquare.com/v2/apps/dailystats/?v=20191202&days=${days}&consumerIds=${consumerIds}&byEndpoint=true&oauth_token=DOFQSWVZGSAB5O52HSBZSBCOOTQPDOGBEEANR3DSGF5PEPV2`

  axios.get(urlToFetch).then((response) => {
    let data = response.data
    let aggStats = data.response.aggregatedStats
    console.log(data)
    let stats = data.response.stats
    let dailyStats = stats[0].dailyStats

    filterDailyHits(dailyStats)

    console.log(dailyStats)
  })
}

function filterDailyHits(stats) {
  const dateAndEndpoints = []

  if (stats.length != 0) {
    stats.filter((stat) => {
      let endpoints = stat.endpointStats
      if (stat.totalCount > 0) {
        const dailyEndpoint = {
          "date": stat.date,
          "endpoints": endpoints
        }
        dateAndEndpoints.push(dailyEndpoint)
      }
    })

    console.log(dateAndEndpoints)
  } else {
    console.log("No records")
  }

  const firstReductionToEndpoints = reduceToMonthlyAgg(dateAndEndpoints)
  const secondReduction = reduceData(firstReductionToEndpoints)
  console.log(secondReduction)
}

function reduceToMonthlyAgg(stats) {
  // 1. Reduce to endpoints
  const endpoints = stats.reduce((total, stat) => {
    stat.endpoints.forEach((endpoint) => {
      total.push(endpoint)
    })
    return total
  }, [])

  return endpoints
}

function reduceData(data) {
  const reduction = data.reduce((total, dataPoint) => {
    let path = dataPoint.path

    if (!total[path]) {
      total[path] = dataPoint.count
    } else {
      total[path] += dataPoint.count
    }

    return total
  }, {})

  return reduction
}

fetchDailyHits(31, "EJSNJHR22OGG3BYSNDAPDELV1OWKFABVIDDA4Y4FWJEV3DWL")

let object = {
  key: "XXXX",
  info: [
    {
      month: "Jan",
      stats: {
        "endpointOne": 12,
        "endpointTwo": 24
      }
    },
    {
      month: "Feb",
      stats: {
        "endpointOne": 12,
        "endpointTwo": 24
      }
    }
  ]
}

  // look at the date and categorize it. Once the date is categorized, create an object with the month that performs the reducing function and add that for the stats.