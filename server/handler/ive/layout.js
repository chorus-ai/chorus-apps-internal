// handler/ive/layout.js
const layoutService = require("../../services/ive/layout");

/**
 * 1. List All Layout Configurations
 */
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  layoutService
    .findAll(page, pageSize, sortOrder)
    .then((layouts) => res.status(200).json(layouts))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

/**
 * 2. Get a Layout Configuration by ID
 */
exports.findById = (req, res) => {
  const { layout_id } = req.params;
  layoutService
    .findById(layout_id)
    .then((layout) => {
      if (!layout) {
        return res.status(404).json({ message: `Layout with id=${layout_id} not found.` });
      }
      return res.status(200).json(layout);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

/**
 * 3. Create a New Layout Configuration
 */
exports.create = (req, res) => {
  const { name, config } = req.body;
  if (!name || !config) {
    return res
      .status(400)
      .json({ message: "Both 'name' and 'config' are required fields." });
  }
  layoutService
    .createLayout(name, config)
    .then((newLayout) => res.status(201).json(newLayout))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

/**
 * 4. Update an Existing Layout Configuration
 */
exports.update = (req, res) => {
  const { layout_id } = req.params;
  const { name, config } = req.body;
  if (!name || !config) {
    return res
      .status(400)
      .json({ message: "Both 'name' and 'config' are required fields." });
  }
  layoutService
    .updateLayout(layout_id, name, config)
    .then((updatedLayout) => {
      if (!updatedLayout) {
        return res
          .status(404)
          .json({ message: `Layout with id=${layout_id} not found or not updated.` });
      }
      return res.status(200).json(updatedLayout);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

/**
 * 5. Delete a Layout Configuration
 */
exports.delete = (req, res) => {
  const { layout_id } = req.params;
  layoutService
    .deleteLayout(layout_id)
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        return res
          .status(404)
          .json({ message: `Layout with id=${layout_id} not found.` });
      }
      return res.status(200).json({ message: "Layout configuration deleted successfully." });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

/**
 * 6. Search for Layouts by Name
 */
exports.searchByName = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { name } = req.body;
  layoutService
    .searchByName(name, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No layouts found matching the criteria." });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
