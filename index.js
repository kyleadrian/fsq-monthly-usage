const axios = require("axios")
const args = require("yargs").argv

let oauth_token = args.token
let daysHistory = args.days
let consumerIds = args.consumer_id.split(",")

let months = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec"
}

fetchUsageForConsumers(consumerIds)

function fetchUsageForConsumers(ids) {
  ids.forEach((id) => {
    fetchHits(daysHistory, id)
  })
}

async function fetchHits(days, consumerId) {
  let urlToFetch = `https://api.foursquare.com/v2/apps/dailystats/?v=20191202&days=${days}&consumerIds=${consumerId}&byEndpoint=true&oauth_token=${oauth_token}`

  try {
    let response = await axios.get(urlToFetch)
    let stats = response.data

    return calculateUsage(consumerId, stats)
  } catch (error) {
    if (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(`Fetch Error for ${consumerId}:`, error.message);
      }
    }
  }
}

function calculateUsage(consumerId, data) {
  const newStats = []
  let stats = data.response.stats
  let consumerInfo = stats[0]

  if (stats == undefined) {
    console.log({ "consumerId": consumerId, "endpoints": "No stats for user" })
  }

  let dailyStats = consumerInfo.dailyStats

  if (dailyStats == undefined) {
    console.log({ "consumerId": consumerId, "endpoints": "No stats for user" })
  }

  if (dailyStats.length != 0) {
    dailyStats.filter((stat) => {
      if (stat.totalCount > 0) {
        /*         const formatted = stat.date.split("-")[1].includes("0") ? stat.date.split("-")[1].slice(1) : stat.date.split("-")[1] */
        const newStat = {}
        const month = months[stat.date.split("-")[1]]
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

    console.log(JSON.stringify({ "consumer_id": consumerId, "total_calls": consumerInfo.totalCount, "monthly_usage": uniqueEndpointsByMonth }, null, 2))

  } else {
    console.log({ "consumer_id": consumerId, "total_calls": 0, "monthly_usage": 'No activity' })
  }
}

