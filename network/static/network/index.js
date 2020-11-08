document.addEventListener('DOMContentLoaded', function() {
	
	
	//////////////////////////////////////////
	//  create new post						//
	//////////////////////////////////////////	
	document.querySelector('#create-post').addEventListener('click', () => toggleForm());
	var formDiv = document.querySelector('#post-form-container');
	formDiv.style.display = 'none';
		
	var postForm = document.querySelector('#post-form');
	postForm.addEventListener('submit', createPost);
	
	var likeButton = document.querySelector('likebutton');
	likeButton.addEventListener('click', likePost);
	
});//end addEventListener


function createPost(event) {
	event.preventDefault();
	fetch('newpost', {
		method: 'POST',
		body: JSON.stringify({
			subject: document.querySelector('#sub').value,
			body: document.querySelector('#bod').value
		})
	})
	.then(result => {
		var formDiv = document.querySelector('#post-form-container');
		formDiv.style.display = 'none';
		document.querySelector('#sub').value = "";
		document.querySelector('#bod').value = "";
		location.reload();
	})
	.catch(error => {
		console.log('create tError:', error);  
	});
}

function likePost(event) {
	fetch('likepost'{
		method: 'POST',
		body: JSON.stringify({
			subject: document.querySelector('#postId').value,			
		})
	})
	.then(result => {
		var responseToUser = document.querySelector('#likebutton');
		responseToUser.innerHTML = 'liked';
		//location.reload();
	})
	.catch(error => {
		console.log('Like Error:', error);  
	});
}

function toggleForm() {
	var formDiv = document.querySelector('#post-form-container');
	var buttonDiv = document.querySelector('#post-option');
	if(formDiv.style.display == 'none')
	{
		formDiv.style.display = 'block';
		
	}
	
	else
		formDiv.style.display = 'none';
}
