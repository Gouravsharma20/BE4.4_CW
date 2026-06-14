const {initializeDatabase} = require("./db/db.connection.js")

const express = require("express")

const app = express()

initializeDatabase()

app.use(express.json())

const fs = require("fs")


const Movie = require("./model/MovieModel.js")
const { error } = require("console")

const jsonData = fs.readFileSync("./data/hotelData.json","utf-8")

app.get("/",(req,res)=>{
    res.json("Welcoem to my express app")
})

// async function createMovie(newMovie) {
//     await initializeDatabase()
//   try {
//     const movie = new Movie(newMovie)
//     const saveMovie = await movie.save()
//     return saveMovie
//   } catch (error) {
//     throw error
//   }
// }

async function getAllMovie() {
    try {
        const movies = await Movie.find()
        console.log(movies)
    } catch(err){
        console.log("an error occured while fetching movies",err)
    }
}

getAllMovie()


async function updateMovie(movieId,dataToUpdate) {
    try {
        const updateMovies = await Movie.findByIdAndUpdate(movieId,dataToUpdate,{
            new:true
        })
        return updateMovies
    } catch(err){
        console.log("an error occured updating movie string",err)
    }    
}

app.post("/movies/:movieId",async(req,res)=>{
    try {
        const updatedMovie = await updateMovie(req.params.movieId,req.body)
        if(!updatedMovie){
            return res.status(404).json({error:"movie not found"})
        } else {
            return res.status(200).json({message:"movie updated successfully",newMovieData:updatedMovie})
        }
    } catch(err) {
        res.status(500).json({error:"failed to update movie",errDetails:err.message})
        console.log(err.message)
    }
})



// app.post("/movies",async(req,res)=>{
//     console.log("POST HITTED")
//     try{
//         const savedMovie = await createMovie(req.body)
//         console.log(savedMovie)
//         return res.status(201).json({message:"Movie added successfully",movie:savedMovie})

//     } catch(err){
//         res.status(500).json({error:"failed to add movie",errDetails:err.message})
//         console.log(err.message)
//     }
// })


const hotelData = JSON.parse(jsonData)


const PORT = 2222

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})