const form = document.querySelector('#new-form');
const inpTask = document.querySelector('#task');
const inpDescription = document.querySelector('#description');
const incompleted = document.querySelector('#yettocomplete');
const Completed = document.querySelector('#Completed');

form.addEventListener('submit', onSubmit);
incompleted.addEventListener('click', modifyItem);
window.addEventListener("DOMContentLoaded",()=>{
    axios.get("https://crudcrud.com/api/24c66278745145279132ae351313a195/todoList")
    .then((response) =>
    {
        //console.log(response);
        for(var i=0; i<response.data.length ; i++)
        {
          if(response.data[i].isCompleted===true)
          {
            showUser(response.data[i],Completed)
          }
          else{
            showUser(response.data[i],incompleted)
          }
        }
    })
    .catch((error)=>
    {
        console.log(error)
    })
})

function showUser(value,place){
    const li=document.createElement('li');
    li.appendChild(document.createTextNode(value.Task+'-'+value.Description));
    if(place===incompleted)
    {
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'Delete-Task';
    deleteBtn.textContent = 'X';
    

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'Edit-Task';
    editBtn.textContent = '√';
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    }
    place.appendChild(li);  

}

function onSubmit(e) {
    e.preventDefault();
    if (inpTask.value === '' ||inpDescription.value === '') {
        alert('Error: All fields are required');
    } else {
        const li = document.createElement('li');
        li.textContent = inpTask.value + " - " + inpDescription.value;
     
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'Delete-Task';
        deleteBtn.textContent = 'X';
        

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'Edit-Task';
        editBtn.textContent = '√';
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        // Adding to local storage
        const myObj = {
           Task: inpTask.value,
           Description: inpDescription.value,
           isCompleted:false
        };
       axios.post("https://crudcrud.com/api/24c66278745145279132ae351313a195/todoList",myObj)
       .then((response)=>{
        console.log("Posted");
       })
       .catch((err)=>{
        console.log(err);
       })

        // Appending the created li to the list
        incompleted.appendChild(li);
    }

    inpTask.value = '';
    inpDescription.value = '';
}

function modifyItem(e) {
    if (e.target.classList.contains('Delete-Task')) {
        if (confirm('Are you sure you want to delete this Task?')) {
            const li = e.target.parentElement;
            
            const text = li.textContent.split('-');
            
            axios.get('https://crudcrud.com/api/24c66278745145279132ae351313a195/todoList')
    .then((response) =>
    {
        
        for(var i=0; i<response.data.length ; i++)
        {
           if(response.data[i].Task === text[0].trim())
           {
               const idToDelete = response.data[i]._id;
               
               axios.delete(`https://crudcrud.com/api/24c66278745145279132ae351313a195/todoList/${idToDelete}`)
               .then(response => {
                console.log('Delete successful:')
              })
              .catch(error => {
                console.error('Error deleting data:');
              });
           }
           //break;
        }
       
    })
    .catch((error)=>
    {
        console.log(error)
    })
            incompleted.removeChild(li);
        }
    }
    if (e.target.classList.contains('Edit-Task')) {
        if (confirm('Do you want to edit this Task?')) {
            const li = e.target.parentElement;
            const editText = li.textContent.split('-');

           
            axios.get('https://crudcrud.com/api/24c66278745145279132ae351313a195/todoList')
    .then((response) =>
    {
        //console.log(response);
        for(var i=0; i<response.data.length ; i++)
        {
           if(response.data[i].Task === editText[0].trim())
           {
               const idToEdit = response.data[i]._id;
               const updatedTask = {
                Task: response.data[i].Task,
                Description: response.data[i].Description,
                isCompleted: true
                };

               
               axios.put(`https://crudcrud.com/api/24c66278745145279132ae351313a195/todoList/${idToEdit}`,updatedTask)
               .then(response => {
                console.log('Edit successful:')
              })
              .catch(error => {
                console.error('Error editing data:');
              });
           }
           //break;
        }
       
    })
    .catch((error)=>
    {
        console.log(error)
    })
            
            incompleted.removeChild(li);
            const deleteBtn = li.querySelector('.Delete-Task');
            const editBtn = li.querySelector('.Edit-Task');
            li.removeChild(deleteBtn);
            li.removeChild(editBtn);

            Completed.appendChild(li);
        }
    }
}

