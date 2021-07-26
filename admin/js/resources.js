const MENU_ID = 'ZYGL_ZYLB';
const BRANCH_LIST = '/api/admin/branches';
const RESOURCES_URI = '/api/admin/resources';
const RESOURCE_TYPE_LIST = '/api/admin/resourceTypes';

(function ($) {
    'use strict'

    var dataTable;

    function loadInitData() {
        dataTable = $('#tableResources').DataTable({
            ajax: RESOURCES_URI,
            responsive: true,
            columns: [
                { data: 'branch_order', visible: false},
                { data: 'branch' },
                { data: 'type' },
                { data: 'tag' },
                { data: 'service_ip' },
                { data: 'service_domain' },
                { data: 'service_url' },
                { data: 'real_ip' },
                { data: 'description' },
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
                    data: 'resource_id',
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
        // 获取分支列表
        $.getJSON(BRANCH_LIST)
            .done(data => {
                let selectBranchData = data.data.map(v => {
                    return {
                        id: v.branch_id,
                        text: v.branch_id + "_" + v.name
                    };
                });
                $("#selectBranch").select2({
                    data: selectBranchData
                });
            }).fail((jqXHR, textStatus, err) => {
                console.error(err);
            });

        // 获取资源类型列表
        $.getJSON(RESOURCE_TYPE_LIST)
            .done(data => {
                let selectResTypeData = data.data.map(v => {
                    return {
                        id: v.type_id,
                        text: v.name
                    };
                });
                $("#selectType").select2({
                    data: selectResTypeData
                });
            }).fail((jqXHR, textStatus, err) => {
                console.error(err);
            });

    }


    $('#btnNewRes').on('click', () => {
        $("#divError").hide();
        $('#divEditor').modal('show');
        $("input[name='resource_id']").val(null);
        $('#editorTitle').text('创建资源');
        $('#formEditor')[0].reset();
        $('.select2').trigger('change');
    });

    $('#btnDelete').on('click', (event) => {
        $.ajax({
            type: 'delete',
            url: `${RESOURCES_URI}/${$(event.target).data('resource_id')}`
        }).done(result => {
            if (result.result) {
                $('#divDelete').modal('hide');
                dataTable.ajax.reload();
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
        $('#editorTitle').text('编辑资源');
        $('#formEditor')[0].reset();
        $('.select2').trigger('change');
        $('#formEditor').jsonToForm(data);
    }

    function delComfirm(data) {
        $('#divDelete').modal('show');
        $('#spanDel').text(`${data.branch}-${data.type}-${data.tag?'(' + data.tag + ')':''}`);
        $('#btnDelete').data('resource_id', data.resource_id);
    }

    function create(data) {
        $.post(RESOURCES_URI, data).done(result => {
            if (result.result) {
                $('#divEditor').modal('hide');
                dataTable.ajax.reload();
            } else {
                showErrMsg(result.msg);
            }
        }).fail((jqXHR, textStatus, err) => {
            console.error(err);
            showErrMsg('提交数据失败');
        });
    }

    function update(data) {
        $.ajax({
            type: 'put',
            url: `${RESOURCES_URI}/${data.resource_id}`,
            data: data
        }).done(result => {
            if (result.result) {
                $('#divEditor').modal('hide');
                dataTable.ajax.reload();
            } else {
                showErrMsg(result.msg);
            }
        }).fail((jqXHR, textStatus, err) => {
            console.error(err);
            showErrMsg('提交数据失败');
        });
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

            if (typeof data.resource_id == 'undefined' || !data.resource_id) {
                create(data);
            } else {
                update(data);
            }
        },
        rules: {
            service_ip: {
                required: true,
                IP4Checker: true
            },
            real_ip: {
                required: false,
                IP4Checker: true
            }
        },
        messages: {
            service_ip: {
                required: "Please enter a service IP",
                IP4Checker: "Please enter a vaild IP address"
            },
            real_ip: {
                IP4Checker: "Please enter a vaild IP address"
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