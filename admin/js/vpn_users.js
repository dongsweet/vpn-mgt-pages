const MENU_ID = 'YHGL_YHLB';
const USERS_URI = '/api/admin/vpnUsers';
const USER_GROUP_PATH_URI = '/api/admin/vpnUsers/groupPathList';
const USER_AVAIL_IP_URI = '/api/admin/vpnUsers/availableIPList';
const USER_TYPES_URI = '/api/admin/vpnUserTypes';

(function ($) {
    'use strict'

    var dataTable;

    function loadInitData() {
        dataTable = $('#tableUsers').DataTable({
            ajax: USERS_URI,
            responsive: true,
            columns: [
                { data: 'group_path' },
                { data: 'type_name' },
                { data: 'username' },
                { data: 'realname' },
                { data: 'ip' },
                { data: 'mobile' },
                {
                    data: 'enabled',
                    render: function (data, type, row) {
                        if (1 == data) {
                            return '<i class="far fa-check-circle text-success"></i>';
                        } else {
                            return '<i class="fas fa-times-circle text-danger"></i>';
                        }
                    }
                },
                {
                    data: 'username',
                    render: function (data, type, row) {
                        return `<a href="#" class="edit-button"><i class="far fa-edit"></i></a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#" class="del-button"><i class="far fa-trash-alt"></i></a>`;
                    }
                }
            ]
        });

        dataTable.on('draw', () => {
            $(".edit-button").on('click', (event) => {
                edit(dataTable.row($(event.target).closest('tr')).data());
            });

            $(".del-button").on('click', (event) => {
                delComfirm(dataTable.row($(event.target).closest('tr')).data());
            });

        });
        loadUserTypeData();
        loadGroupPathData();
        loadAvailableIPData();
    }

    function loadUserTypeData() {
        $.getJSON(USER_TYPES_URI)
            .done(data => {
                let selectVpnUserTypeData = data.data.map(v => {
                    return {
                        id: v.type,
                        text: v.name
                    };
                });
                $("#selectType").empty();
                $("#selectType").select2({
                    data: selectVpnUserTypeData
                });
                $("#selectType").trigger('change');
            }).fail((jqXHR, textStatus, err) => {
                console.error(err);
            });
    }

    function loadGroupPathData() {
        $.getJSON(USER_GROUP_PATH_URI)
            .done(data => {
                let groupPathData = data.data.map(v => {
                    return {
                        id: v.group_path,
                        text: v.group_path
                    };
                });
                $("#selectGroupPath").empty();
                $("#selectGroupPath").select2({
                    data: groupPathData,
                    tags: true
                });
                $("#selectGroupPath").trigger('change');
            }).fail((jqXHR, textStatus, err) => {
                console.error(err);
            });
    }

    function loadAvailableIPData() {
        $.getJSON(USER_AVAIL_IP_URI)
            .done(data => {
                let selectIPData = data.data.map(v => {
                    return {
                        id: v,
                        text: v
                    };
                });
                $("#selectIP").empty();
                $("#selectIP").select2({
                    data: selectIPData,
                    tags: true
                });
                $("#selectIP").trigger('change');
            }).fail((jqXHR, textStatus, err) => {
                console.error(err);
            });
    }


    $.validator.addMethod('IP4Checker', function (value) {
        var ip = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;

        return '' === value || value.match(ip);
    }, 'Invalid IP address');

    $('#btnNewUser').on('click', () => {
        $("#divError").hide();
        $('#divEditor').modal('show');
        $('#editorTitle').text('创建用户');
        $('#formEditor')[0].reset();
        $('.select2').trigger('change');
        $('.edit-readonly').attr('readonly', false);
        $('#btnSave').data('save_type', 'new');
    });

    $('#btnDelete').on('click', (event) => {
        $.ajax({
            type: 'delete',
            url: `${USERS_URI}/${$(event.target).data('username')}`
        }).done(result => {
            if (result.result) {
                $('#divDelete').modal('hide');
                dataTable.ajax.reload();
                loadGroupPathData();
                loadAvailableIPData();
            } else {
                $('#pDelError').text(result.msg);
            }
        }).fail((jqXHR, textStatus, err) => {
            console.error(err);
            $('#pDelError').text('删除数据失败');
        });
    });

    function edit(data) {
        $("#divError").hide();
        $('#divEditor').modal('show');
        $('#editorTitle').text('编辑用户');
        $('#formEditor')[0].reset();
        let ipOption = new Option(data.ip, data.ip, false, true);
        $('#selectIP').append(ipOption);
        $('.select2').trigger('change');
        $('.edit-readonly').attr('readonly', true);
        $('#formEditor').jsonToForm(data);
        $('#btnSave').data('save_type', 'edit');
    }

    function delComfirm(data) {
        $('#divDelete').modal('show');
        $('#spanDel').text(`${data.username}(类型：${data.type_name})`);
        $('#btnDelete').data('username', data.username);
    }

    function create(data) {
        $.post(USERS_URI, data).done(editDone).fail(editFail);
    }

    function update(data) {
        $.ajax({
            type: 'put',
            url: `${USERS_URI}/${data.username}`,
            data: data
        }).done(editDone).fail(editFail);
    }

    function editDone(result) {
        if (result.result) {
            $('#divEditor').modal('hide');
            dataTable.ajax.reload();
            loadGroupPathData();
            loadAvailableIPData();
        } else {
            showErrMsg(result.msg);
        }
    }

    function editFail(jqXHR, textStatus, err) {
        console.error(err);
        showErrMsg('提交数据失败');
    }

    function showErrMsg(msg) {
        $("#spanError").text(msg);
        $("#divError").show();
    }

    $('#formEditor').validate({
        submitHandler: function () {
            let formData = new FormData($('#formEditor')[0]);
            let data = Object.fromEntries(formData.entries());
            data.enabled = ("on" === data.enabled ? 1 : 0);

            if ($('#btnSave').data('save_type') === 'new') {
                create(data);
            } else {
                update(data);
            }
            return false;
        },
        rules: {
            username: {
                required: true,
            },
            realname: {
                required: true,
            },
            mobile: {
                required: true
            }
        },
        messages: {
            username: {
                required: "Please enter a username",
            },
            realname: {
                IP4Checker: "Please enter the real name"
            },
            mobile: {
                IP4Checker: "Please enter the mobile number"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });



    loadInitData();

})(jQuery)