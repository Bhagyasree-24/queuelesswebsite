const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const mongoose = require("mongoose");

const User = require("../models/User");
const Office = require("../models/Office");
const Service = require("../models/Service");
const Counter = require("../models/Counter");

// Data files
const officeData = require("./data/officeData");
const serviceData = require("./data/serviceData");
const createCounterData = require("./data/counterData");
const userData = require("./data/userData");


const initDb = async () => {
  try {
    // CONNECT DATABASE

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // CLEAR EXISTING DATA

    await User.deleteMany({});
    await Service.deleteMany({});
    await Counter.deleteMany({});
    await Office.deleteMany({});

    console.log("Old data cleared");

    // CREATE OFFICES

    const offices = await Office.insertMany(officeData);

    const revenueOffice = offices.find(
      (office) => office.type === "REVENUE"
    );

    const developmentOffice = offices.find(
      (office) => office.type === "DEVELOPMENT"
    );

    console.log("Offices created");

    // CREATE SERVICES

    const services = await Service.insertMany(
      serviceData(
        revenueOffice._id,
        developmentOffice._id
      )
    );

    console.log(`${services.length} services created`);

    // CREATE COUNTERS

    const counters = await Counter.insertMany(
      createCounterData(
        revenueOffice._id,
        developmentOffice._id
      )
    );

    console.log(`${counters.length} counters created`);

    // CREATE USERS
    for (const data of userData) {

      let officeId = null;
      let counterId = null;

      if (data.officeType) {

        const office = offices.find(
          (office) => office.type === data.officeType
        );

        officeId = office ? office._id : null;

        if (data.counterNumber && office) {

          const counter = counters.find(
            (counter) =>
              counter.officeId.toString() === office._id.toString() &&
              counter.number === data.counterNumber
          );

          counterId = counter ? counter._id : null;
        }
      }

      const user = new User({
        name: data.name,
        email: data.email.trim().toLowerCase(),
        role: data.role,
        phone: data.phone || undefined,
        officeId,
        counterId,
      });

      await User.register(user, data.password);
    }

    console.log(`${userData.length} users created`);

    // SUCCESS

    console.log("Database initialized successfully");

  } catch (error) {

    console.error(
      "Database initialization failed:",
      error
    );

  } finally {

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  }
};


initDb();