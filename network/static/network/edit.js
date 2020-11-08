document.addEventListener('DOMContentLoaded', function() {
	
	
	//////////////////////////////////////////
	//  edit post							//
	//////////////////////////////////////////	
		
	postForm = document.querySelector('#post-form');
	postForm.addEventListener('submit', function(event) {
		event.preventDefault();
		console.log("result ");
		fetch('editpostb', {
			method: 'POST',
			body: JSON.stringify({
				feid: document.querySelector('#eid').value,
				fbody: document.querySelector('#ebody').value
			})
		})
		.then(result => {
			// Print result
			console.log(result);			
			document.querySelector('#emsg').innerHTML = "Saved";			
		})
		.catch(error => {
			console.log('tError:', error);  
		});
	});
	
});//end addEventListener

