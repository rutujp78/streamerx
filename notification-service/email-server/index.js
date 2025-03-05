const { initKafka } = require("./configs/initKafka");
const connectDb = require("./utils/connectDb");

const main = async () => {
    await connectDb();
    await initKafka();
}

main();