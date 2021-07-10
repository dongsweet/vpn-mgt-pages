const LOGIN_INFO_URI = '/api/adminUser/loginInfo';
const LOGOUT_URI = '/api/adminUser/logout';
const MENU_URI = '/api/admin/menu';

(function ($) {
    // 登录信息
    $.get(LOGIN_INFO_URI).done(adminUser => {
        $('#adminUserRealName').text(adminUser.realname);
        $('#adminUserName').text(adminUser.username);
        $('#loginIp').text(adminUser.ip);
    });


    $('#aLogout').on('click', () => {
        $.get(LOGOUT_URI).done(result => {
            $(window).attr('location', 'login.html');
        }).fail((jqXHR, textStatus, err) => {
            // TODO 在页面上添加错误消息
            console.log(err);
            $(window).attr('location', 'login.html');
        });
    });

    // 菜单相关
    $.get(MENU_URI).done(menuData => {
        buildMenu(menuData.data);
        makeActive();
    }).fail((jqXHR, textStatus, err) => {
        // TODO 在页面上添加错误消息
        console.log(err);
        alert('目录信息获取失败');
    });

    function buildMenu(meunData) {
        let search = function (parentMenuId, parentUl, level) {
            let filtered = meunData.filter(d => d.parent_menu_id === parentMenuId);

            filtered.forEach(d => {
                let li = $(`<li class="nav-item" data-menu-id="${d.menu_id}"></li>`);
                let a = $(`<a href="${d.url}" class="nav-link">
                    <i class="nav-icon ${d.icon}"></i>
                </a>`);
                let p = $(`<p>${d.menu_name}</p>`);
                a.append(p);
                li.append(a);
                parentUl.append(li);

                let ul = $('<ul class="nav nav-treeview"></ul>');
                let searchLength = search(d.menu_id, ul, level + 1);
                if(searchLength) {
                    let right = $('<i class="right fas fa-angle-left"></i>');
                    p.append(right);
                    li.append(ul);
                }
            });
            return filtered.length;
        }

        search(null, $('#ulRoot'), 0);
    }

    function makeActive() {
        if(MENU_ID) {
            let li = $(`li[data-menu-id='${MENU_ID}']`);
            li.find('a').addClass('active');
            let parentLi = li.parents('li').first();
            while(parentLi.length) {
                parentLi.addClass('menu-open');
                parentLi.find('a').first().addClass('active');
                parentLi = parentLi.parents('li');
            }
        }
    }


})(jQuery)