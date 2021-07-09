const MENU_URI = '/api/admin/menu';

(function ($) {
    $.get(MENU_URI).done(menuData => {
        console.log(menuData);
    }).fail((jqXHR, textStatus, err) => {
        // TODO 在页面上添加错误消息
        console.log(err);
        alert('目录信息获取失败');
    });
})(jQuery)