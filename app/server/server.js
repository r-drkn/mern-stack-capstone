if (process.env.NODE_ENV !== "production") require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");

// EXPRESS CONFIG
const app = express();
const port = process.env.PORT || 8080;

//CORS CONFIGURATION
const allowList = [
  "http://localhost:3000",
  "https://dogolatmusicco.herokuapp.com/",
  "https://dogolatmusicco.netlify.app/",
]; // allow to server to accept request from different origin
const corsConfig = {
  origin: (origin, callback) => {
    // Check each url in allowList and see if it includes the origin (instead of matching exact string)
    const allowListIndex = allowList.findIndex((url) => url.includes(origin));
    // console.log("ORIGIN :: ", allowList[allowListIndex]);
    callback(null, allowListIndex > -1);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(express.json({ limit: "50mb" }));

//DATABASE
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("DB :: connected successfully."));

//SESSION CONFIGURATION
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "cookie cat",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: { expires: 3600000, httpOnly: false },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
};

if (process.env.NODE_ENV === "production") {
  sessionConfig.cookie.sameSite = "none"; // allow cross-site usage of cookies
  sessionConfig.cookie.secure = true; // secures cookies
}
app.enable("trust proxy"); //stamps the cookie to tell FE it is secure

//MIDDLEWARE
app.use(session(sessionConfig));

//configure local strategy for passport
require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());

//API ROUTES
const apiRoutes = require("./api/apiRoutes");
app.use("/api", apiRoutes);

//if in production, serve static front end
//SET REACT BUILD FOLDER
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("PORT :: Listening @ port:" + port);
});
