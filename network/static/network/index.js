document.addEventListener('DOMContentLoaded', function() {
	
	console.log("loadingpage");
	//////////////////////////////////////////
	//  create new post						//
	//////////////////////////////////////////	
	document.querySelector('#create-post').addEventListener('click', () => toggleForm());
	var formDiv = document.querySelector('#post-form-container');
	formDiv.style.display = 'none';
		
	var postForm = document.querySelector('#post-form');
	postForm.addEventListener('submit', createPost);
	
	//var likeButton = document.querySelector('#likebutton');
	//likeButton.addEventListener('click', likePost);
	initIndexDisplay();
	
});//end addEventListener

function initIndexDisplay() {
	var index = 0;
	console.log("initing");
	fetch('showall')
	.then(response => response.json())
	.then(posts => {
		while (posts[index]) {
			//console.log(posts[index]);
			displayPosts(posts[index++]);
		}
	})
}

function displayPosts(post) {	
	postRows = document.querySelector('#target-row');
	const tr1 = document.createElement('tr');
	const tr2 = document.createElement('tr');
	const tr3 = document.createElement('tr');
	const td1 = document.createElement('td');
	const td2 = document.createElement('td');
	const td3 = document.createElement('td');
	const br = document.createElement('br');
	const h1 = document.createElement('h1');
	const div1 = document.createElement('div');
	const div2 = document.createElement('div');
	
	h1.innerHTML = `${post['subject']}`;
	div1.innerHTML = `Posted by ${post['author']} on ${post['timestamp']}`;
	div2.innerHTML = `${post['body']}`;
	
	td1.append(h1);
	td1.append(br);
	td1.append(div1);
	td1.append(br);
	td1.append(div2);
	//td1.innerHTML = `${post['subject']} <br> Posted by ${post['author']} on ${post['timestamp']}`;
	//td2.innerHTML = `Posted by ${post['author']} on ${post['timestamp']}`;
	//td3.innerHTML = `${post['body']}`;
	
	tr1.append(td1);
	//tr1.append(br);
	//tr1.append(td2);
//	tr2.append(td2);
	tr3.append(td3);
	postRows.append(tr1);
	postRows.append(tr2);
	postRows.append(tr3);
	postRows.append(br);
}

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
	fetch('likepost',{
		method: 'POST',
		body: JSON.stringify({
			postid : document.querySelector('#likebutton').value
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
