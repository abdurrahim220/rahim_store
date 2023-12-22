const mongoose = require("mongoose");

const CONNECTION_STRING = `mongodb+srv://rahim:aU9eUMj4PRoTRn84@cluster0.hncbqqn.mongodb.net/RahimStore?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(CONNECTION_STRING);
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
