$(document).ready(function () {
    getVelocity()

    createWorld();

    prepareStartStop();


    $('#create-btn').on('click', function (event) {
        $('#world').remove();
        createWorld();
    });

    $('#clear-btn').on('click', function (event) {
        $('#generation-counter').text(0);
        $("td").each(function (index) {
           $(this).removeClass();
        });
    });

    $('#one-step-btn').on('click', function (event) {
        getRules();
        oneStep();
    });

    $('#velocity').on('change', function (event) {
        getVelocity();
    });

    $('#rand-btn').on('click', function (event) {
        var probabilityValue = $('#probability').val()
        var probability = (probabilityValue <= 100 && probabilityValue > 0) ? probabilityValue : 50;
        $("td").each(function (index) {
            Math.random() * 100 <= probability ? $(this).addClass('live') : $(this).removeClass('live');
        });
    });

    $(".help").each(function (index) {
        $(this).mouseover(function () {
            $(this).next('.manual').show();
        });
        $(this).mouseout(function () {
            $(this).next('.manual').hide();
        });
    });




});

function oneStep() {

    $("td").each(function (index) {
        var id = $(this).attr('id');
        var x = parseInt(id.substring(0, id.indexOf('x')));
        var y = parseInt(id.substring(id.indexOf('x') + 1));

        var counter = countLivingNeighbours(x, y);

        liveOrDie(this, counter);

    });

    loadNextGeneration();

    $('#generation-counter').text(parseInt($('#generation-counter').text()) + 1);


}

function loadNextGeneration() {
    $("td").each(function (index) {
        $(this).data('next-generation') > 0 ? $(this).addClass('live').addClass('existed') : $(this).removeClass('live');
    });
}

function liveOrDie(cell, counter) {
    if ($(cell).hasClass('live')) {
        $.inArray(counter.toString(), window.survivalRules) >= 0 ? $(cell).data('next-generation', 1) : $(cell).data('next-generation', 0);
    } else {
        $.inArray(counter.toString(), window.bornRules) >= 0 ? $(cell).data('next-generation', 1) : $(cell).data('next-generation', 0);
    }
}

function countLivingNeighbours(x, y) {
    var counter = 0;

    for (i = (x - 1); i <= (x + 1); i++) {
        for (j = (y - 1); j <= (y + 1); j++) {
            if (!(i == x && j == y)) {
                counter = $('#' + i + 'x' + j).hasClass('live')
                    ? counter + 1 : counter;
            }
        }
    }

    return counter;
}

function createWorld() {
    var width = parseInt($('#width').val());
    var height = parseInt($('#height').val());

    width = width > 0 ? width : 50;
    height = height > 0 ? height : 50;

    world = createTable(width, height);

    $('#world-container').append(world);

    setTdClickFunction();


}

function createTable(width, height) {

    var world = "<table id='world'>";
    for (i = 0; i < height; i++) {
        world += "<tr>";
        for (j = 0; j < width; j++) {
            world += '<td id="' + j + 'x' + i + '"></td>';
        }
        world += "</tr>";
    }
    return world + "</table>";
}


function setTdClickFunction() {
    $('td').on('click', function (event) {
        $(this).toggleClass('live');
    });
}

function getRules() {
    var bornRules = $('#born-rules').val();
    var survivalRules = $('#survive-rules').val();

    window.bornRules = bornRules.replace(/ /g, '').split(',');
    window.survivalRules = survivalRules.replace(/ /g, '').split(',');

}

function prepareStartStop() {
    $('#start-btn').on('click', function (event) {
        getRules();
        if (!$(this).hasClass('play')) {
            $(this).addClass('play');
            $(this).text('STOP');
            runWorld = setInterval(function () {
                oneStep();  // this is inside your loop
            }, window.velocity);
        } else {
            $(this).removeClass('play');
            $(this).text('RUN');
            clearInterval(runWorld);
        }
    });
}

function getVelocity() {
    window.velocity =$('#velocity').val();
}


// window.setInterval(function () {
//     if ($('#start-btn').hasClass('play')) {
//         setTimeout(function () {
//             runWorld();
//         }, 2000);
//     }
// }, 0);