async function loadDashboard() {

    try {

        const [caseResponse, hearingResponse, taskResponse] =
            await Promise.all([
                fetch("/api/cases"),
                fetch("/api/hearings"),
                fetch("/api/tasks")
            ]);


        const cases = await caseResponse.json();
        const hearings = await hearingResponse.json();
        const tasks = await taskResponse.json();


        // Statistics

        document.getElementById("totalCases")
            .textContent = cases.length;

        document.getElementById("pendingCases")
            .textContent =
            cases.filter(
                c => c.status === "Pending"
            ).length;

        document.getElementById("activeCases")
            .textContent =
            cases.filter(
                c => c.status === "Active"
            ).length;

        document.getElementById("disposedCases")
            .textContent =
            cases.filter(
                c => c.status === "Disposed"
            ).length;


        // Upcoming hearings

        const hearingList =
            document.getElementById("hearingList");


        const upcomingHearings =
            hearings
                .filter(
                    h => h.status === "Upcoming"
                )
                .sort(
                    (a, b) =>
                        new Date(a.hearingDate) -
                        new Date(b.hearingDate)
                )
                .slice(0, 5);


        if (upcomingHearings.length === 0) {

            hearingList.innerHTML =
                `<p class="empty">
                    No upcoming hearings.
                </p>`;

        } else {

            hearingList.innerHTML =
                upcomingHearings.map(
                    hearing => `

                    <div class="list-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    hearing.caseNumber
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    hearing.clientName
                                )}
                            </p>

                        </div>

                        <span class="date-badge">
                            ${formatDate(
                                hearing.hearingDate
                            )}
                        </span>

                    </div>

                `
                ).join("");
        }


        // Tasks

        const taskList =
            document.getElementById("taskList");


        const pendingTasks =
            tasks
                .filter(
                    t => t.status === "Pending"
                )
                .sort(
                    (a, b) =>
                        new Date(a.dueDate) -
                        new Date(b.dueDate)
                )
                .slice(0, 5);


        if (pendingTasks.length === 0) {

            taskList.innerHTML =
                `<p class="empty">
                    No pending tasks.
                </p>`;

        } else {

            taskList.innerHTML =
                pendingTasks.map(
                    task => `

                    <div class="list-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    task.title
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    task.relatedCase ||
                                    "General task"
                                )}
                            </p>

                        </div>

                        <span class="priority ${task.priority.toLowerCase()}">
                            ${task.priority}
                        </span>

                    </div>

                `
                ).join("");
        }


        // Recent cases

        const caseList =
            document.getElementById("caseList");


        const recentCases =
            cases.slice(0, 5);


        if (recentCases.length === 0) {

            caseList.innerHTML =
                `<p class="empty">
                    No cases available.
                </p>`;

        } else {

            caseList.innerHTML =
                recentCases.map(
                    c => `

                    <div class="list-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    c.caseNumber
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    c.title
                                )}
                            </p>

                        </div>

                        <span class="status ${c.status.toLowerCase()}">
                            ${c.status}
                        </span>

                    </div>

                `
                ).join("");
        }


        // Backlog

        const backlogList =
            document.getElementById("backlogList");


        const backlog =
            cases
                .filter(
                    c =>
                        c.status === "Pending" ||
                        c.status === "Active"
                )
                .sort(
                    (a, b) =>
                        new Date(a.filingDate) -
                        new Date(b.filingDate)
                )
                .slice(0, 5);


        if (backlog.length === 0) {

            backlogList.innerHTML =
                `<p class="empty">
                    No pending backlog.
                </p>`;

        } else {

            backlogList.innerHTML =
                backlog.map(
                    c => `

                    <div class="list-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    c.caseNumber
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    c.title
                                )}
                            </p>

                        </div>

                        <span class="priority ${c.priority.toLowerCase()}">
                            ${c.priority}
                        </span>

                    </div>

                `
                ).join("");
        }


    } catch (error) {

        console.error(error);

        document.getElementById("hearingList")
            .innerHTML =
            `<p class="error">
                Unable to load dashboard.
            </p>`;
    }
}


function formatDate(date) {

    if (!date) {
        return "No date";
    }

    return new Date(date)
        .toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}


function escapeHTML(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


loadDashboard();