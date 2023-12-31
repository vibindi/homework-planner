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
  loadTodo();
  loadClassTimings();
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

function loadTodo() {
  chrome.storage.local.get("info", function(obj) {
    for (let key of Object.keys(obj['info']['semesters'][curr_semester])) {
      let the_class = obj['info']['semesters'][curr_semester][key];
      var new_class = document.createElement("div");
      new_class.setAttribute("class", "schedule-day");
      let homeworks = "";
      for (let homework of obj['info']['semesters'][curr_semester][key]['homework']) {
        var date = homework['date'];
        date = MONTHS[parseInt(date.substring(5,7)) - 1] + " " + date.substring(8) + ", " + date.substring(0,4);
        homeworks += "<li>" + homework['name'] + " due " + date + " @ " + convertOneTime(homework['time']) + "</li>"
      }
      for (let homework of obj['info']['semesters'][curr_semester][key]['projects']) {
        var date = homework['date'];
        date = MONTHS[parseInt(date.substring(5,7)) - 1] + " " + date.substring(8) + ", " + date.substring(0,4);
        homeworks += "<li>" + homework['name'] + " due " + date + " @ " + convertOneTime(homework['time']) + "</li>"
      }
      new_class.innerHTML = "<span style='background-color: " + the_class.color + ";' class='dot'></span><h2>" + key + "</h2><ul>" + homeworks + "</ul>";
      $("#todo-list").append(new_class);
    }
  })
}

function loadClassTimings() {
  chrome.storage.local.get("info", function(obj) {
    let monday = []
    let tuesday = []
    let wednesday = []
    let thursday = []
    let friday = []
    let saturday = []
    let sunday = []
    for (let key of Object.keys(obj['info']['semesters'][curr_semester])) {
      for (let time of obj['info']['semesters'][curr_semester][key]['class-times']) {
        time['color'] = obj['info']['semesters'][curr_semester][key]['color'];
        time['class'] = key;
        //console.log(time);
        if (time.days.includes('Monday')) {
          monday.push(time);
        }
        if (time.days.includes('Tuesday')) {
          tuesday.push(time);
        }
        if (time.days.includes('Wednesday')) {
          wednesday.push(time);
        }
        if (time.days.includes('Thursday')) {
          thursday.push(time);
        }
        if (time.days.includes('Friday')) {
          friday.push(time);
        }
        if (time.days.includes('Saturday')) {
          saturday.push(time);
        }
        if (time.days.includes('Sunday')) {
          sunday.push(time);
        }
      }

    }

    monday.sort(compareByTime);
    tuesday.sort(compareByTime);
    wednesday.sort(compareByTime);
    thursday.sort(compareByTime);
    friday.sort(compareByTime);
    saturday.sort(compareByTime);
    sunday.sort(compareByTime);

    for (let time of monday) {
      var new_time = document.createElement("div");
      new_time.setAttribute("class", "class-timing");
      new_time.innerHTML = "<span style='background-color: " + time.color + ";' class='dot'></span><h2>" + time['name'] + "</h2><h3>" + time['class'] +"</h3><h3>" + convertTime(time['start'], time['end']) + "</h3>"
      $("#weekly-monday").append(new_time);
    }
    for (let time of tuesday) {
      var new_time = document.createElement("div");
      new_time.setAttribute("class", "class-timing");
      new_time.innerHTML = "<span style='background-color: " + time.color + ";' class='dot'></span><h2>" + time['name'] + "</h2><h3>" + time['class'] +"</h3><h3>" + convertTime(time['start'], time['end']) + "</h3>"
      $("#weekly-tuesday").append(new_time);
    }
    for (let time of wednesday) {
      var new_time = document.createElement("div");
      new_time.setAttribute("class", "class-timing");
      new_time.innerHTML = "<span style='background-color: " + time.color + ";' class='dot'></span><h2>" + time['name'] + "</h2><h3>" + time['class'] +"</h3><h3>" + convertTime(time['start'], time['end']) + "</h3>"
      $("#weekly-wednesday").append(new_time);
    }
    for (let time of thursday) {
      var new_time = document.createElement("div");
      new_time.setAttribute("class", "class-timing");
      new_time.innerHTML = "<span style='background-color: " + time.color + ";' class='dot'></span><h2>" + time['name'] + "</h2><h3>" + time['class'] +"</h3><h3>" + convertTime(time['start'], time['end']) + "</h3>"
      $("#weekly-thursday").append(new_time);
    }
    for (let time of friday) {
      var new_time = document.createElement("div");
      new_time.setAttribute("class", "class-timing");
      new_time.innerHTML = "<span style='background-color: " + time.color + ";' class='dot'></span><h2>" + time['name'] + "</h2><h3>" + time['class'] +"</h3><h3>" + convertTime(time['start'], time['end']) + "</h3>"
      $("#weekly-friday").append(new_time);
    }
    for (let time of saturday) {
      var new_time = document.createElement("div");
      new_time.setAttribute("class", "class-timing");
      new_time.innerHTML = "<span style='background-color: " + time.color + ";' class='dot'></span><h2>" + time['name'] + "</h2><h3>" + time['class'] +"</h3><h3>" + convertTime(time['start'], time['end']) + "</h3>"
      $("#weekly-saturday").append(new_time);
    }
    for (let time of sunday) {
      var new_time = document.createElement("div");
      new_time.setAttribute("class", "class-timing");
      new_time.innerHTML = "<span style='background-color: " + time.color + ";' class='dot'></span><h2>" + time['name'] + "</h2><h3>" + time['class'] +"</h3><h3>" + convertTime(time['start'], time['end']) + "</h3>"
      $("#weekly-sunday").append(new_time);
    }
  })
}

function compareByTime(a, b) {
  if (a.start < b.start) {
    return -1;
  }
  if (a.start > b.start) {
    return 1;
  }
  return 0;
}

function convertOneTime (time) {
  var start_hour = parseInt(time.substring(0,2));
  var start_minute = time.substring(3);
  if (start_hour >= 12) {
    // PM
    if (start_hour == 12) {
      time = start_hour + ":" + start_minute + " PM";
    } else {
      time = (start_hour % 12) + ":" + start_minute + " PM";
    }
  } else {
    // AM
    if (start_hour == 0) {
      time = "12" + ":" + start_minute + " AM";
    } else {
      time = start_hour + ":" + start_minute + " AM";
    }
  }
  return time;
}

function convertTime(start_time, end_time) {
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

  return start_time + " - " + end_time;
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
          + "<button class='delete-class-time-button' type='button' value='"+ i + "'>Delete Class Time</button>"
          + "</div>";
      }
      class_times += "</div>";
      $("#class-times-div").html(class_times);
      $(".delete-class-time-button").on("click", function() {
        let to_remove = this.value;
        chrome.storage.local.get("info", function(obj) {
          let curr_info = obj['info']
          let curr_class_times =  curr_info['semesters'][curr_semester][class_name]['class-times'];
          curr_info['semesters'][curr_semester][class_name]['class-times'] = curr_class_times.slice(0, to_remove).concat(curr_class_times.slice(to_remove + 1));
          chrome.storage.local.set({ info: curr_info}, function() {});
          window.location.reload();
        });
      });

      var homework = "<div>";
      for (let i = 0; i < obj['info']['semesters'][curr_semester][class_name]['homework'].length; i++) {
        var time = obj['info']['semesters'][curr_semester][class_name]['homework'][i]['time'];
        var time_hour = parseInt(time.substring(0,2));
        var time_minute = time.substring(3);
        if (time_hour >= 12) {
          // PM
          if (time_hour == 12) {
            time = time_hour + ":" + time_minute + " PM";
          } else {
            time = (time_hour % 12) + ":" + time_minute + " PM";
          }
        } else {
          // AM
          if (time_hour == 0) {
            time = "12" + ":" + time_minute + " AM";
          } else {
            time = time_hour + ":" + time_minute + " AM";
          }
        }

        var date = obj['info']['semesters'][curr_semester][class_name]['homework'][i]['date'];
        date = MONTHS[parseInt(date.substring(5,7)) - 1] + " " + date.substring(8) + ", " + date.substring(0,4);

        homework += "<div class='class-time-info-div'>" + 
          "<h3>" + obj['info']['semesters'][curr_semester][class_name]['homework'][i]['name'] + "</h3>" 
          + "<p>" + date + " @ " + time + "</p>"
          + "<button class='delete-homework-button' type='button' value='"+ i + "'>Delete Homework</button>"
          + "</div>";
      }
      homework += "</div>";
      $("#homework-div").html(homework);
      $(".delete-homework-button").on("click", function() {
        let to_remove = this.value;
        chrome.storage.local.get("info", function(obj) {
          let curr_info = obj['info']
          let curr_homework =  curr_info['semesters'][curr_semester][class_name]['homework'];
          curr_info['semesters'][curr_semester][class_name]['homework'] = curr_homework.slice(0, to_remove).concat(curr_homework.slice(to_remove + 1));
          chrome.storage.local.set({ info: curr_info}, function() {});
          window.location.reload();
        });
      });
      
      var projects = "<div>";
      for (let i = 0; i < obj['info']['semesters'][curr_semester][class_name]['projects'].length; i++) {
        var time = obj['info']['semesters'][curr_semester][class_name]['projects'][i]['time'];
        var time_hour = parseInt(time.substring(0,2));
        var time_minute = time.substring(3);
        if (time_hour >= 12) {
          // PM
          if (time_hour == 12) {
            time = time_hour + ":" + time_minute + " PM";
          } else {
            time = (time_hour % 12) + ":" + time_minute + " PM";
          }
        } else {
          // AM
          if (time_hour == 0) {
            time = "12" + ":" + time_minute + " AM";
          } else {
            time = time_hour + ":" + time_minute + " AM";
          }
        }

        var date = obj['info']['semesters'][curr_semester][class_name]['projects'][i]['date'];
        date = MONTHS[parseInt(date.substring(5,7)) - 1] + " " + date.substring(8) + ", " + date.substring(0,4);

        projects += "<div class='class-time-info-div'>" + 
          "<h3>" + obj['info']['semesters'][curr_semester][class_name]['projects'][i]['name'] + "</h3>" 
          + "<p>" + date + " @ " + time + "</p>"
          + "<button class='delete-project-button' type='button' value='"+ i + "'>Delete Project</button>"
          + "</div>";
      }
      projects += "</div>";
      $("#projects-div").html(projects);
      $(".delete-project-button").on("click", function() {
        let to_remove = this.value;
        chrome.storage.local.get("info", function(obj) {
          let curr_info = obj['info']
          let curr_projects =  curr_info['semesters'][curr_semester][class_name]['projects'];
          curr_info['semesters'][curr_semester][class_name]['projects'] = curr_projects.slice(0, to_remove).concat(curr_projects.slice(to_remove + 1));
          chrome.storage.local.set({ info: curr_info}, function() {});
          window.location.reload();
        });
      });
      
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
        date = MONTHS[parseInt(date.substring(5,7)) - 1] + " " + date.substring(8) + ", " + date.substring(0,4);

        exams += "<div class='class-time-info-div'>" + 
          "<h3>" + obj['info']['semesters'][curr_semester][class_name]['exams'][i]['name'] + "</h3>" 
          + "<p>" + date + "</p>"
          + "<p>" + start_time + " - " + end_time + "</p>"
          + "<button class='delete-exam-button' type='button' value='"+ i + "'>Delete Exam</button>"
          + "</div>";
      }
      exams += "</div>";
      $("#exams-div").html(exams);
      // when you want to delete an exam
      $(".delete-exam-button").on("click", function() {
        let to_remove = this.value;
        chrome.storage.local.get("info", function(obj) {
          let curr_info = obj['info']
          let curr_exams =  curr_info['semesters'][curr_semester][class_name]['exams'];
          curr_info['semesters'][curr_semester][class_name]['exams'] = curr_exams.slice(0, to_remove).concat(curr_exams.slice(to_remove + 1));
          chrome.storage.local.set({ info: curr_info}, function() {});
          window.location.reload();
        });
      });
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
    //console.log(obj['info']['semesters'][curr_semester][class_name])
  });
}