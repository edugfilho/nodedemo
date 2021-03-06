// Userlist data array for filling in user tab
var userListData = [];
// Product data array for filling in product tab
var prodListData = [];

var max_fields      = 10; //maximum input boxes allowed
var wrapper         = $(".input_fields_wrap"); //Fields wrapper
var add_button      = $(".add_field_button"); //Add button ID

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    populateProdTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);


    // Product link click
     $('#productList table tbody').on('click', 'td a.linkshowprod', showProductInfo);

    // Add Product button click
    $('#btnAddProduct').on('click', addProduct);

    // Delete Product link click
    $('#productList table tbody').on('click', 'td a.linkdeleteprod', deleteProduct);
    
    // Add Product button click
    $('#btnAddOrder').on('click', addOrder);

    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div id="orderItem"><label>Produto </label><select type="text" style="width: 100px" name="itemPedido[]"/> <label>Quantidade </label><input style=" width: 50px" type="number" name="quantidadePedido[]"/><a href="#" class="remove_field">Remover</a></div>'); //add input box
        }
        populateProdTable();
    });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })




    $( "#tabs" ).tabs();
    

});

// Functions =============================================================

// Fill user table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.nome + '" title="Detalhes">' + this.nome + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
        $( "#orderInputCustomerName" ).select2({
            placeholder: "Selecione o cliente",
            data: userListData.map(function(obj){ return obj.nome})
        });
    });
};

// Fill product tab with data
function populateProdTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/products/productlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        prodListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowprod" rel="' + this.nome + '" title="Detalhes">' + this.nome + '</a></td>';
            tableContent += '<td>' + this.preco + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteprod" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#productList table tbody').html(tableContent);
        $( "select[name='itemPedido[]'" ).each(function(){
            $(this).select2({
            placeholder: "Selecione o produto",
            data: prodListData.map(function(obj){ return obj.nome})
        })
      }); 
    });
};
// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.nome; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoLocation').text(thisUserObject.endereco);
	$('#userInfoName').text(thisUserObject.nome);
	$('#userInfoEmail').text(thisUserObject.email);

};

// Show Product Info
function showProductInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisProdName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = prodListData.map(function(arrayItem) { return arrayItem.nome; }).indexOf(thisProdName);

    // Get our User Object
    var thisProdObject = prodListData[arrayPosition];

    //Populate Info Box
	$('#prodInfoName').text(thisProdObject.nome);
	$('#prodInfoPrice').text(thisProdObject.preco);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

            // If it is, compile all user info into one object
            var usuario = {
                'nome': $('#addUser fieldset input#inputUserName').val(),
                'email': $('#addUser fieldset input#inputUserEmail').val(),
                'endereco': $('#addUser fieldset input#inputUserLocation').val()
            }

            // Use AJAX to post the object to our adduser service
            $.ajax({
                type: 'POST',
                data: usuario,
                url: '/users/adduser',
                dataType: 'JSON'
            }).done(function( response ) {

                // Check for successful (blank) response
                if (response.msg === '') {

                    // Clear the form inputs
                    $('#addUser fieldset input').val('');

                    // Update the table
                    populateTable();

                } else {

                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);

                }
            });

    } else {
        // If errorCount is more than 0, error out
        alert('Por favor preencha todos os campos.');
        return false;
    }
};

// Add Product
function addOrder(event) {
    event.preventDefault();
    var produto = [];
    var quantidade = [];
    var itemsPedido = [];
    var pedido;

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addOrder input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        $("select[name='itemPedido[]'").each(function(){
            produto.push($(this).find(":selected").val());
        }); 

         $("input[name='quantidadePedido[]'").each(function(){
            quantidade.push($(this).val());
        }); 

        for(i = 0; i < produto.length; i++){
            //itemPedido.concat("{'produto': "+produto[i]+", 'quantidade':"+quantidade[i]+"}");
            itemsPedido.push("{'produto': " + produto[i] + ",'quantidade': " + quantidade[i] + "}");
        }

        pedido = {
            'cliente': $('#addOrder #orderInputCustomerName').find(":selected").val(),
            'itemsPedido' : JSON.stringify(itemsPedido)
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: pedido,
            url: '/orders/addorder',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {


                while(max_fields != 0) {
                    $("#orderItem").remove();
                    max_fields--;
                }

                // Update the table
                //populateOrderTable();

            } else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Por favor preencha todos os campos.');
        return false;
    }
};


// Add Product
function addProduct(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addProduct input select').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var produto = {
            'nome': $('#addProduct fieldset input#inputProdName').val(),
            'preco': $('#addProduct fieldset input#inputProdPreco').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: produto,
            url: '/products/addproduct',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addProduct fieldset input').val('');

                // Update the table
                populateProdTable();

            } else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Por favor preencha todos os campos.');
        return false;
    }
};


// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Tem certeza que deseja excluir?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    } else {

        // If they said no to the confirm, do nothing
        return false;
    }

};

// Delete Product
function deleteProduct(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Tem certeza que deseja excluir?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/products/deleteproduct/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateProdTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};