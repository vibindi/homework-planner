document.body.onload = function() {
  // load uname
  chrome.storage.sync.get('uname', function (obj) {
    //console.log(obj)
    if (obj.uname == null) {
      chrome.storage.sync.set({'uname': 'New User'}, function() {
      });
      $("#uname-text").html('New User');
    } else {
      $("#uname-text").html(obj.uname)
    }
  });

  // load settings
  chrome.storage.sync.get('settings', function(obj) {
    console.log(obj)
    if (obj.settings == null) {
      chrome.storage.sync.set({'settings': {'semester': 'No Semester Selected'}}, function() {
      });
    }
    $("#curr-semester").html('Semester: ' + obj['settings']['semester'])
  })

  // load class info
  chrome.storage.sync.get('info', function(obj) {
    console.log(obj)
    if (obj.info == null) {
      chrome.storage.sync.set({'info': {'semesters': {}}}, function() {
      });
    }
    for (let i = 0; i < Object.keys(obj['info']['semesters']).length; i++) {
      semester_name = Object.keys(obj['info']['semesters'])[i] 
      var new_semester = document.createElement("button");
      new_semester.type = 'button'
      new_semester.id = semester_name.replace(/\s+/g, '-').toLowerCase()
      new_semester.setAttribute('class', 'choose-semester-button')
      new_semester.setAttribute('value', semester_name)
      new_semester.innerHTML = semester_name
      new_semester.onclick = function() {
        var val = this.value
        chrome.storage.sync.get('settings', function(obj) {
          var curr_settings = obj['settings']
          curr_settings['semester'] = val
          chrome.storage.sync.set({'settings': curr_settings}, function() {
          });
        })
        window.location.reload();
      }
      $("#semester-name-input").before(new_semester);
    }
    $("#semester-name-input").before(document.createElement('br'));
    $("#semester-name-input").before(document.createElement('br'));
  });
}

$("#add-semester").submit(function() {
  var semester_name = $("#semester-name-input").val()
  if (semester_name === '') return;
  chrome.storage.sync.get('info', function(obj) {
    var curr_info = obj.info;
    curr_info['semesters'][semester_name] = {}
    chrome.storage.sync.set({'info': curr_info}, function() {
    });
  });
});

$("#uname-text").focusout(function() {
  var uname = $("#uname-text").html();
  if (uname === '') {
    uname = ' ';
    $("#uname-text").html(uname);
  }
  if (uname.length > 50) {
    uname = uname.slice(0, 49);
    $("#uname-text").html(uname);
  }
  chrome.storage.sync.set({'uname': uname}, function() {
  });
});

$("#change-semester").on('click', function() {
  $("#semester-select").css('display', 'block')
})

$(".close-modal").on('click', function() {
  $("#semester-select").css('display', 'none')
})