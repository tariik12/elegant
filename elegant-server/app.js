
const express = require('express');
const session = require('express-session');
const mysql = require('mysql'); 
const crypto = require('crypto');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { promises: fs } = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Trim to the desired length
};

// Generate a secure random string of, for example, 32 characters
const secureRandomString = generateRandomString(32);



app.use(cors());
app.use(express.json());
app.use(express.static('im'));
app.use(session({
  secret: secureRandomString,
  resave: false,
  saveUninitialized: true,
}));

const pool = mysql.createPool({
  user: "root",
  host: "localhost",
  password: "",
  database: "mytodo",
});

// Check the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
  } else {
    console.log('Connected to the database');
    connection.release();
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'im/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});
// Banner post
app.post('/bannerUpload', upload.single('bannerImage'), (req, res) => {
  const bannerImage = req.file.filename;
  const title = req.body.title;

  const sql = "INSERT INTO banner (title, bannerImage) VALUES (?, ?)";
  const values = [title, bannerImage];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error inserting values");
    } else {
      res.send("Values inserted");
    }
  });
});


app.post('/projectUpload', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'subImage1', maxCount: 1 },
  { name: 'subImage2', maxCount: 1 },
  { name: 'subImage3', maxCount: 1 },
]), async (req, res) => {
  const {
    address,
    name,
    status,
    landArea,
    noOfFloors,
    apartmentFloor,
    apartmentSize,
    bedroom,
    bathroom,
    launchDate,
    collection,
    extraData
  } = req.body;

  const mainImage = req.files['mainImage'][0].filename;
  const subImage1 = req.files['subImage1'][0].filename;
  const subImage2 = req.files['subImage2'][0].filename;
  const subImage3 = req.files['subImage3'][0].filename;

  const sql = 'INSERT INTO projects (address, name, status, landArea, noOfFloors, apartmentFloor, apartmentSize, bedroom, bathroom, launchDate, collection, extraData, mainImage, subImage1, subImage2, subImage3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    address,
    name,
    status,
    landArea,
    noOfFloors,
    apartmentFloor,
    apartmentSize,
    bedroom,
    bathroom,
    launchDate,
    collection,
    extraData,
    mainImage,
    subImage1,
    subImage2,
    subImage3
  ];

  try {
    await pool.query(sql, values);
    res.status(200).send('Values inserted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting values');
  }
});



app.get('/getAllData', (req, res) => {
  const sql = "SELECT * FROM banner";

  pool.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(results);
    }
  });
});

//single banner by ID
app.get('/getByProjectId/:id', (req, res) => {
  const projectId = req.params.id;
  const sql = "SELECT * FROM projects WHERE id = ?";

  pool.query(sql, [projectId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching data");
    } else {
      if (result.length === 0) {
        res.status(404).send("project not found");
      } else {
        res.json(result[0]); // Assuming you want to return the first (and only) result
      }
    }
  });
});
app.get('/getDataById/:id', (req, res) => {
  const bannerId = req.params.id;
  const sql = "SELECT * FROM banner WHERE id = ?";

  pool.query(sql, [bannerId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching data");
    } else {
      if (result.length === 0) {
        res.status(404).send("Banner not found");
      } else {
        res.json(result[0]); // Assuming you want to return the first (and only) result
      }
    }
  });
});

// delete banner 
app.delete('/deleteBanner/:id', async (req, res) => {
  const bannerId = req.params.id;

  const getBannerSql = "SELECT * FROM banner WHERE id = ?";
  const getBannerValues = [bannerId];

  pool.query(getBannerSql, getBannerValues, async (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching banner data");
    } else {
      const banner = results[0];
      if (!banner) {
        return res.status(404).send("Banner not found");
      }

      const imagePath = path.join(__dirname, 'im/images', banner.bannerImage);

      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.error("Error deleting image file:", unlinkError);
        res.status(500).send("Error deleting image file");
        return;
      }

      const deleteBannerSql = "DELETE FROM banner WHERE id = ?";
      const deleteBannerValues = [bannerId];

      pool.query(deleteBannerSql, deleteBannerValues, (deleteError, deleteResult) => {
        if (deleteError) {
          console.log(deleteError);
          res.status(500).send("Error deleting banner");
        } else {
          res.send("Banner and image deleted");
        }
      });
    }
  });
});


app.delete('/deleteProject/:id', async (req, res) => {
  const projectId = req.params.id;
  const getProductSql = 'SELECT * FROM projects WHERE id = ?';
  const getProductValues = [projectId];

  pool.query(getProductSql, getProductValues, async (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error fetching project data');
    } else {
      const project = results[0];
      if (!project) {
        return res.status(404).send('Project not found');
      }

      const imagePath = path.join(
        __dirname,
        'im/images',
        project.mainImage,
      );

      try {
        // Check if the main image exists before attempting to delete
        await fs.access(imagePath);
        await fs.unlink(imagePath);

        // Repeat the process for each subImage
        const subImagePaths = [
          project.subImage1,
          project.subImage2,
          project.subImage3,
        ];

        subImagePaths.forEach(async (subImage) => {
          const subImagePath = path.join(
            __dirname,
            'im/images',
            subImage,
          );

          try {
            await fs.access(subImagePath);
            await fs.unlink(subImagePath);
          } catch (subImageUnlinkError) {
            console.error('Error deleting subImage file:', subImageUnlinkError);
          }
        });
      } catch (unlinkError) {
        console.error('Error deleting image file:', unlinkError);
        res.status(500).send('Error deleting image file');
        return;
      }

      const deleteProjectSql = 'DELETE FROM projects WHERE id = ?';
      const deleteProjectValues = [projectId];

      pool.query(deleteProjectSql, deleteProjectValues, (deleteError, deleteResult) => {
        if (deleteError) {
          console.log(deleteError);
          res.status(500).send('Error deleting project');
        } else {
          res.send('Project and image deleted');
        }
      });
    }
  });
});

// update banner
app.patch('/updateBanner/:id', upload.single('bannerImage'), async (req, res) => {
  const bannerId = req.params.id;
  const { title } = req.body;
  const newBannerImage = req.file?.filename;

  console.log("Received request to update banner:", req.body, req.file, bannerId);

  // Get the existing banner data
  const getBannerSql = 'SELECT * FROM banner WHERE id = ?';
  const getBannerValues = [bannerId];

  pool.query(getBannerSql, getBannerValues, async (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching banner data");
    } else {
      const existingBanner = results[0];
      if (!existingBanner) {
        return res.status(404).send("Banner not found");
      }

      const existingImage = existingBanner.bannerImage;

      // If a new image is provided, delete the existing image
      if (newBannerImage && existingImage) {
        const imagePath = path.join(__dirname, 'im/images', existingImage);
        try {
          await fs.unlink(imagePath);
        } catch (unlinkError) {
          console.error("Error deleting existing image file:", unlinkError);
          res.status(500).send("Error deleting existing image file");
          return;
        }
      }

      // Update the banner data
      const setClause = [];
      if (title) setClause.push('title = ?');
      if (newBannerImage) setClause.push('bannerImage = ?');

      if (setClause.length === 0) {
        return res.status(400).send("No fields to update");
      }

      const updateSql = `UPDATE banner SET ${setClause.join(', ')} WHERE id = ?`;
      const updateValues = [
        ...(title ? [title] : []),
        ...(newBannerImage ? [newBannerImage] : []),
        bannerId,
      ];

      pool.query(updateSql, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.log(updateErr);
          res.status(500).send("Error updating banner");
        } else {
          res.send("Banner updated");
        }
      });
    }
  });
});

app.patch('/updateProduct/:id', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'subImage1', maxCount: 1 },
  { name: 'subImage2', maxCount: 1 },
  { name: 'subImage3', maxCount: 1 },
]), async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      address, name, status, landArea, noOfFloors, apartmentFloor, apartmentSize, bedroom, bathroom, launchDate, collection, extraData
    } = req.body;
    
    const mainImage = req.files && req.files['mainImage'] ? req.files['mainImage'][0].filename : null;
    const subImage1 = req.files && req.files['subImage1'] ? req.files['subImage1'][0].filename : null;
    const subImage2 = req.files && req.files['subImage2'] ? req.files['subImage2'][0].filename : null;
    const subImage3 = req.files && req.files['subImage3'] ? req.files['subImage3'][0].filename : null;

    console.log("Received request to update product:", req.body, req.files, productId);

    const getProductSql = 'SELECT * FROM projects WHERE id = ?';
    const getProductValues = [productId];
    pool.query(getProductSql, getProductValues, async (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error fetching product data");
      } else {
        const existingProduct = results[0];
        if (!existingProduct) {
          return res.status(404).send('Product Not found');
        }
        const existingMainImage = existingProduct.mainImage;

        if (mainImage && existingMainImage) {
          const imagePath = path.join(__dirname, 'im/images', existingMainImage);
          try {
            await fs.unlink(imagePath);
          } catch (unlinkError) {
            console.error("Error deleting existing main image file : ", unlinkError);
            res.status(500).send("Error deleting existing main image file");
            return;
          }
        }

        const setClause = [];
        if (address) setClause.push('address = ?');
        if (name) setClause.push('name = ?');
        // Add other fields to the setClause...
// Add other fields to the setClause...
if (status) setClause.push('status = ?');
if (landArea) setClause.push('landArea = ?');
if (noOfFloors) setClause.push('noOfFloors = ?');
if (apartmentFloor) setClause.push('apartmentFloor = ?');
if (apartmentSize) setClause.push('apartmentSize = ?');
if (bedroom) setClause.push('bedroom = ?');
if (bathroom) setClause.push('bathroom = ?');
if (launchDate) setClause.push('launchDate = ?');
if (collection) setClause.push('collection = ?');
if (extraData) setClause.push('extraData = ?');
        if (mainImage) setClause.push('mainImage = ?');
        if (subImage1) setClause.push('subImage1 = ?');
        if (subImage2) setClause.push('subImage2 = ?');
        if (subImage3) setClause.push('subImage3 = ?');

        if (setClause.length === 0) {
          return res.status(400).send("No fields to update");
        }

        const updateSql = `UPDATE projects SET ${setClause.join(', ')} WHERE id = ?`;
        const updateValues = [
          ...(name ? [name] : []),
          ...(address ? [address] : []),
          // Add other values to the updateValues...
          ...(status ? [status] : []),
...(landArea ? [landArea] : []),
...(noOfFloors ? [noOfFloors] : []),
...(apartmentFloor ? [apartmentFloor] : []),
...(apartmentSize ? [apartmentSize] : []),
...(bedroom ? [bedroom] : []),
...(bathroom ? [bathroom] : []),
...(launchDate ? [launchDate] : []),
...(collection ? [collection] : []),
...(extraData ? [extraData] : []),
          ...(mainImage ? [mainImage] : []),
          ...(subImage1 ? [subImage1] : []),
          ...(subImage2 ? [subImage2] : []),
          ...(subImage3 ? [subImage3] : []),
          productId,
        ];

        pool.query(updateSql, updateValues, (updateErr, updateResult) => {
          if (updateErr) {
            console.log(updateErr);
            res.status(500).send("Error updating product");
          } else {
            res.send("Product updated");
          }
        });
      }
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
});



// get witness
app.get('/witness', (req,res) =>{
  const sql = "SELECT * FROM witness";
  pool.query(sql,(err,results) =>{
    if(err){
      console.log(err);
      res.status(500).send("Error fetching data");
    }
    else{
      res.json(results)
    }
  })
})

// update witness
app.patch('/updateWitness/:id', upload.single('witnessTitle'), (req, res) =>{
const witnessId = req.params.id;
const {witnessTitle} = req.body;
const {witnessPara} = req.body;
const setClause =[];
if(witnessTitle) setClause.push('witnessTitle = ?');
if(witnessPara) setClause.push('witnessPara = ?');
if(setClause.length === 0) {
  return res.status(400).send("No fields to update");
}

const sql =  `UPDATE witness SET ${setClause.join(', ')}  WHERE id = ?`;
const values = [...(witnessTitle ? [witnessTitle] : []), ...(witnessPara ? [witnessPara] : []), witnessId];

pool.query(sql, values, (err, result) =>{
  if(err){
    console.log(err)
    res.status(500).send("Error updating witness")
  } else{
    res.send("Witness Updated")
  }
})
})
// get landWanted
app.get('/landWanted', (req,res) =>{
  const sql = 'SELECT * FROM landwanted';
  pool.query(sql,(err, result) =>{
    if(err){
      console.log(err)
      res.status(500).send("Error Fetching Data")
    }
    else{
      res.json(result)
    }
  } )
})

// update landWanted
app.patch('/landUpdate/:id', upload.single('landImage'), async (req, res) => {
  const landId = req.params.id;
  const { landWantedTitle, landWantedSubtitle, landWantedPara, phNumber } = req.body;
  const newLandImage = req.file?.filename;
  console.log("Received request to update land:", req.body, req.file, landId);

  // Get the existing land data
  const getLandSql = 'SELECT * FROM landwanted WHERE id = ?';
  const getLandValues = [landId];

  pool.query(getLandSql, getLandValues, async (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching land data");
    } else {
      const existingLand = results[0];
      if (!existingLand) {
        return res.status(404).send("Land not found");
      }

      const existingImage = existingLand.landImage;

      // If a new image is provided, delete the existing image
      if (newLandImage && existingImage) {
        const imagePath = path.join(__dirname, 'im/images', existingImage);
        try {
          await fs.unlink(imagePath);
        } catch (unlinkError) {
          console.error("Error deleting existing image file:", unlinkError);
          res.status(500).send("Error deleting existing image file");
          return;
        }
      }

      // Update the land data
      const setClause = [];
      if (landWantedTitle) setClause.push('landWantedTitle = ?');
      if (landWantedSubtitle) setClause.push('landWantedSubtitle = ?');
      if (landWantedPara) setClause.push('landWantedPara = ?');
      if (phNumber) setClause.push('phNumber = ?');
      if (newLandImage) setClause.push('landImage = ?');

      if (setClause.length === 0) {
        return res.status(400).send("No Fields to update");
      }

      const updateSql = `UPDATE landwanted SET ${setClause.join(', ')} WHERE id = ?`;
      const updateValues = [
        ...(landWantedTitle ? [landWantedTitle] : []),
        ...(landWantedSubtitle ? [landWantedSubtitle] : []),
        ...(landWantedPara ? [landWantedPara] : []),
        ...(phNumber ? [phNumber] : []),
        ...(newLandImage ? [newLandImage] : []),
        landId,
      ];

      pool.query(updateSql, updateValues, (updateErr, updateResults) => {
        if (updateErr) {
          console.log(updateErr);
          res.status(500).send("Error updating land");
        } else {
          res.send("Land Wanted Update");
        }
      });
    }
  });
});


//get luxury
app.get('/luxury', (req,res) =>{
  const sql = 'SELECT * FROM luxury';
  pool.query(sql, (err, result) =>{
    if(err){
      console.log(err)
      res.status(500).send("Error Fetching Data")
    }
    else{
      res.json(result)
    }
  })
})


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM login WHERE username = ? AND password = ?";

  pool.query(sql, [email, password], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length === 0) {
      // No matching user found (invalid credentials)
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (req.session) {
      // Check if the 'data' array is not empty before accessing its elements
      if (data[0] && data[0].username) {
        req.session.user = { email: data[0].username };
        return res.json({ message: "Login Successfully", user: req.session.user });
      } else {
        console.error("Invalid user data in the database");
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      console.error("Session not initialized");
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Add a logout route
app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      return res.json({ message: 'Logout Successful' });
    });
  } else {
    console.error("Session not initialized");
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/luxuryUpdate/:id', upload.single('luxuryImage'), async (req, res) => {
  const luxuryId = req.params.id;
  const { youtubeLink } = req.body;
  const newLuxuryImage = req.file?.filename;

  console.log("Received request to update luxury:", req.body, req.file, luxuryId);

  const getLuxurySql = 'SELECT * FROM luxury WHERE id = ?';
  const getLuxuryValues = [luxuryId];

  pool.query(getLuxurySql, getLuxuryValues, async (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching luxury data");
    } else {
      const existingLuxury = results[0];
      if (!existingLuxury) {
        return res.status(404).send("Luxury not found");
      }
      const existingImage = existingLuxury.luxuryImage;
      if (newLuxuryImage && existingImage) {
        const imagePath = path.join(__dirname, 'im/images', existingImage);
        try {
          await fs.unlink(imagePath);
        } catch (unlinkError) {
          console.error("Error deleting existing image file:", unlinkError);
          res.status(500).send("Error deleting existing image file");
          return;
        }
      }

      const setClause = [];
      if (youtubeLink) setClause.push('youtubeLink = ?');
      if (newLuxuryImage) setClause.push('luxuryImage = ?');

      if (setClause.length === 0) {
        return res.status(400).send("No Fields to update");
      }

      const updateSql = `UPDATE luxury SET ${setClause.join(', ')} WHERE id = ?`;
      const updateValues = [
        ...(youtubeLink ? [youtubeLink] : []),
        ...(newLuxuryImage ? [newLuxuryImage] : []),
        luxuryId,
      ];

      pool.query(updateSql, updateValues, (updateErr, updateResults) => {
        if (updateErr) {
          console.log(updateErr);
          res.status(500).send("Error updating luxury");
        } else {
          res.send("Luxury Update");
        }
      });
    }
  });
});
app.get('/metro', (req, res) =>{
  const sql = 'SELECT * FROM metro';
  pool.query(sql,(err, result) =>{
    if(err) {
      console.log(err)
      res.status(500).send("Error Fetching Data ")
    }
    else{
      res.json(result)
    }
  })
})
app.patch('/metroUpdate/:id', upload.single('metroImage'), async(req, res) =>{
  const metroId = req.params.id;
  const {metroPara} = req.body;
  const newMetroImage = req.file?.filename;

  console.log("Received request to update metro :", req.body, req.file, metroId);
  const getMetroSql = 'SELECT * FROM metro WHERE id = ?';
  const getMetroValues = [metroId]
   
  pool.query(getMetroSql, getMetroValues, async(err, results) =>{
if(err){
  console.log(err)
  res.status(500).send('Error fetching metro data')
}else{
  const existingMetro = results[0];
  if(!existingMetro){
    return res.status(404).send("metro not found")
  }

  const existingImage = existingMetro.metroImage;
  if(newMetroImage && existingImage){
    const imagePath = path.join(__dirname, 'im/images', existingImage);
    try{
      await fs.unlink(imagePath);

    }catch(error){
      console.log('Error deleting existing image file : ', unLinkError);
      res.status(500).send("Error deleting existing image file");
      return;
    }
  }
  const setClause = [];
  if(metroPara) setClause.push('metroPara = ?');
  if(newMetroImage) setClause.push('metroImage = ?');
   
  if(setClause.length === 0) {
    return res.status(400).send("No Fields to update");
  };
  const updateSql =  `UPDATE  metro SET ${setClause.join (', ') }   WHERE id = ?`;
  const updateValues = [
    ...(metroPara ? [metroPara] : []),
    ...(newMetroImage ? [newMetroImage] : []),
    metroId
  ]

  pool.query(updateSql, updateValues, (updateErr, updateResult) =>{
    if(updateErr) {
      console.log(updateErr)
      res.status(500).send("Error updating metro")
    } else{
      res.send("metro update++_")
    }
  })
}
  })
});
//get product

app.get('/products', (req,res) =>{
  const sql = ' SELECT * FROM projects';
  pool.query(sql, (err, result) =>{
    if(err){
      console.log(err)
      res.status(500).send("Error Fetching Data")
    }
    else{
      res.json(result)
    }
  })
  })

app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, 'im/images', imageName));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});