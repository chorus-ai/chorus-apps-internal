const assetService = require("../services/asset");

exports.findAll = async (req, res) => {
  const { page, pageSize } = req.query;
  const result = await assetService.findAll(page, pageSize);
  res.json(result);
};

exports.search = async (req, res) => {
  const { page, pageSize } = req.query;
  const filters = {
    source: req.query.source,
    type: req.query.type,
    ext: req.query.ext,
    info: req.query.info,
  };
  const result = await assetService.search(filters, page, pageSize);
  res.json(result);
};

exports.getById = async (req, res) => {
  const asset = await assetService.getById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Not found" });
  res.json(asset);
};

exports.bulkCreate = async (req, res) => {
  const payload = req.body;
  const result = await assetService.bulkCreate(payload);
  res.status(201).json(result);
};

exports.updateById = async (req, res) => {
  const { source, type, ext, info } = req.body;
  const result = await assetService.updateById(req.params.id, { source, type, ext, info });
  res.json(result);
};

exports.deleteById = async (req, res) => {
  const ok = await assetService.deleteById(req.params.id);
  if (!ok) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, message: "Asset deleted" });
};

exports.bulkDelete = async (req, res) => {
  const { ids } = req.body;
  const result = await assetService.bulkDelete(ids);
  res.json(result);
};
