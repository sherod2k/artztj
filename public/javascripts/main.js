$(document).ready(function(){
	$('.delete-painting').on('click', function(){
		var id = $(this).data('id');
		var url = '/delete/'+id;
		if(confirm('Delete Painting?')){
			console.log("%%%%%%%%%%%%% DELETION CONFIRMED %%%%%%%%%%%");
			$.ajax({
				url: url,
				type:'DELETE',
				success: function(result){
					console.log('Deleting painting...'); 
					window.location.href='/view';
				},
				error: function(err){
					console.log("&&&&&&&& Deletion Error &&&&&&&&&&&");
					console.log(err);
					console.log("&&&&&&&& Deletion Error &&&&&&&&&&&");
				}
			});
		}else {
			console.log("%%%%%%%%%%%%% DELETION NOT CONFIRMED %%%%%%%%%%%");
			window.location.href='/view';
		}

	});


	$('.delete-user').on('click', function(){
		var id = $(this).data('id');
		var url = '/deleteUser/'+id;
		if(confirm('Delete User?')){
			console.log("%%%%%%%%%%%%% DELETION CONFIRMED %%%%%%%%%%%");
			$.ajax({
				url: url,
				type:'DELETE',
				success: function(result){
					console.log('Deleting user...'); 
					window.location.href='/viewUsers';
				},
				error: function(err){
					console.log("&&&&&&&& Deletion Error &&&&&&&&&&&");
					console.log(err);
					console.log("&&&&&&&& Deletion Error &&&&&&&&&&&");
				}
			});
		}else {
			console.log("%%%%%%%%%%%%% DELETION NOT CONFIRMED %%%%%%%%%%%");
			window.location.href='/viewUsers';
		}

	});








	$(".toggle-details").click(function(){
    $("#details").hide();
	});

});