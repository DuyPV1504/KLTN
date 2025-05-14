const History = require("../models/History");

exports.saveHistory = async (req, res) => {
  try {
    const { practiceType, passage, questions, score } = req.body;
    
    const history = new History({
      userEmail: req.user.email,
      practiceType,
      passage,
      questions,
      score
    });
    await history.save();
    res.status(201).json({ message: "History saved", id: history._id });
  } catch (err) {
    console.error("Save history error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { practiceType, search, sortBy = "score-desc", page = 1, limit = 5 } = req.query;
    
    const query = { userEmail: req.user.email };

    if (practiceType && practiceType !== "all") {
      query.practiceType = practiceType.toUpperCase();
    }

    if (search) {
      query.passage = { $regex: search, $options: "i" };
    }

    const [field, order] = sortBy.split("-");
    const sort = { [field]: order === "asc" ? 1 : -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const history = await History.find(query).sort(sort).skip(skip).limit(parseInt(limit));
    const total = await History.countDocuments(query);

    const result = history.map(h => ({
      _id: h._id,
      passage: h.passage,
      practiceType: h.practiceType,
      score: h.score,
      questions: h.questions,
      userEmail: h.userEmail
    }));

    res.json({
      history: result,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getHistoryById = async (req, res) => {
  try {
    const item = await History.findOne({ 
      _id: req.params.id,
      userEmail: req.user.email
    });    
    
    if (!item) return res.status(404).json({ message: "Not found" });

    res.json({
      _id: item._id,
      passage: item.passage,
      practiceType: item.practiceType,
      score: item.score,
      questions: item.questions,
      userEmail: item.userEmail
    });
  } catch (err) {
    console.error("Get history by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};