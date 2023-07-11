document.body.onload = function() {
  chrome.storage.sync.get('uname', function (obj) {
    console.log(obj)
    if (obj.uname == null) {
      chrome.storage.sync.set({'uname': 'New User'}, function() {
      });
      $("#uname-text").html('New User');
    } else {
      $("#uname-text").html(obj.uname)
    }
  })
}

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
})