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
	console.log("initializing/actualizing");
	fetch('showall')
	.then(response => response.json())
	.then(posts => {
		while (posts[index]) {			
			displayPosts(posts[index++]);
		}
		$('#postTable').DataTable({
			"searching":false, 
			"paging":"simple",
			"lengthChange": false,
			"ordering": false});
	});
}

function saveEdit(id) {
	console.log("insaveedit");
	editedTextBox = document.querySelector(`#ta${id}`);
	editedText = editedTextBox.value;
console.log(`body edit : ta${bodyEdit}`);
console.log(`${editedText}`);
	fetch('editpost/editpostb', {
		method: 'PUT',
		body: JSON.stringify({
			jid: id,
			jbody: editedText
		})
	})
	.then(result => {	
		editedTextBox.style.display = "none";
		bodyEdit = document.querySelector(`#ape${id}`);
		bodyEdit.innerHTML = editedText;
		
		//rebuild the button:
		edButton = document.querySelector(`#eb${id}`);
		edButton.innerHTML = 'edit post';
		const buttonClick = document.createAttribute('onClick');
		buttonClick.value = `editPost(${id})`;
		edButton.setAttributeNode(buttonClick);
	});
}

function editPost(id) {
	
console.log(`edit Post function with ${id}`);
	

	bodyEdit = document.querySelector(`#ape${id}`); //div2 has id: has body in it
	
	
console.log(bodyEdit);
	currentBody =  bodyEdit.innerHTML;
	mtextBox = document.createElement('textArea');
	
	const editedTA = document.createAttribute('id');
	editedTA.value = `ta${id}`;
	mtextBox.setAttributeNode(editedTA);
	
	mtextBox.innerHTML = currentBody;
	bodyEdit.innerHTML = '';
	bodyEdit.append(mtextBox);
	
	editbutton = document.querySelector(`#eb${id}`);
	editbutton.innerHTML = 'save post';
	
	const editClick = document.createAttribute('onClick');
	editClick.value = `saveEdit(${id})`;
	editbutton.setAttributeNode(editClick);
	
console.log(`${currentBody} editpost`);
	
}

function displayPosts(post) {	
	postRows = document.querySelector('#target-row');
	const tr1 = document.createElement('tr');
	const trIdAttr = document.createAttribute('id');
	trIdAttr.value = `post${post['id']}`
	
	//don't think I need this - test without....
	const td1 = document.createElement('td');
	const attr = document.createAttribute('id');
	attr.value = "bodydiv";
	td1.setAttributeNode(attr);
	
	const h1 = document.createElement('h1');
	const div1 = document.createElement('div');
	
	const editDiv = document.createElement('div');
	
	const likeButton = document.createElement('button');
	likeButton.style.border = 'none';
	likeButton.style.backgroundColor = "#FFFFFF";
	likeButton.innerHTML = '<img src="static/network/images/sup.jpg" />'
	
	const dislikeButton = document.createElement('button');
	dislikeButton.style.border = 'none';
	dislikeButton.style.backgroundColor = "#FFFFFF";
	dislikeButton.innerHTML = '<img src="static/network/images/sdown.jpg" />'
	
	const likeButtonsDiv = document.createElement('div');
	likeButtonsDiv.append(likeButton);
	likeButtonsDiv.append(dislikeButton);
	const editButton = document.createElement('button');
	const buttonClick = document.createAttribute('onClick');
	const srcID = document.createAttribute('id');
	srcID.value = `eb${post['id']}`;
	buttonClick.value = `editPost(${post['id']})`;
	editButton.innerHTML = `edit post`;
	editButton.setAttributeNode(buttonClick);
	editButton.setAttributeNode(srcID);
	editDiv.append(editButton);
	
	const anchor = document.createElement('a');
	const src = document.createAttribute('href');
	src.value = `profile_post/${post['author']}`;
	
	anchor.innerHTML = `${post['author']}`;
	anchor.setAttributeNode(src);
		
	const subdiv = document.createElement('div');
	subdiv.append(anchor);
	
	
	h1.innerHTML = `${post['subject']}`;
	div1.innerHTML = `Posted by ${subdiv.innerHTML} on ${post['timestamp']}`;
	
	const div2 = document.createElement('div');
	const divID = document.createAttribute('id');
	divID.value = `ape${post['id']}`;
	div2.setAttributeNode(divID);
	div2.innerHTML = `${post['body']}`;
	
	td1.append(h1);
	td1.append(div1);
	td1.append(div2);
	td1.append(likeButtonsDiv);
	console.log(td1);
	//console.log(likeButtonsDiv);
	const thisUsr = document.querySelector('#usr > strong').innerHTML;
	if (post['author'] === thisUsr)
		td1.append(editDiv);
	tr1.append(td1);
	
	
	postRows.append(tr1);
	
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
