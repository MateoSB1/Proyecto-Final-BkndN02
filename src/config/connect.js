import mongoose from "mongoose"

export const connectDB = async (uri, dbName) => {
    try {
        await mongoose.connect(
            uri,
            {
                dbName: dbName
            }
        )
        console.log(`DB Online!`)
    } catch (error) {
        console.log('Error al conectar a la database')
    }
}

export default connectDB