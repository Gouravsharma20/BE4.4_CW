const {initializeDatabase} = require("./db/db.connection.js")

const express = require("express")

const app = express()

initializeDatabase()

app.use(express.json())

const fs = require("fs")

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));



const Movie = require("./model/MovieModel.js")
const { error } = require("console")
// const jsonData = fs.readFileSync("./data/hotelData.json","utf-8")

app.get("/",(req,res)=>{
    res.json("Welcoem to my Movie express app")
})

async function createMovie(newMovie) {
    await initializeDatabase()
  try {
    const movie = new Movie(newMovie)
    const saveMovie = await movie.save()
    return saveMovie
  } catch (error) {
    throw error
  }
}

async function getAllMovie() {
    try {
        const movies = await Movie.find()
        return movies
    } catch(err){
        console.log("an error occured while fetching movies",err)
    }
}

app.get("/allMovies",async(req,res)=>{
    try {
        const allMovies = await getAllMovie()
        if (allMovies.length === 0) {
            return res.status(404).json({error:"all movies not founds"})
        } else {
            return res.status(200).json({message:"all movies found successfully",AllMovies:allMovies})
        }
    } catch (err) {
        return res.status(500).json({error:"an error occured while getting movies",errorDetails:err.message})
    }
})


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



app.post("/movies",async(req,res)=>{
    console.log("POST HITTED")
    try{
        const savedMovie = await createMovie(req.body)
        console.log(savedMovie)
        return res.status(201).json({message:"Movie added successfully",movies:savedMovie})

    } catch(err){
        res.status(500).json({error:"failed to add movie",errDetails:err.message})
        console.log(err.message)
    }
})

async function getMovieByTitle(movieTitle) {
    try {
        const foundMovie = await Movie.findOne({title: movieTitle})
        return foundMovie
    } catch(err){
        console.log("an error occured while getting movies by title")
        throw err
    } 
}

app.get("/movies/:title",async(req,res)=>{
    try {
        const title = req.params.title
        const movieFound = await getMovieByTitle(title)
        if (!movieFound) {
            return res.status(404).json({error:"movie not found"})
        } else {
            return res.status(200).json({message:`movie with title ${title} found successfully`,FoundMovie:movieFound})
        }
        

    } catch(err) {
        return res.status(500).json({error:"an error getting movie by id",errorDetails:err.message})
    }
})


// const hotelData = JSON.parse(jsonData)


const PORT = 2235

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})