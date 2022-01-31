let taskInput = document.getElementById("jauns");
let addButton = document.getElementsByTagName("button")[0];
let incompleteTaskHolder = document.getElementById("nepabeigts");
let completedTasksHolder = document.getElementById("pabeigts");
let clearTasks = document.getElementById("clear");
let todo = [];
let complete = [];


// Datu saglabāšana pēc lapas ielādes
document.onreadystatechange = function(){

	if(document.readyState === "complete"){

		let checkStorageTodo = JSON.parse(localStorage.getItem("todo"));
		let checkStorageComplete = JSON.parse(localStorage.getItem("complete"));

		if(checkStorageTodo != null){

			todo = checkStorageTodo
			checkStorageTodo.forEach(element => {

				let incElement = createNewTaskElement(element);
				bindTaskEvents(incElement, taskCompleted);
				incompleteTaskHolder.appendChild(incElement);
			})

		}if(checkStorageComplete != null){

			complete = checkStorageComplete
			checkStorageComplete.forEach(element => {

				let comElement = createNewTaskElement(element);
				bindTaskEvents(comElement, taskIncomplete);
				completedTasksHolder.appendChild(comElement);
			})

		}

	}
}

//Izveido jaunu elementu (li)
let createNewTaskElement = function(taskString){

	let listItem = document.createElement("li");
	let checkBox = document.createElement("input");
	let label = document.createElement("label");
	let editInput = document.createElement("input");
	let editButton = document.createElement("button");
	let deleteButton = document.createElement("button");

	label.innerText = taskString;

	checkBox.type = "checkbox";
	editInput.type = "text";

	editButton.innerText = "Edit";
	editButton.className = "edit";
	deleteButton.innerText = "Delete";
	deleteButton.className = "delete";


	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(editInput);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);

	console.log(listItem);

	return listItem;
}
//Pievienot uzdevumu
let addTask = function(){
	if(taskInput.value === ""){
		console.log("wrong input");
	}else{
		todo.push(taskInput.value);
		localStorage.setItem("todo", JSON.stringify(todo));
		let listItem = createNewTaskElement(taskInput.value);
		incompleteTaskHolder.appendChild(listItem);
		bindTaskEvents(listItem, taskCompleted);
		taskInput.value = "";
	}

}
//Rediģēt uzdevumu
let editTask = function(){
	let listItem = this.parentNode;
	let editInput = listItem.querySelector('input[type=text]');
	let label = listItem.querySelector("label");
	let containsClass = listItem.classList.contains("editMode");
	if(containsClass){
		let index = todo.indexOf(label.innerText);
		if(index === -1){
			index = complete.indexOf(label.innerText);
			label.innerText = editInput.value;
			complete.splice(index,1,label.innerText);
			localStorage.setItem('complete',JSON.stringify(complete));
		}else{
		label.innerText = editInput.value;
		todo.splice(index,1,label.innerText);
		localStorage.setItem('todo',JSON.stringify(todo));
	}
	
	}else{
		editInput.value = label.innerText;
	}

	listItem.classList.toggle("editMode");
}
//Dzēst uzdevumu
let deleteTask = function(){

	let listItem = this.parentNode;
	let ul = listItem.parentNode;
	ul.removeChild(listItem);
	let index = todo.indexOf(listItem.children[1].innerText);
	if(index === -1){
		index = complete.indexOf(listItem.children[1].innerText);
		complete.splice(index,1);
		localStorage.setItem('complete',JSON.stringify(complete));
	}else{
		todo.splice(index,1);
		localStorage.setItem('todo',JSON.stringify(todo));
	}

}
//Pabeigtie uzdevumi
let taskCompleted = function(){
	
	let listItem = this.parentNode;
	completedTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskIncomplete);
	complete.push(listItem.children[1].innerText);
	localStorage.setItem('complete',JSON.stringify(complete));
	const index = todo.indexOf(listItem.children[1].innerText);
	todo.splice(index,1);
	localStorage.setItem('todo',JSON.stringify(todo));
	console.log(complete);

}
//Atgriezt pabeigto uz todo
let taskIncomplete = function(){
	console.log("to be implemented");
}

addButton.onclick = addTask;

//Pievieno funkcijas pogām
let bindTaskEvents = function(taskListItem,checkBoxEventHandler){

	let checkBox = taskListItem.querySelector("input[type=checkbox]");
	let editButton = taskListItem.querySelector("button.edit");
	let deleteButton = taskListItem.querySelector("button.delete");

	editButton.onclick = editTask;
	deleteButton.onclick = deleteTask;
	checkBox.onchange = checkBoxEventHandler;
}

//Nodzēst visus pabeigtos
let clearStorage = function(){
	localStorage.removeItem('complete');
	const children = Array.from(completedTasksHolder.children)
	children.forEach(e => e.remove())
}

clearTasks.addEventListener('click', clearStorage)





