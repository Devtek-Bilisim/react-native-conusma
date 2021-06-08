"use strict";
function Start() {
    console.log("test worker");
    setTimeout("Start()", 2000);
}
function IAmHere() {
    setTimeout("IAmHere()", 20000);
}
IAmHere();
Start();
