const {initializeDatabase} = require("./db/db.connection.js")

const express = require("express")

const app = express()

const fs = require("fs")

const Hotel = require("./model/HotelModel")
const { error } = require("console")

const jsonData = fs.readFileSync("./data/hotelData.json","utf-8")

app.get("/",(req,res)=>{
    res.json("Welcoem to my express app")
})

const hotelData = JSON.parse(jsonData)

async function readHotels(){
    await initializeDatabase()
    try{
        const allData = await Hotel.find()
        return allData
    } catch(err) {
        console.log("Error loading data",err)
    }
}

app.get("/hotels",async(req,res)=>{
    try {
        const allHotels = await readHotels()
        if (!allHotels) {
            res.status(404).json({error:"hotel data not found"})
        } else {
            res.status(200).json({message:"Hotel data oaded successfully",hotelData:allHotels})
        }
    } catch {
        res.status(500).json({error:"an error occured while loading hotels data"})
    }
})



async function readHotelName(hotelName){
    await initializeDatabase()
    try {
        const foundHotel = await Hotel.find({name:hotelName})
        return foundHotel
    } catch(err){
        console.log(`Error finding ${hotelName} `,err)
    }
}

app.get("/hotels/:hotelName",async(req,res)=>{
    try {
        const hotelFound = await readHotelName(req.params.hotelName)
        if (hotelFound.length === 0) {
            return res.status(404).json({error:"hotel data doesnt found"})
        } else {
            return res.status(200).json({message:"Hotel data found successfully",hotelData:hotelFound})
        }
    } catch (err) {
        return res.status(500).json({error:"an error occured while oading hotelName"})
    }
})

// finding api with phone number

async function findByPhoneNum(phoneNum){
    await initializeDatabase()
    try {
        const foundRestro  = await Hotel.find({phoneNumber:phoneNum})
        console.log(`Restraunt with phone number ${phoneNum}: `,foundRestro)
        return foundRestro
    } catch(err){
        console.log(`No data found with phone number ${phoneNum}`)
    }
    
}


app.get("/hotels/directory/:phoneNumber",async(req,res)=>{
    try {
        const foundHotels = await findByPhoneNum(req.params.phoneNumber)
        if (foundHotels.length === 0) {
            return res.status(404).json({error:"hotel data with phone number not found",hotelData:foundHotels})
        } else {
            return res.status(200).json({message:"phone number found successfully",foundData:foundHotels})
        }
    } catch (err) {
        console.log("Route error : ",err)
        return res.status(500).json({error:"an error occured while loading phone number"})
    }
})

async function ifParkingAvailable(){
    await initializeDatabase()
    try {
        const ifparking = await Hotel.find({isParkingAvailable:true})
    console.log("Hotels with parking available :",ifparking)

    } catch {
        console.log("Error finding available parking data")
    }
    
}

async function availableRestraunt(){
    await initializeDatabase()
    try {
        const availabelRestro = Hotel.find({isRestaurantAvailable: true})
        console.log("list of available Restraunts:",availabelRestro)

    } catch(err){
        console.log("Error loading data",err)
    }
}

async function findCategory(category){
    await initializeDatabase()
    try {
        const categoryHotel = await Hotel.find({category:category})
        console.log(`${category} restraunts : `,categoryHotel)
        return categoryHotel

    } catch(err) {
        console.log(`Error finding ${category} hotels`)
    }
}

app.get("/hotels/category/:hotelCategory",async(req,res)=>{
    try {
        const foundHotel = await findCategory(req.params.hotelCategory)

        if (foundHotel.length === 0) {
            return res.status(404).json({error:"an error occured while loading restraunt data"})
        } else {
            return res.status(200).json({message:"hotel with category found successfully",hotelData:foundHotel})
        }

    } catch(err) {
        return res.status(500).json({error:"an error occured while loading hotel category"})
    }
})



async function ratedRestro(rating){
    await initializeDatabase()
    try {
        const foundRatingData = await Hotel.find({rating:rating})
        console.log(`Restraunt with rating ${rating} : `,foundRatingData)
        return foundRatingData

    } catch (err) {
        console.log(`No data found with rating ${rating}`)
    }
}

app.get("/hotels/rating/:hotelRating",async(req,res)=>{
    try {
        const foundHotel = await ratedRestro(req.params.hotelRating)
        if (!foundHotel.length === 0 ) {
            return res.status(404).json({error:`Hotel with rating ${req.params.hotelRating} not found `})
        } else {
            return res.status(200).json({message:"hotels found successfully",data:foundHotel})
        }
    } catch(err) {
        res.status(500).json({error:"an error occoured"})
    }
})
const PORT = 2212

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})