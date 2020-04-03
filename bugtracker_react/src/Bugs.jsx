
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//const apiURL = 'http://localhost:3001'
const apiURL = 'https://ruby-lelo515805.codeanyapp.com/'

function BugForm({ bug, updateBug, formMode, submitCallback, cancelCallback }) {

  let cancelClicked = (event) => {
    event.preventDefault();
    cancelCallback();
  }

  let renderButtons = () => {
    if (formMode === "new") {
      return (
        <button type="submit" className="btn btn-primary">Create</button>
      );
    } else {
      return (
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="submit" className="btn btn-danger" onClick={cancelClicked} >Cancel</button>
        </div>
      );
    }
  } // end renderButtons

  let formSubmitted = (event) => {
    // Prevent the browser from re-loading the page.
    event.preventDefault();
    submitCallback();
  };

  return (
    <div className="bug-form">
      <h1> Bugs </h1>
      <form onSubmit={formSubmitted}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" className="form-control" autoComplete='given-name' name="title" id="title"
            placeholder="Title" value={bug.fname} onChange={(event) => updateBug('title', event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input type="text" className="form-control" autoComplete='description' name="description" id="description"
            placeholder="Description" value={bug.lname} onChange={(event) => updateBug('description', event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="issue_type">Issue Type</label>
          <select  name="issue_type" id="issue_type">
                <option value="1">Grapefruit</option>
                <option value="2">Lime</option>
                <option value="3">Mango</option>
            </select>
          <input type="email" className="form-control" name="email" id="email"
            value={bug.email} onChange={(event) => updateBug('email', event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priorty</label>
          <select  name="priority" id="priority">
                <option value="1">Grapefruit</option>
                <option value="2">Lime</option>
                <option value="3">Mango</option>
            </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select  name="status" id="status">
                <option value="1">Grapefruit</option>
                <option value="2">Lime</option>
                <option value="3">Mango</option>
            </select>
        </div>
        {renderButtons()}
      </form>
    </div>
  );
}

function BugListItem({ bug, onEditClicked, onDeleteClicked }) {
  // Notice that the buttons currently don't do anything when clicked.
  return (
    <tr>
      <td className="w-25">{bug.title}</td>
      <td className="w-25">{bug.description}</td>
      <td className="w-25">{bug.issue_type}</td>
      <td className="w-25">{bug.priority}</td>
      <td className="w-25">{bug.status}</td>
      <td className="w-25">
        <button className="btn btn-success btn-sm" onClick={event => onEditClicked(bug)}>
          <i className="glyphicon glyphicon-pencil"></i> Edit
          </button>
        <button className="btn btn-danger btn-sm" onClick={event => onDeleteClicked(bug.id)}>
          <i className="glyphicon glyphicon-remove"></i> Delete
          </button>
      </td>
    </tr>
  );
}

function BugList({ bugs, onEditClicked, onDeleteClicked }) {
  const bugItems = bugs.map((bug) => (
    <BugListItem key={bug.id} bug={bug} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
  ));

  return (
    <div className ="py-4 bg-light">
      <table className="table">
        <thead >
          <tr>
            <th className="w-25">Title</th>
            <th className="w-25">Desription</th>
            <th className="w-25">Issue Type</th>
            <th className="w-25">Priority</th>
            <th className="w-25">Status</th>
          </tr>
        </thead>
        
        <tbody>
          {bugItems}
        </tbody>
      </table>
    </div>
  );
}

function Bugs() {

  let [bugList, setBugList] = React.useState([
    { id: 1, title: "Hasn't", description: "Loaded", issue_type: 1, priority: 1, status: 1 }
  ]);

  let [formMode, setFormMode] = React.useState("new");

  let emptyBug = { title: '', description: '', issue_type: 1, priority: 1, status: 1 };
  let [currentBug, setCurrentBug] = React.useState(emptyBug);

  let fetchBugs = () => {
    fetch(`${apiURL}/bugs`).then(response => {
      return response.json();
    }).then(data => {
      console.log("And the JSON");
      console.log(data);

      setBugList(data);
    });
  };

  React.useEffect(() => fetchBugs(), []);

  let updateBug = (field, value) => {
    let newBug = { ...currentBug }
    newBug[field] = value;
    setCurrentBug(newBug);
  }

  let postNewBug = (bug) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(bug)
    };
    console.log("Attempting to post new bug");
    console.log(bug);
    console.log(options.body);
    return fetch(`${apiURL}/bugs`, options).then(response => {
      return response.json();
    });
  }

  let updatedSelectedBug = (bug) => {
    const options = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(bug)
      };
      console.log("Attempting to update an existing bug");
      console.log(bug);
      console.log(options.body);
      return fetch(`${apiURL}/bugs/${bug.id}`, options).then(response => {
        return response.json();
      });
  }
  let deleteSelectedBug = (id) => {
    const options = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
        })
      };
      return fetch(`${apiURL}/bugs/${id}`, options).then(response => {
        return response;
      });
  }
  
  let formValidated = (currentBug) => {
    if(currentBug.title !== "" && currentBug.description !== "") {
        return true;
    }
    else{
        alert("Please enter all require information.");
        return false;
    }
  }
  let formSubmitted = () => {
    if(formValidated(currentBug)){
        if (formMode === "new") {
        
        postNewBug(currentBug).then(data => {
            console.log("Received data");
            console.log(data);
            if (!data.message) {
                currentBug.id = data.id;
                setBugList([...bugList, currentBug]);
            } else {
                console.log("New bug wasn't created because " + data.message);
            }
        });
        } else {
            console.log("update existing bug.");
        let newBugList = [...bugList];
        let bugIndex = bugList.findIndex((bug) => bug.id === currentBug.id);

        newBugList[bugIndex] = currentBug;
        setBugList(newBugList);
        updatedSelectedBug(currentBug).then(data =>{

        });
        }
    }
  }

  let editClicked = (bug) => {
    setFormMode("update");
    setCurrentBug(bug);
  }

  let cancelClicked = () => {
    setFormMode("new");
    setCurrentBug(emptyBug)
  }


  let deleteClicked = (id) => {
    setBugList(bugList.filter((item) => item.id !== id));
    deleteSelectedBug(id).then(data =>{

    });
    // reset the form after someone clicks delete.
    cancelClicked();
  }

  return (
    <div className="bugs">
      <BugForm formMode={formMode} bug={currentBug} updateBug={updateBug}
        submitCallback={formSubmitted} cancelCallback={cancelClicked} />
      <div />
      <BugList bugs={bugList} onEditClicked={editClicked} onDeleteClicked={deleteClicked} />
    </div>
  );
}

export default Bugs;