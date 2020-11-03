let bodyTables = document.getElementById("bodyTable");

let result = {};
$(document).ready(function() {

    result = fetchAPI();
    result.then(
        result => {

            Render(result.data);
            // setActionTable();
        },
        error => {
            console.log(loi);
        }
    );
    sortTable(0);
    // let arrayResult = [];
    // arrayResult = result.data;
    // console.log(typeof(arrayResult))
    // Render(arrayResult);

});


// function setActionTable() {
//     let table = document.getElementById("dataTable");
//     let row = table.rows;
//     for (let i = 0; i < 7; i++) {
//         let tableHeader = row[0].getElementsByTagName("th")[i];
//         tableHeader.onclick = sortTable(i);
//     }
// }
async function fetchAPI() {
    let url = "https://webhook.site/70c4733b-f073-4caf-887a-47230f7c944b";
    let resultFetch = "";
    resultFetch = await fetch(url);
    let result = await resultFetch.json();

    // console.log(typeof(result));

    return result;
}

// function sortData(arrayData, title, typeSort) {
//     let arrayData = arrayData;

//     this.arrayData.sort();

// }

function sortArray(a, b, direction) {

    if (a > b) {
        if (direction == 'ascending') {
            return a - b;
        } else {
            return b - a;
        }

    } else if (a < b) {
        if (direction == 'ascending') {
            return a - b;
        } else {
            return b - a;
        }
    } else {
        return 0;
    }

}

function sortTable(n) {
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    // let table = document.getElementById("dataTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        if (bodyTables.rows != null) {

            rows = bodyTables.rows;


        } else {
            console.log('table null');
        }
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 0; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            if (rows[i].getElementsByTagName("td")[n] != null) {
                x = rows[i].getElementsByTagName("td")[n];
            } else {
                console.log(`row ${i} null`);
            }
            if (rows[i + 1].getElementsByTagName("td")[n] != null) {
                y = rows[i + 1].getElementsByTagName("td")[n];
            } else {
                console.log(`row ${i+1} null`);
            }

            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function Render(arrayData) {
    let stringHTML = '';
    arrayData.forEach(element => {
        stringHTML += `<tr role="row" data-id='${element.DT_RowId}' class="odd">
                                                <td class="sorting_1">${element.first_name}</td>
                                                <td>${element.last_name}}</td>
                                                <td>${element.position}</td>
                                                <td>${element.office}</td>
                                                <td>${element.age}</td>
                                                <td>${element.start_date}</td>
                                                <td>$${element.salary}</td>
                                            </tr>`;
    });
    bodyTables.innerHTML = stringHTML;
    let table = document.getElementById("dataTable");

}