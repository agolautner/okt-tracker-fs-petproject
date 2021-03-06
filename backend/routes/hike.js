const router = require("express").Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");

router.get("/all", auth({ block: true }), async (req, res) => {
    // return all hikes beloning to the user
    const user = await User.findById(res.locals.user.userId);
    if (!user) return res.status(401).send("User not found");
    const hikes = user.hikes;
    res.json(hikes);
});

router.get("/:id", auth({ block: true}), async (req, res) => {
  // return one hike data belonging to the user
  id = req.params.id;
  const user = await User.findById(res.locals.user.userId);
  if (!user) return res.status(401).send("User not found");
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

router.delete("/:id", auth({ block: true}), async (req, res) => {
  // return one hike data belonging to the user
  id = req.params.id;
  const user = await User.findById(res.locals.user.userId);
  if (!user) return res.status(401).send("User not found");
  // finding subdocument in array of hikes by id
  for (let hike of user.hikes) {
    if (hike._id == id) {
      console.log(hike);
      await user.hikes.pull(hike);
      await user.save();
      return res.status(200).json('Hike deleted');
    }
  }
  res.status(404).send("Hike not found");
});

router.patch("/:id", auth({ block: true}), async (req, res) => {
  // updates one hike data belonging to the user
  id = req.params.id;
  const { title, description, start, end, date } = req.body;
  const user = await User.findById(res.locals.user.userId);
  if (!user) return res.status(401).send("User not found");
  // finding subdocument in array of hikes by id
  // this can probably be done with some sort of weird mongo query, but I'm not sure how
  for (let hike of user.hikes) {
    if (hike._id == id) {
      // update the hike with the new data
      hike.title = title;
      hike.description = description;
      hike.start = start;
      hike.end = end;
      hike.date = date;
      await user.save();
      return res.status(200).json(hike);
    }
  }
  res.status(404).send("Hike not found");
});

router.post("/new", auth({ block: true }), async (req, res) => {
  //add a new hike log to the logged in user
  const { title, description, start, end, date } = req.body;
  const user = await User.findById(res.locals.user.userId);
  if (!user) return res.status(401).send("User not found");
  if (!title || !description || !start || !end || !date) return res.status(400).send("Missing data");
  const hike = {
    title,
    description,
    start,
    end,
    date
  }
  user.hikes.push(hike);
  await user.save();
  res.status(200).json(user);
});

module.exports = router;
