$.fn.jsonToForm = function (data, callbacks) {
    var formInstance = this;
  
    var options = {
      data: data || null,
      callbacks: callbacks,
    };
  
    if (options.data != null) {
      $.each(options.data, function (k, v) {
        var elements = $('[name^="' + k + '"]', formInstance);
  
        if (options.callbacks != null && options.callbacks.hasOwnProperty(k)) {
          options.callbacks[k](v);
          return;
        }
  
        $(elements).each(function (index, element) {
          // if (Array.isArray(v)) {
          //   v.forEach(function (val) {
          //     $(element).is("select")
          //       ? $(element)
          //           .find("[value='" + val + "']")
          //           .prop("selected", true)
          //       : $(element).val() == val
          //       ? $(element).prop("checked", true)
          //       : "";
          //   });
          // } else 
          if ($(element).is(":radio")) {
            // checkbox group or radio group
            $(element).val() == v ? $(element).prop("checked", true) : "";
          } else if($(element).is(":checkbox")) {
            if(v) {
              $(element).prop("checked", true);
            } else {
              $(element).prop("checked", false);
            }
          } else {
            $('[name="' + k + '"]', formInstance).val(v);
            $('[name="' + k + '"]', formInstance).trigger('change');
          }
        });
      });
    }
  };