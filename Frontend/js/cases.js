let allCases = [];


async function loadCases() {

    try {

        const response =
            await fetch("/api/cases");

        allCases =
            await response.json();

        displayCases(allCases);

    } catch (error) {

        console.error(error);

        document.getElementById(
            "casesContainer"
        ).innerHTML =
            `<p class="error">
                Unable to load cases.
            </p>`;
    }
}


function displayCases(cases) {

    const container =
        document.getElementById(
            "casesContainer"
        );


    if (cases.length === 0) {

        container.innerHTML =
            `<div class="empty-state">
                <h3>No cases found</h3>
                <p>Add a new case to get started.</p>
            </div>`;

        return;
    }


    container.innerHTML =
        cases.map(
            c => `

            <div class="case-card">

                <div class="case-card-top">

                    <div>

                        <span class="case-number">
                            ${escapeHTML(
                                c.caseNumber
                            )}
                        </span>

                        <h3>
                            ${escapeHTML(
                                c.title
                            )}
                        </h3>

                    </div>

                    <span class="status ${c.status.toLowerCase()}">
                        ${c.status}
                    </span>

                </div>


                <div class="case-info">

                    <p>
                        <strong>Client:</strong>
                        ${escapeHTML(
                            c.clientName
                        )}
                    </p>

                    <p>
                        <strong>Type:</strong>
                        ${escapeHTML(
                            c.caseType
                        )}
                    </p>

                    <p>
                        <strong>Court:</strong>
                        ${escapeHTML(
                            c.court
                        )}
                    </p>

                    <p>
                        <strong>Next Hearing:</strong>
                        ${formatDate(
                            c.nextHearing
                        )}
                    </p>

                    <p>
                        <strong>Priority:</strong>
                        <span class="priority ${c.priority.toLowerCase()}">
                            ${c.priority}
                        </span>
                    </p>

                </div>


                <div class="case-actions">

                    <a
                        href="case-details.html?id=${c._id}"
                        class="btn small">
                        View Details
                    </a>

                    <button
                        onclick="deleteCase('${c._id}')"
                        class="btn danger small">
                        Delete
                    </button>

                </div>

            </div>

        `
        ).join("");
}


function filterCases() {

    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const priority =
        document.getElementById(
            "priorityFilter"
        ).value;


    const filtered =
        allCases.filter(c => {

            const matchesSearch =
                c.caseNumber.toLowerCase()
                    .includes(search) ||

                c.title.toLowerCase()
                    .includes(search) ||

                c.clientName.toLowerCase()
                    .includes(search);


            const matchesStatus =
                status === "All" ||
                c.status === status;


            const matchesPriority =
                priority === "All" ||
                c.priority === priority;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });


    displayCases(filtered);
}


async function deleteCase(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this case?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/cases/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (response.ok) {

            loadCases();

        } else {

            alert(
                "Unable to delete case."
            );
        }

    } catch (error) {

        console.error(error);

        alert(
            "Server error."
        );
    }
}


function formatDate(date) {

    if (!date) {
        return "Not scheduled";
    }

    return new Date(date)
        .toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
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


document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        filterCases
    );


document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        filterCases
    );


document
    .getElementById("priorityFilter")
    .addEventListener(
        "change",
        filterCases
    );


loadCases();