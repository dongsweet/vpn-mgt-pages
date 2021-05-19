/**
 * Welcome Page
 * ------------------
 */

/* eslint-disable camelcase */

const INNER_RES_LIST_BY_BRANCH = "/api/innerResource/listByBranch";

(function ($) {
    'use strict'

    function fillMainContent(data) {
        data.forEach(d => {
            let row = $('<div class="row"></div><!-- /.row -->');
            $('#welcome-container').append(`<h5 class="mb-2">${d.branch}</h5>`, row);
            
            d.resources.forEach(r => {
                let col = $('<div class="col-md-3 col-sm-6 col-12"></div><!-- /.col -->');
                let infobox = $('<div class="info-box"></div><!-- /.info-box -->');
                let content = $('<div class="info-box-content"></div><!-- /.info-box-content -->');
                content.append(`<span class="info-box-text">${r.type + (r.tag ? '(' + r.tag + ')' : '')}</span>`);
                content.append(`<span class="info-box-text">服务地址：${r.service_domain ? r.service_domain : r.service_ip}</span>`);
                content.append(`<span class="info-box-text">真实地址：${r.real_ip ? r.real_ip : r.service_ip}</span>`);
                content.append(`<span class="info-box-text">${r.service_url ? '<a href="' + r.service_url + '" target="_blank">单击访问</a>': '使用工具访问'}</span>`);
                
                infobox.append('<span class="info-box-icon bg-info"><i class="far fa-envelope"></i></span>');
                infobox.append(content);

                col.append(infobox);
                row.append(col);
            });
        });
    }

    $.getJSON(INNER_RES_LIST_BY_BRANCH)
    .done(data => {
        fillMainContent(data);
    }).fail((jqXHR, textStatus, err) => {
        console.error(err);
    });

    

})(jQuery)