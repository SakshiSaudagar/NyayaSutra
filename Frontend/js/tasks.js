async function loadTasks() {

    try {

        const response =
            await fetch("/api/tasks");

        const tasks =
            await response.json();


        const container =
            document.getElementById(
                "tasksContainer"
            );


        if (tasks.length === 0) {

            container.innerHTML =
                `<div class="empty-state">
                    <h3>No tasks found</h3>
                    <p>Add a task to manage your work.</p>
                </div>`;

            return;
        }


        container.innerHTML =
            tasks.map(
                task => `

                <div class="task-card">

                    <div>

                        <h3>
                            ${escapeHTML(
                                task.title
                            )}
                        </h3>

                        <p>
                            ${
                                task.relatedCase
                                ? "Case: " +
                                  escapeHTML(
                                      task.relatedCase
                                  )
                                : "General legal work"
                            }
                        </p>

                        <p>
                            ${
                                task.dueDate
                                ? "Due: " +
                                  formatDateTime(
                                      task.dueDate
                                  )
                                : "No due date"
                            }
                        </p>

                    </div>


                    <div>

                        <span class="priority ${task.priority.toLowerCase()}">
                            ${task.priority}
                        </span>


                        ${
                            task.status === "Completed"
                            ? `<span class="status completed">
                                    Completed
                               </span>`
                            : `<button
                                    class="btn small"
                                    onclick="completeTask('${task._id}')">
                                    Complete
                               </button>`
                        }

                    </div>

                </div>

            `
            ).join("");

    } catch (error) {

        console.error(error);

        document.getElementById(
            "tasksContainer"
        ).innerHTML =
            `<p class="error">
                Unable to load tasks.
            </p>`;
    }
}


function showTaskForm() {

    document.getElementById(
        "taskForm"
    ).classList.toggle("hidden");
}


document
    .getElementById(
        "taskFormElement"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const data = {

                title:
                    document.getElementById(
                        "taskTitle"
                    ).value.trim(),

                relatedCase:
                    document.getElementById(
                        "relatedCase"
                    ).value.trim(),

                dueDate:
                    document.getElementById(
                        "taskDueDate"
                    ).value || null,

                priority:
                    document.getElementById(
                        "taskPriority"
                    ).value,

                description:
                    document.getElementById(
                        "taskDescription"
                    ).value.trim()
            };


            try {

                const response =
                    await fetch(
                        "/api/tasks",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                if (!response.ok) {

                    const result =
                        await response.json();

                    alert(
                        result.message ||
                        "Unable to save task."
                    );

                    return;
                }


                alert(
                    "Task added successfully!"
                );


                document
                    .getElementById(
                        "taskFormElement"
                    )
                    .reset();


                loadTasks();


            } catch (error) {

                console.error(error);

                alert(
                    "Server error."
                );
            }

        }
    );


async function completeTask(id) {

    try {

        const response =
            await fetch(
                `/api/tasks/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: "Completed"
                    })
                }
            );


        if (response.ok) {

            loadTasks();

        } else {

            alert(
                "Unable to complete task."
            );
        }

    } catch (error) {

        console.error(error);

        alert(
            "Server error."
        );
    }
}


function formatDateTime(date) {

    return new Date(date)
        .toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}


function escapeHTML(value) {

    if (!value) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


loadTasks();