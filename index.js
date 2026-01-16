const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const {v4: uuidv4} = require("uuid");
const methodOverride = require("method-override");
const multer = require("multer");

app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.set("view engine", "ejs"); //view engine of express -> ejs template
app.set("views", path.join(__dirname, "views")); //absolute path to find views dir

app.use(express.static(path.join(__dirname, "public"))); //sets up static files like images, css files, js files etc.

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

let posts = [
    {
        id: uuidv4(),
        username: "alex.codes",
        content: "Looking to connect with other software engineers!",
        image: "/images/pic1.jpg"
    },
    {
        id: uuidv4(),
        username: "grace_23",
        content: "Why do programmers prefer dark mode?",
        image: "/images/pic2.jpg"
    },
    {
        id: uuidv4(),
        username: "okte",
        content: "The more I learn about the complexities of coding, thee more my passion grows. Overcoming even small coding challenges bring me pure joy",
        image: "/images/pic3.jpeg"
    },
    {
        id: uuidv4(),
        username: "ritesh_kumar",
        content: "Microsoft server down globally. Happy Blue screen day",
        image: "/images/pic4.jpg"
    }
]; 

app.get("/", (req, res) => {
    res.redirect("/posts");
});

app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts});
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", upload.single('image'), (req, res) => {
    let {username, content} = req.body;
    const image = req.file ? `/images/${req.file.filename}` : '';
    let id = uuidv4();
    posts.unshift({id, username, content, image});
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("show.ejs", {post});
});

app.patch("/posts/:id", (req, res) => {
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", {post});
});

app.delete("/posts/:id", (req, res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
