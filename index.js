import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'

const app = express();
const port = 3000;

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

mongoose.connect(`${process.env.MONGO_CONNECT}`, {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
    name: String,
});

const Item = mongoose.model("Item", itemSchema);

const workSchema = new mongoose.Schema({
    name: String,
});

const WorkItem = mongoose.model("WorkItem", workSchema);

const item1 = new Item({
    name: "Welcome to your todolist!",
});

const item2 = new Item({
    name: "Hit the + button to add a new item.",
});

const item3 = new Item({
    name: "<-- Click this button to delete an item.",
});

const defaultItems = [item1, item2, item3];

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;

    const todayList = await Item.find({});

    if(todayList.length === 0) {
        await Item.insertMany(defaultItems);
        res.redirect("/");
    }
    else {
        res.render("today.ejs", {
            data: todayList,
            listType: "today",
            displayText: weekday[date.getDay()] + ", " + months[month - 1] + " " + day,
        });
    }
});

app.get("/work", async (req, res) => {
    const workList = await WorkItem.find({});
    if(workList.length === 0) {
        await WorkItem.insertMany(defaultItems);
        res.redirect("/work");
    }
    else {
        res.render("work.ejs", {
            data: workList,
            listType: "work",
            displayText: "Work List",
        });
    }
});

app.post("/add", async (req, res) => {
    if(req.body.listType === "todayList") {
        const itemSubmit = new Item({
            name: req.body.addTodayItem,
        });
        await itemSubmit.save();
        res.redirect("/");
    }
    else {
        const itemSubmit = new WorkItem({
            name: req.body.addWorkItem,
        });
        await itemSubmit.save();
        res.redirect("/work");
    }
});

app.post("/delete", async (req, res) => {
    const id = req.body.checkbox;
    if(req.body.listType === "todayList") {
        await Item.findOneAndRemove({_id: id});
        res.redirect("/");
    }
    else {
        await WorkItem.findOneAndRemove({_id: id});
        res.redirect("/work");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});