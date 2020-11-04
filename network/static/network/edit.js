document.addEventListener('DOMContentLoaded', function() {
	
	
	//////////////////////////////////////////
	//  edit post							//
	//////////////////////////////////////////	
		
	postForm = document.querySelector('#post-form');
	postForm.addEventListener('submit', function(event) {
		//ident = document.querySelector('#eid').value;
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
			console.log("result ");
			console.log(result);			
			console.log("after result ");
			document.querySelector('#emsg').innerHTML = "Saved";
			// document.querySelector('#ebody').value = "";
			//location.reload();
		})
		.catch(error => {
			console.log('tError:', error);  
		});
	});

	
});//end addEventListener

function editForm(event) {
	//event.preventDefault();
	id = document.querySelector("#numb").value;
	id2 = document.querySelector("#edi-div").innerHTML;
	id3 = document.querySelector("#edit-div").innerHTML;
	alert(`id is ${id3}`);
	alert(`id is ${id2}`);
	altIDdiv = document.querySelector("#obo");
	altID = altIDdiv.value;
	console.log(altID);
	console.log("value ", altIDdiv.value);
	alert(`from div is: ${altID}`);
	var editData = {
		method: 'POST',
		body: {postid : id},
		//headers: new Headers()
	};
	fetch('editpost', editData)
	.then(result => {
	// Print result
	 console.log("result ");
	 console.log(result);
			// console.log("after result ");
			// var formDiv = document.querySelector('#post-form-container');
			// formDiv.style.display = 'none';
			// document.querySelector('#sub').value = "";
			// document.querySelector('#bod').value = "";
	 location.reload();
	 })
	 .catch(error => {
		console.log('tError:', error);  
	 });
}

function toggleForm() {
	var formDiv = document.querySelector('#post-form-container');
	if(formDiv.style.display == 'none')
		formDiv.style.display = 'block';
	else
		formDiv.style.display = 'none';
}
