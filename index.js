const port=5000;
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
app.use(express.json());
app.use(cors());
import("trash").then((trash) => {
  // Now you can use the 'trash' module here
}).catch((error) => {
  console.error("Error importing 'trash' module:", error);
});

app.use("/files",express.static("files"))
//to run enter node index.js in terminal


//DB connect
mongoose.connect("mongodb+srv://sreekrishnnaa:sree2003@project1.xk0wkup.mongodb.net/?retryWrites=true&w=majority").then(()=>{console.log("connected to db");}).catch((e)=>console.log(e));

//API creation



app.get("/",(req,res)=>{
res.send("server is running")
})




app.listen(port,(error)=>{
if(!error){
    console.log("Server Running in the port "+port);
}
else{
    console.log("error:"+error);
}
})

//multer


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });


//post method
app.post("/uploadfiles", upload.single("file"), async (req, res) => {
  console.log(req.file);

  
  const authenticatedUser = req.user;
  
  const userName = authenticatedUser ? authenticatedUser.sub : 'Anonymous';
  
  const title = req.body.title;
  const fileName = req.file.filename;

  try {
    // Assuming PdfSchema is your Mongoose model
    await PdfSchema.create({ title: title, pdf: fileName, userName: userName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});


//get method

app.get("/getfiles", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});

//delete method
app.delete('/deletefiles/:id', async (req, res) => {
  try {
    // Dynamically import the 'trash' module
    const { default: trash } = await import("trash");

    const pdf = await PdfSchema.findById(req.params.id);

    if (!pdf) {
      return res.status(404).send({ status: 'not found', message: 'Record not found' });
    }

    const filePath = path.join(__dirname, 'files', pdf.pdf);

    // Move the file to trash using the 'trash' module
    await trash(filePath);

    // Now you can delete the record from the database
    const deletedRecord = await PdfSchema.deleteOne({ _id: req.params.id });

    if (deletedRecord.deletedCount === 1) {
      res.send({ status: 'ok', data: deletedRecord });
    } else {
      res.status(404).send({ status: 'not found', message: 'Record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});
