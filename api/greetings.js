export default (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({
    message: 'hooray! welcome to our api server!...',
    apis: ['cars', 'colors', 'makes', 'solution', 'vins'],
  })
}
