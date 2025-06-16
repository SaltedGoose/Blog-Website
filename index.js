import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let blogPosts = [];

function getTime(){
    let time = new Date();

    let day = time.getDate();
    let month = time.getMonth();
    let year = time.getFullYear();

    let hour = time.getHours();
    let min = time.getMinutes();

    let formattedTime = `${day}/${month}/${year} ${hour}:${min}`
    return formattedTime;
}

function blogPost(blogInfo, time){
    this.name = blogInfo["usersName"];
    this.blogTitle = blogInfo["blogTitle"];
    this.blogText = blogInfo["blogText"];

    this.time = getTime();
}

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.get("/view", (req, res) => {
    res.render("view.ejs", {
        posts : blogPosts
    });
});

app.post("/add", (req, res) => {
    let blogInfo = req.body;
    let today = new Date();
    let newBlogPost = new blogPost(blogInfo, today);
    blogPosts.push(newBlogPost);
    res.redirect("/add");
});

app.post("/updateBlog", (req, res) => {
    let blogInfo = req.body;
    res.render("update.ejs",{
        name : blogInfo["name"],
        title : blogInfo["title"],
        text : blogInfo["text"]
    });
});

app.post("/update", (req, res) => {
    let updateBlogInfo = req.body;
    for (let i = 0; i < blogPosts.length; i++){
        if (blogPosts[i].name === updateBlogInfo["currentName"]){
            Object.defineProperty(blogPosts[i], "name", {value : updateBlogInfo["usersName"]});
            Object.defineProperty(blogPosts[i], "blogTitle", {value : updateBlogInfo["blogTitle"]});
            Object.defineProperty(blogPosts[i], "blogText", {value : updateBlogInfo["blogText"]});
            Object.defineProperty(blogPosts[i], "time", {value : getTime()});
        }
    }
    res.redirect("/view");
});

app.post("/delete", (req, res) => {
    let blogInfo = req.body;
    for (let i = 0; i < blogPosts.length; i++){
        if(blogPosts[i].name === blogInfo.name){
            blogPosts.splice(i,1);
        }
    }
    res.redirect("/view");
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});