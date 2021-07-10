
const CAPTCHA = '/api/captcha';
const PUBLIC_KEY = '/api/adminUser/publicKey';
const LOGIN = '/api/adminUser/login';

(function ($) {
    'use strict'

    const encrypt = new JSEncrypt();

    function loadCaptcha() {
        let captchaUrl = CAPTCHA + '?' + Math.random();
        $("#imgCaptcha").attr('src', captchaUrl);
    }

    function showErrMsg(msg) {
        $("#spanError").text(msg);
        $("#divError").show();
    }

    $('#formLogin').validate({
        submitHandler: function () {
            let dataArray = $('#formLogin').serializeArray();
            let data = {};
            dataArray.forEach(element => {
                data[element.name] = element.value;
            });

            $.get(PUBLIC_KEY).done(pubKey => {
                encrypt.setPublicKey(pubKey);
                console.log(`Post data: ${JSON.stringify(data)}`);
                let encData = {
                    enc: encrypt.encrypt(JSON.stringify(data))
                };

                $.post(LOGIN, encData).done(loginRes => {
                    
                    if(!loginRes.result) {
                        showErrMsg(loginRes.msg);
                        loadCaptcha();
                    } else {
                        // 跳转
                        $("#divError").hide();
                        $(window).attr('location', 'resources.html');
                    }
                }).fail((jqXHR, textStatus, err) => {
                    // TODO 在页面上添加错误消息
                    console.log(err);
                    showErrMsg('登录信息提交失败');
                });
            }).fail((jqXHR, textStatus, err) => {
                // TODO 在页面上添加错误消息
                console.log(err);
                showErrMsg('秘钥信息获取失败');
            });
        },
        rules: {
            username: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                minlength: 5
            },
            captcha: {
                required: true,
                rangelength: [4, 4]
            },
        },
        messages: {
            username: {
                required: "Please enter a email address",
                email: "Please enter a vaild email address"
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            captcha: {
                required: "Please enter captcha",
                rangelength: "Captcha must be 4 characters long"
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