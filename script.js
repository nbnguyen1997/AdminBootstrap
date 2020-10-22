$(document).ready(function() {
    $('#dataTable').DataTable({

        dom: "Bfrtip",
        ajax: "../objects.txt",
        order: [
            [1, 'asc']
        ],
        columns: [

            { data: "first_name" },
            { data: "last_name" },
            { data: "position" },
            { data: "office" },
            { data: "age" },
            { data: "start_date" },
            { data: "salary", render: $.fn.dataTable.render.number(',', '.', 0, '$') }
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        }
        // },
        // buttons: [
        //     { extend: "create", editor: editor },
        //     { extend: "edit", editor: editor },
        //     { extend: "remove", editor: editor }
        // ]
    });
});