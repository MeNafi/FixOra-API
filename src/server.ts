import "dotenv/config"
import app from "./app"
import { prisma } from "./lib/prisma";
import config from "./config"

const PORT = config.PORT

async function main() {
    try {
        await prisma.$connect()
        console.log("Connected to the database successfully")

        app.listen(PORT, () => {
            console.log(`FixItNow server is running on port ${PORT}`)
            console.log(`API docs available at http://localhost:${PORT}/api-docs`)
        })
    } catch (error) {
        console.error("Error starting the server:", error)
        await prisma.$disconnect()
        process.exit(1);
    }
}

main();

