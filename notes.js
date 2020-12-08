var noteCount = 0;
var activeNote = null;
const list = document.getElementById("listed");
let LIST = [];

let data = localStorage.getItem("NOTES");
if (data){
  LIST = JSON.parse(data);
  loadNotes(LIST);
  noteCount = LIST.length;
}
else{
}

function loadNotes(array){
  array.forEach(function(item){
      addNotes(item.color, item.title, item.body, item.created, true);
  });
}

function addNotes(color, title, body, created, refresh){
  console.log(activeNote, color, title, body, created);
  if (activeNote) {
    document.getElementById(activeNote).querySelector(".list-title").innerHTML = title;
    document.getElementById(activeNote).querySelector(".list-date").innerHTML = created.toLocaleString("en-US");
    document.getElementById(activeNote).querySelector(".list-text").innerHTML = body;
    document.getElementById(activeNote).style.backgroundColor = color;
    $('#edit-mode').removeClass('display').addClass('no-display');
    LIST[activeNote]= {
      id: activeNote,
      color: color,
      title: title,
      body: body,
      created: created
    };
    console.log(LIST[activeNote]);
    LIST.splice(activeNote+1, LIST.length/2);
    activeNote = null;
    console.log(LIST);
  } 
  else {
    var id = noteCount;
    var created = new Date();
    let text = `<div id="${id}" style="background-color: ${color}">
                  <div class="list-title">${title}</div> 
                  <div class="list-date">${created.toLocaleString("en-US")}</div> 
                  <div class="list-text" style="white-space: pre-wrap">${body}</div> 
                </div>`;
    const position = "beforeend";
    list.insertAdjacentHTML(position, text);
    if(!refresh){
      LIST.push(
        {
            id: id,
            color: color,
            title: title,
            body: body,
            created: created
        }
      );
    }
    noteCount++;
  };
  console.log('noteCount: ' + noteCount);
}

function deleteNotes(array, index){
  array.splice(index, 1);
  console.log(array.length, array);
  noteCount--;
  for(i = index; i < array.length; i++){
    console.log("before: " + array[i].id);
    array[i].id = array[i].id - 1;
    console.log("after: " + array[i].id);
  }
  localStorage.setItem("NOTES", JSON.stringify(array))
}

$('.color-box').click(function(){
  var color = $(this).css('background-color');
  $('notepad').css('background-color', color);
  $('#title-field').css('background-color', color);
  $('#body-field').css('background-color', color);
})

$('#btn-save').click(function(){
  var title = $('#title-field').val();
  var body = $('#body-field').val();
  if (title === '' && body === '') {
    alert ('Please add a title or body to your note.');
    return;
  }
  var created = new Date();
  var color = $('notepad').css('background-color');
  addNotes(color, title, body, created, false);
  $('#title-field').val('');
  $('#body-field').val('');
  $('notepad').css('background-color', 'white');
  $('#title-field').css('background-color', 'white');
  $('#body-field').css('background-color', 'white');
  localStorage.setItem("NOTES", JSON.stringify(LIST));
});

$('#btn-delete').click(function(){
  if (activeNote) {
    // var index = activeNote.match(/(\d+)/); 
    console.log("activeNote: " + activeNote);
    deleteNotes(LIST, activeNote);
    $('#' + activeNote).remove();
    activeNote = null;
    $('#edit-mode').removeClass('display').addClass('no-display');
  }
    $('#title-field').val('');
    $('#body-field').val('');
    $('notepad').css('background-color', 'white');
    $('#title-field').css('background-color', 'white');
    $('#body-field').css('background-color', 'white');
});

$('#listed').click(function(e){
  var id = e.target.parentElement.id;
  var color = e.target.parentElement.style.backgroundColor;
  activeNote = id;
  $('#edit-mode').removeClass('no-display').addClass('display');
  var titleSel = $('#' + id)[0].children[0].innerHTML;
  var bodySel = $('#' + id)[0].children[2].innerHTML;
  $('#title-field').val(titleSel);
  $('#body-field').val(bodySel);
  $('notepad').css('background-color', color);
  $('#title-field').css('background-color', color);
  $('#body-field').css('background-color', color);
})
