(function () {
    let cont = document.querySelector('#container_a2_fly');
    let plid = cont.getAttribute('data-plid');
    let contWidth = cont.getAttribute('data-cont-width');
    let globalUri = 'https://a-global.online/test/';
    let vastUri = 'https://ssp.agency2.ru/?plid=' + plid;
    let muteSrc = globalUri + 'assets/mute.png';
    let unmuteSrc = globalUri + 'assets/unmute.png';
    let mobileBool = false;
    let vast;
    let obj = {};
    let info_panel, video, skiptimer_cont, skipTimerCont, timerCont, linearSkipTime, time, btnVolume, srcUri, volume_btn, export_btn, doc, fr, volume_cont, volume_cont_img, impsUri, export_cont, nroa_button, nroa_close, nroa_popup;
    let ord_inn, ord_token, ord_title, inline;
    let impBool = false;
    let qu1Bool = false;
    let qu2Bool = false;
    let qu3Bool = false;
    let isPaused = false;
    let durationSplit;
    let closeTimer = 0;
    // let canSkipping = false;
    var a2_pixel = `<scr` + `ipt type="text/javascript" src="https://cs.agency2.ru/pixeljs" async="async"></scr` + `ipt>`;

    let impArr;
    let eventArr;

    function reqStat(uri) {
        // let i = new Image();
        // i.src = uri;

        var xhr = new XMLHttpRequest()
        xhr.open('GET', uri)
        xhr.withCredentials = true
        xhr.send();
    }

    // <meta name="referrer" content="none">
    let markup = `<link rel="stylesheet" href="${globalUri}players/flyroll/main.css">
    
    <meta charset="utf-8">
    <div>
        <div id="info_panel" style="position:absolute; width: 100%; display: none; justify-content: space-between; z-index: 11;">
            <div 
                style="padding: 10px; background-color: black; margin: 10px; border-radius: 8px; z-index: 11; display: flex;">
                <div style="display: flex; align-items: center;">
                    <div class="ad_title">Реклама</div>
                    <div>
                        <button class="nroa_button" id="nroa_button">i</button>
                        <div class="nroa_popup">
                            <div class="nroa_item" style="display: flex; justify-content: space-between;">
                                <div style="margin-right: 20px;">Рекламное объявление</div>
                                <div id="nroa_close" style="cursor: pointer;">x</div>
                            </div>
                            <div class="nroa_item" style="display: flex; justify-content: space-between;">
                                
                                <div id="ord_title"></div>
                            </div>
                            <div class="nroa_item" style="display: flex; justify-content: space-between;">
                                <div style="margin-right: 10px;">ERID</div>
                                <div id="ord_token"></div>
                            </div>
                        </div>
                    </div>
                    <div class="ad_title ad_timer"></div>
                </div>
            </div>
    
            <div style="display: flex; justify-content: space-between; z-index: 10;">
                <div class="buttons">
                    <button id="volume_btn">
                        <div id="volume_cont">
                            <img id="volume_cont_img" width="100%" height="100%"
                                style="background: white; border-radius: 50%;">
                        </div>
                    </button>
                    <input type="range" step="0.01" min="0" max="1" value="0.5" id="volume" />
                </div>
                <div 
                    style="z-index: 11; display: flex; cursor: pointer;">
                    <div id="skiptimer_cont" style="display: flex; align-items: center; padding: 10px;">
                        <div class="ad_title"><img src="${globalUri}assets/cross_2.png" width="35px" height="35px"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="videoPlayer_a2">
            <a id="export" target="_blank"><video id="video"></video></a>
        </div>
    </div>`;

    let markupMobile = `<link rel="stylesheet" href="${globalUri}players/flyroll/main_mobile.css">
    <meta charset="utf-8">
    <div>
        <div id="info_panel" style="position:absolute; width: 100%; display: flex; justify-content: space-between; z-index: 11;">
            <div 
                style="padding: 5px; background-color: black; margin: 10px; border-radius: 8px; z-index: 11; display: flex;">
                <div style="display: flex; align-items: center;">
                    <div class="ad_title">Реклама</div>
                    <div>
                        <button class="nroa_button" id="nroa_button">i</button>
                        <div class="nroa_popup">
                            <div class="nroa_item" style="display: flex; justify-content: space-between;">
                                <div style="margin-right: 20px;">Рекламное объявление</div>
                                <div id="nroa_close" style="cursor: pointer;">x</div>
                            </div>
                            <div class="nroa_item" style="display: flex; justify-content: space-between;">
                                
                                <div id="ord_title"></div>
                            </div>
                            <div class="nroa_item" style="display: flex; justify-content: space-between;">
                                <div style="margin-right: 10px;">ERID</div>
                                <div id="ord_token"></div>
                            </div>
                        </div>
                    </div>
                    <div class="ad_title ad_timer"></div>
                </div>
            </div>
    
            <div style="display: flex; justify-content: space-between; z-index: 10">
                <div class="buttons">
                    <button id="volume_btn">
                        <div id="volume_cont">
                            <img id="volume_cont_img" width="100%" height="100%"
                                style="background: white; border-radius: 50%;">
                        </div>
                    </button>
                    <input type="range" step="0.01" min="0" max="1" value="0.5" id="volume" />
                </div>
                <div 
                    style="z-index: 11; display: flex;">
                    <div id="skiptimer_cont" style="padding: 10px; border-radius: 50%; background: gray; position: absolute; right: 0; top: -40px;">
                        <div class="ad_title"><img  src="${globalUri}assets/cross_2.png" width="10px" height="10px"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="videoPlayer_a2">
            <a id="export" target="_blank"><video id="video"></video></a>
        </div>
    </div>`;

    // player markup
    var getPlayerMarkup = function () {
        fr = document.createElement('iframe');
        fr.style.border = 'none';
        cont.appendChild(fr);
        doc = fr.contentDocument.document || fr.contentDocument;
        doc.body.style.margin = '0px';
        doc.body.style.overflow = 'hidden';
        doc.body.style.display = 'flex';
        doc.body.style.alignItems = 'flex-end';
        doc.body.innerHTML = mobileBool ? markupMobile : markup;

        // var meta = document.createElement('meta');
        // meta.name = "referrer";
        // meta.content = "https://ivi.ru";
        // doc.getElementsByTagName('head')[0].appendChild(meta);
        // doc.head.baseURI = 'https://ivi.ru';
        // doc.head.innerHTML = '<meta http-equiv="content-type" content="1;url=https://ivi.ru">'
        // console.log(doc.head);


        // Получаем текущий URL страницы
        // var currentUrl = window.location.href;

        // Создаем новый URL с подмененным referrer
        // var newUrl = currentUrl.replace(/(\?|&)referrer=([^&]*)/, '');

        // Добавляем новый referrer к текущему URL
        // newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + 'referrer=https://ivi.ru';

        // Перенаправляем на новый URL с подмененным referrer
        // window.location.href = newUrl;

        fetchVAST();
    }

    // response vast
    var fetchVAST = function (wrapperUri) {
        vast = null;
        video = null;
        var xhr = new XMLHttpRequest()
        xhr.open('GET', vastUri)
        xhr.onload = function () {
            vast = xhr.response;
            initPlayer(vast);
        }
        xhr.send();
    }

    function initContainer() {
        if (/webOS|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return;
        }

        if (/Windows|Linux|Mac OS/i.test(navigator.userAgent) && !(/Android|iPhone/i.test(navigator.userAgent))) {
            mobileBool = false;
        } else {
            mobileBool = true;
        }

        // console.log(navigator.userAgent);
        // console.log(mobileBool);

        cont.style.display = 'flex';
        cont.style.justifyContent = 'center';
        cont.style.zIndex = 9999;

        if (!mobileBool) {
            cont.style.width = contWidth + 'px';
        } else {
            cont.style.width = document.documentElement.clientWidth + 'px';
            // console.log(cont.style.width);
        }

        // cont.style.height = contHeight + 'px';
        cont.style.overflow = 'hidden';
        cont.style.position = 'fixed';
        // cont.style.background = 'black';

        getPlayerMarkup();
    }

    function initPlayer(vastStr) {
        video = doc.getElementById("video");
        if (mobileBool) {
            video.setAttribute("muted", "");
            video.setAttribute("playsInline", "");
        }


        time = doc.querySelector(".timeline");
        btnVolume = doc.getElementById('volume');
        volume_btn = doc.querySelector("#volume_btn");
        volume_cont = volume_btn.querySelector("#volume_cont");
        volume_cont_img = volume_cont.querySelector("#volume_cont_img");
        // export_cont = doc.querySelector('.export-cont');
        export_btn = doc.querySelector('#export');
        nroa_button = doc.querySelector('#nroa_button');
        nroa_popup = doc.querySelector('.nroa_popup');
        nroa_close = doc.querySelector('#nroa_close');
        timerCont = doc.querySelector('.ad_timer');
        // skipTimerCont = doc.querySelector('.ad_skiptimer');
        skiptimer_cont = doc.querySelector('#skiptimer_cont');
        // ord_inn = doc.querySelector('#ord_inn');
        ord_token = doc.querySelector('#ord_token');
        ord_title = doc.querySelector('#ord_title');
        info_panel = doc.querySelector('#info_panel');


        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(vastStr, 'text/xml');

        inline = xmlDoc.getElementsByTagName('InLine')[0];

        if (!inline) {
            // closeTimer++;
            let t = setTimeout(() => {
                fetchVAST();
            }, 2000);

            // if (closeTimer == 3) {
            //     // Plug
            //     if (typeof a2_plug != 'undefined') {
            //         clearTimeout(t);
            //         setInnerHTML(cont, a2_plug);
            //     } else {
            //         clearTimeout(t);
            //         Clearing();
            //     }
            // }

            return;
        }

        // closeTimer = 0;

        let duration = inline.getElementsByTagName('Duration')[0].textContent;
        durationSplit = duration.split(':')[2];
        // console.log(durationSplit);

        let linear = inline.getElementsByTagName('Linear')[0].getAttribute('skipoffset');
        // console.log(linear);
        linearSkipTime = linear.split(':')[2];
        // console.log(linearSkipTime);
        // skipTimerCont.innerHTML = linearSkipTime;

        // Global uri
        srcUri = inline.getElementsByTagName('MediaFile')[0].textContent;
        // impUri = inline.getElementsByTagName('Impression')[0].textContent;

        impsUri = [];
        impArr = Array.from(inline.getElementsByTagName('Impression'));
        // console.log(impArr);
        impArr.forEach(element => {
            impsUri.push(element.textContent);
        });
        let errorUri = inline.getElementsByTagName('Error')[0].textContent;

        // ord
        let ord = (inline.querySelector('Extension[type=AdTune]') || "").textContent;
        // console.log(ord);

        if (ord) {
            let ord_parse = JSON.parse(ord);
            ord_title.innerHTML = ord_parse.advertiserInfo;
            ord_token.innerHTML = ord_parse.token;
        }

        // end ord

        // Stat event uri
        eventArr = [
            'acceptInvitation',
            'close',
            'collapse',
            'complete',
            'creativeView',
            'expand',
            'firstQuartile',
            'fullscreen',
            'midpoint',
            'mute',
            'pause',
            'resume',
            'rewind',
            'start',
            'thirdQuartile',
            'unmute',
        ];
        eventArr.forEach(function (event) {
            obj[event] = [];
            let eventsArr = inline.querySelectorAll('Tracking[event=' + event + ']');
            eventsArr.forEach(element => {
                obj[event].push(element.textContent);
            });
        })

        // console.log(obj);

        // Video events
        video.addEventListener("play", Unpaused)

        video.addEventListener('playing', PlayingParams)

        video.addEventListener('ended', sendComplete)

        video.addEventListener('pause', Paused)

        qu1Bool = false;
        qu2Bool = false;
        qu3Bool = false;
        impBool = false;

        video.addEventListener('timeupdate', TimeupdateEvents)

        volume_btn.addEventListener("click", MuteClicks);

        nroa_button.addEventListener("click", function () {
            nroa_popup.style.display = "flex";
        })

        nroa_close.addEventListener("click", function () {
            nroa_popup.style.display = "none";
        })

        // export_btn.textContent = inline.getElementsByTagName('AdTitle')[0].textContent;
        export_btn.href = inline.getElementsByTagName('ClickThrough')[0].textContent;

        export_btn.addEventListener('click', exportClick)

        skiptimer_cont.addEventListener("click", function () {
            obj.close.forEach(element => {
                reqStat(element);
            });
            removeContainer();
        })

        // Pause when page not in focus
        doc.addEventListener('visibilitychange', unfocusPause)

        document.onfocus = function () {
            // console.log('Вкладка активна');
            video.play();
        }

        document.onblur = function () {
            // console.log('Вкладка не активна');
            video.pause();
        }
        // END

        // Pixel >50% viewbility
        var adContainer = cont;
        var visibilityPixel = document.querySelector('.visibility-pixel') || {};

        function checkVisibility() {
            var adRect = adContainer.getBoundingClientRect();
            var isVisible = adRect.top < window.innerHeight / 2 && adRect.bottom > 0;
            if (isVisible) {
                // console.log("50% fly");
                visibilityPixel.src = 'https://example.com/pixel.gif?event=visible';
            }
        }

        // window.addEventListener('scroll', checkVisibility);
        // checkVisibility();
        // End

        playVideo();
    }

    function setInnerHTML(elm, html) {
        elm.innerHTML = html;

        Array.from(elm.querySelectorAll("script"))
            .forEach(oldScriptEl => {
                const newScriptEl = document.createElement("script");

                Array.from(oldScriptEl.attributes).forEach(attr => {
                    newScriptEl.setAttribute(attr.name, attr.value)
                });

                const scriptText = document.createTextNode(oldScriptEl.innerHTML);
                newScriptEl.appendChild(scriptText);

                oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
            });
    }

    function exportClick() {
        reqStat(inline.getElementsByTagName('ClickTracking')[0].textContent)
    }

    function Unpaused() {
        isPaused = false;
    }

    function Paused() {
        isPaused = true;
    }

    function PlayingParams() {
        let v = fr.contentWindow.document.getElementsByTagName('video');

        if (!mobileBool) {
            fr.width = contWidth;
            fr.height = v[0].offsetHeight;
            // console.log(fr.height);

            cont.style.top = document.documentElement.clientHeight - fr.height - 15 + 'px';
            cont.style.left = document.documentElement.clientWidth - contWidth - 15 + 'px';
        } else {
            // console.log(mobileBool);
            // fr.width = document.documentElement.clientWidth;
            fr.width = '80%';
            fr.height = v[0].offsetHeight + 40;
            cont.style.top = document.documentElement.clientHeight - fr.height + 'px';
            cont.style.left = '0px';
        }

        sendStart();
    }

    function TimeupdateEvents() {
        let videoTime = Math.round(video.currentTime);
        let videoLength = Math.round(video.duration);

        timerCont.innerHTML = durationSplit - videoTime;

        let f = Math.round(videoLength / 4);
        let mid = Math.round(videoLength / 2);
        let th = f + mid;

        if (qu1Bool === false && videoTime == f) {
            // console.log("qu 1");
            obj.firstQuartile.forEach(element => {
                reqStat(element);
            });
            qu1Bool = true;
            // Stopper
            // video.pause()
        }
        if (qu2Bool === false && videoTime == mid) {
            // console.log("qu 2");
            obj.midpoint.forEach(element => {
                reqStat(element);
            });
            qu2Bool = true;
        }
        if (qu3Bool === false && videoTime == th) {
            // console.log("qu 3");
            obj.thirdQuartile.forEach(element => {
                reqStat(element);
            });
            qu3Bool = true;
        }
        if (impBool === false && videoTime === 3) {
            impsUri.forEach(element => {
                reqStat(element);
            });
            impBool = true;
        }

        // if (skipTimerCont.innerHTML <= 0) {
        //     skipTimerCont.innerHTML = '>';
        //     canSkipping = true;
        //     return;
        // }

        // if (skipTimerCont.innerHTML > 0) {
        //     skipTimerCont.innerHTML = linearSkipTime - videoTime;
        // }
    }

    function MuteClicks() {
        let vol = video.volume;
        let muteBool = vol === 0 ? true : false;

        if (!muteBool) {
            volume_cont_img.src = muteSrc;
            video.volume = 0;
            muteBool = true;
            console.log("mute");
            obj.mute.forEach(element => {
                reqStat(element);
            });
            return;
        }

        if (muteBool) {
            volume_cont_img.src = unmuteSrc;
            video.volume = 0.1;
            muteBool = false;
            console.log("unmute");
            obj.unmute.forEach(element => {
                reqStat(element);
            });
            return;
        }
    }

    function unfocusPause() {
        if (doc.hidden) {
            // console.log('Вкладка не активна');
            video.pause();
        } else {
            // console.log('Вкладка активна');
            video.play();
        }
    }

    function sendStart() {
        // Start
        obj.start.forEach(element => {
            reqStat(element);
        });
        // video.pause();

        isPaused = false;
        inProgress = true;
    }

    function sendComplete() {
        obj.complete.forEach(element => {
            reqStat(element);
        });
        // console.log("Complete");

        closeTimer++;

        if (closeTimer == 2) {
            // Plug
            if (typeof a2_plug != 'undefined') {
                setInnerHTML(cont, a2_plug);
                return;
            } else {
                Clearing();
                return;
            }
        }

        // Clearing
        // Clearing();

        setTimeout(() => {
            fetchVAST();
        }, 1000);
    }

    function Clearing() {
        video.src = '';
        // video = null;
        volume_cont.style.display = "none";
        info_panel.style.display = "none";
        // export_cont.style.display = "none";
        canSkipping = false;

        // Remove video events
        video.removeEventListener("play", Unpaused);
        video.removeEventListener('playing', PlayingParams);
        video.removeEventListener('ended', sendComplete);

        video.removeEventListener('pause', Paused);
        video.removeEventListener('timeupdate', TimeupdateEvents);
        volume_btn.removeEventListener("click", MuteClicks);
        doc.removeEventListener('visibilitychange', unfocusPause);
        export_btn.removeEventListener('click', exportClick)
    }

    function removeContainer() {
        cont.innerHTML = '';
    }

    async function playVideo() {
        try {
            volume_cont.style.display = "flex";
            info_panel.style.display = "flex";
            // export_cont.style.display = "block";
            video.src = srcUri;
            volume_cont_img.src = muteSrc;
            btnVolume.value = 0;
            video.volume = btnVolume.value;
            await video.play();
        } catch (err) {
            console.log("Fatal error when cideo trying to play! Remove container", err);
            removeContainer();
        }
    }

    function insertPixel() {
        let div = document.createElement('div');
        div.style.position = 'absolute';
        setInnerHTML(div, a2_pixel);
        cont.appendChild(div);
    }

    initContainer();
    insertPixel();
})();