const params =
    new URLSearchParams(
        window.location.search
    );

const caseId =
    params.get("id");


async function loadCase() {

    if (!caseId) {

        document.getElementById(
            "caseDetails"
        ).innerHTML =
            "<p>Case ID is missing.</p>";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/cases/${caseId}`
            );


        const caseData =
            await response.json();


        if (!response.ok) {

            throw new Error(
                caseData.message
            );
        }


        document.getElementById(
            "caseDetails"
        ).innerHTML = `

            <div class="detail-header">

                <div>

                    <span class="case-number">
                        ${escapeHTML(
                            caseData.caseNumber
                        )}
                    </span>

                    <h1>
                        ${escapeHTML(
                            caseData.title
                        )}
                    </h1>

                </div>

                <span class="status ${caseData.status.toLowerCase()}">
                    ${caseData.status}
                </span>

            </div>


            <div class="detail-grid">

                <div class="detail-item">
                    <span>Client</span>
                    <strong>
                        ${escapeHTML(
                            caseData.clientName
                        )}
                    </strong>
                </div>


                <div class="detail-item">
                    <span>Case Type</span>
                    <strong>
                        ${escapeHTML(
                            caseData.caseType
                        )}
                    </strong>
                </div>


                <div class="detail-item">
                    <span>Court</span>
                    <strong>
                        ${escapeHTML(
                            caseData.court
                        )}
                    </strong>
                </div>


                <div class="detail-item">
                    <span>Filing Date</span>
                    <strong>
                        ${formatDate(
                            caseData.filingDate
                        )}
                    </strong>
                </div>


                <div class="detail-item">
                    <span>Next Hearing</span>
                    <strong>
                        ${formatDate(
                            caseData.nextHearing
                        )}
                    </strong>
                </div>


                <div class="detail-item">
                    <span>Priority</span>
                    <strong class="priority ${caseData.priority.toLowerCase()}">
                        ${caseData.priority}
                    </strong>
                </div>

            </div>


            <div class="description-box">

                <h2>Case Notes</h2>

                <p>
                    ${escapeHTML(
                        caseData.description ||
                        "No notes available."
                    )}
                </p>

            </div>

        `;

    } catch (error) {

        console.error(error);

        document.getElementById(
            "caseDetails"
        ).innerHTML =
            `<p class="error">
                Unable to load case details.
            </p>`;
    }
}


function formatDate(date) {

    if (!date) {
        return "Not scheduled";
    }

    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
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


loadCase();