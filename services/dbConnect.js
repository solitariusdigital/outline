import { connect, connection, set } from "mongoose";

const conn = {
  isConneted: false,
};

async function dbConnect() {
  if (conn.isConneted) return;

  set("strictQuery", true);

  const db = await connect(process.env.NEXT_PUBLIC_MONGO_URI, {
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  conn.isConneted = db.connections[0].readyState;

  console.log(db.connection.db.databaseName);
}

connection.on("connected", () => {
  console.log("MongoDB connected to DB");
});

connection.on("error", (error) => {
  console.log("MongoDB error", error.message);
});

export default dbConnect;
