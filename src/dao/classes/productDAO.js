import Product from '../models/productModel.js'

class ProductManager {
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const filters = {}
            if (query) {
                if (query.category) {
                    filters.category = query.category
                }
                if (query.availability !== undefined) {
                    filters.status = query.availability === 'true'
                }
            }
    
            let productsQuery = Product.find(filters)
    
            if (sort) {
                productsQuery = productsQuery.sort({ price: sort === 'asc' ? 1 : -1 })
            }
    
            const totalProducts = await Product.countDocuments(filters)
            const totalPages = Math.ceil(totalProducts / limit)
    
            const products = await productsQuery
                .skip((page - 1) * limit)
                .limit(limit)
                .exec()
    
            return {
                docs: products,
                totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
            }
        } catch (error) {
            console.error("Error al obtener los productos:", error)
            throw new Error("Error al obtener los productos")
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id)
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error)
            throw new Error("Error al obtener los productos por ID")
        }
    }

    async addProduct(productData) {
        try {
            const existingProduct = await Product.findOne({ code: productData.code })
            if (existingProduct) {
                console.error("El código del producto ya existe")
                throw new Error("El código del producto ya existe")
            }
            const product = new Product(productData)
            return await product.save()
        } catch (error) {
            console.error("Error al agregar el producto:", error)
            throw new Error("Error al agregar el producto")
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const existingProduct = await Product.findOne({
                code: updatedFields.code,
                _id: { $ne: id },
            })

            if (existingProduct) {
                console.error("El código del producto ya existe")
                throw new Error("El código del producto ya existe")
            }
    
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                updatedFields,
                { new: true }
            )

            if (!updatedProduct) {
                throw new Error("Producto no encontrado")
            }

            return updatedProduct
        } catch (error) {
            console.error("Error al actualizar el producto:", error)
            throw new Error("Error al actualizar el producto")
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id)

            if (!deletedProduct) {
                throw new Error("Producto no encontrado")
            }

            return deletedProduct
        } catch (error) {
            console.error("Error al eliminar el producto:", error)
            throw new Error("Error al eliminar el producto")
        }
    }
}

export default new ProductManager
