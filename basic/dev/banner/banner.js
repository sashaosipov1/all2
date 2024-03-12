(function () {
    let cont = document.querySelector('#container_a2_banner');
    let plid = cont.getAttribute('data-plid');
    let globalUri = 'https://a-global.online/test/';
    let vastUri = 'https://ssp.agency2.ru/?plid=' + plid;

    function reqStat(uri) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', uri)
        xhr.withCredentials = true
        xhr.send();
    }

    // response vast
    let getBannerMarkup = function () {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', vastUri)
        xhr.withCredentials = true
        xhr.onload = function () {
            let res = xhr.response;
            // console.log(JSON.parse(res).banners[0]);
            let result = JSON.parse(res).banners[0];
            cont.style.width = result.width + 'px';
            cont.style.height = result.height + 'px';
            let fr = document.createElement('iframe');
            fr.style.border = 'none';
            fr.style.width = 'inherit';
            fr.style.height = 'inherit';
            cont.appendChild(fr);
            fr.setAttribute('srcdoc', result.html);
            fr.setAttribute('id', 'agency2_banner');

            setTimeout(() => {insertOrdMarkup();}, 1000);
        }
        xhr.send();
    }

    function insertOrdMarkup() {
        let cont = document.querySelector('#agency2_banner');
        let doc = cont.contentDocument;
        doc.body.style.position = 'relative';
        let ordMarkup = `<link rel="stylesheet" href="${globalUri}players/banner/main.css">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; position: absolute; z-index: 1">
            <div class="ad_title">Реклама</div>
            <div>
                <button class="nroa_button" id="nroa_button">i</button>
                <div class="nroa_popup">
                    <div class="nroa_item" style="display: flex; justify-content: space-between;">
                        <div style="margin-right: 20px;">Рекламное объявление</div>
                        <div id="nroa_close" style="cursor: pointer;">x</div>
                    </div>
                    <div class="nroa_item" style="display: flex; justify-content: space-between;">
                        <div id="ord_title">Реклама. ООО «ТОСОЛ-СИНТЕЗ ТРЕЙДИНГ». ИНН 5249046147. 18+</div>
                    </div>
                    <div class="nroa_item" style="display: flex; justify-content: space-between;">
                        <div style="margin-right: 10px;">ERID</div>
                        <div id="ord_token">LatrWuuRe</div>
                    </div>
                </div>
            </div>
        </div>
        `;
        doc.body.innerHTML = ordMarkup + doc.body.innerHTML;
        console.log(cont.innerHTML);


        nroa_button = doc.querySelector('#nroa_button');
        nroa_popup = doc.querySelector('.nroa_popup');
        nroa_close = doc.querySelector('#nroa_close');

        nroa_button.addEventListener("click", function () {
            nroa_popup.style.display = "flex";
        })

        nroa_close.addEventListener("click", function () {
            nroa_popup.style.display = "none";
        })

        let img = doc.querySelector('#adwist-banner-wrapper');
        img.style.left = '0px';
    }

    getBannerMarkup();
})();