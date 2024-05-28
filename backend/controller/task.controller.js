const Tasks = require("../modal/task.modal");

exports.getTasks = async (req, res) => {
  try {
    Tasks.find(
      {
        userId: req.query._id,
      },
      function (err, product) {
        return res.status(200).json({ Tasks: product });
      }
    );
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.addTask = async (req, res) => {
  const { title, remarks } = req.body;
  if (!title || !remarks) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  const TaskToAdd = new Tasks(req.body);
  try {
    const createdTask = await TaskToAdd.save();
    return res.status(201).json({ task: createdTask });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: "Task Id is required" });
  }
  try {
    const deletedTask = await Tasks.deleteOne({
      _id: taskId,
    });
    return res.status(201).json({ task: deletedTask });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: "Task Id is required" });
  }
  try {
    const updatedTask = await Tasks.updateOne(
      {
        _id: taskId,
      },
      req.body
    );
    return res
      .status(201)
      .json({ success: true, message: "Task has being updated" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
