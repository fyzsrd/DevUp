const express =require('express')
const { userAuth, adminAuth } = require('../middleware/auth')
const profileRouter = express.Router();

//get user by profile
profileRouter.get('/profile',userAuth, async (req, res) => {
  try {
    const user=req.user
    res.send('we welcome ' + user)

  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

// get all users
profileRouter.get('/feed',userAuth, async (req, res) => {
  try {

    const data = await User.find()

    res.send(data)
  } catch (err) {
    res.status(401).send("erroe")
  }
})

// delete user
profileRouter.delete('/delete', async (req, res) => {
  const userId = req.body.userId;
  try {

    const user = await User.findByIdAndDelete(userId)

    res.send('deleted')
  } catch (err) {
    res.status(401).send("erroe")
  }
})

//update user
profileRouter.patch('/update/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age"];
  const isUpdateAllowed = Object.keys(data).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  try {
    if (!isUpdateAllowed) {
      throw new Error('Update Not Allowed');
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send({ message: 'User updated', user });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports=profileRouter;