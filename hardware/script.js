function debug($content){
    console.log($content);
}
function init(){
    disableCableDroitDiv();
    disableCableCroiseDiv();
}
//==========ENABLE AND DISABLE SECTION==========//
//Divs
function enableCableDroitDiv(){
    document.getElementById('cable_droit').style.display="";
}
function disableCableDroitDiv(){
    document.getElementById('cable_droit').style.display="none";
}
function enableCableCroiseDiv(){
    document.getElementById('cable_croise').style.display="";
}
function disableCableCroiseDiv(){
    document.getElementById('cable_croise').style.display="none";
}