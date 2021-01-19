$(function () {

    $("td").click(function () {

        var link = $(this).data("link");
        var target = $(this).data("target");

        if (link) {
            if (target) {
                return window.open(link, target);
            }
            window.location.href = link;
        } else {
            return false
        }
    })

    var socket = io.connect();

    socket.on("LeagueConnects", function (data, onlines) {

        $('#onlines').numerator({
            duration: 1000,
            delimiter: ',',
            toValue: onlines
        });

    });
});