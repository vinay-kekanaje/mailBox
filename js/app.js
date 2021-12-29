$(document).ready(function () {
    // Handler for .ready() called
    var sampleCredentials = [{ email: "sample@gmail.com", password: "sample" }, { email: "sample1@gmail.com", password: "sample1" }, { email: "sample2@gmail.com", password: "sample2" }];

    if (localStorage.getItem("sampleCredentials") == null) localStorage.setItem("sampleCredentials", JSON.stringify(sampleCredentials));
    $("form#login-form").on("submit", function () {
        const credentailArr = JSON.parse(localStorage.getItem("sampleCredentials"));
        if ($("input#email").val() == "" || $("input#email").val() == " " || $("input#password").val() == "" || $("input#password").val() == " ") {
            $("p#error-msg").text("Email/Password cannot be blank..");
        } else {
            var valid = 0;
            $.each(credentailArr, function (key, value) {
                if ($("input#email").val() == value.email && $("input#password").val() == value.password) {
                    valid = 1;
                }
            });
            if (!valid) $("p#error-msg").text("Please enter valid credentails.."); else {
                localStorage.setItem("loginMail", $("input#email").val());
                return true;
            }
        }
        return false;
    });

    // set default data for inbox
    var sampleInboxData = [
        {
            from: "test1@gmail.com",
            to: "sample@gmail.com",
            payload: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            dateTime: "28 December",
            read: 1,
            default: 1,
        },
        {
            from: "test2@gmail.com",
            to: "sample@gmail.com",
            payload: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            dateTime: "28 December",
            read: 1,
            default: 1,
        },
        {
            from: "test3@gmail.com",
            to: "sample@gmail.com",
            payload: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
            dateTime: "29 December",
            read: 1,
            default: 1,
        },
        {
            from: "test4@gmail.com",
            to: "sample@gmail.com",
            payload: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
            dateTime: "29 December",
            read: 1,
            default: 1,
        },
        {
            from: "test5@gmail.com",
            to: "sample@gmail.com",
            payload: "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur.",
            dateTime: "30 December",
            read: 1,
            default: 1,
        }
    ];

    if (localStorage.getItem("inboxData") == null /* || JSON.parse(localStorage.getItem("inboxData")).length == 0 */) {
        localStorage.setItem("inboxData", JSON.stringify(sampleInboxData));
    }

    $(".brand-link").text(localStorage.getItem("loginMail").split("@")[0])

    var newInboxData = JSON.parse(localStorage.getItem("inboxData"));
    $.each(newInboxData, function (key, value) {
        var from = value["from"];
        if (value["default"] == 1 || value["to"] == localStorage.getItem("loginMail")) {
            $("#inbox-wrapper").append('<tr><td><div class="icheck-primary"><input type="checkbox" id="check' + key + '" class="check-message" value = "' + from + '"><label for="check' + key + '"></label></div></td><td class="mailbox-star mailbox-data"><a href="#"><i class="fas fa-star text-warning"></i></a></td><td class="mailbox-name mailbox-data"><p>' + value["from"].split("@")[0] + '</p></td> <td class="mailbox-subject mailbox-data">' + value["payload"] + '</td> <td class="mailbox-attachment mailbox-data"></td><td class="mailbox-date mailbox-data">' + value["dateTime"] + '</td></tr>');
        }
    });
    if (newInboxData.length == 0) {
        $("#inbox-wrapper").append('<tr><td>No data available</tr>');
    }

    var count = 0;
    $.each(newInboxData, function (key, value) {
        if (value["read"] == 0 && value["to"] == localStorage.getItem("loginMail")) {
            count++;
        }
    });
    $(".read-count .badge").text(count);

    $("button#compose-mail").on("click", function () {
        $("#app-compose-modal").modal("show");
    })

    $("#inbox-wrapper .mailbox-data").on("click", function (e) {
        e.preventDefault();
        var readFlag = 0;
        var newInboxData1 = JSON.parse(localStorage.getItem("inboxData"));
        $.each(newInboxData1, function (key, value) {
            if (value["to"] == localStorage.getItem("loginMail") && !readFlag && value["read"] == 0) {
                readFlag = value["read"] = 1;
                newInboxData1[key]["read"] = 1;
            }
        });

        localStorage.setItem("inboxData", JSON.stringify(newInboxData1));
        var count = 0;
        for (var i = 0; i < newInboxData1.length; i++) {
            if (newInboxData1[i]["read"] == 0) {
                count++;
                // break;
            }
        };
        $(".read-count .badge").text(count);
    });

    $("button#delete-mail").on("click", function () {
        if ($(".mailbox-messages").find("input:checkbox:checked").length > 0) {
            $("#delete-confirmation-modal").modal("show");
        }
        $("button#delete-mail-btn").on("click", function () {
            var deleteMailFormEle = $(".mailbox-messages").find("input:checkbox:checked");
            var inboxData = JSON.parse(localStorage.getItem("inboxData"));
            var deletedArr = inboxData;
            for (var i = 0; i < deleteMailFormEle.length; i++) {
                deletedArr = deletedArr.filter(function (item) {
                    return item.from != $(deleteMailFormEle[i]).val();
                });
            }
            localStorage.setItem("inboxData", JSON.stringify(deletedArr));
            window.location.reload();
        });
    })

    $("form#compose-mail-form").on("submit", function () {
        var preData = JSON.parse(localStorage.getItem("inboxData"));
        var preCredentials = JSON.parse(localStorage.getItem("sampleCredentials"));

        if ($("input#compose-email").val() == "" || $("input#compose-email").val() == " ") {
            $("p#error-msg").text("Email cannot be blank..");
        } else {
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var mailData = {
                from: "sample@gmail.com",
                to: $("input#compose-email").val(),
                payload: $("input#subject").val() + " " + $("textarea#compose-textarea").val(),
                dateTime: new Date().getDate() + " " + month[new Date().getMonth()],
                read: 0,
                default: 0
            };
            preData.push(mailData);
            localStorage.setItem("inboxData", JSON.stringify(preData));
            var checkEmail = 0;
            for (var i = 0; i < preCredentials.length; i++) {
                if (preCredentials[i]["email"] == $("input#compose-email").val()) {
                    checkEmail = 1;
                    break;
                }
            }

            if (!checkEmail) {
                var newcredential = {
                    email: $("input#compose-email").val(),
                    password: $("input#compose-email").val().split("@")[0]
                };
                preCredentials.push(newcredential);
                localStorage.setItem("sampleCredentials", JSON.stringify(preCredentials));
            }
            return true;
        }
        return false;
    });

    $("button .fa-sync-alt").on("click", function () {
        window.location.reload();
    });
});