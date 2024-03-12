const creativeData = {
    AdParameters: `{"crs":[{"advertiser_id":-1,"title":"","description":"","duration":0,"ya_id":"","raw_content":"","content":{"disable_attention_metrics":true,"main_content":"https://exchange.buzzoola.com/dsp_adm/33ee771f-7dfb-47e1-670f-0e8710a6f502/"},"content_type":"vast","overlay_start_after":0,"overlay_close_after":10000000,"action_button_title":"","tracking_url":{},"player_show_skip_button_before_play":false,"player_show_skip_button_seconds":30,"player_show_title":true,"click_event_view":"whole","auto_play":true,"logo_url":null,"player_show_panels":false,"thumbnail":"","tracking_js":{},"click_event_url":"","skip_clickthru":false,"landing_link_text":"","landing_link_position":"right","displayed_price":"","js_wrapper_url":"","event_url":"https://exchange.buzzoola.com/event/3d7ff311-1563-4460-5224-2453a4373cdb/33ee771f-7dfb-47e1-670f-0e8710a6f502/TUnkCkL_z8jefjxmNDoi0scCBiuYLfxCMG9Xq-4CuOB8zIYJn5FfMPHFPfJzkqfmroOYW0KXiqbYg3nZgcSMzA/","resend_event_url":"https://exchange.buzzoola.com/resend_event/3d7ff311-1563-4460-5224-2453a4373cdb/33ee771f-7dfb-47e1-670f-0e8710a6f502/TUnkCkL_z8jefjxmNDoi0scCBiuYLfxCMG9Xq-4CuOB8zIYJn5FfMPHFPfJzkqfmroOYW0KXiqbYg3nZgcSMzA/","creative_hash":"TUnkCkL_z8jefjxmNDoi0scCBiuYLfxCMG9Xq-4CuOB8zIYJn5FfMPHFPfJzkqfmroOYW0KXiqbYg3nZgcSMzA","custom_html":"","custom_js":"","campaign_id":-1,"line_item_id":-1,"creative_id":-1,"extra":{"imp_id":"33ee771f-7dfb-47e1-670f-0e8710a6f502","rtime":"2024-01-29 13:56:21"},"auction_settings":null,"ad_format_type":"inread","show_legal_info":true,"ad_label_info":{"ad_labels":[["Рекламодатель","ООО \"ЗВУК\""],["ERID","2SDnjeFgiAU"]],"seller_link":"https://zvuk.com"},"seller_name":"ООО \"ЗВУК\"","seller_address":"","seller_ogrn":"","seller_inn":"","seller_link":"https://zvuk.com","seller_alternative_inn":"","seller_reg_number":"","seller_mobile_phone":"","seller_epay_number":"","seller_oksm_number":"","seller_creative_erir_id":"2SDnjeFgiAU"}],"tracking_urls":{},"tracking_js":{},"placement":{"placement_id":1217282,"unit_type":"inread","unit_settings":{"autoplay_enable_sound":false,"container_height":"","width":"100%"},"unit_settings_list":[],"disallow_fpc":false,"code_settings":null,"env_type":"web"},"uuid":"b471f84c06610feb16169f244c6bc678","auction_id":"3d7ff311-1563-4460-5224-2453a4373cdb","env":"prod"}`
};

(() => {
    const log = (text, data) => {
        if (data) {
            console.log('%c ' + text, 'color: #bada55;', data);
        } else {
            console.log('%c ' + text, 'color: #bada55;');
        }
    }

    const width = 600;
    const height = 340;

    const createElements = () => {
        const slot = document.createElement('div');
        slot.id = 'slot';
        slot.style.position = 'relative';
        slot.style.width = width + 'px';
        slot.style.height = height + 'px';
        slot.style.background = '#eee';

        const videoSlot = document.createElement('video');
        videoSlot.id = 'videoslot';
        videoSlot.style.width = '100%';
        videoSlot.style.height = '100%';

        slot.appendChild(videoSlot);
        document.body.appendChild(slot);
    }

    const startVpaid = () => {
        const environmentVars = {
            slot: document.querySelector('#slot'),
            videoSlot: document.querySelector('#videoslot'),
        };

        const viewMode = 'normal';
        const desiredBitrate = 100;

        const VPAIDAd = getVPAIDAd();
        VPAIDAd.subscribe(() => {

            VPAIDAd.startAd();
            log('VPAID_PLAYER_INIT_SUCCESS');
        }, 'AdLoaded');

        VPAIDAd.subscribe(() => {
            log('VPAID_PLAYER_AD_STARTED');
        }, 'AdStarted');

        VPAIDAd.initAd(
            width,
            height,
            viewMode,
            desiredBitrate,
            creativeData,
            environmentVars
        );
        console.log(VPAIDAd);
    };

    const createScript = () => {
        const el = document.createElement('script')
        el.src = 'https://tube.buzzoola.com/js/lib/vpaid_js_proxy_hash_only.js'
        el.onload = (e) => {
            log('SCRIPT_LOAD_SUCCESS');

            startVpaid();
        }

        el.onerror = (e) => {
            log('SCRIPT_LOAD_ERROR', e);
        };

        document.body.appendChild(el);
    };

    createElements();
    createScript();
})();