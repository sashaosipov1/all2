(function () {
    let cont = document.querySelector('#container_a2_inr');
    let plid = cont.getAttribute('data-plid');
    let contWidth = cont.getAttribute('data-cont-width');
    let contHeight = cont.getAttribute('data-cont-height');
    let globalUri = 'https://a-global.online/test/';
    let vastUri = 'https://ssp.agency2.ru/?plid=' + plid;
    let muteSrc = globalUri + 'assets/mute.png';
    let unmuteSrc = globalUri + 'assets/unmute.png';
    let vast;
    let obj = {};
    let video, time, btnPlay, btnClose, btnVolume, srcUri, volume_btn, muteIcon, unmuteIcon,
        export_btn, doc, fr, volume_cont, volume_cont_img, impUri, export_cont, nroa_button, nroa_close, nroa_popup, impsUri;
    let inProgress = false;
    let impBool = false;
    let mobileBool = false;
    let qu1Bool = false;
    let qu2Bool = false;
    let qu3Bool = false;
    let isPaused = false;
    let closeTimer = 0;
    let ord_inn, ord_token, ord_title;

    function reqStat(uri) {
        // let i = new Image();
        // i.src = uri;

        var xhr = new XMLHttpRequest()
        xhr.open('GET', uri)
        xhr.withCredentials = true
        xhr.send();
    }

    let markup = `<link rel="stylesheet" href="${globalUri}players/inr/main.css">
            <meta charset="utf-8">
            <div id="videoPlayer_a2_inr">
                <div id="controls">
                    <div style="display: flex; justify-content: space-between;">
                        <div style="padding: 10px; background-color: black; margin: 10px; border-radius: 8px; z-index:1; display: flex;">
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
                        <div class="buttons">
                            <button id="volume_btn">
                                <div id="volume_cont">
                                    <img id="volume_cont_img" width="100%" height="100%">
                                </div>
                            </button>
                            <input type="range" step="0.01" min="0" max="1" value="0.5" id="volume" />
                        </div>
                    </div>
                    <div class="video-track">
                        <div class="timeline"></div>
                    </div>
                </div>
                <a id="export" target="_blank" rel="noreferrer"><video id="video"></video></a>
            </div>`;

    let markupMobile = `<link rel="stylesheet" href="${globalUri}players/inr/main_mobile.css">
            <div id="videoPlayer_a2_inr">
                <div id="controls">
                    <div style="display: flex; justify-content: space-between;">    
                        <div class="ad_title">Реклама</div>
                        <div class="ad_title"><a href="https://agency2.ru" style="text-decoration: none; color: inherit;" target="_blank">Agency 2</a></div>
                    </div>
                    <div class="video-track">
                        <div class="timeline"></div>
                    </div>
                </div>
                <a id="export" target="_blank" rel="noreferrer"><video id="video"></video></a>
                <div class="buttons">
                    <button id="volume_btn">
                        <div id="volume_cont">
                            <img id="volume_cont_img" width="100%" height="100%">
                        </div>
                    </button>
                    <input type="range" step="0.01" min="0" max="1" value="0.5" id="volume" />
                </div>
            </div>`;

    // player markup
    var getPlayerMarkup = function () {
        fr = document.createElement('iframe');
        fr.style.border = 'none';
        fr.style.borderRadius = '0px';
        cont.appendChild(fr);
        let cs = document.createElement('meta');
        cs.charser = "utf-8";
        doc = fr.contentDocument.document || fr.contentDocument;
        doc.body.style.margin = '0px';
        doc.body.style.overflow = 'hidden';
        doc.head.appendChild(cs);

        if (/webOS|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return;
        }

        if (/Windows|Linux|Mac OS/i.test(navigator.userAgent)) {
            //  other
            doc.body.innerHTML = markup;
        }

        if (/Android|iPhone/i.test(navigator.userAgent)) {
            // mobile
            doc.body.innerHTML = markupMobile;
            mobileBool = true;
        }
    }

    // response vast
    var fetchVAST = function () {
        vast = null;
        video = null;
        var xhr = new XMLHttpRequest()
        xhr.open('GET', vastUri)
        xhr.withCredentials = true
        xhr.onload = function () {
            vast = xhr.response;
            initPlayer(vast);
        }
        xhr.send()
    }

    function initContainer() {
        cont.style.display = 'flex';
        cont.style.justifyContent = 'center';
        cont.style.width = 'auto';
        cont.style.height = '0px';
        cont.style.overflow = 'hidden';
        cont.style.transition = 'all 1s';
        cont.style.position = 'relative';

        cont.addEventListener("transitionend", function (params) {
            if (params.target.style.height != '0px') {
                // reqStat(obj.expand);
                fetchVAST();
            } else {
                // Close
                inProgress = false;

                try {
                    video.removeEventListener("playing", sendStart)
                    video.removeEventListener('ended', sendComplete)
                } catch (error) {
                    console.log(error);
                }

                // reqStat(obj.collapse);
            }
        });


        window.addEventListener('scroll', function () {
            let h = parseInt(contHeight) + 10;
            let targetPosition = {
                top: window.pageYOffset + cont.getBoundingClientRect().top,
                bottom: window.pageYOffset + cont.getBoundingClientRect().bottom
            };
            // Получаем позиции окна
            let windowPosition = {
                top: window.pageYOffset,
                bottom: window.pageYOffset + document.documentElement.clientHeight
            };

            if (targetPosition.top > windowPosition.top &&
                targetPosition.bottom < windowPosition.bottom && inProgress === false) {
                if (video) {
                    if (video.paused) {
                        video.play();
                    }
                } else {

                }
            }

            if (targetPosition.top > windowPosition.top &&
                targetPosition.bottom < (windowPosition.bottom - h) && inProgress === false) {
                // console.log("Start");
                if (video) {
                    if (video.paused) {
                        video.play();
                    }
                } else {
                    displayADBlock();
                }
            }

            if ((targetPosition.top < windowPosition.top && inProgress === true) ||
                (targetPosition.bottom > windowPosition.bottom && inProgress === true)) {
                video.pause();
                inProgress = false;
            }
        })

        getPlayerMarkup();
    }

    function initPlayer(vastStr) {
        video = doc.getElementById("video");
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
        // ord_inn = doc.querySelector('#ord_inn');
        ord_token = doc.querySelector('#ord_token');
        ord_title = doc.querySelector('#ord_title');

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(vastStr, 'text/xml');

        let inline = xmlDoc.getElementsByTagName('InLine')[0];

        // nobanner
        if (!inline) {
            closeTimer++;
            let t = setTimeout(() => {
                fetchVAST();
            }, 2000);

            if (closeTimer == 113) {
                // Plug
                if (typeof a2_plug != 'undefined') {
                    clearTimeout(t);
                    setInnerHTML(cont, a2_plug);
                } else {
                    hideADBlock();
                    clearTimeout(t);
                }
            }

            // console.log("Nobanner");
            // hideADBlock();
            return;
        }

        closeTimer = 0;

        let duration = inline.getElementsByTagName('Duration')[0].textContent;
        // console.log(duration);

        // Global uri
        srcUri = inline.getElementsByTagName('MediaFile')[0].textContent;
        // impUri = inline.getElementsByTagName('Impression')[0].textContent;

        impsUri = [];
        impArr = Array.from(inline.getElementsByTagName('Impression'));
        console.log(impArr);
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
        const eventArr = [
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

        console.log(obj);

        // Video events
        video.addEventListener("play", Unpaused)

        video.addEventListener("playing", sendStart)

        video.addEventListener('ended', sendComplete)

        video.addEventListener('pause', Paused)

        video.addEventListener("contextmenu", function () {
            return false;
        })

        qu1Bool = false;
        qu2Bool = false;
        qu3Bool = false;
        impBool = false;

        video.addEventListener('timeupdate', TimeupdateEvents)

        volume_btn.addEventListener("click", MuteClicks)

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

        // skiptimer_cont.addEventListener("click", function () {
        //     if (canSkipping) {
        //         obj.close.forEach(element => {
        //             reqStat(element);
        //         });
        //         removeContainer();
        //     }
        // })

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

        if (mobileBool === false) {
            nroa_button.addEventListener("click", function () {
                nroa_popup.style.display = "flex";
            })

            nroa_close.addEventListener("click", function () {
                nroa_popup.style.display = "none";
            })
        }

        // export_btn.textContent = inline.getElementsByTagName('AdTitle')[0].textContent;
        export_btn.href = inline.getElementsByTagName('ClickThrough')[0].textContent;

        export_btn.addEventListener('click', function () {
            reqStat(inline.getElementsByTagName('ClickTracking')[0].textContent)
        })

        playVideo();
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
            console.log(mobileBool);
            fr.width = document.documentElement.clientWidth;
            fr.height = v[0].offsetHeight;
            cont.style.top = document.documentElement.clientHeight - fr.height + 'px';
            cont.style.left = '0px';
        }

        sendStart();
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

    function TimeupdateEvents() {
        let videoTime = Math.round(video.currentTime);
        let videoLength = Math.round(video.duration);
        startTimeLine(time);

        // timerCont.innerHTML = videoTime;

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
        //     // console.log(123);
        //     skipTimerCont.innerHTML = '>';
        //     canSkipping = true;
        //     return;
        // }

        // if (skipTimerCont.innerHTML > 0) {
        //     // console.log(234);
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
            video.volume = 0.5;
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

        isPaused = false;
        inProgress = true;

        let v = fr.contentWindow.document.getElementsByTagName('video');
        // console.log(v);
        fr.width = v[0].offsetWidth;
        // console.log(fr.width);

        // video.pause()
    }

    function sendComplete() {
        obj.complete.forEach(element => {
            reqStat(element);
        });
        // console.log("Complete");
        clearInterval(videoPlay);
        video.src = '';
        doc.querySelector('#controls').style.display = 'none';
        volume_cont.style.display = "none";
        // export_cont.style.display = "none";
        // Clearing();
        // hideADBlock();

        setTimeout(() => {
            fetchVAST();
        }, 1000);
    }

    async function playVideo() {
        try {
            doc.querySelector('#controls').style.display = 'flex';
            volume_cont.style.display = "flex";
            // export_cont.style.display = "block";
            video.src = srcUri;
            volume_cont_img.src = muteSrc;
            btnVolume.value = 0;
            video.volume = btnVolume.value;
            await video.play();
        } catch (err) {
            // console.log("some error");

            setTimeout(() => {
                fetchVAST();
            }, 1000);
        }
    }

    function Clearing() {
        video.src = '';
        // video = null;
        volume_cont.style.display = "none";
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
    }

    function startTimeLine(time) {
        videoPlay = setInterval(function () {
            if (video) {
                let videoTime = video.currentTime;
                let videoLength = video.duration;
                time.style.width = (videoTime * 100) / videoLength + '%';
            }
        }, 10)
    }

    function displayADBlock() {
        AdBlock = setTimeout(function () {
            cont.style.height = parseInt(contHeight) + 'px';
        }, 0)
    }

    function hideADBlock() {
        AdBlock = setTimeout(function () {
            inProgress = false;
            cont.style.height = '0px';
        }, 0)
    }

    initContainer();
})();