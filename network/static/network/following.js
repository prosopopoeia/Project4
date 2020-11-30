document.addEventListener('DOMContentLoaded', function() {
	
	
	console.log("load followed posts");
	//////////////////////////////////////////
	//  create new post						//
	//////////////////////////////////////////	
	document.querySelector('#create-post').addEventListener('click', () => toggleForm());
	var formDiv = document.querySelector('#post-form-container');
	formDiv.style.display = 'none';
		
	var postForm = document.querySelector('#post-form');
	//postForm.addEventListener('submit', createPost);
	
	//var likeButton = document.querySelector('#likebutton');
	//likeButton.addEventListener('click', likePost);
	initIndexDisplay();
	
});//end addEventListener

function initIndexDisplay() {
	var index = 0;
	console.log("initializing/actualizing");
	fetch('load_following')
	.then(response => response.json())
	.then(posts => {
		while (posts[index]) {			
			displayPosts(posts[index++]);
			console.log(posts);
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
	const thisUsr = document.querySelector('#usr > strong').innerHTML;
	if (post['author'] === thisUsr)
		td1.append(editDiv);
	tr1.append(td1);
	
	
	postRows.append(tr1);
	
}