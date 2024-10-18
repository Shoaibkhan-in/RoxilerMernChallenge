import mongoose, { Schema } from "mongoose";

const ProductSchema =  new mongoose.Schema({
    id:Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
})

const Product = mongoose.model('Product', ProductSchema)

export default Product