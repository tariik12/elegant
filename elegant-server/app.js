// app.js
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { promises: fs } = require("fs");

const app = express();
const port = Number(process.env.PORT || 3000);

const IMAGES_DIR = path.join(__dirname, "im", "images");

// -------------------- Helpers --------------------
const ensureDir = async (dir) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
};

const safeUnlink = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err && err.code === "ENOENT") return; // file doesn't exist
    throw err;
  }
};

const safeUnlinkMany = async (fileNames) => {
  const list = (fileNames || []).filter(Boolean);
  for (const f of list) {
    const p = path.join(IMAGES_DIR, f);
    await safeUnlink(p);
  }
};

// when DB fails after multer upload, delete newly uploaded files to avoid orphan files
const deleteUploadedFilesFromReq = async (req) => {
  const files = [];

  // upload.single
  if (req.file?.filename) files.push(req.file.filename);

  // upload.fields
  if (req.files && typeof req.files === "object") {
    for (const key of Object.keys(req.files)) {
      for (const f of req.files[key] || []) {
        if (f?.filename) files.push(f.filename);
      }
    }
  }

  await safeUnlinkMany(files);
};

// -------------------- Middlewares --------------------
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Serve static (so /images/filename works OR direct /im/images/filename if you want)
app.use(express.static("im"));

// Session (IMPORTANT: use fixed secret from env)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_in_env",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true only if HTTPS
    },
  })
);

// -------------------- DB Pool (Promise) --------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check DB connection
(async () => {
  try {
    await ensureDir(IMAGES_DIR);
    const conn = await pool.getConnection();
    console.log("Connected to the database");
    conn.release();
  } catch (err) {
    console.error("DB connection error:", err.message || err);
  }
})();

// -------------------- Multer Setup --------------------
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureDir(IMAGES_DIR);
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${file.fieldname}_${Date.now()}${ext}`);
  },
});

// Optional: only allow images
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only image files are allowed (jpg, jpeg, png, webp)."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// -------------------- Routes --------------------

// ---------- Banner ----------

// Create banner
app.post("/bannerUpload", upload.single("bannerImage"), async (req, res) => {
  try {
    const bannerImage = req.file?.filename || null;
    const title = req.body.title ?? null;

    const sql = "INSERT INTO banner (title, bannerImage) VALUES (?, ?)";
    await pool.query(sql, [title, bannerImage]);

    res.status(200).send("Values inserted");
  } catch (err) {
    await deleteUploadedFilesFromReq(req);
    console.error(err);
    res.status(500).send("Error inserting values");
  }
});

// Get all banners
app.get("/getAllData", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM banner");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

// Get banner by id
app.get("/getDataById/:id", async (req, res) => {
  try {
    const bannerId = req.params.id;
    const [rows] = await pool.query("SELECT * FROM banner WHERE id = ?", [bannerId]);
    if (!rows.length) return res.status(404).send("Banner not found");
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

// Update banner (replace image if new uploaded)
app.patch("/updateBanner/:id", upload.single("bannerImage"), async (req, res) => {
  const bannerId = req.params.id;
  const title = req.body.title;
  const newBannerImage = req.file?.filename;

  let oldImageToDelete = null;

  try {
    const [rows] = await pool.query("SELECT * FROM banner WHERE id = ?", [bannerId]);
    const existing = rows[0];
    if (!existing) {
      await deleteUploadedFilesFromReq(req);
      return res.status(404).send("Banner not found");
    }

    const setClause = [];
    const values = [];

    if (title !== undefined) {
      setClause.push("title = ?");
      values.push(title);
    }

    if (newBannerImage) {
      setClause.push("bannerImage = ?");
      values.push(newBannerImage);
      oldImageToDelete = existing.bannerImage || null;
    }

    if (!setClause.length) {
      await deleteUploadedFilesFromReq(req);
      return res.status(400).send("No fields to update");
    }

    values.push(bannerId);
    const sql = `UPDATE banner SET ${setClause.join(", ")} WHERE id = ?`;
    await pool.query(sql, values);

    // delete old image AFTER DB update success
    if (oldImageToDelete) {
      await safeUnlink(path.join(IMAGES_DIR, oldImageToDelete));
    }

    res.send("Banner updated");
  } catch (err) {
    // if update fails, remove newly uploaded file
    await deleteUploadedFilesFromReq(req);
    console.error(err);
    res.status(500).send("Error updating banner");
  }
});

// Delete banner (+ delete image)
app.delete("/deleteBanner/:id", async (req, res) => {
  try {
    const bannerId = req.params.id;
    const [rows] = await pool.query("SELECT * FROM banner WHERE id = ?", [bannerId]);
    const banner = rows[0];
    if (!banner) return res.status(404).send("Banner not found");

    // delete from DB first
    await pool.query("DELETE FROM banner WHERE id = ?", [bannerId]);

    // then delete file
    if (banner.bannerImage) {
      await safeUnlink(path.join(IMAGES_DIR, banner.bannerImage));
    }

    res.send("Banner and image deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting banner");
  }
});

// ---------- Projects (Products) ----------

// Create project
app.post(
  "/projectUpload",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImage1", maxCount: 1 },
    { name: "subImage2", maxCount: 1 },
    { name: "subImage3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
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
        extraData,
      } = req.body;

      const mainImage = req.files?.mainImage?.[0]?.filename || null;
      const subImage1 = req.files?.subImage1?.[0]?.filename || null;
      const subImage2 = req.files?.subImage2?.[0]?.filename || null;
      const subImage3 = req.files?.subImage3?.[0]?.filename || null;

      const sql = `
        INSERT INTO projects
        (address, name, status, landArea, noOfFloors, apartmentFloor, apartmentSize, bedroom, bathroom, launchDate, collection, extraData, mainImage, subImage1, subImage2, subImage3)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        address ?? null,
        name ?? null,
        status ?? null,
        landArea ?? null,
        noOfFloors ?? null,
        apartmentFloor ?? null,
        apartmentSize ?? null,
        bedroom ?? null,
        bathroom ?? null,
        launchDate ?? null,
        collection ?? null,
        extraData ?? null,
        mainImage,
        subImage1,
        subImage2,
        subImage3,
      ];

      await pool.query(sql, values);
      res.status(200).send("Values inserted");
    } catch (err) {
      await deleteUploadedFilesFromReq(req);
      console.error(err);
      res.status(500).send("Error inserting values");
    }
  }
);

// Get all projects
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Fetching Data");
  }
});

// Get single project by id
app.get("/getByProjectId/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId]);
    if (!rows.length) return res.status(404).send("project not found");
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

// Update project (replace only updated images, delete old ones)
app.patch(
  "/updateProduct/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImage1", maxCount: 1 },
    { name: "subImage2", maxCount: 1 },
    { name: "subImage3", maxCount: 1 },
  ]),
  async (req, res) => {
    const productId = req.params.id;

    const newMain = req.files?.mainImage?.[0]?.filename || null;
    const newSub1 = req.files?.subImage1?.[0]?.filename || null;
    const newSub2 = req.files?.subImage2?.[0]?.filename || null;
    const newSub3 = req.files?.subImage3?.[0]?.filename || null;

    const fields = req.body;

    let oldToDelete = []; // old image names to delete AFTER DB update

    try {
      const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [productId]);
      const existing = rows[0];
      if (!existing) {
        await deleteUploadedFilesFromReq(req);
        return res.status(404).send("Product Not found");
      }

      const setClause = [];
      const values = [];

      // text fields
      const allowedTextFields = [
        "address",
        "name",
        "status",
        "landArea",
        "noOfFloors",
        "apartmentFloor",
        "apartmentSize",
        "bedroom",
        "bathroom",
        "launchDate",
        "collection",
        "extraData",
      ];

      for (const key of allowedTextFields) {
        if (fields[key] !== undefined) {
          setClause.push(`${key} = ?`);
          values.push(fields[key]);
        }
      }

      // image fields (replace)
      if (newMain) {
        setClause.push("mainImage = ?");
        values.push(newMain);
        if (existing.mainImage) oldToDelete.push(existing.mainImage);
      }
      if (newSub1) {
        setClause.push("subImage1 = ?");
        values.push(newSub1);
        if (existing.subImage1) oldToDelete.push(existing.subImage1);
      }
      if (newSub2) {
        setClause.push("subImage2 = ?");
        values.push(newSub2);
        if (existing.subImage2) oldToDelete.push(existing.subImage2);
      }
      if (newSub3) {
        setClause.push("subImage3 = ?");
        values.push(newSub3);
        if (existing.subImage3) oldToDelete.push(existing.subImage3);
      }

      if (!setClause.length) {
        await deleteUploadedFilesFromReq(req);
        return res.status(400).send("No fields to update");
      }

      values.push(productId);
      const sql = `UPDATE projects SET ${setClause.join(", ")} WHERE id = ?`;
      await pool.query(sql, values);

      // delete old images after successful update
      await safeUnlinkMany(oldToDelete);

      res.send("Product updated");
    } catch (err) {
      // if update fails, remove newly uploaded files
      await deleteUploadedFilesFromReq(req);
      console.error(err);
      res.status(500).send("Error updating product");
    }
  }
);

// Delete project (+ delete all images)
app.delete("/deleteProject/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId]);
    const project = rows[0];
    if (!project) return res.status(404).send("Project not found");

    // delete from DB first
    await pool.query("DELETE FROM projects WHERE id = ?", [projectId]);

    // then delete files
    await safeUnlinkMany([project.mainImage, project.subImage1, project.subImage2, project.subImage3]);

    res.send("Project and image deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting project");
  }
});

// ---------- Witness ----------
app.get("/witness", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM witness");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

app.patch("/updateWitness/:id", async (req, res) => {
  try {
    const witnessId = req.params.id;
    const { witnessTitle, witnessPara } = req.body;

    const setClause = [];
    const values = [];

    if (witnessTitle !== undefined) {
      setClause.push("witnessTitle = ?");
      values.push(witnessTitle);
    }
    if (witnessPara !== undefined) {
      setClause.push("witnessPara = ?");
      values.push(witnessPara);
    }

    if (!setClause.length) return res.status(400).send("No fields to update");

    values.push(witnessId);
    await pool.query(`UPDATE witness SET ${setClause.join(", ")} WHERE id = ?`, values);

    res.send("Witness Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating witness");
  }
});

// ---------- LandWanted ----------
app.get("/landWanted", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM landwanted");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Fetching Data");
  }
});

app.patch("/landUpdate/:id", upload.single("landImage"), async (req, res) => {
  const landId = req.params.id;
  const { landWantedTitle, landWantedSubtitle, landWantedPara, phNumber } = req.body;
  const newLandImage = req.file?.filename;

  let oldToDelete = null;

  try {
    const [rows] = await pool.query("SELECT * FROM landwanted WHERE id = ?", [landId]);
    const existing = rows[0];
    if (!existing) {
      await deleteUploadedFilesFromReq(req);
      return res.status(404).send("Land not found");
    }

    const setClause = [];
    const values = [];

    if (landWantedTitle !== undefined) {
      setClause.push("landWantedTitle = ?");
      values.push(landWantedTitle);
    }
    if (landWantedSubtitle !== undefined) {
      setClause.push("landWantedSubtitle = ?");
      values.push(landWantedSubtitle);
    }
    if (landWantedPara !== undefined) {
      setClause.push("landWantedPara = ?");
      values.push(landWantedPara);
    }
    if (phNumber !== undefined) {
      setClause.push("phNumber = ?");
      values.push(phNumber);
    }
    if (newLandImage) {
      setClause.push("landImage = ?");
      values.push(newLandImage);
      oldToDelete = existing.landImage || null;
    }

    if (!setClause.length) {
      await deleteUploadedFilesFromReq(req);
      return res.status(400).send("No Fields to update");
    }

    values.push(landId);
    await pool.query(`UPDATE landwanted SET ${setClause.join(", ")} WHERE id = ?`, values);

    if (oldToDelete) await safeUnlink(path.join(IMAGES_DIR, oldToDelete));

    res.send("Land Wanted Update");
  } catch (err) {
    await deleteUploadedFilesFromReq(req);
    console.error(err);
    res.status(500).send("Error updating land");
  }
});

// ---------- Luxury ----------
app.get("/luxury", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM luxury");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Fetching Data");
  }
});

app.patch("/luxuryUpdate/:id", upload.single("luxuryImage"), async (req, res) => {
  const luxuryId = req.params.id;
  const { youtubeLink } = req.body;
  const newLuxuryImage = req.file?.filename;

  let oldToDelete = null;

  try {
    const [rows] = await pool.query("SELECT * FROM luxury WHERE id = ?", [luxuryId]);
    const existing = rows[0];
    if (!existing) {
      await deleteUploadedFilesFromReq(req);
      return res.status(404).send("Luxury not found");
    }

    const setClause = [];
    const values = [];

    if (youtubeLink !== undefined) {
      setClause.push("youtubeLink = ?");
      values.push(youtubeLink);
    }
    if (newLuxuryImage) {
      setClause.push("luxuryImage = ?");
      values.push(newLuxuryImage);
      oldToDelete = existing.luxuryImage || null;
    }

    if (!setClause.length) {
      await deleteUploadedFilesFromReq(req);
      return res.status(400).send("No Fields to update");
    }

    values.push(luxuryId);
    await pool.query(`UPDATE luxury SET ${setClause.join(", ")} WHERE id = ?`, values);

    if (oldToDelete) await safeUnlink(path.join(IMAGES_DIR, oldToDelete));

    res.send("Luxury Update");
  } catch (err) {
    await deleteUploadedFilesFromReq(req);
    console.error(err);
    res.status(500).send("Error updating luxury");
  }
});

// ---------- Metro ----------
app.get("/metro", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM metro");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Fetching Data");
  }
});

app.patch("/metroUpdate/:id", upload.single("metroImage"), async (req, res) => {
  const metroId = req.params.id;
  const { metroPara } = req.body;
  const newMetroImage = req.file?.filename;

  let oldToDelete = null;

  try {
    const [rows] = await pool.query("SELECT * FROM metro WHERE id = ?", [metroId]);
    const existing = rows[0];
    if (!existing) {
      await deleteUploadedFilesFromReq(req);
      return res.status(404).send("metro not found");
    }

    const setClause = [];
    const values = [];

    if (metroPara !== undefined) {
      setClause.push("metroPara = ?");
      values.push(metroPara);
    }
    if (newMetroImage) {
      setClause.push("metroImage = ?");
      values.push(newMetroImage);
      oldToDelete = existing.metroImage || null;
    }

    if (!setClause.length) {
      await deleteUploadedFilesFromReq(req);
      return res.status(400).send("No Fields to update");
    }

    values.push(metroId);
    await pool.query(`UPDATE metro SET ${setClause.join(", ")} WHERE id = ?`, values);

    if (oldToDelete) await safeUnlink(path.join(IMAGES_DIR, oldToDelete));

    res.send("metro updated");
  } catch (err) {
    await deleteUploadedFilesFromReq(req);
    console.error(err);
    res.status(500).send("Error updating metro");
  }
});

// ---------- Auth ----------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      "SELECT * FROM login WHERE username = ? AND password = ?",
      [email, password]
    );

    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    req.session.user = { email: rows[0].username };
    res.json({ message: "Login Successfully", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/logout", (req, res) => {
  if (!req.session) return res.status(500).json({ error: "Session not initialized" });

  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    res.json({ message: "Logout Successful" });
  });
});

// ---------- Serve images ----------
app.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(path.join(IMAGES_DIR, imageName));
});

// ---------- Global error handler (multer fileFilter etc.) ----------
app.use((err, req, res, next) => {
  console.error("Global error:", err?.message || err);
  res.status(400).json({ error: err?.message || "Something went wrong" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
