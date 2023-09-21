// server.js
const mongoose = require("mongoose");
// const { DB_HOST} = require('./config')

const DB_HOST = 'mongodb+srv://yuliasiromakha:ZeU4Bw0MfEseH7Et@mycluster.geac3vj.mongodb.net/db-contacts?retryWrites=true&w=majority'

const app = require('./app')

mongoose.set('strictQuery', true)

mongoose.connect(DB_HOST)
.then(() => {
  app.listen(3000)
  console.log('"Database connection successful"');
})
.catch(error => {
  console.log(error);
  console.log(error.message)
  process.exit(1);
})