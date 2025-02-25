import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: { type: String, unique: true },
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: [String],
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

export default Product