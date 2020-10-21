$(document).ready(function() {
    $('#dataTable').DataTable({
        "ajax": "./arrays.txt"
    });
});