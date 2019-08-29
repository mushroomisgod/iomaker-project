var db = new Firebase("https://makeio.firebaseio.com/");

var updateData = function () {
    db.on('child_added', function (snapshot) {
        var dataInput = snapshot.val();
        if( dataInput.type == "acc" ) {
            acc.usr.push(dataInput.usr);
            acc.psw.push(dataInput.psw);
        } else if (dataInput.type == "makeNewGame" ) {
            console.log(dataInput.user); 
            console.log(dataInput.user == loggedUser);
            if( dataInput.user == loggedUser ) {
                gProjects.name.push( dataInput.gname );
                updateGameLaunchers();
            }
        }
    });
}

updateData();