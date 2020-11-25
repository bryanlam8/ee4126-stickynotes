// new Vue({
//   el: '#app',
//   data: {
//     showModal: false
//   },
//   methods: {
//     onShowModal(){
//       this.showModal = true;
//     }
//   }
// });

// Vue.component('btn',{
//   template: `<button @click="$emit('trigger')"><slot></slot></button>`,
// });

// Vue.component('modal',{
//   template: `<p><slot></slot></p>`,
// });

// Vue.component('modal-btn', {
//   template: `
//     <div>
//       <modal v-if="showModal">
//         <slot>I am a modal</slot>
//       </modal>
//       <btn @trigger="showModal = true">Show Modal</btn>
//     </div>
//   `,
//   data() {
//     return { showModal: false }
//   }
// });
$(document).ready(
function() {
  var dialog, form,

    // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
    name = $( "#name" ),
    password = $( "#password" ),
    allFields = $( [] ).add( name ).add( password ),
    tips = $( ".validateTips" );

  function updateTips( t ) {
    tips
      .text( t )
      .addClass( "ui-state-highlight" );
    setTimeout(function() {
      tips.removeClass( "ui-state-highlight", 1500 );
    }, 500 );
  }

  function checkLength( o, n, min, max ) {
    if ( o.val().length > max || o.val().length < min ) {
      o.addClass( "ui-state-error" );
      updateTips( "Length of " + n + " must be between " +
        min + " and " + max + "." );
      return false;
    } else {
      return true;
    }
  }

  function checkRegexp( o, regexp, n ) {
    if ( !( regexp.test( o.val() ) ) ) {
      o.addClass( "ui-state-error" );
      updateTips( n );
      return false;
    } else {
      return true;
    }
  }

 function addUser() {
    var path = "/"
    var valid = true;
    allFields.removeClass( "ui-state-error" );

    // valid = valid && checkLength( name, "username", 3, 16 );
    // valid = valid && checkLength( password, "password", 5, 16 );

    // valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
    // valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
  
    if ( valid ) {
      $( "#users tbody" ).append( "<tr>" +
        "<td>" + name.val() + "</td>" +
        "<td>" + password.val() + "</td>" +
      "</tr>" );
      
      var username = document.getElementById("name").value
      var parsePassword =   document.getElementById("password").value
      var tran = JSON.stringify({"username": username,"password": parsePassword})
      let msg = "{\"username\":\"" + username + "\",\"password\":\"" + parsePassword + "\"}";
      console.log(tran)
      console.log(msg)
      fetch('http://54.172.67.50:8080/api/NewUser', {
          method: 'POST',
          body: tran,
          headers: {}
      })
      .then(async (res) => {
        let str = await res.text();
        console.log(str);

        // Get the token from server: token is the identifier
        if(str === "done"){
          fetch('http://54.172.67.50:8080/api/GetMyToken', {
            method: 'POST',
            body: msg,
            headers: {}
          })
          .then(async (res) =>{
            let token = await res.text();
            console.log(token);
            if(token === "GGWP"){
              return alert("server error");
            }
            else{
              path = 'note.html'
              localStorage.setItem('username', username);
              localStorage.setItem('password', parsePassword);
              localStorage.setItem('token', token);
              localStorage.setItem('path', String(path));
              location.reload();
            }
          })
        }
        else if(str === "Fail, username already exist or internal error"){
          fetch('http://54.172.67.50:8080/api/GetMyToken', {
            method: 'POST',
            body: tran,
            headers: {}
          })
          .then(async (res) =>{
            let token = await res.text();
            console.log(token);
            if(token === "GGWP"){
              return alert("server error");
            }
            else{
              path = 'note.html'
              localStorage.setItem('username', username);
              localStorage.setItem('password', parsePassword);
              localStorage.setItem('token', token);
              localStorage.setItem('path', String(path));
              location.reload();
            }
          })
        }
      })
      dialog.dialog( "close" );
    return valid
    }
  }

  dialog = $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      "Create/Login": addUser,
      Cancel: function() {
        $(".hidden").hide();
        dialog.dialog( "close" );
      }
    },
    close: function() {
      form[ 0 ].reset();
      allFields.removeClass( "ui-state-error" );
      $(".ui-widget-overlay").removeClass('modal-opened');
    }
  });

  form = dialog.find( "form" ).on( "submit", function( event ) {
    event.preventDefault();
    addUser();
  });

  $( "#create-user" ).button().on( "click", function() {
    dialog.dialog( "open" );
    $(".ui-widget-overlay").addClass('modal-opened');
  });
  
  //  save login state
  if(localStorage.getItem('path') === 'note.html'){
    window.location.href = localStorage.getItem('path');
  }  
}
);


