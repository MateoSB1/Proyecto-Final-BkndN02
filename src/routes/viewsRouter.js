import { Router } from "express"
import ProductManager from "../dao/classes/productDAO.js"
import CartManager from "../dao/classes/cartDAO.js"
import extractUserFromToken, { onlyAdmin, onlyUser } from "../utils/auth.js"
import passport from "passport"
import userRepository from "../repositories/userRepository.js"

const router = Router()
router.use(extractUserFromToken)

router.get("/", passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), onlyUser, async (req, res) => {
    try {    
        const { limit = 10, page = 1, sort, query } = req.query

        const productsResult = await ProductManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        })
        
        if (!productsResult || !productsResult.docs || productsResult.docs.length === 0) {
            return res.render('home', {
                cart: null,
                products: [],
                totalPages: 0,
                prevPage: null,
                nextPage: null,
                page: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevLink: null,
                nextLink: null
            })
        }

        const arrayProducts = productsResult.docs.map(product => product._doc)

        const user = await userRepository.getUserByUsername(res.locals.username)
        const cart = await userRepository.getCartByUserId(user._id)

        res.render('home', {
            cart: cart?._id || null,
            products: arrayProducts,
            totalPages: productsResult.totalPages,
            prevPage: productsResult.prevPage || 1,
            nextPage: productsResult.nextPage || null,
            page: productsResult.page,
            hasPrevPage: productsResult.hasPrevPage,
            hasNextPage: productsResult.hasNextPage,
            prevLink: productsResult.hasPrevPage ? `/api/products?limit=${limit}&page=${productsResult.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productsResult.hasNextPage ? `/api/products?limit=${limit}&page=${productsResult.nextPage}&sort=${sort}&query=${query}` : null
        })

    } catch (error) {
        console.error("Error al obtener productos", error)
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        })
    }
})

router.get("/products/:pid", async (req, res) => {
    try {
        const product = await ProductManager.getProductById(req.params.pid)
        if (!product) {
            return res.status(404).render("404", { message: "Producto no encontrado" })
        }
        res.render("productDetail", { product })
    } catch (error) {
        console.error("Error fetching product details:", error)
        res.status(500).send("Error fetching product details")
    }
})

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid)
        if (!cart) {
            return res.status(404).render("404", { message: "Carrito no encontrado" })
        }
        const plainCart = cart.toObject()
        res.render(
            'cartDetail',
            {
                cart: plainCart,
            }
        )
    } catch (error) {
        console.error("Error al obtener detalles del carrito: ", error)
        res.status(500).send("Error al obtener detalles del carrito")
    }
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})

export default router
