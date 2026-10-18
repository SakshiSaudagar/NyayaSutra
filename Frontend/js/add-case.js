const caseForm =
    document.getElementById("caseForm");


caseForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const caseData = {

            caseNumber:
                document.getElementById(
                    "caseNumber"
                ).value.trim(),

            title:
                document.getElementById(
                    "title"
                ).value.trim(),

            clientName:
                document.getElementById(
                    "clientName"
                ).value.trim(),

            caseType:
                document.getElementById(
                    "caseType"
                ).value,

            court:
                document.getElementById(
                    "court"
                ).value.trim(),

            filingDate:
                document.getElementById(
                    "filingDate"
                ).value,

            nextHearing:
                document.getElementById(
                    "nextHearing"
                ).value || null,

            status:
                document.getElementById(
                    "status"
                ).value,

            priority:
                document.getElementById(
                    "priority"
                ).value,

            description:
                document.getElementById(
                    "description"
                ).value.trim()
        };


        try {

            const response =
                await fetch("/api/cases", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(caseData)
                });


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Unable to save case."
                );

                return;
            }


            alert(
                "Case added successfully!"
            );

            window.location.href =
                "cases.html";


        } catch (error) {

            console.error(error);

            alert(
                "Server is not available."
            );
        }

    }
);