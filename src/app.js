
const express = require("express");

const app = express();

app.use(express.json());

let tasks = [
    { id: 1, title: "Learn Node.js", completed: false },
    { id: 2, title: "Build my first app", completed: true }
];

app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f3f5fb;
            color: #1e293b;
        }

        header {
            background: #4f46e5;
            color: white;
            padding: 25px;
            text-align: center;
        }

        main {
            max-width: 650px;
            margin: 35px auto;
            padding: 20px;
        }

        .stats {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
        }

        .stat {
            flex: 1;
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 3px 12px #00000008;
        }

        .stat h2 {
            color: #4f46e5;
            margin: 0 0 8px;
        }

        .task-form {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        input {
            flex: 1;
            min-width: 0;
            padding: 13px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 15px;
        }

        button {
            border: none;
            border-radius: 8px;
            padding: 12px 15px;
            cursor: pointer;
            font-size: 14px;
        }

        .add-btn {
            background: #4f46e5;
            color: white;
        }

        .task {
            display: flex;
            align-items: center;
            gap: 10px;
            background: white;
            margin-bottom: 12px;
            padding: 15px;
            border-radius: 10px;
        }

        .task span {
            flex: 1;
            overflow-wrap: anywhere;
        }

        .completed {
            text-decoration: line-through;
            color: #94a3b8;
        }

        .delete-btn {
            background: #fee2e2;
            color: #b91c1c;
        }

        .empty {
            text-align: center;
            color: #64748b;
            padding: 25px;
        }

        @media (max-width: 480px) {
            .stats {
                gap: 8px;
            }

            .stat {
                padding: 14px 5px;
            }

            .task-form {
                flex-wrap: wrap;
            }

            .task-form input {
                width: 100%;
                flex-basis: 100%;
            }
        }
    </style>
</head>

<body>
    <header>
        <h1>TaskFlow</h1>
        <p>Organize your day, one task at a time.</p>
    </header>

    <main>
        <div class="stats">
            <div class="stat">
                <h2 id="total">0</h2>
                <span>Total Tasks</span>
            </div>

            <div class="stat">
                <h2 id="done">0</h2>
                <span>Completed</span>
            </div>
        </div>

        <form class="task-form" id="taskForm">
            <input
                id="taskInput"
                type="text"
                placeholder="What do you need to do?"
                maxlength="150"
                required
            >
            <button class="add-btn" type="submit">
                + Add Task
            </button>
        </form>

        <section id="taskList"></section>
    </main>

    <script>
        const taskList = document.getElementById("taskList");
        const taskInput = document.getElementById("taskInput");
        const total = document.getElementById("total");
        const done = document.getElementById("done");

        async function loadTasks() {
            const response = await fetch("/api/tasks");
            const tasks = await response.json();

            total.textContent = tasks.length;
            done.textContent =
                tasks.filter(task => task.completed).length;

            taskList.replaceChildren();

            if (tasks.length === 0) {
                const message = document.createElement("p");
                message.className = "empty";
                message.textContent = "No tasks yet. Add your first task!";
                taskList.appendChild(message);
                return;
            }

            tasks.forEach(task => {
                const item = document.createElement("div");
                item.className = "task";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed;
                checkbox.setAttribute("aria-label", "Complete task");

                const title = document.createElement("span");
                title.textContent = task.title;

                if (task.completed) {
                    title.className = "completed";
                }

                checkbox.addEventListener("change", async () => {
                    await fetch("/api/tasks/" + task.id, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            completed: checkbox.checked
                        })
                    });

                    loadTasks();
                });

                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-btn";
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", async () => {
                    await fetch("/api/tasks/" + task.id, {
                        method: "DELETE"
                    });

                    loadTasks();
                });

                item.append(checkbox, title, deleteButton);
                taskList.appendChild(item);
            });
        }

        document.getElementById("taskForm")
            .addEventListener("submit", async event => {
                event.preventDefault();

                const title = taskInput.value.trim();

                if (!title) return;

                const response = await fetch("/api/tasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ title })
                });

                if (response.ok) {
                    taskInput.value = "";
                    loadTasks();
                } else {
                    alert("Could not add task.");
                }
            });

        loadTasks();
    </script>
</body>
</html>
    `);
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post("/api/tasks", (req, res) => {
    const title = req.body.title?.trim();

    if (!title || title.length > 150) {
        return res.status(400).json({
            error: "Task title must contain 1-150 characters."
        });
    }

    const task = {
        id: Date.now(),
        title,
        completed: false
    };

    tasks.push(task);

    res.status(201).json(task);
});

// Mark a task as completed or incomplete
app.patch("/api/tasks/:id", (req, res) => {
    const task = tasks.find(
        task => task.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            error: "Task not found."
        });
    }

    if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({
            error: "Completed must be true or false."
        });
    }

    task.completed = req.body.completed;

    res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);
    const exists = tasks.some(task => task.id === taskId);

    if (!exists) {
        return res.status(404).json({
            error: "Task not found."
        });
    }

    tasks = tasks.filter(task => task.id !== taskId);

    res.json({ message: "Task deleted successfully." });
});

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

module.exports = app;

