document.addEventListener('DOMContentLoaded', function() {
	
	/* var followDiv = document.querySelector('#follow-message');
	followDiv.style.display = 'none'; */

	followForm = document.querySelector('#follow-form');
	followForm.addEventListener('submit', function(event) {
		event.preventDefault();
		fetch('/add_follower', {
			method: 'POST',
			body: JSON.stringify({
				username : document.querySelector('#profileowner').value
			})
		})
		.then(result => {
			// Print result
			console.log("result ");
			console.log(result);
			console.log("after result ");
			var followDiv = document.querySelector('#follow-message');
			followDiv.style.display = 'block';			
			location.reload();
		})
		.catch(error => {
			console.log('tError:', error);  
		});
	});

	
});//end addEventListener


