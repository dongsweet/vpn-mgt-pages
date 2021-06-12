/**
 * Welcome Page
 * ------------------
 */

/* eslint-disable camelcase */

const INNER_RES_LIST_BY_BRANCH = "/api/innerResource/listByBranch";
const VPN_USER_INFO = "/api/vpnUser/getUserByIp";

(function ($) {
    'use strict'

    const types = {
        type_1: {icon: 'fas fa-network-wired', color: 'bg-danger'},     //分支端
        type_2: {icon: 'fab fa-fort-awesome', color: 'bg-warning'},     //堡垒机
        type_3: {icon: 'fas fa-cloud', color: 'bg-info'},               //云平台
        type_6: {icon: 'fab fa-watchman-monitoring', color: 'bg-olive'},//监控代理
        type_7: {icon: 'far fa-bell', color: 'bg-teal'},                //Zabbix
        other: {icon: 'fas fa-border-style', color: 'bg-secondary'},    //其他
    }

    function fillMainContent(data) {
        data.forEach(d => {
            let row = $('<div class="row"></div><!-- /.row -->');
            $('#welcome-container').append(`<h5 class="mb-2">${d.branch}</h5>`, row);
            
            d.resources.forEach(r => {
                let col = $('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"></div><!-- /.col -->');
                let infobox = $('<div class="info-box"></div><!-- /.info-box -->');
                let content = $('<div class="info-box-content"></div><!-- /.info-box-content -->');
                content.append(`<span class="info-box-text">${r.type + (r.tag ? '(' + r.tag + ')' : '')}</span>`);
                content.append(`<span class="info-box-text">服务地址：${r.service_domain ? r.service_domain : r.service_ip}</span>`);
                content.append(`<span class="info-box-text">真实地址：${r.real_ip ? r.real_ip : r.service_ip}</span>`);
                content.append(`<span class="info-box-text">${r.service_url ? '<a href="' + r.service_url + '" target="_blank">单击访问</a>': '使用工具访问'}</span>`);
                
                let type = types['type_' + r.type_id] || types['other'];
                infobox.append(`<span class="info-box-icon ${type.color}">
                                    <i class="${type.icon}"></i>
                                </span>`);
                infobox.append(content);

                col.append(infobox);
                row.append(col);
            });
        });
    }

    //加载用户信息
    $.getJSON(VPN_USER_INFO)
    .done(data => {
        $("#vpnUserRealName").text(data.realname);
        $("#vpnUserName").text(data.username);
        $("#vpnIp").text(data.ip);
    }).fail((jqXHR, textStatus, err) => {
        console.error(err);
    });

    //加载导航数据
    $.getJSON(INNER_RES_LIST_BY_BRANCH)
    .done(data => {
        fillMainContent(data);
    }).fail((jqXHR, textStatus, err) => {
        console.error(err);
    });



    

})(jQuery)