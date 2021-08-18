'use strict'

const CAPTCHA = '/api/public/captcha';
const SEND_VERIFY_CODE = '/api/public/vpnUsers/sendResetPwdVerifyCode';
const RESET_PWD = '/api/public/vpnUsers/resetPassword';

(function ($) {
    function loadCaptcha() {
        let captchaUrl = CAPTCHA + '?' + Math.random();
        $("#imgCaptcha").attr('src', captchaUrl);
    }

    function showErrMsg(msg, error) {
        if(error) {
            $('#divError').removeClass('alert-success');
            $('#divError').addClass('alert-warning');
        } else {
            $('#divError').removeClass('alert-warning');
            $('#divError').addClass('alert-success');
        }
        $("#spanError").text(msg);
        $("#divError").show();
    }

    let verifySent = false;

    $('#formLogin').validate({
        submitHandler: function () {
            let formData = new FormData($('#formLogin')[0]);
            let data = Object.fromEntries(formData.entries());

            if(!verifySent) {
                $.get(SEND_VERIFY_CODE, data).done(result => {
                    if(result.result) {
                        verifySent = true;
                        $('#divVerifyCode').show();
                        $('input[name=captcha]').attr('readonly', true);
                        $('#btnSubmit').text('重置密码');
                        showErrMsg('验证码已发送，请使用绑定手机接收');
                    } else {
                        showErrMsg(result.msg, true);
                        $("#imgCaptcha").trigger('click');
                    }
                }).fail((jqXHR, textStatus, err) => {
                    console.log(err);
                    showErrMsg('验证码发送请求失败', true);
                });
            } else {
                $.get(RESET_PWD, data).done(result => {
                    if(result.result) {
                        showErrMsg(`您的密码已重置为${result.msg}，请尽快登录并使用任务栏中的VPN图标修改密码`);
                        $('#btnSubmit').attr('disabled', true);
                    } else {
                        showErrMsg(result.msg, true);
                    }
                }).fail((jqXHR, textStatus, err) => {
                    console.log(err);
                    showErrMsg('重置密码请求失败', true);
                });
            }

            
        },
        rules: {
            username: {
                required: true
            },
            captcha: {
                required: true,
                rangelength: [4, 4]
            },
        },
        messages: {
            username: {
                required: "请输入用户名，通常与OA名相同",
            },
            captcha: {
                required: "请输入验证码",
                rangelength: "验证码长度为4"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.input-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });

    $("#imgCaptcha").on('click', loadCaptcha);
    $("#imgCaptcha").trigger('click');
})(jQuery)