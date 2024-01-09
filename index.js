const port=5000;
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
app.use(express.json());
app.use(cors());


app.use("/files",express.static("files"))
//to run enter node .\index.js in terminal


//DB connect
mongoose.connect("mongodb+srv://sreekrishnnaa:sree2003@project1.xk0wkup.mongodb.net/?retryWrites=true&w=majority").then(()=>{console.log("connected to db");}).catch((e)=>console.log(e));

//API creation



app.get("/",(req,res)=>{
res.send("server is running")
})




app.listen(port,(error)=>{
if(!error){
    console.log("Server Running in the port"+port);
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

app.post("/uploadfiles", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/getfiles", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});



