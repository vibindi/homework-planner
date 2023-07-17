/* GLOBAL VARIABLES */
curr_semester = "";
curr_class = "";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/* ON BODY LOAD */
document.body.onload = function () {
  loadData();
  setListeners();
};

/* ON BODY LOAD DATA LOADING */
function loadData() {
  loadUname();
  loadSettings();
  loadSemesters();
  loadClasses();
}

function loadUname() {
  // load uname
  chrome.storage.local.get("uname", function (obj) {
    if (obj.uname == null) {
      chrome.storage.local.set({ uname: "New User" }, function () {});
      $("#uname-text").html("New User");
    } else {
      $("#uname-text").html("Hello, " + obj.uname + "!");
    }
  });
}

function loadSettings() {
  // load settings
  chrome.storage.local.get("settings", function (obj) {
    if (obj.settings == null) {
      chrome.storage.local.set(
        { settings: { semester: "General Semester" } },
        function () {}
      );
    }
    $("#curr-semester").html(obj["settings"]["semester"]);
    curr_semester = obj["settings"]["semester"];
  });
}

function loadSemesters() {
  // load semesters
  chrome.storage.local.get("info", function (obj) {
    if (obj.info == null) {
      chrome.storage.local.set(
        { info: { semesters: { "General Semester": {} } } },
        function () {
          window.location.reload();
        }
      );
    }
    for (let i = 0; i < Object.keys(obj["info"]["semesters"]).length; i++) {
      createSemesterSelectionButtons(Object.keys(obj["info"]["semesters"])[i]);
    }
  });
}

function loadClasses() {
  chrome.storage.local.get("info", function (obj) {
    for (
      let i = 0;
      i < Object.keys(obj["info"]["semesters"][curr_semester]).length;
      i++
    ) {
      createClassNameButtons(
        Object.keys(obj["info"]["semesters"][curr_semester])[i]
      );
    }
  });
}

/* ON BODY LOAD LISTENERS */
function setListeners() {
  setOnClickListeners();
  setOnSubmitListeners();
}

function setOnClickListeners() {
  // when you click the change semester button in settings, show the modal to choose semester
  $("#change-semester-button").on("click", function () {
    $("#semester-select").css("display", "block");
  });

  // when you click the add class button on main page, show the modal to add class
  $("#add-class-button").on("click", function () {
    $("#class-create").css("display", "block");
  });

  // when you click the add class time button, add a new class time
  $("#add-class-time-button").on("click", function () {
    $("#class-time-create").css("display", "block");
  });
  $("#add-homework-button").on("click", function () {
    $("#homework-create").css("display", "block");
  });
  $("#add-projects-button").on("click", function () {
    $("#projects-create").css("display", "block");
  });
  $("#add-exams-button").on("click", function () {
    $("#exams-create").css("display", "block");
  });

  // when you click the settings button on main page, show the modal for settings
  $("#settings-button").on("click", function () {
    $("#settings-modal").css("display", "block");
  });

  // when you click the close modal button, go back to home page
  $("#class-time-create .close-modal").on("click", function () {
    $("#class-time-create").css("display", "none");
  });
  $("#homework-create .close-modal").on("click", function () {
    $("#homework-create").css("display", "none");
  });
  $("#projects-create .close-modal").on("click", function () {
    $("#projects-create").css("display", "none");
  });
  $("#exams-create .close-modal").on("click", function () {
    $("#exams-create").css("display", "none");
  });

  $("#semester-select .close-modal").on("click", function () {
    $("#semester-select").css("display", "none");
  });
  $("#class-create .close-modal").on("click", function () {
    $("#class-create").css("display", "none");
  });
  $("#class-info-modal .close-modal").on("click", function () {
    $("#class-info-modal").css("display", "none");
  });
  $("#settings-modal .close-modal").on("click", function () {
    $("#settings-modal").css("display", "none");
  });

  // when you click the reset data button, reset data
  $("#clear-data-test").on("click", function () {
    chrome.storage.local.clear(function () {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
      // do something more
      window.location.reload();
    });
  });
}

function setOnSubmitListeners() {
  // when you try to add a new semester, parse the text and add the semester to storage
  $("#add-semester").submit(function () {
    var semester_name = $("#semester-name-input").val();
    if (semester_name === "") return;
    chrome.storage.local.get("info", function (obj) {
      var curr_info = obj.info;
      curr_info["semesters"][semester_name] = {};
      chrome.storage.local.set({ info: curr_info }, function () {});
    });
  });

  // when you try to add a new class, parse the text and add the class to storage
  $("#add-class").submit(function () {
    var class_name = $("#class-name-input").val();
    var class_color = $("#class-color-input").val();
    if (class_name === "") return;
    chrome.storage.local.get("info", function (obj) {
      var curr_info = obj.info;
      curr_info["semesters"][curr_semester][class_name] = {
        color: class_color,
        "class-times": [],
        homework: [],
        projects: [],
        exams: [],
      };
      chrome.storage.local.set({ info: curr_info }, function () {});
    });
  });

  // when you try to change your name
  $("#change-name").submit(function () {
    var uname = $("#change-name-input").val();
    chrome.storage.local.set({ uname: uname }, function () {});
  });

  // when you want to add a class time
  $("#add-class-time").submit(function (event) {
    var cname = $("#class-time-name-input").val();
    var cdays = $("#class-time-days-input").val();
    var cstart = $("#class-time-start-input").val();
    var cend = $("#class-time-end-input").val();

    var start_date = new Date();
    start_date.setHours(parseInt(cstart.substring(0, 2)));
    start_date.setMinutes(parseInt(cstart.substring(3)));
    var end_date = new Date();
    end_date.setHours(parseInt(cend.substring(0, 2)));
    end_date.setMinutes(parseInt(cend.substring(3)));

    if (start_date < end_date) {
      chrome.storage.local.get("info", function (obj) {
        var curr_info = obj.info;
        curr_info["semesters"][curr_semester][curr_class]['class-times'].push({
          'name' : cname,
          'days' : cdays,
          'start' : cstart,
          'end' : cend
        });
        chrome.storage.local.set({ info: curr_info}, function() {});
      });
    }
    else {
      alert("Please enter an end time that is after the start time.");
      event.preventDefault();
    }
  })

  // when you want to add a homework
  $("#add-homework").submit(function () {
    var cname = $("#homework-name-input").val();
    var cdate = $("#homework-date-input").val();
    var ctime = $("#homework-time-input").val();

    chrome.storage.local.get("info", function (obj) {
      var curr_info = obj.info;
      curr_info["semesters"][curr_semester][curr_class]['homework'].push({
        'name' : cname,
        'date' : cdate,
        'time' : ctime
      });
      chrome.storage.local.set({ info: curr_info}, function() {});
    });
  });

  // when you want to add a project
  $("#add-project").submit(function () {
    var cname = $("#project-name-input").val();
    var cdate = $("#project-date-input").val();
    var ctime = $("#project-time-input").val();

    chrome.storage.local.get("info", function (obj) {
      var curr_info = obj.info;
      curr_info["semesters"][curr_semester][curr_class]['projects'].push({
        'name' : cname,
        'date' : cdate,
        'time' : ctime
      });
      chrome.storage.local.set({ info: curr_info}, function() {});
    });
  });

  // when you want to add an exam
  $("#add-exam").submit(function (event) {
    var cname = $("#exam-name-input").val();
    var cdate = $("#exam-date-input").val();
    var cstart = $("#exam-start-input").val();
    var cend = $("#exam-end-input").val();

    var start_date = new Date();
    start_date.setHours(parseInt(cstart.substring(0, 2)));
    start_date.setMinutes(parseInt(cstart.substring(3)));
    var end_date = new Date();
    end_date.setHours(parseInt(cend.substring(0, 2)));
    end_date.setMinutes(parseInt(cend.substring(3)));

    if (start_date < end_date) {
      chrome.storage.local.get("info", function (obj) {
        var curr_info = obj.info;
        curr_info["semesters"][curr_semester][curr_class]['exams'].push({
          'name' : cname,
          'date' : cdate,
          'start' : cstart,
          'end' : cend
        });
        chrome.storage.local.set({ info: curr_info}, function() {});
      });
    }
    else {
      alert("Please enter an end time that is after the start time.");
      event.preventDefault();
    }
  });
}

/* ELEMENT CREATION HELPERS */
function createSemesterSelectionButtons(semester_name) {
  var new_semester = document.createElement("button");
  new_semester.type = "button";
  new_semester.id = semester_name.replace(/\s+/g, "-").toLowerCase();
  new_semester.setAttribute("class", "choose-semester-button");
  new_semester.setAttribute("value", semester_name);
  new_semester.innerHTML = semester_name;
  new_semester.onclick = function () {
    var val = this.value;
    chrome.storage.local.get("settings", function (obj) {
      var curr_settings = obj["settings"];
      curr_settings["semester"] = val;
      chrome.storage.local.set({ settings: curr_settings }, function () {});
    });
    window.location.reload();
  };
  $("#semester-name-input").before(new_semester);
}

function createClassNameButtons(class_name) {
  var new_class = document.createElement("button");
  new_class.type = "button";
  new_class.id = class_name.replace(/\s+/g, "-").toLowerCase();
  new_class.setAttribute("class", "choose-class-button");
  new_class.setAttribute("value", class_name);
  new_class.innerHTML = class_name;
  new_class.onclick = function () {
    var val = this.value;
    curr_class = val;
    // show class modal
    $("#class-info-name").html(val);
    chrome.storage.local.get("info", function (obj) {
      var class_times = "<div>";
      for (let i = 0; i < obj['info']['semesters'][curr_semester][class_name]['class-times'].length; i++) {
        var start_time = obj['info']['semesters'][curr_semester][class_name]['class-times'][i]['start'];
        var start_hour = parseInt(start_time.substring(0,2));
        var start_minute = start_time.substring(3);
        if (start_hour >= 12) {
          // PM
          if (start_hour == 12) {
            start_time = start_hour + ":" + start_minute + " PM";
          } else {
            start_time = (start_hour % 12) + ":" + start_minute + " PM";
          }
        } else {
          // AM
          if (start_hour == 0) {
            start_time = "12" + ":" + start_minute + " AM";
          } else {
            start_time = start_hour + ":" + start_minute + " AM";
          }
        }

        var end_time = obj['info']['semesters'][curr_semester][class_name]['class-times'][i]['end'];
        var end_hour = parseInt(end_time.substring(0,2));
        var end_minute = end_time.substring(3);
        if (end_hour >= 12) {
          // PM
          if (end_hour == 12) {
            end_time = end_hour + ":" + end_minute + " PM";
          } else {
            end_time = (end_hour % 12) + ":" + end_minute + " PM";
          }
        } else {
          // AM
          if (end_hour == 0) {
            end_time = "12" + ":" + end_minute + " AM";
          } else {
            end_time = end_hour + ":" + end_minute + " AM";
          }
        }
        

        class_times += "<div class='class-time-info-div'>" + 
          "<h3>" + obj['info']['semesters'][curr_semester][class_name]['class-times'][i]['name'] + "</h3>" 
          + "<p>" + obj['info']['semesters'][curr_semester][class_name]['class-times'][i]['days'].join(", ") + "</p>"
          + "<p>" + start_time + " - " + end_time + "</p>"
          + "<button type='button'>Delete Class Time</button>"
          + "</div>";
      }
      class_times += "</div>";
      $("#class-times-div").html(class_times);

      var homework = "<div>";
      for (let i = 0; i < obj['info']['semesters'][curr_semester][class_name]['homework'].length; i++) {
        homework += "<div class='class-time-info-div'>" + 
          "<h3>" + obj['info']['semesters'][curr_semester][class_name]['homework'][i]['name'] + "</h3>" 
          + "<p>" + obj['info']['semesters'][curr_semester][class_name]['homework'][i]['date'] + "</p>"
          + "<p>" + obj['info']['semesters'][curr_semester][class_name]['homework'][i]['time'] + "</p>"
          + "<button type='button'>Delete Homework</button>"
          + "</div>";
      }
      homework += "</div>";
      $("#homework-div").html(homework);
      
      var projects = "<div>";
      for (let i = 0; i < obj['info']['semesters'][curr_semester][class_name]['projects'].length; i++) {
        projects += "<div class='class-time-info-div'>" + 
          "<h3>" + obj['info']['semesters'][curr_semester][class_name]['projects'][i]['name'] + "</h3>" 
          + "<p>" + obj['info']['semesters'][curr_semester][class_name]['projects'][i]['date'] + "</p>"
          + "<p>" + obj['info']['semesters'][curr_semester][class_name]['projects'][i]['time'] + "</p>"
          + "<button type='button'>Delete Project</button>"
          + "</div>";
      }
      projects += "</div>";
      $("#projects-div").html(projects);
      
      var exams = "<div>";
      for (let i = 0; i < obj['info']['semesters'][curr_semester][class_name]['exams'].length; i++) {
        var start_time = obj['info']['semesters'][curr_semester][class_name]['exams'][i]['start'];
        var start_hour = parseInt(start_time.substring(0,2));
        var start_minute = start_time.substring(3);
        if (start_hour >= 12) {
          // PM
          if (start_hour == 12) {
            start_time = start_hour + ":" + start_minute + " PM";
          } else {
            start_time = (start_hour % 12) + ":" + start_minute + " PM";
          }
        } else {
          // AM
          if (start_hour == 0) {
            start_time = "12" + ":" + start_minute + " AM";
          } else {
            start_time = start_hour + ":" + start_minute + " AM";
          }
        }

        var end_time = obj['info']['semesters'][curr_semester][class_name]['exams'][i]['end'];
        var end_hour = parseInt(end_time.substring(0,2));
        var end_minute = end_time.substring(3);
        if (end_hour >= 12) {
          // PM
          if (end_hour == 12) {
            end_time = end_hour + ":" + end_minute + " PM";
          } else {
            end_time = (end_hour % 12) + ":" + end_minute + " PM";
          }
        } else {
          // AM
          if (end_hour == 0) {
            end_time = "12" + ":" + end_minute + " AM";
          } else {
            end_time = end_hour + ":" + end_minute + " AM";
          }
        }

        var date = obj['info']['semesters'][curr_semester][class_name]['exams'][i]['date'];
        date = MONTHS[parseInt(date.substring(5,7)) - 1] + " " + date.substring(8) + " , " + date.substring(0,4);

        exams += "<div class='class-time-info-div'>" + 
          "<h3>" + obj['info']['semesters'][curr_semester][class_name]['exams'][i]['name'] + "</h3>" 
          + "<p>" + date + "</p>"
          + "<p>" + start_time + " - " + end_time + "</p>"
          + "<button type='button'>Delete Exam</button>"
          + "</div>";
      }
      exams += "</div>";
      $("#exams-div").html(exams);
    });
    // when you want to delete class
    $("#delete-class-button").on("click", function () {
      if (confirm("You are about to delete " + val)) {
        // load semesters
        chrome.storage.local.get("info", function (obj) {
          let curr_info = obj["info"];
          delete curr_info["semesters"][curr_semester][val];
          chrome.storage.local.set({ info: curr_info }, function () {});
          window.location.reload();
        });
        alert("Deleted " + val);
      }
    });
    $("#class-info-modal").css("display", "block");
  };
  $("#classes-buttons-div").append(new_class);
  chrome.storage.local.get("info", function (obj) {
    $("#" + new_class.id).css(
      "background-color",
      obj["info"]["semesters"][curr_semester][class_name]["color"]
    );
    console.log(obj['info']['semesters'][curr_semester][class_name])
  });
}