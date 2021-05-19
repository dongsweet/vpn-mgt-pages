/**
 * Welcome Page
 * ------------------
 */

/* eslint-disable camelcase */

const INNER_RES_LIST_BY_BRANCH = "/api/innerResource/listByBranch";

(function ($) {
    'use strict'

    function fillMainContent(data) {
        for(let d of data) {
            $('#welcome-container').append(`<h5 class="mb-2">${d.branch}</h5>`);
        }
    }

    $.getJSON(INNER_RES_LIST_BY_BRANCH)
    .done(data => {
        fillMainContent(data);
    }).fail((jqXHR, textStatus, err) => {
        console.error(err);
    });

    

})(jQuery)