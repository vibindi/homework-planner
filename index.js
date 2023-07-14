/* GLOBAL VARIABLES */
curr_semester = "";

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
  $("#add-class-time-button").on("click", function() {
    $("#class-time-create").css("display", "block");
  })
  $("#add-homework-button").on("click", function() {
    $("#homework-create").css("display", "block");
  })
  $("#add-projects-button").on("click", function() {
    $("#projects-create").css("display", "block");
  })
  $("#add-exams-button").on("click", function() {
    $("#exams-create").css("display", "block");
  })

  // when you click the settings button on main page, show the modal for settings
  $("#settings-button").on("click", function () {
    $("#settings-modal").css("display", "block");
  });

  // when you click the close modal button, go back to home page
  $("#class-time-create .close-modal").on("click", function() {
    $("#class-time-create").css("display", "none");
  });
  $("#homework-create .close-modal").on("click", function() {
    $("#homework-create").css("display", "none");
  });
  $("#projects-create .close-modal").on("click", function() {
    $("#projects-create").css("display", "none");
  });
  $("#exams-create .close-modal").on("click", function() {
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
  $("#add-class-time").submit(function() {
    var cname = $("#class-time-name-input").val();
    var cdate = $("#class-time-date-input").val();
    var cstart = $("#class-time-start-input").val();
    var cend = $("#class-time-end-input").val();
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
    // show class modal
    $("#class-info-name").html(val);
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
  });
}
