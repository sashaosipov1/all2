(function() {
    let cont = document.querySelector('.adwistsfplace');
    let id = cont.getAttribute('id');
    // console.log(id);
    let block = document.querySelector('#' + id);
    let width = block.clientWidth;
    let height = block.clientHeight;
    console.log(width, height);
})();