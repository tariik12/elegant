// app.js
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = Number(process.env.PORT || 3000);

const IMAGES_DIR = path.join(__dirname, "im", "images");

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// -------------------- Middleware --------------------
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static(IMAGES_DIR));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

// -------------------- Database --------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Database connected");
    conn.release();
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
})();

// -------------------- Multer --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, png, webp images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const projectImagesUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "subImage1", maxCount: 1 },
  { name: "subImage2", maxCount: 1 },
  { name: "subImage3", maxCount: 1 },
]);

const deleteFile = (fileName) => {
  if (!fileName) return;

  const filePath = path.join(IMAGES_DIR, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const deleteUploadedFiles = (req) => {
  if (!req.files) return;

  Object.keys(req.files).forEach((key) => {
    req.files[key].forEach((file) => {
      deleteFile(file.filename);
    });
  });

  if (req.file) {
    deleteFile(req.file.filename);
  }
};

// -------------------- Project Upload --------------------
app.post("/projectUpload", projectImagesUpload, async (req, res) => {
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
      (
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
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      address || null,
      name || null,
      status || "Upcoming",
      landArea || null,
      noOfFloors || null,
      apartmentFloor || null,
      apartmentSize || null,
      bedroom || null,
      bathroom || null,
      launchDate || null,
      collection || null,
      extraData || null,
      mainImage,
      subImage1,
      subImage2,
      subImage3,
    ];

    await pool.query(sql, values);

    res.status(200).json({
      message: "Project uploaded successfully",
    });
  } catch (error) {
    deleteUploadedFiles(req);
    console.error("Project upload error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// -------------------- Get All Projects --------------------
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// -------------------- Get Project By ID --------------------
app.get("/getByProjectId/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [
      req.params.id,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Get project by id error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// -------------------- Update Project --------------------
app.patch("/updateProduct/:id", projectImagesUpload, async (req, res) => {
  try {
    const projectId = req.params.id;

    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [
      projectId,
    ]);

    if (!rows.length) {
      deleteUploadedFiles(req);
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const oldProject = rows[0];

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

    const setParts = [];
    const values = [];

    allowedTextFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        setParts.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    });

    const imageFields = ["mainImage", "subImage1", "subImage2", "subImage3"];
    const oldImagesToDelete = [];

    imageFields.forEach((field) => {
      const newFile = req.files?.[field]?.[0]?.filename;

      if (newFile) {
        setParts.push(`${field} = ?`);
        values.push(newFile);

        if (oldProject[field]) {
          oldImagesToDelete.push(oldProject[field]);
        }
      }
    });

    if (!setParts.length) {
      deleteUploadedFiles(req);
      return res.status(400).json({
        error: "No fields to update",
      });
    }

    values.push(projectId);

    const sql = `UPDATE projects SET ${setParts.join(", ")} WHERE id = ?`;

    await pool.query(sql, values);

    oldImagesToDelete.forEach(deleteFile);

    res.status(200).json({
      message: "Project updated successfully",
    });
  } catch (error) {
    deleteUploadedFiles(req);
    console.error("Project update error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// -------------------- Delete Project --------------------
app.delete("/deleteProject/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [
      projectId,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const project = rows[0];

    await pool.query("DELETE FROM projects WHERE id = ?", [projectId]);

    deleteFile(project.mainImage);
    deleteFile(project.subImage1);
    deleteFile(project.subImage2);
    deleteFile(project.subImage3);

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// -------------------- Banner --------------------
app.post("/bannerUpload", upload.single("bannerImage"), async (req, res) => {
  try {
    const title = req.body.title || null;
    const bannerImage = req.file?.filename || null;

    await pool.query("INSERT INTO banner (title, bannerImage) VALUES (?, ?)", [
      title,
      bannerImage,
    ]);

    res.json({
      message: "Banner uploaded successfully",
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.filename);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/getAllData", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM banner ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/getDataById/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM banner WHERE id = ?", [
      req.params.id,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        error: "Banner not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.patch("/updateBanner/:id", upload.single("bannerImage"), async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM banner WHERE id = ?", [
      req.params.id,
    ]);

    if (!rows.length) {
      if (req.file) deleteFile(req.file.filename);

      return res.status(404).json({
        error: "Banner not found",
      });
    }

    const oldBanner = rows[0];

    const setParts = [];
    const values = [];

    if (req.body.title !== undefined) {
      setParts.push("title = ?");
      values.push(req.body.title);
    }

    if (req.file) {
      setParts.push("bannerImage = ?");
      values.push(req.file.filename);
    }

    if (!setParts.length) {
      return res.status(400).json({
        error: "No fields to update",
      });
    }

    values.push(req.params.id);

    await pool.query(`UPDATE banner SET ${setParts.join(", ")} WHERE id = ?`, values);

    if (req.file && oldBanner.bannerImage) {
      deleteFile(oldBanner.bannerImage);
    }

    res.json({
      message: "Banner updated successfully",
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.filename);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.delete("/deleteBanner/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM banner WHERE id = ?", [
      req.params.id,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        error: "Banner not found",
      });
    }

    const banner = rows[0];

    await pool.query("DELETE FROM banner WHERE id = ?", [req.params.id]);

    deleteFile(banner.bannerImage);

    res.json({
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// -------------------- Other Routes --------------------
app.get("/witness", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM witness");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/updateWitness/:id", async (req, res) => {
  try {
    const { witnessTitle, witnessPara } = req.body;

    const setParts = [];
    const values = [];

    if (witnessTitle !== undefined) {
      setParts.push("witnessTitle = ?");
      values.push(witnessTitle);
    }

    if (witnessPara !== undefined) {
      setParts.push("witnessPara = ?");
      values.push(witnessPara);
    }

    if (!setParts.length) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.params.id);

    await pool.query(`UPDATE witness SET ${setParts.join(", ")} WHERE id = ?`, values);

    res.json({ message: "Witness updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Auth --------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM login WHERE username = ? AND password = ?",
      [email, password]
    );

    if (!rows.length) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    req.session.user = {
      email: rows[0].username,
    };

    res.json({
      message: "Login successfully",
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: "Logout failed",
      });
    }

    res.json({
      message: "Logout successful",
    });
  });
});

// -------------------- Global Error Handler --------------------
app.use((error, req, res, next) => {
  console.error("Global error:", error.message);

  res.status(400).json({
    error: error.message || "Something went wrong",
  });
});

// -------------------- Start Server --------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});