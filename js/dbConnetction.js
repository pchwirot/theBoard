var loadDataFromDB = function() {
    $.ajax({
        url: "http://theboard.pchwirot.c9.io/getData.php?b=b"

    }).done(function(data) {
        var d = data;
        console.log(d);
        return d;
    }).fail(function(jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
        return false;
    });
};
var test = function(){
    var a = 'aaa';
    return a;
};

var addDbConnectionHandlers = function() {
    $('#getDataFromDB').bind('click', function(e) {
        console.log('loaded data - ');
        console.log(loadDataFromDB());
    });
};