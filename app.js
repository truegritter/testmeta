function onSubmit(e) {
    e.preventDefault();

    const search_str = document.getElementById('query-name').value;
    const search_country = document.getElementById('query-country').value;
    let country;
    switch (search_country) {
        case 'USA': country = "US"; break;
        case 'Canada': country = "CA"; break;
        case 'Finland': country = "FI"; break;
        case 'Australia': country = "AU"; break;
    }

    const submit = `
    <query>
        <search>${search_str}</search>
        <country>${country}</country>
    </query>
    `;

    fetch("/api/search_printers", {
        method: "POST",
        body: submit
    })
        .then(data => data.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const tableBody = document.getElementById("table-body");
            while (tableBody.firstChild) {
                tableBody.firstChild.remove()
            }

            const error = data.getElementsByTagName("error");

            if (error.length > 0) {
                const error = error[0];
                const row = tableBody.insertRow(-1);
                const cell = row.insertCell(-1);
                cell.setAttribute("colspan", "3");
                cell.innerHTML = error;
                return;
            }

            const prods = data.getElementsByTagName("product");

            if (prods.length == 0) {
                const row = tableBody.insertRow(-1);
                const cell = row.insertCell(-1);
                cell.setAttribute("colspan", "3");
                cell.innerHTML = "No results found.";
            }

            for (p of prods) {
                const row = tableBody.insertRow(-1);
                row.insertCell(-1).innerHTML = p.getAttribute("id");
                row.insertCell(-1).innerHTML = p.getAttribute("name");
                row.insertCell(-1).innerHTML = p.getAttribute("price");
            }
        });

}