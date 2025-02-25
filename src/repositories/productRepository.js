import ProductManager from '../dao/classes/productDAO.js'
import ProductDTO from '../dto/productDTO.js'

class ProductRepository {
    async getProducts(queryParams) {
        const productsData = await ProductManager.getProducts(queryParams)
        return productsData.docs.map(product => new ProductDTO(
            product._id,
            product.title,
            product.description,
            product.price,
            product.code,
            product.status,
            product.stock,
            product.category,
            product.thumbnails,
            product.createdAt,
            product.updatedAt,
            product.__v
        ))
    }
    
    async getProductById(id) {
        const product = await ProductManager.getProductById(id)
        return product ? new ProductDTO(
            product._id,
            product.title,
            product.description,
            product.price,
            product.code,
            product.status,
            product.stock,
            product.category,
            product.thumbnails,
            product.createdAt,
            product.updatedAt,
            product.__v
        ) : null
    }

    async addProduct(productData) {
        const productDTO = new ProductDTO(
            productData._id,
            productData.title,
            productData.description,
            productData.price,
            productData.code,
            productData.status,
            productData.stock,
            productData.category,
            productData.thumbnails,
            productData.createdAt,
            productData.updatedAt,
            productData.__v
        )
        return await ProductManager.addProduct(productDTO)
    }

    async updateProduct(id, updatedFields) {
        return await ProductManager.updateProduct(id, updatedFields)
    }

    async deleteProduct(id) {
        return await ProductManager.deleteProduct(id)
    }
}

export default new ProductRepository
