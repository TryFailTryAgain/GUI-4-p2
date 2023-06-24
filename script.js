// File: script.css

// w3schools.com and developer.mozilla.org were used as learning and reference material
// to structure this assignment.

// Copyright (c) 2023. All rights reserved. May be freely copied or
// excerpted for educational purposes with credit to the author.
// Last updated: Jun 24, 2023


//Resources utilized along side w3School and developer.mozilla.org:
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell
// https://www.w3schools.com/jsref/dom_obj_table.asp
// https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
//jquery
// https://jqueryvalidation.org/required-method/
// https://jqueryvalidation.org/jQuery.validator.addMethod/
//jquery ui
// https://jqueryui.com/tabs/#manipulation
// https://jqueryui.com/slider/#colorpicker
// https://api.jqueryui.com/slider/#event-change
// https://www.w3schools.com/jquery/sel_gt.asp

let form = $("#inputForm");
const submit = document.getElementById('submit');

//event listener to constantly be ready for the submit button
submit.addEventListener('click', errorCheck());
//event listener to constantly check when the form is changed, submit for error checking
document.getElementById('inputForm').addEventListener('change', errorCheck());


//sets up tabs for jquery ui
let tabs = $("#myTabs").tabs();

//adds a tab on click of submit button with the current xy values as the title
$("#submit").click(function () {
    const xStartVal = parseInt(document.getElementById('xStart').value);
    const xEndVal = parseInt(document.getElementById('xEnd').value);
    const yStartVal = parseInt(document.getElementById('yStart').value);
    const yEndVal = parseInt(document.getElementById('yEnd').value);
    //get the current table to be saved
    let currentTable = document.getElementById('dynTable');
    //add a new tab
    addTab(currentTable, xStartVal, xEndVal, yStartVal, yEndVal);
});

//removes all extra open tabs on click of remove all button
$("#remove").click(function () {
    //get current number of tabs
    let numTabs = $("#myTabs ul li").length;
    console.log("removing all tabs, number of tabs: " + numTabs);

    //check if last tab so the tab list is never empty
    if (numTabs == 1) {
        console.log("error: can't remove last tab");
        return;
    } else {
        // remove all tabs but the first one, gt(x) is a selector to pick all elements greater then x
        $("#myTabs ul li:gt(0)").remove();
        console.log("removed all tabs");
    }
});

//addtab() function repurposed and modified from jquery ui https://jqueryui.com/tabs/#manipulation
//function call to add a tab with the current values sent to it from the form for the title
let tabTitle = $("#tab_title");
let tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
let tabCounter = 0;

function addTab(currentTable, xStart, xEnd, yStart, yEnd) {
    let label = "Chart: " + xStart + "," + xEnd + "," + yStart + "," + yEnd;
    console.log("addTab label: " + label);
    id = "tabs-" + tabCounter;
    li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));

    tabs.find(".ui-tabs-nav").append(li);
    //appends the ids needed for styling and then the table element to the new tab
    tabs.append("<div id='" + id + "'></div>");
    $("#" + id).append("<div id=\"jsTable\">" + currentTable.outerHTML + "</div>");
    tabs.tabs("refresh");
    tabCounter++;
}
//also adapted from jquery ui https://jqueryui.com/tabs/#manipulation
//closes the tab on click of the x in the tab title itself
tabs.on("click", "span.ui-icon-close", function () {
    var panelId = $(this).closest("li").remove().attr("aria-controls");
    $("#" + panelId).remove();
    tabs.tabs("refresh");
});
//end tab section


//validates the input form using jquery validation plugin https://jqueryvalidation.org/
function validateForm() {
    form.validate({
        //states the rules for each input in the form
        rules: {
            xStart: {
                required: true,
                number: true,
                min: -1000000000,
                max: 1000000000,
                xRange: true,
                xSmallFirst: true
            },
            xEnd: {
                required: true,
                number: true,
                min: -1000000000,
                max: 1000000000,
                xRange: true
            },
            yStart: {
                required: true,
                number: true,
                min: -1000000000,
                max: 1000000000,
                yRange: true,
                ySmallFirst: true
            },
            yEnd: {
                required: true,
                number: true,
                min: -1000000000,
                max: 1000000000,
                yRange: true
            }
        },
        //the error messages for each error on the inputs
        messages: {
            //no clue why I cant do xStart, xEnd, yStart, yEnd: {} too play messages to multiple rules
            //so this will have to do
            xStart: {
                required: "Please enter a number",
                number: "Please enter a number",
                min: "Please enter a number greater than -1000000000 ",
                max: "Please enter a number less than 1000000000",
            },
            xEnd: {
                required: "Please enter a number",
                number: "Please enter a number",
                min: "Please enter a number greater than -1000000000 ",
                max: "Please enter a number less than 1000000000"
            },
            yStart: {
                required: "Please enter a number",
                number: "Please enter a number",
                min: "Please enter a number greater than -1000000000 ",
                max: "Please enter a number less than 1000000000"
            },
            yEnd: {
                required: "Please enter a number",
                number: "Please enter a number",
                min: "Please enter a number greater than -1000000000 ",
                max: "Please enter a number less than 1000000000"
            }
        }
    });
    //adds additional checks if the range between the start and end values are greater than 100
    $.validator.addMethod("xRange", function (element) {
        let xStartVal = parseInt(document.getElementById('xStart').value);
        let xEndVal = parseInt(document.getElementById('xEnd').value);
        console.log("xRange: " + Math.abs(xStartVal - xEndVal))
        if (Math.abs(xStartVal - xEndVal) > 100) {
            return false;
        }
        return true;
    }, "The range between the start and end values of X must be less than 100");

    $.validator.addMethod("yRange", function (element) {
        let yStartVal = parseInt(document.getElementById('yStart').value);
        let yEndVal = parseInt(document.getElementById('yEnd').value);
        console.log("yRange: " + Math.abs(yStartVal - yEndVal))
        if (Math.abs(yStartVal - yEndVal) > 100) {
            return false;
        }
        return true;
    }, "The range between the start and end values of Y must be less than 100");

    //adds check to make sure the start value is less than or equal to the end value
    $.validator.addMethod("xSmallFirst", function (element) {
        let xStartVal = parseInt(document.getElementById('xStart').value);
        let xEndVal = parseInt(document.getElementById('xEnd').value);
        console.log("xSmallFirst: " + xStartVal, xEndVal)
        if (xStartVal > xEndVal) {
            return false;
        } else {
            return true;
        }
    }, "Please make sure the start value is less than the end value");

    $.validator.addMethod("ySmallFirst", function (element) {
        let yStartVal = parseInt(document.getElementById('yStart').value);
        let yEndVal = parseInt(document.getElementById('yEnd').value);
        console.log("ySmallFirst: " + yStartVal, yEndVal)
        if (yStartVal > yEndVal) {
            return false;
        } else {
            return true;
        }
    }, "Please make sure the start value is less than the end value");
    //end of additional checks
}
//end of validation


function errorCheck() {
    console.log("errorCheck: called");
    //parseInt required to keep values as numbers despite being passed as a number from html
    let xStartVal = parseInt(document.getElementById('xStart').value);
    let xEndVal = parseInt(document.getElementById('xEnd').value);
    let yStartVal = parseInt(document.getElementById('yStart').value);
    let yEndVal = parseInt(document.getElementById('yEnd').value);

    //call for validation on the most up to date data
    validateForm();
    //check outcome of validation
    if (form.valid()) {
        console.log("errorCheck: input form is VALID");
        console.log("sending to fillTable: " + xStartVal, xEndVal, yStartVal, yEndVal);
        fillTable(xStartVal, xEndVal, yStartVal, yEndVal);
    } else {
        console.log("errorCheck: input form is INVALID");
    }
}


//SLIDERS Mmmm... burgers
// initialize the sliders with its values
$("#slider-xStart, #slider-xEnd, #slider-yStart, #slider-yEnd").slider({
    value: 0,
    min: -50,
    max: 50
});

//provides smooth updates as the slider slides or form is typed in
$("#slider-xStart").slider({
    //event idk, just needs to be there because its the slide event
    //ui is the slider iself and its value is ui.value
    slide: function (event, ui) {
        $("#xStart").val(ui.value);
        //send the data to validation on update
        errorCheck();
    }
});
//see top example
$("#slider-xEnd").slider({
    slide: function (event, ui) {
        $("#xEnd").val(ui.value);
        errorCheck();
    }
});
//see top example
$("#slider-yStart").slider({
    slide: function (event, ui) {
        $("#yStart").val(ui.value);
        errorCheck();
    }
});
//see top example
$("#slider-yEnd").slider({
    slide: function (event, ui) {
        $("#yEnd").val(ui.value);
        errorCheck();
    }
});
//end burgers-I mean sliders

//this function adds column from xStart to xEnd and rows from yStart to yEnd. Each cell is the product of the row and column. The first cell is blank
function fillTable(xStart, xEnd, yStart, yEnd) {
    console.log("values received for the table: " + xStart, xEnd, yStart, yEnd);
    const table = document.getElementById('dynTable');
    console.log("cleaning old table if it exists");
    table.innerHTML = ''; //clear past table

    console.log("creating table now");
    //create first row and a blank cell in top left corner so numbers align correctly
    table.insertRow();//adds a row
    //.insertCell() is not capable of making <th> cells, so this is used
    injectHeader(table, 0, " ");

    //fills top row with values from xStart and xEnd
    for (let i = xStart; i <= xEnd; i++) {
        injectHeader(table, 0, i);
    }

    //populates proceeding row values from yStart to yEnd, and finds products along the way
    for (let i = yStart, rowCount = 1; i <= yEnd; i++, rowCount++) {
        table.insertRow(); //creates current new row
        injectHeader(table, rowCount, i); //inject the y number as header
        for (let j = xStart; j <= xEnd; j++) {
            table.rows[rowCount].insertCell().innerHTML = i * j;//same application of rowCount
        }
    }
}

//Injects a header into the next position given the
//table, the row depth, and the value wanted in the cell
function injectHeader(table, rowDepth, value) {
    let Headers = document.createElement("th");
    headerRow = table.rows[rowDepth];
    Headers.innerHTML = value;
    headerRow.appendChild(Headers);
}