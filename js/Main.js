//base object
var Board = function(params) {
    this.version = '0.07.09.07.2013';
    this.workspaceContainer = params.workspaceContainer;
    this.workspaceWidth = params.workspaceWidth;
    this.workspaceHeight = params.workspaceHeight;
    this.workspaceBackground = params.workspaceBackground;
    this.websiteId = params.websiteId;
    this.workspace = '';
    this.noteIter = 0;
    this.randomNoteBG = params.randomNoteBG;
    this.logger = '';
    this.renderWorkspace();
    this.minWidth = 0;
    this.minHeight = 0;
    this.baseNoteWidth = 200;
    this.baseNoteHeight = 200;
};

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function currentDate() {
    var objToday = new Date(),
        weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'],
        dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
    var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
    return today;
}

function idealTextColor(bgColor) {

   var nThreshold = 105;
   var components = getRGBComponents(bgColor);
   var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

   return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";   
}

function getRGBComponents(color) {       

    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);

    return {
       R: parseInt(r, 16),
       G: parseInt(g, 16),
       B: parseInt(b, 16)
    };
}

var initZindex = 0;
var tempData = [];
var depthArray = [];
var tempDataIds = [];
var tempBoardParams = {};
var checkTempDataIds = function() {
    tempDataIds = [];
    for (var i = 0; i < tempData.length; i++) {
        tempDataIds.push(tempData[i].id);
    }
};
Board.prototype.getTempDataIds = function() {
    checkTempDataIds();
    return tempDataIds;
};
var checkDepths = function() {
    for (var i = 0; i < tempData.length; i++) {
        depthArray.push(tempData[i].zindex);
    }
    if (depthArray.length !== 0) {
        initZindex = Math.max.apply(Math, depthArray);
        return Math.max.apply(Math, depthArray);
    }
    else {
        initZindex = 0;
    }
};

Board.prototype.getVersion = function() {
    return this.version;
};
Board.prototype.refreshLogger = function() {
    $('#logArea').val(this.logger);
    $('#logArea').scrollTop($('#logArea')[0].scrollHeight);
};
Board.prototype.saveData = function() {
    var tempObj = tempData;
    if (tempObj.length) {
        localStorage.setItem('boardData', JSON.stringify(tempObj));
        this.logger += 'data saved \n';
    }
    else {
        this.logger += 'no data for save \n';
    }
    this.refreshLogger();
};
Board.prototype.getData = function() {
    if (localStorage.getItem('boardData')) {
        var d = JSON.parse(localStorage.getItem('boardData'));
        this.logger += 'data loaded \n';
        this.loadData(d);
    }
    else {
        this.logger += 'no saved data \n';
    }
    this.refreshLogger();
};
Board.prototype.clearSavedData = function() {
    localStorage.setItem('boardData', '');
};
Board.prototype.openWorkspace = function() {
    this.workspace = '<div id="' + this.websiteId + '">';
    //this.workspace += '<div class="helpBox"></div>';
    this.workspace += '<div class="noteProperties"></div>';
};
Board.prototype.closeWorkspace = function() {
    this.workspace += '</div>';
};
Board.prototype.mergeWorkspace = function() {
    this.openWorkspace();
    this.closeWorkspace();
};
Board.prototype.showHelpMsg = function(msg) {
    $('#wrap .helpBox').html(msg);
};
Board.prototype.clearHelpMsg = function() {
    $('#wrap .helpBox').html('');
};
Board.prototype.helpMsg = function(el, msg) {
    var _this = this;
    $('#wrap .helpBox').html('');
    el.hover(

    function() {
        _this.showHelpMsg(msg);
    },

    function() {
        _this.clearHelpMsg();
    });
};
Board.prototype.getTempBoardParams = function() {
    return tempBoardParams;
};
Board.prototype.setBoard = function(params) {
    this.logger += 'setBoard \n';
    this.checkBoardSize();
    if (params.width <= this.minWidth) {
        params.width = this.minWidth;
        this.logger += 'width to low - set to - ' + this.minWidth + '\n';
    }
    if (params.height <= this.minHeight) {
        params.height = this.minHeight;
        this.logger += 'height to low - set to - ' + this.minHeight + '\n';
    }

    var workspace = this.workspaceContainer;
    if (params.width) {
        workspace.width(params.width);
        tempBoardParams.width = params.width;
    }
    else {
        workspace.width(this.workspaceWidth);
        tempBoardParams.width = this.workspaceWidth;
    }
    if (params.height) {
        workspace.height(params.height);
        tempBoardParams.height = params.height;
    }
    else {
        workspace.height(this.workspaceHeight);
        tempBoardParams.height = this.workspaceHeight;
    }
    if (params.background && params.background[0] != '#') {
        params.background = '#' + params.background;
    }
    if (params.background) {
        workspace.css('background', params.background);
        tempBoardParams.background = params.background;
    }
    else {
        if (this.workspaceBackground && this.workspaceBackground[0] != '#') {
            this.workspaceBackground = '#' + this.workspaceBackground;
        }
        workspace.css('background', this.workspaceBackground);
        tempBoardParams.background = this.workspaceBackground;
    }
    localStorage.setItem('boardParams', JSON.stringify(tempBoardParams));
    this.logger += 'board params saved \n';
    this.refreshLogger();
};
Board.prototype.loadBoardProperties = function() {
    this.logger += 'loadBoardProperties \n';
    if (localStorage.getItem('boardParams')) {
        this.logger += 'loadBoardProperties if \n';
        var d = JSON.parse(localStorage.getItem('boardParams'));
        this.setBoard(d);
    }
    else {
        this.logger += 'loadBoardProperties else \n';
        this.setBoard({});
    }
};
Board.prototype.updateNote = function(params, id) {
    var _this = this;
    for (var i = 0; i < tempData.length; i++) {
        if (id == tempData[i].id) {
            if (params.note) {
                tempData[i].note = params.note;
            }
            if (params.noteBg) {
                tempData[i].noteBg = params.noteBg;
            }
            if (params.noteTextColor) {
                tempData[i].noteTextColor = params.noteTextColor;
            }
            if (params.zindex) {
                tempData[i].zindex = params.zindex;
            }
            if (params.top) {
                tempData[i].top = params.top;
            }
            if (params.left) {
                tempData[i].left = params.left;
            }
            if (params.isDone === true || params.isDone === false) {
                tempData[i].isDone = params.isDone;
            }
            if (!params.noReload) {
                _this.loadData(tempData);
            }
        }
    }
};
Board.prototype.editNoteContainer = function(el) {
    var _this = this;
    el.find('.editNoteContainer').remove();
    el.find('.noteBody').hide();
    var editTemplate = '<span class="editNoteContainer"><textarea class="editNoteBody">'+el.find('.noteBody').val()+'</textarea><span class="cancel icon btn">&nbsp;</span><span class="save icon btn">&nbsp;</span></span>';
    el.append(editTemplate);
    _this.helpMsg(el.find('.editNoteContainer .cancel'), 'Cancel edited note');
    el.find('.editNoteContainer .cancel').bind('click', function(e) {
        el.find('.editNoteContainer').remove();
        el.find('.noteBody').show();
    });
    _this.helpMsg(el.find('.editNoteContainer .save'), 'Save edited note');
    el.find('.editNoteContainer .save').bind('click', function(e) {
        var updatedNoteVal = el.find('.editNoteContainer textarea').val();
        _this.updateNote({
            note: updatedNoteVal
        }, el.attr('id'));
        el.find('.editNoteContainer').remove();
        el.find('.noteBody').show();
    });
};
Board.prototype.renderWorkspace = function() {
    this.logger += 'renderWorkspace \n';
    this.mergeWorkspace();
    this.workspaceContainer.append(this.workspace);
    this.addNoteContainer();
    this.loadBoardProperties();
    checkDepths();
    if (tempBoardParams.background) {
        $('#workspaceBG').val(tempBoardParams.background);
    }
    $('#workspaceBG').jPicker({
        window: {
            position: {
                x: 'left',
                y: 'bottom'
            },
            expandable: false,
            liveUpdate: true
        },
        color: {
            active: new $.jPicker.Color({
                hex: '993300'
            })
        }
    }, function(color, context) {
        board1.setBoard({
            background: '#' + color.val('hex'),
            width: tempBoardParams.width,
            height: tempBoardParams.height
        });
    });
};
Board.prototype.addNoteContainer = function() {
    var noteContainer = '<div id="noteContainer"></div>';
    this.workspaceContainer.append(noteContainer);
};
Board.prototype.drag = function(el) {
    el.draggable({
        start: function() {
            el.css('z-index', 1);
        },
        stop: function() {
            el.css('z-index', 'auto');
        }
    });
};
Board.prototype.getNoteBg = function(id){
    var _this = this;
    for (var i = 0; i < tempData.length; i++) {
        if (id == tempData[i].id) {
                return tempData[i].noteBg;
        }
    }
};
Board.prototype.addNote = function(params) {
    var noteId = 'note';
    var noteTemplate;
    var _this = this;
    var randomBG = '';
    //console.log(params.isDone);
    if (params.isDone !== true && params.isDone !== false) {
        params.isDone = false;
        //console.log('no isDone');
    }
    if (params.fail !== true && params.fail !== false) {
        params.fail = false;
    }
    if (!params.finishDate) {
        params.finishDate = null;
    }
    if (!params.addDate) {
        params.addDate = currentDate();
    }
    if (!params.noteTextColor) {
        params.noteTextColor = '000000';
    }
    if (params.width === undefined) {
        params.width = _this.baseNoteWidth;
    }
    if (params.height === undefined) {
        params.height = _this.baseNoteHeight;
    }
    if (params.id) {
        noteId = params.id;
    }
    else {
        checkTempDataIds();
        noteId += this.noteIter;
        for (var i = 0; i < tempDataIds.length; i++) {
            if (tempDataIds[i] == noteId) {
                noteId += '_';
            }
        }
        params.id = noteId;
    }

    if (this.randomNoteBG && !params.noteBg) {
        var rndColor = get_random_color();
        randomBG = 'style="background-color:' + rndColor + '"';
        params.noteBg = rndColor;
    }
    else if (params.noteBg === '') {
        randomBG = '';
    }
    else {
        randomBG = 'style="background-color:' + params.noteBg + '"';
    }
    noteTemplate = '<div id="' + noteId + '" class="note" >';
    if (params.noteTextColor[0] != '#') {
        params.noteTextColor = '#' + params.noteTextColor;
    }

    noteTemplate += '<textarea class="noteBody" readonly style="color:' + params.noteTextColor + '">' + params.note + '</textarea>';
    noteTemplate += '<span class="close icon btn">&nbsp;</span>';
    noteTemplate += '<span class="editNote icon btn">&nbsp;</span>';
    noteTemplate += '<span class="properties icon btn">&nbsp;</span>';
    noteTemplate += '<span class="doneCheck"><input type="checkbox" ';
    if (params.isDone) {
        noteTemplate += 'checked';
    }
    noteTemplate += '></span>';
    noteTemplate += '<span class="noteBg" ' + randomBG + '></span>';
    noteTemplate += '<span class="noteStatus';
    if (params.isDone) {
        noteTemplate += ' done"><span class="close icon btn">&nbsp;</span> done';
    }
    else if (params.fail) {
        noteTemplate += ' fail"> fail';
    }
    noteTemplate += '</span>';
    noteTemplate += '</div>';
    $('#noteContainer').append(noteTemplate);
    var currentNote = $('#' + noteId);
    currentNote.css('top', params.top);
    currentNote.css('left', params.left);


    currentNote.css('width', params.width);
    currentNote.css('height', params.height);

    if (params.zindex) {
        currentNote.css('z-index', params.zindex);
    }
    else {
        initZindex += 1;
        params.zindex = initZindex;
        currentNote.css('z-index', initZindex + 1);
    }
    currentNote.draggable({
        containment: "parent",
        start: function() {
            _this.getNextHighestDepth({
                noteId: params.id,
                zindex: params.zindex
            });

            //window.location.hash = noteId;
            _this.showDepths();
        },
        stop: function() {
            params.top = currentNote.css('top');
            params.left = currentNote.css('left');
        },
        drag: function() {
            currentNote.css('z-index', params.zindex);
        }
    }).resizable({
        containment: "parent",
        stop: function(event, ui) {
            params.width = currentNote.css('width');
            params.height = currentNote.css('height');
        }
    });
    this.helpMsg(currentNote.find('.noteBg'), 'Hold to drag note');
    this.helpMsg(currentNote.find('span.close'), 'Delete note');
    this.helpMsg(currentNote.find('span.editNote'), 'Click to edit note');
    this.helpMsg(currentNote.find('span.properties'), 'Edit note properties');
    this.helpMsg(currentNote.find('span.doneCheck'), 'Mark as done');

    this.noteIter++;

    var noteSelector = '#' + noteId;
    $(noteSelector).bind('click', function(e) {
        //window.location.hash = noteId;
        //console.log(noteSelector)
        _this.getNextHighestDepth({
            noteId: noteSelector,
            zindex: parseInt($(noteSelector).css('z-index'))
        });
    });

    var statusCheckbox = '#' + noteId + ' span.doneCheck input[type="checkbox"]';
    $(statusCheckbox).click(function() {
        if ($(this).is(':checked')) {
            _this.updateNote({
                isDone: true
            }, noteId);
        }
        else {
            _this.updateNote({
                isDone: false
            }, noteId);
        }
    });
    //edit note after click on textarea and save on blur 
    //idealTextColor getRGBComponents
    var noteBodySelector = '#' + noteId + ' .noteBody';
    var editNoteBodySelector = '#' + noteId + ' .editNoteBody';
    this.helpMsg(currentNote.find('textarea.noteBody'), 'Click to edit note');
    $(noteBodySelector).bind('click', function(e) {
        _this.editNoteContainer($(this).parent());
        $(editNoteBodySelector).focus();
        //console.log(_this.getNoteBg(noteId));
        //console.log(idealTextColor(_this.getNoteBg(noteId)));
        $(editNoteBodySelector).css('color',idealTextColor(_this.getNoteBg(noteId)));
        $(editNoteBodySelector).blur(function() {
            //$("button:first").trigger('click');
             $('#' + noteId).find('.editNoteContainer .save').trigger('click');
        });    
    });
    
    
    var closeSelector = '#' + noteId + ' > span.close';
    $(closeSelector).bind('click', function(e) {
        _this.removeFromTempData($(this).parent().attr('id'));
        $(this).parent().remove();
    });
    var closeDoneSelector = '#' + noteId + ' span.noteStatus span.close';
    $(closeDoneSelector).bind('click', function(e) {

        _this.removeFromTempData($(this).parent().parent().attr('id'));
        $(this).parent().parent().remove();
    });

    var editNoteSelector = '#' + noteId + ' span.editNote';
    $(editNoteSelector).bind('click', function(e) {
        _this.editNoteContainer($(this).parent());
    });

    var propertiesSelector = '#' + noteId + ' span.properties';
    $(propertiesSelector).bind('click', function(e) {
        for (var i = 0; i < tempData.length; i++) {
            if (tempData[i].id == $(this).parent().attr('id')) {
                var thisNoteId = $(this).parent().attr('id');
                _this.showNoteProperties(tempData[i], function() {
                    var jPickerList = $.jPicker.List;
                    var jPickerObjs = $('.jPicker.Container');
                    for (var i = 0; i < jPickerList.length; i++) {
                        if (i !== 0) {
                            $.jPicker.List[i].destroy();
                            jPickerObjs[i].remove();
                        }
                    }
                    $('#noteColor').jPicker({
                        window: {
                            position: {
                                x: '30',
                                y: '-50'
                            },
                            expandable: false,
                            liveUpdate: true
                        },
                        color: {
                            active: new $.jPicker.Color({
                                hex: params.noteBg
                            })
                        }
                    }, function(color, context) {
                        _this.updateNote({
                            noteBg: '#' + color.val('hex')
                        }, thisNoteId);
                    });
                    $('#noteTextColor').jPicker({
                        window: {
                            position: {
                                x: '30',
                                y: '-50'
                            },
                            expandable: false,
                            liveUpdate: true
                        },
                        color: {
                            active: new $.jPicker.Color({
                                hex: params.noteTextColor
                            })
                        }
                    }, function(color, context) {
                        _this.updateNote({
                            noteTextColor: '#' + color.val('hex')
                        }, thisNoteId);
                    });
                });
            }
        }
    });
    this.addToTempData(params);
};
Board.prototype.showNoteProperties = function(obj, callback) {
    var properties = '<div>';
    var h = obj.height ? obj.height : "default value";
    var w = obj.width ? obj.width : "default value";
    var _this = this;
    properties += '<div class="noteId">Note id - ' + obj.id + '</div>';
    //properties += '<div class="">' + obj + '</div>'
    properties += '<div class="noteAddDate">Note add date - ' + obj.addDate + '</div>';
    properties += '<div class="noteHeight"> Note height - ' + h + '</div>';
    properties += '<div class="noteWidth"> Note width - ' + w + '</div>';
    properties += '<div class="noteContent"> <p class="fl">Note content - </p><textarea class="fl">' + obj.note + '</textarea><span class="cancel icon btn">&nbsp;</span><span class="save icon btn">&nbsp;</span></div>';
    properties += '<div class="noteBg clear"> Note background - <input id="noteColor" name="noteColor" value="' + obj.noteBg + '" /></div>';
    properties += '<div class="noteTextColor"> Note text color - <input id="noteTextColor" name="noteTextColor" value="' + obj.noteTextColor + '" /></div>';
    properties += '<div class="noteZindex"> Note z-index - ' + obj.zindex + '</div>';
    properties += '<div class="noteTop"> Note top position - ' + obj.top + '</div>';
    properties += '<div class="noteLeft"> Note left position - ' + obj.left + '</div>';

    properties += '<span class="btn close icon">&nbsp;</span>';
    properties += '</div>';
    $('#' + this.websiteId + ' .noteProperties').fadeIn();
    $('#' + this.websiteId + ' .noteProperties').empty().append(properties);
    callback();
    $('#workspace .noteProperties .icon.close').bind('click', function(e) {
        $('#' + _this.websiteId + ' .noteProperties').fadeOut();
    });
    $('#workspace .noteProperties textarea').bind('click', function(e) {
        if($(this).is(":focus")) {
            //$('#workspace .noteProperties .icon.save, #workspace .noteProperties .icon.cancel').show();
        }
    });
     $('#workspace .noteProperties textarea').blur(function() {
        //$('#workspace .noteProperties .icon.save, #workspace .noteProperties .icon.cancel').hide();
        //console.log($(this).val())
        var updatedNote = $(this).val();
        if(updatedNote ===  ''){
            updatedNote = ' ';
        }
        _this.updateNote({
            note: updatedNote
        }, obj.id);
        
     });
};
Board.prototype.addToTempData = function(obj) {
    tempData.push(obj);
};
Board.prototype.getTempData = function() {
    console.log(tempData);
    return tempData;
};
Board.prototype.removeFromTempData = function(el) {
    for (var i = 0; i < tempData.length; i++) {
        if (el == tempData[i].id) {
            tempData.splice(i, 1);
        }
    }
};
Board.prototype.resetNoteContainer = function() {
    $('#noteContainer').empty();
    this.noteIter = 0;
};
Board.prototype.checkBoardSize = function() {
    var sizeObj = {
        minWidth: 0,
        minHeight: 0
    };
    for (var i = 0; i < tempData.length; i++) {
        if (sizeObj.minWidth < Math.abs(parseInt(tempData[i].left)) + parseInt(tempData[i].width)) {
            sizeObj.minWidth = Math.abs(parseInt(tempData[i].left)) + parseInt(tempData[i].width);
        }
        if (sizeObj.minHeight < Math.abs(parseInt(tempData[i].top)) + parseInt(tempData[i].height)) {
            sizeObj.minHeight = Math.abs(parseInt(tempData[i].top)) + parseInt(tempData[i].height);
        }
    }
    this.minWidth = sizeObj.minWidth;
    this.minHeight = sizeObj.minHeight;
    tempBoardParams.width = sizeObj.minWidth;
    tempBoardParams.height = sizeObj.minHeight;
};
Board.prototype.initFromHash = function() {
    if (window.location.hash) {
        $(window.location.hash).css('z-index', checkDepths() + 1);
    }
};
Board.prototype.loadData = function(data) {
    this.resetNoteContainer();
    tempData = [];
    var minWidth = 0;
    var minHeight = 0;
    for (var i = 0; i < data.length; i++) {
        if (minWidth < Math.abs(parseInt(data[i].left)) + parseInt(data[i].width)) {
            minWidth = Math.abs(parseInt(data[i].left)) + parseInt(data[i].width);
        }
        if (minHeight < Math.abs(parseInt(data[i].top)) + parseInt(data[i].height)) {
            minHeight = Math.abs(parseInt(data[i].top)) + parseInt(data[i].height);
        }
        this.addNote({
            id: data[i].id,
            addDate: data[i].addDate,
            noteTextColor: data[i].noteTextColor,
            note: data[i].note,
            noteBg: data[i].noteBg,
            top: data[i].top,
            left: data[i].left,
            zindex: data[i].zindex,
            width: data[i].width,
            height: data[i].height,
            isDone: data[i].isDone,
            fail: data[i].fail
        });
    }
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    if (minWidth > tempBoardParams.width) {
        tempBoardParams.width = minWidth;
    }
    if (minHeight > tempBoardParams.height) {
        tempBoardParams.height = minHeight;
    }
    this.setBoard({
        width: tempBoardParams.width,
        height: tempBoardParams.height,
        background: tempBoardParams.background
    });
    //this.initFromHash();
};

//for test
Board.prototype.showDepths = function() {
    var _this = this;
    for (var i = 0; i < tempData.length; i++) {
        _this.logger += 'id - ' + tempData[i].id + ' z-index - ' + tempData[i].zindex + '\n';
    }
    _this.logger += '\n';
    _this.refreshLogger();
};

Board.prototype.getNextHighestDepth = function(params) {
    
    var _id = params.noteId;
    var _zindex = params.zindex;
    //depthArray
    var higestNoteZindexId = '';
    var highestZindex = checkDepths();
    var _this = this;

    for (var i = 0; i < tempData.length; i++) {
        if (tempData[i].zindex == highestZindex) {
            higestNoteZindexId = tempData[i].id;
        }
    }
    //increment higest z-index and assign to clicked element
    highestZindex = highestZindex + 1;
    _this.updateNote({
        zindex: highestZindex,
        noReload: true
    }, _this.removeIdHash(_id));
    $(_this.addIdHash(_id)).css('z-index', highestZindex);
    
    //swap z-index between clicked element and element with higest z-index
    /*
    _this.updateNote({
        zindex: highestZindex,
        noReload: true
    }, _this.removeIdHash(_id));
    _this.updateNote({
        zindex: _zindex,
        noReload: true
    }, _this.removeIdHash(higestNoteZindexId));
    $(_this.addIdHash(_id)).css('z-index', highestZindex);
    $(_this.addIdHash(higestNoteZindexId)).css('z-index', _zindex);
    */
    
    
};
Board.prototype.addIdHash = function(string) {
    if (string[0] != '#') {
        string = '#' + string;
    }
    return string;
};
Board.prototype.removeIdHash = function(string) {
    if (string[0] == '#') {
        string = string.slice(1, string.length);
    }
    return string;
};
Board.prototype.sortNotes = function(){
    var point = function(x,y){
        return {
            x: x,
            y: y
        }
    };
    var notesDims = [];
    var map = [];
    var boardWidth = this.workspaceWidth;
    var boardHeight = this.workspaceHeight;
    var notesCount = 0;
    for(var i=0; i<tempData.length; i++){
        notesDims.push(new point(parseInt(tempData[i].width), parseInt(tempData[i].height)));
    }
    console.log(notesDims)
    var nextX = 0;
    var nextY = 0;
    var highestHeightInRow = 0;
    
    map.push(new point(0,0))
    for(var i=0; i<notesDims.length-1; i++){
        nextX += notesDims[i].x;
        if(highestHeightInRow < notesDims[i].y){
            highestHeightInRow = notesDims[i].y;
        }
        if(nextX > boardWidth){
            nextX = 0;
            nextY += highestHeightInRow;
            highestHeightInRow = 0;
        }
        map.push(new point(nextX,nextY));
    }
    //return map;
    for(var i =0; i < tempData.length; i++){
        tempData[i].top = map[i].y
        tempData[i].left  = map[i].x
        $('#'+tempData[i].id).animate({
            //opacity: 0.25,
            left: map[i].x,
            top: map[i].y
            }, 200);
    }
    this.setBoard({
        width: tempBoardParams.width,
        height: tempBoardParams.height
    })
    //this.loadData(tempData);
};
var helpBoxIsVisible = true;
var helpBoxToggle = function(){
    console.log('helpBoxToggle')
    if(helpBoxIsVisible){
        $('div.helpBoxContainer').css('left','-190px');
        helpBoxIsVisible = false;
    }else{
        $('div.helpBoxContainer').css('left','0');
        helpBoxIsVisible = true;
    }
}

var board1;
$(function() {
    board1 = new Board({
        workspaceContainer: $('#workspace'),
        websiteId: 'website1',
        workspaceHeight: 500,
        workspaceWidth: 900,
        workspaceBackground: '000000',
        randomNoteBG: true
    });
    $('#setBoard').bind('click', function(e) {
        board1.setBoard({
            width: $('#workspaceWidth').val(),
            height: $('#workspaceHeight').val(),
            background: $('#workspaceBG').val()
        });
    });
    $('#addNote').bind('click', function(e) {
        board1.addNote({
            note: $('#addNoteValue').val()
        });
    });
    $('#saveData').bind('click', function(e) {
        board1.saveData();
    });
    $('#loadData').bind('click', function(e) {
        board1.getData();
    });
    $('#clearSavedData').bind('click', function(e) {
        board1.clearSavedData();
    });
    $('#sortNotes').bind('click', function(e) {
        board1.sortNotes();
    });
    $('div.helpBoxRightBar').bind('click', function(e) {
        helpBoxToggle();
    });
    //addDbConnectionHandlers();
});