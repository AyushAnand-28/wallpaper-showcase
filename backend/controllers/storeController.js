import Store from "../models/Store.js";

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private (STORE_OWNER)
const createStore = async (req, res) => {
  try {
    const { name, description, address, city, imageUrl } = req.body;

    if (!name || !address || !city) {
      return res.status(400).json({ message: "Name, address, and city are required" });
    }

    const store = await Store.create({
      name,
      description,
      address,
      city,
      imageUrl,
      owner: req.user._id,
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active stores (optionally filter by city)
// @route   GET /api/stores
// @access  Public
const getStores = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = { isActive: true };
    if (city) filter.city = { $regex: city, $options: "i" };

    const stores = await Store.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single store by ID
// @route   GET /api/stores/:id
// @access  Public
const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate("owner", "name email");
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stores owned by logged-in user
// @route   GET /api/stores/my
// @access  Private (STORE_OWNER)
const getMyStores = async (req, res) => {
  try {
    const stores = await Store.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a store
// @route   PUT /api/stores/:id
// @access  Private (STORE_OWNER — must own the store)
const updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this store" });
    }

    const { name, description, address, city, imageUrl, isActive } = req.body;
    if (name) store.name = name;
    if (description !== undefined) store.description = description;
    if (address) store.address = address;
    if (city) store.city = city;
    if (imageUrl !== undefined) store.imageUrl = imageUrl;
    if (isActive !== undefined) store.isActive = isActive;

    const updated = await store.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createStore, getStores, getStoreById, getMyStores, updateStore };
