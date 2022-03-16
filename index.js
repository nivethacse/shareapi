require("dotenv").config();
const express = require ("express")
const app = express()
const PORT = process.env.PORT || 5000
const db = require("./mongo")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const logInService = require("./routes/loginRoutes")
const resetServices = require("./modules/resetModule")
const mailServices = require ("./modules/verifyMailModule")
const sortingServices = require("./modules/sortingModule")
const actionServices = require("./modules/actionModules")

async function connection (){

    app.use(cors())

    await db.connect()

    app.use(express.json())

    //user register

    app.use('/' , logInService )

    // app.use('/' ,  resetServices)
    
    // app.post("/login" , )


    app.put("/reset" , resetServices.resetting )


    app.put("/updatePassword", resetServices.updatePassword)



    app.put( "/verify/:id" , mailServices.verifyMail)



    app.get("/product" , sortingServices.product)


    
    // sorting
    app.put("/asc" , sortingServices.ascending )

    app.put("/dsc" , sortingServices.descending)

    // all shop sorting

    app.get("/all_asc" , sortingServices.allAsc)

    app.get("/all_dsc" , sortingServices.allDsc)

   

    // filter data

    app.get("/shirts" , sortingServices.shirtSort)

    app.get("/T-shirts" , sortingServices.tshirtSort)

    app.get("/jeans" , sortingServices.jeansSort)

    app.get("/shorts" , sortingServices.shortsSort)

    app.get("/pajamas" , sortingServices.pajamasSort)


    // login middleware
    app.use((req , res , next)=>{
        const token = req.headers["auth-token"];
        if (token){
            try{
                req.user = jwt.verify(token , "admin123")
                next()
            }catch(error){
                res.sendStatus(500)
            }
        }else{
            res.sendStatus(400)
        }
    })
   
  

    app.put("/cancelFinal_order" , actionServices.cancelFinal_order )

    // user actions
    app.get("/getOrders" , actionServices.getOrders)

    app.post("/orders" , actionServices.orders)


    app.get("/getCart" , actionServices.getCart)

    app.put('/addCart' , actionServices.addCart)

    app.put('/removeCart' , actionServices.removeCart)

    // wishlist

    app.put("/wishlist" , actionServices.wishlist)

    app.put("/removewishlist" , actionServices.removewishlist)

    app.listen(PORT , ()=>{
        console.log("your server started at " + Port)
    })
}

connection()