window.addEventListener('load', function name(params) {
    // // Получние статы за текущий календарный месяц
    // const date = new Date();
    // const firstDay = getFirstDayOfMonth(
    //     date.getFullYear(),
    //     date.getMonth(),
    // );
    // const today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    // console.log(firstDay);
    // console.log(today);

    $("#from").datepicker('setDate', new Date(2021, 1, 1));
    $("#to").datepicker('setDate', new Date(2022, 1, 1));
})