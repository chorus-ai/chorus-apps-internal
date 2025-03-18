"use strict";
const db = require("../../models");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const cadaFileServices = require("../../services/cada/file");
const dotenv = require("dotenv");
dotenv.config();

exports.processAdibin = (req, res) => {
  function runScript() {
    return spawn(process.env.PYTHON_PATH, [
      path.join(__dirname, "../../python-scripts/adibin-handler.py"),
      path.join(process.env.BUCKET_PATH || "", `${req.query.filename}`),
      req.query.offset,
      req.query.range,
    ]);
  }

  const subprocess = runScript();

  subprocess.stderr.on("data", (data) => {
    console.log(`error:${data}`);
  });
  subprocess.on("error", (error) => {
    console.error(`Error spawning subprocess: ${error}`);
    res.status(500).send("Internal Server Error");
  });
  subprocess.stderr.on("close", () => {
    console.log("Closed");
  });

  res.set("Content-Type", "text/plain");
  subprocess.stdout.pipe(res);
  subprocess.stderr.pipe(res);
};

exports.processHdf5 = (req, res) => {
  function runScript() {
    return spawn(process.env.PYTHON_PATH, [
      path.join(__dirname, "../../python-scripts/hdf5-handler.py"),
      path.join(process.env.BUCKET_PATH || "", `${req.query.filename}`),
      req.query.offset,
      req.query.range,
    ]);
  }

  const subprocess = runScript();

  subprocess.stderr.on("data", (data) => {
    console.log(`error:${data}`);
  });
  subprocess.on("error", (error) => {
    console.error(`Error spawning subprocess: ${error}`);
    res.status(500).send("Internal Server Error");
  });
  subprocess.stderr.on("close", () => {
    console.log("Closed");
  });

  res.set("Content-Type", "text/plain");
  subprocess.stdout.pipe(res);
  subprocess.stderr.pipe(res);
};

exports.processPdf = (req, res) => {
  const pdfPath = path.join(process.env.BUCKET_PATH || "", `${req.query.filename}`);

  fs.access(pdfPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("File not found");
    }

    res.sendFile(pdfPath);
  });
};

exports.processJson = (req, res) => {
  const jsonPath = path.join(process.env.BUCKET_PATH || "", `${req.query.filename}`);

  fs.access(jsonPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("File not found");
    }

    fs.readFile(jsonPath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      res.set("Content-Type", "application/json");
      res.send(data);
    });
  });
};

/**
 * 1) List All Cada Files
 *    + Optional 'search' query param for partial path match
 *    + Pagination & sorting
 */
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder, search } = req.query;
  cadaFileServices
    .findAll(page, pageSize, sortOrder, search)
    .then((files) => res.status(200).json(files))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

/**
 * 2) Get a Cada File by ID
 */
exports.getFileById = (req, res) => {
  const { file_id } = req.params;
  cadaFileServices
    .findById(file_id)
    .then((file) => {
      if (!file) {
        return res.status(404).json({ message: `File with id=${file_id} not found.` });
      }
      return res.status(200).json(file);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

/**
 * 3) Create Bulk Cada Files
 *    Reuses your existing logic
 */
exports.bulkCreate = (req, res) => {
  const files = [...new Set(req.body.map(JSON.stringify))].map(JSON.parse);

  db.sequelize
    .transaction((t) => {
      const filePaths = files.map((f) => f.path);
      return cadaFileServices.findByFiles(t, filePaths).then((existing) => {
        const existingPaths = existing.map((e) => e.get({ plain: true }).path);

        let promiseArray = [];
        for (let i = 0; i < filePaths.length; i += 1000) {
          let newFiles = [];
          for (let j = i; j < filePaths.length && j < i + 1000; j++) {
            if (!existingPaths.includes(filePaths[j])) {
              newFiles.push(files.find((fl) => fl.path === filePaths[j]));
            }
          }
          if (newFiles.length > 0) {
            promiseArray.push(cadaFileServices.bulkCreate(t, newFiles));
          }
        }

        return Promise.all(promiseArray).then(() => {
          return cadaFileServices.findByFiles(t, filePaths).then((all) => {
            return all.map((f) => f.get({ plain: true }));
          });
        });
      });
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

/**
 * 4) Delete Bulk Cada Files
 */
exports.bulkDelete = (req, res) => {
  const { file_ids } = req.body;
  if (!Array.isArray(file_ids) || file_ids.length === 0) {
    return res.status(400).json({ message: "file_ids must be a non-empty array" });
  }

  cadaFileServices
    .bulkDelete(file_ids)
    .then((deletedCount) => {
      // e.g. number of rows deleted
      if (deletedCount > 0) {
        return res
          .status(200)
          .json({ message: `${deletedCount} file(s) deleted successfully.` });
      } else {
        return res.status(404).json({ message: "No matching files found to delete." });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

/**
 * 5) Search for Cada Files by path
 *    with pagination, sorting
 */
exports.searchByPath = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { path } = req.body; // partial or full
  cadaFileServices
    .searchByPath(page, pageSize, sortOrder, path)
    .then((files) => {
      if (files.length > 0) return res.status(200).json(files);
      return res.status(404).json({ message: "No files found matching path." });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
