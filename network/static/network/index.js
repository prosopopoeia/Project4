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
	//$('#postTable').DataTable();
	//$('#postTable').DataTable({"searching":false, "paging":"simple"});
	
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
		$('#postTable').DataTable({
			"searching":false, 
			"paging":"simple",
			"lengthChange": false,
			"ordering": false});
	});
}

function displayPosts(post) {	
	postRows = document.querySelector('#target-row');
	const tr1 = document.createElement('tr');
	const td1 = document.createElement('td');
	const attr = document.createAttribute('data-table-header');
	attr.value = "post";
	td1.setAttributeNode(attr);
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
	
	tr1.append(td1);
	postRows.append(tr1);
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
