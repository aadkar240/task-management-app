import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");

    const [editingTask, setEditingTask] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Get all tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/tasks");
            const data = await response.json();

            setTasks(data);
        } catch (error) {
            console.log("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add or update task
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a task title");
            return;
        }

        try {
            if (editingTask) {
                const response = await fetch(
                    `http://localhost:5000/api/tasks/${editingTask._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title,
                            description,
                            priority
                        })
                    }
                );

                const updatedTask = await response.json();

                setTasks(
                    tasks.map((task) =>
                        task._id === updatedTask._id
                            ? updatedTask
                            : task
                    )
                );

                setEditingTask(null);
            } else {
                const response = await fetch(
                    "http://localhost:5000/api/tasks",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title,
                            description,
                            priority
                        })
                    }
                );

                const newTask = await response.json();

                setTasks([newTask, ...tasks]);
            }

            setTitle("");
            setDescription("");
            setPriority("Medium");

        } catch (error) {
            console.log("Error saving task:", error);
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "DELETE"
            });

            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.log("Error deleting task:", error);
        }
    };

    // Edit task
    const editTask = (task) => {
        setEditingTask(task);

        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
    };

    // Change status
    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status
                    })
                }
            );

            const updatedTask = await response.json();

            setTasks(
                tasks.map((task) =>
                    task._id === updatedTask._id
                        ? updatedTask
                        : task
                )
            );
        } catch (error) {
            console.log("Error updating status:", error);
        }
    };

    // Mark task as completed or pending
    const toggleTask = async (task) => {
        const newStatus =
            task.status === "Completed"
                ? "Pending"
                : "Completed";

        await updateStatus(task._id, newStatus);
    };

    // Filter tasks
    const filteredTasks = tasks.filter((task) => {

        const matchesSearch = task.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            task.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="app">

            <h1>Task Management App</h1>

            <div className="container">

                {/* Add / Edit Task */}

                <form
                    className="task-form"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        {editingTask
                            ? "Edit Task"
                            : "Add New Task"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <textarea
                        placeholder="Task description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    ></textarea>

                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value)
                        }
                    >
                        <option value="Low">
                            Low
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="High">
                            High
                        </option>
                    </select>

                    <button type="submit">
                        {editingTask
                            ? "Update Task"
                            : "Add Task"}
                    </button>

                    {editingTask && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingTask(null);
                                setTitle("");
                                setDescription("");
                                setPriority("Medium");
                            }}
                        >
                            Cancel
                        </button>
                    )}

                </form>

                {/* Search and Filter */}

                <div className="filters">

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option value="All">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Completed">
                            Completed
                        </option>
                    </select>

                </div>

                {/* Task List */}

                <div className="task-list">

                    <h2>Tasks</h2>

                    {filteredTasks.length === 0 ? (
                        <p>No tasks found.</p>
                    ) : (

                        filteredTasks.map((task) => (

                            <div
                                className={
                                    task.status === "Completed"
                                        ? "task-card completed"
                                        : "task-card"
                                }
                                key={task._id}
                            >

                                <div className="task-title">

                                    <input
                                        type="checkbox"
                                        checked={
                                            task.status ===
                                            "Completed"
                                        }
                                        onChange={() =>
                                            toggleTask(task)
                                        }
                                    />

                                    <h3>
                                        {task.title}
                                    </h3>

                                </div>

                                <p>
                                    {task.description}
                                </p>

                                <p>
                                    Priority:
                                    <strong>
                                        {" "}{task.priority}
                                    </strong>
                                </p>

                                <div className="status-section">

                                    <label>
                                        Status:
                                    </label>

                                    <select
                                        value={task.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                task._id,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="In Progress">
                                            In Progress
                                        </option>

                                        <option value="Completed">
                                            Completed
                                        </option>
                                    </select>

                                </div>

                                <div className="buttons">

                                    <button
                                        onClick={() =>
                                            editTask(task)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteTask(task._id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>
    );
}

export default App;