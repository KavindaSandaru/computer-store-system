require("dotenv").config({ quiet: true });

const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");

const Order = require("./models/Order");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Computer Store API is running",
    routes: ["/api/health", "/api/products"],
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/products", async (_req, res, next) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put(
  "/api/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const updatedProduct =
        await Product.findByIdAndUpdate(
          req.params.id,

          {
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            description: req.body.description,
          },

          {
            new: true,
          }
        );

      if (!updatedProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

app.post(
  "/api/orders",
  authMiddleware,
  async (req, res) => {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: "Order must include at least one item",
        });
      }

      const orderItems = items.map((item) => ({
        productId: item.productId || item._id,
        name: item.name,
        price: Number(item.price),
        image: item.image,
        quantity: Number(item.quantity),
      }));

      const hasInvalidItem = orderItems.some(
        (item) =>
          !mongoose.Types.ObjectId.isValid(
            item.productId
          ) ||
          !item.name ||
          Number.isNaN(item.price) ||
          Number.isNaN(item.quantity) ||
          item.quantity < 1
      );

      if (hasInvalidItem) {
        return res.status(400).json({
          message: "Order contains invalid items",
        });
      }

      const calculatedTotal = orderItems.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      );

      const order = await Order.create({
        user: req.user.id,

        items: orderItems,

        totalPrice: calculatedTotal,
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

app.get(
  "/api/orders/my-orders",
  authMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    message: "Server error",
  });
});

startServer();
