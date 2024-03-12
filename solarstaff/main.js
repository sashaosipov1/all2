let token = '';
let solarToken = '';
let solarRefreshToken = '';
let faToken = '';
let main_table, main_table_head, main_table_parent;
let isPublishersPage = false;
let isFrilancersPage = false;
let code_input = document.getElementById('typePasswordCode');
let main_container = document.getElementById('main_container');
let sub_button = document.getElementById('sub_button');
let apiURLsolar = 'https://my.solarstaff.com/api'; // DEMO API https://mydemo.solar-staff.com/api


// For demo
// getAccessToken().then(async function (e) {
//     token = e;
//     getJWTtoken(123123).then(function (e) {
//         solarToken = e.token;
//         solarRefreshToken = e.refreshToken;
//         main_table = document.getElementById('main_table').getElementsByTagName('tbody')[0];
//         main_table_head = document.getElementById('main_table').getElementsByTagName('thead')[0];
//         main_table_parent = document.getElementById('main_table').parentNode;
//         renderPublishersList();
//         // getServicesNames();
//         // getServicesAttributes();
//         // getCompanyData();
//         // getTasks();
//         // getContractInfo();
//         // renderMainTable();
//     })
// })

function loginSubmit() {
    sub_button.setAttribute("disabled", "");

    if (code_input.value == '') {
        getJWTtoken().then(function (e) {
            code_input.removeAttribute("disabled");
            code_input.removeAttribute("placeholder");
            sub_button.removeAttribute("disabled");

            solarToken = e.token;
            solarRefreshToken = e.refreshToken;
        })
    } else {
        getJWTtoken(code_input.value).then(function (e) {
            console.log(e);

            if (Object.hasOwn(e, 'code')) {
                createNotification(e.code);
                code_input.value = '';
                sub_button.removeAttribute("disabled");
                return;
            }

            solarToken = e.token;
            solarRefreshToken = e.refreshToken;

            refreshingToken(solarRefreshToken).then(function (e) {
                solarToken = e.token;
                solarRefreshToken = e.refreshToken;

                getAccessToken().then(function (e) {
                    token = e;
                    sub_button.removeAttribute("disabled");

                    main_container.innerHTML = '';
                    main_container.innerHTML = `<div class="row" style="justify-content: space-around; margin: 0;">
                                                    <div class="" style="width: 10%;">
                                                        <div class="list-group">
                                                            <a class="list-group-item list-group-item-action pointer" onclick="renderPublishersList()">Паблишеры</a>
                                                            <a class="list-group-item list-group-item-action pointer" onclick="renderFreelancersList()">Фрилансеры</a>
                                                            <a class="list-group-item list-group-item-action pointer" onclick="renderTasksList()">Выплаты</a>
                                                        </div>
                                                    </div>
        
                                                    <div class="" style="width: 80%;">
        
                                                        <div style="margin: 10px auto;">
                                                            <label for="from">Дата от</label>
                                                            <input type="text" id="from" name="from">
                                                            <label for="to">до</label>
                                                            <input type="text" id="to" name="to">
                                                            <button type="button" class="btn btn-primary" onclick="dateUpate()">Обновить</button>
                                                        </div>
        
                                                        <table class="table table-striped" id="main_table">
                                                            <thead>
                                                                
                                                            </thead>
                                                            <tbody>
        
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>`;

                    main_table = document.getElementById('main_table').getElementsByTagName('tbody')[0];
                    main_table_head = document.getElementById('main_table').getElementsByTagName('thead')[0];
                    main_table_parent = document.getElementById('main_table').parentNode;
                    renderFreelancersList();
                    startCalendar();
                })
            })
        })
    }
}

async function refreshingToken(token) {
    let response;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    response = await fetch(apiURLsolar + '/token/refresh', {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify({
            "refreshToken": token,
        })
    })

    let result = await response.json();
    console.log(result);
    return result;
}

async function getContractInfo() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    let response = await fetch(apiURLsolar + '/customer/ord/contract', { // organization - для компании
        method: 'GET',
        headers: myHeaders
    })

    let result = await response.json();
    console.log(result);
    return result;
}

async function createNewTask(id, price, site) {
    // id=26 Для Размещение рекламы на сайте
    // gives you your current date
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate() + 2;
    let hh = today.getHours();
    let minmin = today.getMinutes();
    let ss = today.getSeconds();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (hh < 10) hh = '0' + hh;
    if (minmin < 10) minmin = '0' + minmin;
    if (ss < 10) ss = '0' + ss;

    const formattedToday = yyyy + '-' + mm + '-' + dd; // + ' ' + hh + ':' + minmin + ':' + ss

    console.log(formattedToday);

    let uuidContract = '9d02b6c7-7f54-4aaf-9fdc-4289fa65a486'; // uuid contract
    let uuidTask = self.crypto.randomUUID();
    // update for uuid
    // await getCompanyData().then(function (params) {
    //     console.log(params);
    //     let uuid = params.items[1].uuid;
    // })

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    console.log(uuidTask);

    let response = await fetch(apiURLsolar + '/customer/tasks', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            uuid: uuidTask,
            categoryId: 26,
            attributes: [
                {
                    "id": 55,
                    "value": site
                }
            ],
            title: 'Размещение рекламы на сайте',
            description: 'Размещение рекламы на сайте',
            workerId: id,
            deadline: formattedToday, // 2022-06-22T08:57:53.299Z
            price: 766, // parseFloat(price).toFixed(2)
            advData: {
                endContracts: [
                    {
                        uuid: uuidContract
                    }
                ]
            }
        })
    })

    if (response.ok) {
        let result = await response.json();
        console.log(result);
        createNotification('Задача была создана! Её uuid - ' + uuidTask);
        return uuidTask;
    } else {
        createNotification('Ошибка! Смотрите консоль!');
        console.log(response.status);
    }
}
// 0a93995e-ff2b-40d0-b0a4-a296693e44a3 uuid задачи для оплаты
async function checkOfferts() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    let response = await fetch(apiURLsolar + '/customer/freelancers/check-task-requirements', {
        method: 'GET',
        headers: myHeaders,
        body: JSON.stringify({
            "taskUuid": "0a93995e-ff2b-40d0-b0a4-a296693e44a3",
            "freelancerUuid": "3622d63e-d9ff-4df1-be4b-32a964d36fe4", // Zad5d38c2da!8s - прод $J5CF6E#sj - тест
        })
    })

    let result = await response.json();
    console.log(result);
    return result;
}

async function getTasks() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    let response = await fetch(apiURLsolar + '/customer/tasks?state[]=5', {
        method: 'GET',
        headers: myHeaders
    })

    let result = await response.json();
    console.log(result);
    return result.items;
}

function renderTasksList() {
    isPublishersPage = false;
    isFrilancersPage = false;
    getTasks().then(function (arr) {
        createMarkupForTasks(arr);
    })
}

function createMarkupForTasks(arr) {
    main_table.innerHTML = '';
    let markup = '';
    let head_markup = ` <tr>
                            <th scope="col">id</th>
                            <th scope="col">MerchantId задачи</th>
                            <th scope="col">Выплата (рубли)</th>
                            <th scope="col">Услуга</th>
                            <th scope="col">Токен</th>
                            <th scope="col">uuid задачи</th>
                            <th scope="col">Исполнитель</th>
                            <th scope="col">Почта исполнителя</th>
                            <th scope="col">Дата выплаты</th>
                        </tr>`;
    main_table_head.innerHTML = head_markup;
    arr.forEach((element, index) => {
        let m = '<tr><th scope="row">' + element.id + '</th>' +
            '<td>' + element.merchantId + '</td>' +
            '<td>' + element.price + '</td>' +
            '<td>' + element.title + '</td>' +
            '<td>' + element.token + '</td>' +
            '<td>' + element.uuid + '</td>' +
            '<td>' + element.worker.name + '</td>' +
            '<td>' + element.worker.email + '</td>' +
            '<td>' + element.datePaid + '</td>';
        markup = markup + m;
    });

    main_table.innerHTML = markup;
}

async function getCategories() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    let response = await fetch(apiURLsolar + '/customer/lookups/categories', {
        method: 'GET',
        headers: myHeaders
    })

    let result = await response.json();
    console.log(result);
    return result;
}

async function getCompanyData() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    let response = await fetch(apiURLsolar + '/customer/ord/company-data', {
        method: 'GET',
        headers: myHeaders
    })

    let result = await response.json();
    console.log(result);
    return result;
}

async function getServicesNames() {
    // id=2 для интернет рекламы
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    let response = await fetch(apiURLsolar + '/lookups/services/2', {
        method: 'GET',
        headers: myHeaders
    })

    let result = await response.json();
    console.log(result);
    return result;
}

async function getServicesAttributes() {
    // id=2 для интернет рекламы
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    let response = await fetch(apiURLsolar + '/lookups/service-attributes/26', {
        method: 'GET',
        headers: myHeaders
    })

    let result = await response.json();
    console.log(result);
    return result;
}

async function getFreelancersList() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    let response = await fetch(apiURLsolar + '/customer/freelancers?filter[taxationStatusId]=1', {
        method: 'GET',
        headers: myHeaders
    })

    let result = await response.json();
    console.log(result);
    return result.items;
}

async function getJWTtoken(code) {
    let response;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    if (!code) {
        response = await fetch(apiURLsolar + '/login', {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify({
                "username": "rtb@agency2.ru",
                "password": "Zad5d38c2da!8s", // Zad5d38c2da!8s - прод $J5CF6E#sj - тест
            })
        })
    } else {
        response = await fetch(apiURLsolar + '/login', {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify({
                "username": "rtb@agency2.ru",
                "password": "Zad5d38c2da!8s", // Zad5d38c2da!8s - прод $J5CF6E#sj - тест
                "code": code // 2F AUTEF
            })
        })
    }

    let result = await response.json();
    console.log(result);
    return result;
}

async function getPublishersList(from, to) {
    let usersByType = [];
    let platformsOwners = [];
    let platformsStats = [];
    let arrForRender = [];

    const date = new Date();
    const firstDay = from || getFirstDayOfMonth(
        date.getFullYear(),
        date.getMonth(),
    );
    const today = to || new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    $("#from").datepicker('setDate', firstDay);
    $("#to").datepicker('setDate', today);

    await getUsersFromDsp().then(function (arr) {
        arr.forEach(element => {
            usersByType.push(element);
        });
    });

    await getPlatformsWithStats(firstDay.getTime(), today.getTime()).then(function (params) {
        params.platforms.forEach(function (element) {
            platformsStats.push(element);
        });
    })

    for (let element of platformsStats) {
        await getOwnerForPlatform(element.attributes.obj_id).then(function (el) {
            platformsOwners.push(el);
        })
    }

    usersByType.forEach(el => {
        platformsOwners.forEach(elem => {
            platformsStats.forEach(element => {
                if (el.obj_id == elem.owner.obj_id && elem.attributes.obj_id == element.attributes.obj_id) {
                    let obj = {
                        id: el.obj_id,
                        name: el.name,
                        type: el.type,
                        email: el.email,
                        amount: element.stat.filterPeriod.cost,
                        site_uri: element.attributes.url,
                        platform_name: element.attributes.name,
                        currency: elem.owner.currency
                    }
                    arrForRender.push(obj);
                }
            });
        });
    });

    return arrForRender;
}

function renderPublishersList() {
    isPublishersPage = true;
    isFrilancersPage = false;
    getPublishersList().then(function (arr) {
        createMarkupForPublishers(arr);
    })
}

async function renderFreelancersList(from, to) {
    isPublishersPage = false;
    isFrilancersPage = true;
    let frilancers = [];
    let publishers = [];
    let result = [];

    await getFreelancersList().then(function (arr) {
        // createMarkupForFrilancers(arr);
        arr.forEach(element => {
            frilancers.push(element);
        })
    })

    await getPublishersList(from, to).then(function (pubs) {
        let prevEmail = '';
        let obj = {};
        let arr = [];
        pubs.forEach(element => {
            if (element.email == prevEmail) {
                publishers.forEach(elem => {
                    if (elem.pubsEmail == element.email) {
                        elem.sites.push(element);
                    }
                })
            } else {
                arr = [];
                obj = {};
                arr.push(element);
                obj = {
                    pubsEmail: element.email,
                    sites: arr
                }
                publishers.push(obj);
                obj = {};
                prevEmail = element.email;
            }
        })
    })

    frilancers.forEach(frilancer => {
        publishers.forEach(publisher => {
            if (frilancer.email == publisher.pubsEmail) {
                let obj = {
                    idSolar: frilancer.id,
                    email: frilancer.email,
                    name: frilancer.name,
                    category: frilancer.categoryTitle,
                    uuid: frilancer.uuid,
                    sites: publisher.sites
                }
                result.push(obj);
            }
        })
    })

    console.log(frilancers);
    console.log(publishers);
    console.log(result);
    createMarkupForFrilancers(result);
}

function createMarkupForFrilancers(arr) {
    main_table.innerHTML = '';
    let markup = '';
    let head_markup = ` <tr>
                            <th scope="col">id solar</th>
                            <th scope="col">Почта</th>
                            <th scope="col">ФИО</th>
                            <th scope="col">Категория</th>
                            <th scope="col">uuid</th>
                            <th scope="col">Действия</th>
                        </tr>`;
    main_table_head.innerHTML = head_markup;
    arr.forEach((element, index) => {
        let m =
            '<tr><th scope="row">' + element.idSolar + '</th>' +
            '<td>' + element.email + '</td>' +
            '<td>' + element.name + '</td>' +
            '<td>' + element.category + '</td>' +
            '<td>' + element.uuid + '</td>' +
            `<td data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" aria-expanded="false" aria-controls="flush-collapse${index}" style="cursor: pointer;">Развернуть</td></tr>` +
            `<tr id="flush-collapse${index}" class="accordion-collapse collapse">
                <td colspan='6'><table class="table table-striped">
                    <thead>
                        <th>id pubs</th><th>platform_name</th><th>site_uri</th><th>amount</th><th>type</th><th>действия</th>
                    </thead>
                    <tbody>`;
        markup = markup + m;

        element.sites.forEach((site) => {
            let tm = `<tr><td>${site.id}</td><td>${site.platform_name}</td><td>${site.site_uri}</td><td>${formatter.format(site.amount)}</td><td>${site.type}</td><td style="cursor: pointer;" onclick="makePayment(${element.idSolar}, '${site.amount}', '${site.site_uri}')">Оплатить</td></tr>`;
            markup = markup + tm;
        })

        markup = markup + `</tbody>
                        </table></td>
                    </tr>`
    });
    main_table.innerHTML = markup;
}

async function updateStat(firstDay, today) {
    let newToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    if (isFrilancersPage) {
        renderFreelancersList(firstDay, newToday);
        return;
    }

    if (isPublishersPage) {
        getPublishersList(firstDay, newToday).then(function (arr) {
            createMarkupForPublishers(arr);
            return;
        })
    }

    getPublishersList().then(function (arr) {
        createMarkupForPublishers(arr);
        return;
    })
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1);
}

async function getOwnerForPlatform(id) {
    let response = await fetch('https://api.agency2.ru/platform/' + id + '?access-token=' + token, {
        method: 'GET'
    })

    let result = await response.json();
    // console.log(result);
    return result;
}

async function getAccessToken() {
    const emailAccess = "a.osipov@agency2.ru";
    const passwordAccess = "sgaPmGSE";

    let formData = new FormData();
    formData.append('LoginForm[email]', emailAccess);
    formData.append('LoginForm[password]', passwordAccess);

    const apiURL = "https://api.agency2.ru/site/login";

    let response = await fetch(apiURL, {
        method: 'POST',
        body: formData
    });

    let result = await response.json();
    // console.log(result);
    return result.token;
}

async function getPlatformsWithStats(from, to) {

    let response = await fetch('https://api.agency2.ru/platform/getplatforms?access-token=' + token + '&startDate=' + from + '&&endDate=' + to + '&&place_id=', {
        method: 'POST',
    });

    let result = await response.json();
    // console.log(result);
    return result;
}

async function getCountryCodes() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);

    let response = await fetch(apiURLsolar + '/customer/ord/get-arccw-codes', {
        method: 'GET',
        headers: myHeaders
    })

    let result = await response.json();
    console.log(result);
    return result;
}

const formatter = new Intl.NumberFormat('ru-RU', {
    // style: 'currency',
    // currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

async function invitePublisher(email) {
    let response;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);


    response = await fetch(apiURLsolar + '/customer/freelancers', {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify({
            "email": email,
            "country": "RU",
            "sendEmail": true
        })
    })

    let result = await response.json();
    console.log(result);

    if (Object.hasOwn(result, 'uuid')) {
        createNotification('Приглашение было выслано паблишеру на почту!');
    }

    if (Object.hasOwn(result, 'email')) {
        createNotification(result.email);
    }

    return result;
}

function createMarkupForPublishers(arr) {
    main_table.innerHTML = '';
    let markup = '';
    let head_markup = ` <tr>
                            <th scope="col">id</th>
                            <th scope="col">Почта</th>
                            <th scope="col">Паблишер</th>
                            <th scope="col">Название площадки</th>
                            <th scope="col">Баланс</th>
                            <th scope="col">Валюта</th>
                            <th scope="col">Действия</th>
                        </tr>`;
    main_table_head.innerHTML = head_markup;
    arr.forEach((element, index) => {
        let m = '<tr><th scope="row">' + element.id + '</th>' +
            '<td>' + element.email + '</td>' +
            '<td>' + element.name + '</td>' +
            // '<td>' + element.type + '</td>' +
            '<td>' + element.platform_name + '</td>' +
            '<td>' + formatter.format(element.amount || 0) + '</td>' +
            '<td>' + element.currency + '</td>' +
            `<td><button type="button" class="btn btn-primary" onclick="invitePublisher('${element.email}')">Пригласить</button>` +
            `</td></tr>`;
        markup = markup + m;
    });

    main_table.innerHTML = markup;
}

function showModal(id) {
    $('#' + id).modal('show');
}

function createNotification(params) {
    let divDel = document.getElementById('toast');
    console.log(divDel);
    if (divDel) {
        divDel.remove();
    }
    let div = document.createElement('div');
    div.id = 'toast';
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

function dateUpate() {
    let from = $("#from").datepicker('getDate');
    let to = $("#to").datepicker('getDate');

    if (from && to) {
        updateStat(from, to);
    } else {
        createNotification('Неверно выбраны даты');
    }
}

function startCalendar() {
    var dateFormat = "dd-mm-yy",
        from = $("#from")
            .datepicker({
                // defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1,
                dateFormat: dateFormat
            })
            .on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            }),
        to = $("#to").datepicker({
            // defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            dateFormat: dateFormat
        })
            .on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });
}

function getDate(element) {
    var date;
    try {
        date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
        date = null;
    }

    return date;
}

async function makePayment(user, amount, site) {
    // createNewTask(user, amount, site).then(function (uuid) {
    //     makeQuickPay(uuid);
    // })

    makeQuickPay('0a93995e-ff2b-40d0-b0a4-a296693e44a3');
}

async function makeQuickPay(uuid) {
    let response;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + solarToken);


    response = await fetch(apiURLsolar + '/customer/tasks/quick-pay', {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify({
            "uuid": uuid
        })
    })

    if (response.ok) {
        let result = await response.json();
        console.log(result);
        createNotification('Оплата прошла!');
    } else {
        createNotification('Ошибка! Смотрите консоль!');
    }

    return result;
}

async function getUsersFromDsp() {
    let arr = [];

    let response = await fetch('https://api.agency2.ru/user/getusers?access-token=' + token, {
        method: 'GET'
    });

    let result = await response.json();
    // console.log(result);

    result.users.forEach(element => {
        if (element.type === 'publisher') {
            arr.push(element);
        }
    });

    return arr;
}

async function getUserByType() {
    let response = await fetch('https://api.agency2.ru/user/getuserbytype?access-token=' + token + '&type=publisher', {
        method: 'GET',
    });

    let result = await response.json();
    // console.log(result);
    return result;
}

function getRandomInt(minA, maxA) {
    let min = Math.ceil(minA);
    let max = Math.floor(maxA);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function gen_password() {
    let pass = getRandomInt(8, 10)
    var password = "";
    var symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < pass; i++) {
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }

    return password;
}

function genMerchantId() {
    let pass = getRandomInt(4, 8)
    var id = "";
    var symbols = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < pass; i++) {
        id += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }

    return id;
}


// Модалка
// let modal123 = `<!-- Modal for freelancer -->
// <div class="modal fade" id="${index}" tabindex="-1" role="dialog" aria-labelledby="ModalLabel${index}"
//     aria-hidden="true">
//     <div class="modal-dialog" role="document">
//         <div class="modal-content">
//             <div class="modal-header">
//                 <h5 class="modal-title" id="ModalLabel${index}">Провести оплату</h5>
//                 <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
//                     <span aria-hidden="true">&times;</span>
//                 </button>
//             </div>
//             <div class="modal-body">
//                 <form onsubmit="event.preventDefault();" id="form${index}">
//                     <div class="form-group row">
//                         <label class="col-sm-2 col-form-label">Email</label>
//                         <div class="col-sm-10">
//                             <input type="text" readonly class="form-control-plaintext text-right" name="email" id="staticEmail${index}" value="${element.email}">
//                         </div>
//                     </div>
//                     <div class="form-group row">
//                         <label class="col-sm-2 col-form-label">Паблишер</label>
//                         <div class="col-sm-10">
//                             <input type="text" readonly class="form-control-plaintext text-right" name="name" id="staticName${index}" value="${element.name}">
//                         </div>
//                     </div>
//                     <div class="form-group row">
//                         <label class="col-sm-2 col-form-label">Сумма</label>
//                         <div class="col-sm-10">
//                             <input type="text" readonly class="form-control-plaintext text-right" name="amount" id="staticAmount${index}" value="${formatter.format(element.amount)}">
//                         </div>
//                     </div>
//                     <div class="form-group row">
//                         <label class="col-sm-2 col-form-label">Площадка</label>
//                         <div class="col-sm-10">
//                             <input type="text" readonly class="form-control-plaintext text-right" name="site_uri" id="staticPlatform${index}" value="${element.site_uri}">
//                         </div>
//                     </div>
//                     <button type="submit" class="btn btn-primary">Подтвердить</button>
//                 </form>
//             </div>
//         </div>
//     </div>
// </div>`