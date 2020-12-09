document.addEventListener('DOMContentLoaded', function() {
	
	
	
	followForm = document.querySelector('#follow-form');
	//No followForm form if user looking at own profile.
	if(!!followForm)
	{	
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
				location.reload();
			})
			.catch(error => {
				console.log('tError:', error);  
			});
		});
	}

	
});//end addEventListener



