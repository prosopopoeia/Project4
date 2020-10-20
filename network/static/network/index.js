document.addEventListener('DOMContentLoaded', function() {
	
	document.querySelector('#create-post').addEventListener('click', () => toggleForm());
	var formDiv = document.querySelector('#post-form-container');
	formDiv.style.display = 'none';
	
	postForm = document.querySelector('#post-form');
	postForm.addEventListener('submit', function(event) {
		event.preventDefault();
		fetch('newpost', {
			method: 'POST',
			body: JSON.stringify({
				subject: document.querySelector('#sub').value,
				body: document.querySelector('#bod').value
			})
		})
		.then(result => {
			// Print result
			console.log("result ");
			console.log(result);
			console.log("after result ");
			var formDiv = document.querySelector('#post-form-container');
			formDiv.style.display = 'none';
			document.querySelector('#sub').value = "";
			document.querySelector('#bod').value = "";
			location.reload();
		})
		.catch(error => {
			console.log('tError:', error);  
		});
	});

	
	
});//end addEventListener

function toggleForm() {
	var formDiv = document.querySelector('#post-form-container');
	if(formDiv.style.display == 'none')
		formDiv.style.display = 'block';
	else
		formDiv.style.display = 'none';
}
