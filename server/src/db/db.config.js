import mongoose from 'mongoose'

const connectDB=(app)=>{
    mongoose.connect(process.env.MONGO_URI)

    .then(()=>{
     console.log("DB Connected Successfully !!!")

     app.listen(process.env.PORT, ()=>{
        console.log(`App is listening at port ${process.env.PORT}`)
     })
    })

    .catch((error)=>{
     console.error(error.message)
    })
}

export default connectDB