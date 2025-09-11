// Import required modules
import express from "express"; // Web framework for building server-side applications
import bodyParser from "body-parser"; // Middleware to parse incoming request bodies
import pg from "pg"; // PostgreSQL client for Node.js
import methodOverride from "method-override"; // Allows HTTP verbs like PUT and DELETE in places where they are not supported (e.g., HTML forms)
import bcrypt from "bcrypt"; // Library for hashing passwords securely
import session from "express-session"; // Middleware for handling user sessions
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10; // Used to define the cost factor for bcrypt password hashing

env.config();

// Database connection setup
const db = new pg.Client({
    user:process.env.PG_USER,
    host:process.env.PG_HOST,
    database:process.env.PG_DATABASE,
    password:process.env.PG_PASSWORD,
    port:process.env.PG_PORT,
});

db.connect(); // Establish connection to the database

// Middleware to serve static files from the "public" folder
app.use(express.static("public"));

// Middleware to parse JSON bodies from HTTP requests
app.use(express.json());

// Middleware to parse URL-encoded data from form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Allow HTML forms to simulate PUT/DELETE using ?_method=PUT or ?_method=DELETE
app.use(methodOverride("_method"));

// This sets up session support in your Express app.
// It lets the server remember things about each user — like if they're logged in —
// even as they move between pages.

// const session = require('express-session'); // Make sure to import express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // A secret key to help keep session data safe
    resave: false, // Don't save session again if nothing has changed
    saveUninitialized: false, // Don't create session until there's something to save (like login info)
    cookie: {
      httpOnly: true, // Only the server can see this cookie (not JavaScript) — safer
      secure: false, // Use 'true' only if your site uses HTTPS (secure connection)
      maxAge: 1000 * 60 * 60 * 24, // How long the cookie lasts — 24 hours in this case
    },
  })
  // req.session.username = "John";
// console.log(req.session.username); // Will show "John"
);
process.env.SESSION_SECRET

// app.get('/dashboard', isAuthenticated, nocache, (req, res) => {
//   res.render('dashboard');
// });
// This way:

// isAuthenticated makes sure only logged-in users get access.

// nocache makes sure the page isn't saved in the browser.

/*
 * This function checks if a user is logged in.
 * It's used to protect pages — if there's no user session, it redirects to login.
 */

// 1. req.session
// This checks if the session object exists on the request — in other words, has the user started a session?

// 2. req.session.userId
// This checks if the session contains a userId — which usually means the user is logged in 
// (you probably set this value during login or signup like req.session.userId = user.id).


function isAuthenticated(req, res, next) {
  //That userId was set earlier (after login or signup).
  if (req.session && req.session.userId) {
    next(); // User is logged in — continue to the page they were trying to visit
  } else {
    res.redirect("/login"); // User is not logged in — send them to the login page
  }
}

/*
 * This function stops the browser from saving (caching) sensitive pages.
 * It makes sure users can't hit "back" after logging out and still see protected content.
 */
function nocache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate"); // Tells modern browsers not to store the page
  res.header("Expires", "-1"); // Makes the page look expired to older browsers
  res.header("Pragma", "no-cache"); // Another no-cache signal for older HTTP/1.0
  next(); // Move on to the next middleware or route
}


// Set view engine to EJS for rendering dynamic HTML
app.set("view engine", "ejs");

// Homepage route (accessible to anyone, but no cached content allowed)
app.get("/", nocache, (req, res) => {
  res.render("welcome_page.ejs", { username: req.session.username || null });
});

// Show the signup form
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

// Handle user signup
app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE username=$1", [username]);
    if (checkResult.rows.length > 0) {
      return res.status(400).send("Username already exists");
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error while hashing password");
      }

      try {
        // Insert user and get the new user's ID
        const insertResult = await db.query(
          "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",[username, hash]);

        // Set session
        req.session.userId = insertResult.rows[0].id;
        req.session.username = username;

        res.status(200).json({ message: "Signup successful" });

      } catch (insertError) {
        if (insertError.code === "23505") {
          return res.status(400).send("Username already exists (duplicate key)");
        }
        console.error(insertError);
        return res.status(500).send("Database error during signup");
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error during signup");
  }
});


// Handle user login
app.post("/login", async (req, res) => {
  //GET THE VALUES FROM THE UNPUT
  const username = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE username=$1", [username]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      // Compare provided password with stored hashed password
      const passwordMatch = await bcrypt.compare(loginPassword, storedHashedPassword);

      if (passwordMatch) {
        // Successful login: store user info in session
        req.session.userId = user.id;
        req.session.username = user.username;

        return res.json({ success: true });
      } else {
        return res.status(400).json({ message: "Your username or your password was wrong, try again." });
      }
    } else {
      return res.status(400).json({ message: "You don't have an account." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


// Protected route: show form to create a new note

// Without authentication checks:

// Anyone can open your route by just typing the URL.

// There's no way to tell who the user is or whether they should access that page.
app.get("/create_note", nocache, isAuthenticated, (req, res) => {
  res.render("create_note.ejs", { username: req.session.username });
});

// Handle form submission for a new thought/note
app.post("/submit_thought", nocache, isAuthenticated, async (req, res) => {

  //GET THE VALUES OF THE TWO INPUTS
  const thought = req.body["thought"];
  const realization = req.body["realization"] || null;

  try {

    // Save new thought to the database
    const result = await db.query(
      "INSERT INTO thoughts(thought, response, user_id) VALUES ($1, $2, $3)",
      [thought, realization, req.session.userId]
    );

    res.status(200).json({ message: "Thought saved successfully!" });
  } catch (error) {
    console.error("Error saving to the database:", error);
    res.status(500).json({ error: "An error occurred while saving the thought." });
  }
});

// Show list of all saved thoughts (protected and not cached)
app.get("/review_note", nocache, isAuthenticated, async (req, res) => {
  try {
    const result = await db.query(
  "SELECT * FROM thoughts WHERE user_id = $1 ORDER BY id DESC",
  [req.session.userId]
);

    let thoughts = result.rows;
    res.render("review_note.ejs", { thoughts, username: req.session.username });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while loading the thoughts.");
  }
});

// Delete a specific thought by ID
app.delete("/delete_thought/:id", isAuthenticated, async (req, res) => {
  const thought_id = req.params.id;

  try {
    const result = await db.query(
      "DELETE FROM thoughts WHERE id = $1 AND user_id = $2",
      [thought_id, req.session.userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).send("Unauthorized or thought not found");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to delete post");
  }
});


// Update an existing thought's text
app.put("/update_thought/:id", isAuthenticated, async (req, res) => {
  const thought_id = req.params.id;
  const thought = req.body["thought"];

  try {
    const result = await db.query(
      "UPDATE thoughts SET thought = $1 WHERE id = $2 AND user_id = $3",
      [thought, thought_id, req.session.userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).send("Unauthorized or thought not found");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update thought post");
  }
});


// Update a thought's realization/response
app.put("/update_realization/:id", isAuthenticated, async (req, res) => {
  const realization_id = req.params.id;
  const answer = req.body["realization"] || null;

  try {
    const result = await db.query(
      "UPDATE thoughts SET response = $1 WHERE id = $2 AND user_id = $3",
      [answer, realization_id, req.session.userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).send("Unauthorized or thought not found");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update realization post");
  }
});

// Handle logout and destroy the session
app.post("/logout", (req, res) => {
  console.log("Destroying session...");
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Logout failed");
    }

    // Clear the session cookie
    res.clearCookie("connect.sid");

    // Explicitly disable caching after logout to prevent back button showing protected pages
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.redirect("/");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server runs on port ${port}`);
});
