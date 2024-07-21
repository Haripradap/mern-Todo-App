import { useEffect, useState } from "react";

const Todo = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [editId, setEditId] = useState(-1);
    const [edittitle, setEditTitle] = useState("");
    const [editdescription, setEditDescription] = useState("");
    const apiUrl = "http://localhost:3000"

const handleSubmit = (e) => {
    setError("")
        e.preventDefault();
        if(title.trim() !== '' && description.trim() !== ''){
            fetch(apiUrl+"/todos",{
                method: "POST",
                headers:{"content-type": "application/json"},
                body: JSON.stringify({title, description})
            }).then((res)=> {
                if(res.ok){
                    setTodos([...todos,{title, description}])
                    setTitle("");
                    setDescription("");
                    setMsg("Items added successfully")
                    setTimeout(() =>{
                        setMsg("")
                    },3000)
                }else{
                    setError("unable to create todo list")
                }
                
            }).catch(() => {
                setError("unable to create todo list")
            })
            
        }
}

useEffect(() => {
    getItems()
},[])

const getItems = () => {
    fetch(apiUrl + "/todos")
    .then((res) =>{
        return res.json()
    })
    .then((res) => {
        setTodos(res)
    })
}

const handleEdit = (item) => {
     setEditId(item._id);
     setEditTitle(item.title);
     setEditDescription(item.description)
}

const handleUpdate = () => {
    setError("")
       
        if(edittitle.trim() !== '' && editdescription.trim() !== ''){
            fetch(apiUrl+"/todos/"+ editId,{
                method: "PUT",
                headers:{"content-type": "application/json"},
                body: JSON.stringify({title: edittitle, description:editdescription})
            }).then((res)=> {
                if(res.ok){

                 const updatedTodos =    todos.map((item) => {
                            if(item._id == editId){
                                item.title = edittitle;
                                item.description = editdescription;
                            }
                            return item;
                    })
                    setTodos(updatedTodos)
                    setEditTitle("");
                    setEditDescription("");
                    setMsg("Items Updated successfully")
                    setTimeout(() =>{
                        setMsg("")
                    },3000)

                    setEditId(-1)
                }else{
                    setError("unable to create todo list")
                }
                
            }).catch(() => {
                setError("unable to create todo list")
            })
            
        }
}

const handleEditCancel = () => {
    setEditId(-1)
}

const handleDelete = (id) => {
    if(window.confirm('Are you sure to delete this task')){
        fetch(apiUrl+ '/todos/'+ id,{
            method: 'DELETE'
        })
        .then(() => {
           const updatedTodos = todos.filter((item) => item._id !== id  )
            setTodos(updatedTodos)
        })
    }
}

  return (
    <>
    <div className="row p-3 bg-success text-light">
        <h1>ToDo List </h1>
    </div>
    <div className="row">
        <h3>Add Item</h3>
        
        <div className="form-group d-flex gap-2">
        <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" type="text"/>
        <input placeholder="description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text"/>
        <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        
        </div>
        {msg && <p className="text-success">Item Added Successfully</p>}
        {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
        <ul className="list-group">
        {
            todos.map((item) => (
            <li  className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
            <div className="d-flex flex-column me-2">
            {
                editId === -1 || editId !== item._id ? <>
                <span className="fw-bold">{item.title}</span>
                <span>{item.description} </span>
                </> : <>
                <div className="form-group d-flex gap-2">
        <input placeholder="title" value={edittitle} onChange={(e) => setEditTitle(e.target.value)} className="form-control" type="text"/>
        <input placeholder="description" onChange={(e) => setEditDescription(e.target.value)} value={editdescription} className="form-control" type="text"/>
       
        
        </div>
                </>
            }

            </div>
                <div className="d-flex gap-2">
                {
                    editId === -1 || editId !== item._id ? 
                <button onClick={ () => handleEdit(item)} className="btn btn-warning">Edit</button>
                :
                <button onClick={handleUpdate} className="btn btn-warning">Update</button>
                }
                {
                    editId === -1 || editId !== item._id ? 
                <button className="btn btn-danger" onClick={() =>  handleDelete(item._id)}>Delete</button> :
                <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                }
                </div>
            </li>
            ))
        }
            
        </ul>
        </div>
       
    </div>
    </>
  )
}

export default Todo