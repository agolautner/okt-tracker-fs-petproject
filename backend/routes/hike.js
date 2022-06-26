const router = require("express").Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");

router.get("/all", auth({ block: true }), async (req, res) => {
    // return all hikes beloning to the user
    const user = await User.findById(res.locals.user.userId);
    if (!user) return res.status(404).send("User not found");
    const hikes = user.hikes;
    res.json(hikes);
});

router.get("/:id", auth({ block: true}), async (req, res) => {
  // return one hike data belonging to the user
  id = req.params.id;
  const user = await User.findById(res.locals.user.userId);
  if (!user) return res.status(404).send("User not found");
  // finding subdocument in array of hikes by id
  // this can probably be done with some sort of weird mongo query, but I'm not sure how
  for (let hike of user.hikes) {
    if (hike._id == id) {
      console.log(hike);
      return res.json(hike);
    }
  }
  res.status(404).send("Hike not found");
});

router.post("/new", auth({ block: true }), async (req, res) => {
  //add a new hike log to the logged in user
  const { title, description, start, end } = req.body;
  const date = new Date().toDateString();
  const user = await User.findById(res.locals.user.userId);
  if (!user) return res.status(404).send("User not found");
  const hike = {
    title,
    description,
    start,
    end,
    date
  }
  user.hikes.push(hike);
  await user.save();
  res.sendStatus(200);
});

// router.post("/:id/todos", async (req, res) => {
//   // create todo ,
// });

// router.patch("/:id", async (req, res) => {
//   //update existing dashboard
// });

// router.delete("/:id", async (req, res) => {
//   //delete :id dashboard
// });

// router.delete("/:id/todos/:todoId", async (req, res) => {
//   //delete todo
// });

module.exports = router;