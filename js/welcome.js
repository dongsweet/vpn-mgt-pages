/**
 * Welcome Page
 * ------------------
 */

/* eslint-disable camelcase */

const INNER_RES_LIST = "/api/innerResource/getUserResources";

(function ($) {
    'use strict'

    function fillMainContent(data) {
        data.classified.forEach(d => {
            let row = $('<div class="row"></div>');
            $('#welcome-container').append(`<h5 class="mb-2">${d.clazz}</h5>`, row);
            
            d.resources.forEach(r => {
                let col = $('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"></div><!-- /.col -->');
                let infobox = $('<div class="info-box"></div>');
                let content = $('<div class="info-box-content"></div>');
                content.append(`<span class="info-box-text">${r.name + (r.tag ? '(' + r.tag + ')' : '')}</span>`);
                content.append(`<span class="info-box-text">服务地址：${r.service_domain ? r.service_domain : r.service_ip}</span>`);
                content.append(`<span class="info-box-text">真实地址：${r.real_ip ? r.real_ip : r.service_ip}</span>`);
                content.append(`<span class="info-box-text">${r.service_url ? '<a href="' + r.service_url + '" target="_blank">单击访问</a>': '使用工具访问'}</span>`);
                
                infobox.append(`<span class="info-box-icon ${r.type_color}">
                                    <i class="${r.type_icon}"></i>
                                </span>`);
                infobox.append(content);

                col.append(infobox);
                row.append(col);
            });
        });

        $('#vpnUserRealName').text(data.realname);
        $('#vpnUserName').text(data.username);
        $('#vpnIp').text(data.ip);
        $('#vpnUserGroup').text(data.group_path);
    }

    //加载导航数据
    $.getJSON(INNER_RES_LIST)
    .done(data => {
        fillMainContent(data);
    }).fail((jqXHR, textStatus, err) => {
        console.error(err);
    });

})(jQuery)