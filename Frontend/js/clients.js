async function loadClients() {

    try {

        const response =
            await fetch("/api/clients");

        const clients =
            await response.json();


        const container =
            document.getElementById(
                "clientsContainer"
            );


        if (clients.length === 0) {

            container.innerHTML =
                `<div class="empty-state">
                    <h3>No clients found</h3>
                    <p>Add your first client.</p>
                </div>`;

            return;
        }


        container.innerHTML =
            clients.map(
                client => `

                <div class="client-card">

                    <div class="client-avatar">
                        ${client.name
                            .charAt(0)
                            .toUpperCase()}
                    </div>


                    <div class="client-info">

                        <h3>
                            ${escapeHTML(
                                client.name
                            )}
                        </h3>

                        <p>
                            📞 ${escapeHTML(
                                client.phone
                            )}
                        </p>

                        ${
                            client.email
                            ? `<p>
                                ✉ ${escapeHTML(
                                    client.email
                                )}
                               </p>`
                            : ""
                        }

                        ${
                            client.address
                            ? `<p>
                                📍 ${escapeHTML(
                                    client.address
                                )}
                               </p>`
                            : ""
                        }

                    </div>

                </div>

            `
            ).join("");

    } catch (error) {

        console.error(error);

        document.getElementById(
            "clientsContainer"
        ).innerHTML =
            `<p class="error">
                Unable to load clients.
            </p>`;
    }
}


function showClientForm() {

    document.getElementById(
        "clientForm"
    ).classList.toggle("hidden");
}


document
    .getElementById(
        "clientFormElement"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const data = {

                name:
                    document.getElementById(
                        "clientName"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "clientPhone"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "clientEmail"
                    ).value.trim(),

                address:
                    document.getElementById(
                        "clientAddress"
                    ).value.trim(),

                notes:
                    document.getElementById(
                        "clientNotes"
                    ).value.trim()
            };


            try {

                const response =
                    await fetch(
                        "/api/clients",
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
                        "Unable to save client."
                    );

                    return;
                }


                alert(
                    "Client added successfully!"
                );


                document
                    .getElementById(
                        "clientFormElement"
                    )
                    .reset();


                loadClients();


            } catch (error) {

                console.error(error);

                alert(
                    "Server error."
                );
            }

        }
    );


function escapeHTML(value) {

    if (!value) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


loadClients();