let payments_table = document.getElementById('payments_table').getElementsByTagName('tbody')[0];
let payments_table_parent = document.getElementById('payments_table').parentNode;

setTimeout(() => {
    mainInitialization();
}, 1);

function mainInitialization() {
    const date = new Date();
    const firstDay = getFirstDayOfMonth(
        date.getFullYear(),
        date.getMonth(),
    );
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    $("#from").datepicker('setDate', firstDay);
    $("#to").datepicker('setDate', today);

    getPayoutsList(firstDay, today);
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1);
}

const formatter = new Intl.NumberFormat('ru-RU', {
    // style: 'currency',
    // currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function dateUpate() {
    let from = $("#from").datepicker('getDate');
    let to = $("#to").datepicker('getDate');

    if (from && to) {
        getPayoutsList(from, to);
    } else {
        createNotification('Неверно выбраны даты');
    }
}

$(function () {
    var dateFormat = "mm/dd/yy",
        from = $("#from")
            .datepicker({
                // defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1,
                dateFormat: 'dd-mm-yy'
            })
            .on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            }),
        to = $("#to").datepicker({
            // defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            dateFormat: 'dd-mm-yy'
        })
            .on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }
});

async function getPayoutsList(from, to) {
    let res = [];
    let s_date = from.getFullYear() + '-' + (from.getMonth() + 1).toString().padStart(2, '0') + '-' + from.getDate().toString().padStart(2, '0') + ' ' + from.getHours().toString().padStart(2, '0') + ':' + from.getMinutes().toString().padStart(2, '0') + ':' + from.getSeconds().toString().padStart(2, '0');
    
    let f_date = to.getFullYear() + '-' + (to.getMonth() + 1).toString().padStart(2, '0') + '-' + to.getDate().toString().padStart(2, '0') + ' 23:59:59';
    
    $.ajax({
        type: 'POST',
        url: 'getPayouts.php',
        data: {
            data: JSON.stringify({
                start_date: s_date,
                finish_date: f_date
            })
        },
        dataType: 'json'
    })
        .done(function (data) {
            if (data.code == '200' && data.success == true) {
                let obj = data.response.details;
                for (let key in obj) {
                    let o = {
                        date: key,
                        data: obj[key]
                    }

                    res.push(o);
                }

                createMarkupForPayouts(res);
            }
        })
}

function createMarkupForPayouts(arr) {
    payments_table.innerHTML = '';
    let markup = '';
    arr.forEach(element => {
        for (const key in element.data) {
            // Для каждого часа
            let m = `
                <tr>
                    <th>${element.date}</th>
                    <td>${key} - ${parseInt(key) + 1}</td>
                    <td>${element.data[key].count}</td>
                    <td>${element.data[key].sum}</td>
                </tr>
            `
            markup = markup + m;
        }
    });
    payments_table.innerHTML = markup;
}


function createNotification(params) {
    let div = document.createElement('div');
    let notMarkup = `<div class="toast-container position-fixed top-0 end-0 p-3">
                        <div id="payment_success" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header">
                                <strong class="me-auto">Оповещание</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" style="border: 1px solid;"></button>
                            </div>
                            <div class="toast-body">
                                ${params}
                            </div>
                        </div>
                    </div>`;

    document.body.appendChild(div);
    div.innerHTML = notMarkup;

    const toastLiveExample = document.getElementById('payment_success');
    if (toastLiveExample) {
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    }
}