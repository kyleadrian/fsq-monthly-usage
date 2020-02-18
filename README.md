# fsq-monthly-usage
A tool that helps you see your monthly usage - by endpoint - for Foursquare's API.

<br>

To use this app, first run:  
```bash
npm install
```

<br>

## Running the App
You can check usage for one consumer by passing in the token, days and consumerId arguments. To check for multiple consumers, pass in a comma separated list.
```bash
node index.js  --token=your_token --days=30 --consumer_id=your_consumerId
```
