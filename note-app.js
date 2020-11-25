$(document).ready(function(){
  var activeNote = null;
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
    var id;
    if (activeNote) {
      $('#' + activeNote)[0].children[0].innerHTML = title;
      $('#' + activeNote)[0].children[1].innerHTML = created.toLocaleString("en-US");
      $('#' + activeNote)[0].children[2].innerHTML = body;
      $('#' + activeNote)[0].style.backgroundColor = color;
      activeNote = null;
      $('#edit-mode').removeClass('display').addClass('no-display');
    } else {
      // var creationDate = new Date();
      var tran = JSON.stringify({"username": localStorage.getItem('username'),"password": localStorage.getItem('password')})
      fetch('http://54.226.195.55:8080/api/GetMyTokenpw', {
            method: 'POST',
            body: tran,
            headers: {}
      })
      .then(async (res) =>{
        let pw = await res.text();
        console.log(pw);
        sessionStorage.setItem('pw', pw);
      })
      tran = JSON.stringify({"token": localStorage.getItem('token'),"content": body, "color": "White", "font_size": "12"})
      fetch('http://54.226.195.55:8080/api/postMemo', {
            method: 'POST',
            body: tran,
            headers: {}
      })
      .then(async (res) =>{
        let msg = await res.text();
        if(msg === "cool"){
          alert("new note added");
        }
        else{
          alert("fail")
        }
      })
      $('#listed').append('<div id="note' + id + '" style="background-color: ' + color + '">' + '</div> <div class="list-text">' + body + '</div> </div>');
    };
    $('#title-field').val('');
    $('#body-field').val('');
    $('notepad').css('background-color', 'white');
    $('#title-field').css('background-color', 'white');
    $('#body-field').css('background-color', 'white');
  });

  $('#btn-delete').click(function(){
    if (activeNote) {
      $('#' + activeNote)[0].remove();
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
  
  $( "#logout-user" ).button().on( "click", function() {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('token');
      localStorage.setItem('path', 'login.html');
      location.reload();
    });

  if (localStorage.getItem('path') === 'login.html'){
      window.location.assign(localStorage.getItem('path'))
  }

  $('#btn-refresh').click(function(){
    var tran = JSON.stringify({"username": localStorage.getItem('username'),"password": localStorage.getItem('password')})
    fetch('http://54.226.195.55:8080/api/GetMyTokenpw', {
          method: 'POST',
          body: tran,
          headers: {}
    })
    .then(async (res) =>{
      let pw = await res.text();
      console.log(pw);
      sessionStorage.setItem('pw', pw);
    })
    var tran = JSON.stringify({"token": localStorage.getItem('token'),"tokenpw": sessionStorage.getItem('pw')})
    fetch('http://54.226.195.55:8080/api/memo', {
          method: 'POST',
          body: tran,
          headers: {}
    })
    .then(async (res) =>{
      let memo = await res.json();
      console.log(memo);
      let len = memo.length;
      memo.forEach(note =>{
        $('#listed').append('<div id="note' + note.id + '</div> <div class="list-text">' + note.content + '</div> </div>');
      })
      
    })

  });
})