async function loadHearings() {

    try {

        const response =
            await fetch("/api/hearings");

        const hearings =
            await response.json();

        const container =
            document.getElementById(
                "hearingsContainer"
            );


        if (hearings.length === 0) {

            container.innerHTML =
                `<div class="empty-state">
                    <h3>No hearings found</h3>
                    <p>Add your first hearing.</p>
                </div>`;

            return;
        }


        container.innerHTML =
            hearings.map(
                hearing => `

                <div class="hearing-card">

                    <div>

                        <span class="case-number">
                            ${escapeHTML(
                                hearing.caseNumber
                            )}
                        </span>

                        <h3>
                            ${escapeHTML(
                                hearing.clientName
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                hearing.court
                            )}
                        </p>

                    </div>


                    <div class="hearing-date">

                        <strong>
                            ${formatDateTime(
                                hearing.hearingDate
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                hearing.purpose
                            )}
                        </span>

                    </div>


                    <span class="status">
                        ${hearing.status}
                    </span>

                </div>

            `
            ).join("");

    } catch (error) {

        console.error(error);

        document.getElementById(
            "hearingsContainer"
        ).innerHTML =
            `<p class="error">
                Unable to load hearings.
            </p>`;
    }
}


function showHearingForm() {

    document.getElementById(
        "hearingForm"
    ).classList.toggle("hidden");
}


document
    .getElementById(
        "hearingFormElement"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const data = {

                caseNumber:
                    document.getElementById(
                        "hearingCaseNumber"
                    ).value.trim(),

                clientName:
                    document.getElementById(
                        "hearingClientName"
                    ).value.trim(),

                court:
                    document.getElementById(
                        "hearingCourt"
                    ).value.trim(),

                hearingDate:
                    document.getElementById(
                        "hearingDate"
                    ).value,

                purpose:
                    document.getElementById(
                        "hearingPurpose"
                    ).value.trim(),

                status:
                    document.getElementById(
                        "hearingStatus"
                    ).value,

                notes:
                    document.getElementById(
                        "hearingNotes"
                    ).value.trim()
            };


            try {

                const response =
                    await fetch(
                        "/api/hearings",
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
                        "Unable to save hearing."
                    );

                    return;
                }


                alert(
                    "Hearing added successfully!"
                );


                document
                    .getElementById(
                        "hearingFormElement"
                    )
                    .reset();


                loadHearings();

                // Update notifications immediately
                checkHearingNotifications();


            } catch (error) {

                console.error(error);

                alert(
                    "Server error."
                );
            }

        }
    );


function formatDateTime(date) {

    if (!date) {
        return "No date";
    }

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


/* =========================
   NOTIFICATIONS
========================= */

async function checkHearingNotifications() {

    try {

        const response =
            await fetch("/api/hearings");

        if (!response.ok) {
            return;
        }

        const hearings =
            await response.json();


        const notificationCount =
            document.getElementById(
                "notificationCount"
            );

        const notificationList =
            document.getElementById(
                "notificationList"
            );


        if (
            !notificationCount ||
            !notificationList
        ) {
            return;
        }


        const now =
            new Date();


        const upcomingHearings =
            hearings.filter(
                hearing => {

                    // Only upcoming hearings
                    if (
                        hearing.status !==
                        "Upcoming"
                    ) {
                        return false;
                    }


                    const hearingTime =
                        new Date(
                            hearing.hearingDate
                        );


                    const difference =
                        hearingTime - now;


                    // Notification for hearings
                    // occurring within next 24 hours
                    return (
                        difference > 0 &&
                        difference <=
                        24 * 60 * 60 * 1000
                    );

                }
            );


        /*
         * Update notification count
         */

        notificationCount.textContent =
            upcomingHearings.length;


        /*
         * Show / hide notification badge
         */

        if (
            upcomingHearings.length === 0
        ) {

            notificationCount.style.display =
                "none";

        } else {

            notificationCount.style.display =
                "block";
        }


        /*
         * Notification list
         */

        if (
            upcomingHearings.length === 0
        ) {

            notificationList.innerHTML =
                `<p>No new notifications.</p>`;

            return;
        }


        notificationList.innerHTML =
            upcomingHearings.map(
                hearing => `

                <div class="notification-item">

                    <strong>
                        🔔 Upcoming Hearing
                    </strong>

                    <p>
                        Case:
                        ${escapeHTML(
                            hearing.caseNumber
                        )}
                    </p>

                    <p>
                        Client:
                        ${escapeHTML(
                            hearing.clientName
                        )}
                    </p>

                    <p>
                        Court:
                        ${escapeHTML(
                            hearing.court
                        )}
                    </p>

                    <p>
                        Date:
                        ${formatDateTime(
                            hearing.hearingDate
                        )}
                    </p>

                    <p>
                        Purpose:
                        ${escapeHTML(
                            hearing.purpose
                        )}
                    </p>

                </div>

            `
            ).join("");


    } catch (error) {

        console.error(
            "Notification error:",
            error
        );

    }
}


/* =========================
   NOTIFICATION BELL
========================= */

function toggleNotifications() {

    const panel =
        document.getElementById(
            "notificationPanel"
        );


    if (!panel) {
        return;
    }


    panel.classList.toggle(
        "hidden"
    );
}


/* =========================
   START
========================= */

loadHearings();

checkHearingNotifications();