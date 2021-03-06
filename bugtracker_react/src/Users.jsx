
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//const apiURL = 'http://localhost:3001'
const apiURL = 'https://ruby-lelo515805.codeanyapp.com/'

function UserForm({ user, updateUser, uploadSelectedFile, formMode, submitCallback, cancelCallback }) {

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
    <div className="user-form">
      <h1> Users </h1>
      <form onSubmit={formSubmitted}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" className="form-control" autoComplete='given-name' name="fname" id="fname"
            placeholder="First Name" value={user.fname} onChange={(event) => updateUser('fname', event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="lname">Last Name</label>
          <input type="text" className="form-control" autoComplete='family-name' name="lname" id="lname"
            placeholder="Last Name" value={user.lname} onChange={(event) => updateUser('lname', event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" autoComplete='email' name="email" id="email"
            placeholder="name@example.com" value={user.email} onChange={(event) => updateUser('email', event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="thumnail">Profile</label>
          <input id="user_thumbnail" className="form-control-file" type="file" name="thumbnail" 
          onChange ={(event) =>uploadSelectedFile(event.target.value) }/>  
        </div>
        {renderButtons()}
      </form>
    </div>
  );
}

function UserListItem({ user, onEditClicked, onDeleteClicked }) {
  // Notice that the buttons currently don't do anything when clicked.
  return (
    <tr>
      <td className="w-25">{user.fname}</td>
      <td className="w-25">{user.lname}</td>
      <td className="w-25">{user.email}</td>
      <td className="w-25">
        <button className="btn btn-success btn-sm" onClick={event => onEditClicked(user)}>
          <i className="glyphicon glyphicon-pencil"></i> Edit
          </button>
        <button className="btn btn-danger btn-sm" onClick={event => onDeleteClicked(user.id)}>
          <i className="glyphicon glyphicon-remove"></i> Delete
          </button>
      </td>
    </tr>
  );
}

function UserList({ users, onEditClicked, onDeleteClicked }) {
  const userItems = users.map((user) => (
    <UserListItem key={user.id} user={user} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
  ));

  return (
    <div className ="py-4 bg-light">
      <table className="table">
        <thead >
          <tr>
            <th className="w-25">First Name</th>
            <th className="w-25">Last Name</th>
            <th className="w-25">Email</th>
            <th className="w-25">Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {userItems}
        </tbody>
      </table>
    </div>
  );
}

function Users() {

  let [userList, setUserList] = React.useState([
    { id: 1, fname: "Hasn't", lname: "Loaded", email: "Yet" }
  ]);

  let [formMode, setFormMode] = React.useState("new");

  let emptyUser = { fname: '', lname: '', email: '' };
  let [currentUser, setCurrentUser] = React.useState(emptyUser);

  let fetchUsers = () => {
    fetch(`${apiURL}/users`).then(response => {
      return response.json();
    }).then(data => {
      console.log("And the JSON");
      console.log(data);

      setUserList(data);
    });
  };

  React.useEffect(() => fetchUsers(), []);

  let updateUser = (field, value) => {
    let newUser = { ...currentUser }
    newUser[field] = value;
    setCurrentUser(newUser);
  }
  let uploadSelectedFile = (field, value) => {
        let newUser = { ...currentUser }
        newUser[field] = value;
        setCurrentUser(newUser);
        const data = new FormData();
        data.append('file', value);
  }
  let postNewUser = (user) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(user)
    };
    console.log("Attempting to post new user");
    console.log(user);
    console.log(options.body);
    return fetch(`${apiURL}/users`, options).then(response => {
      return response.json();
    });
  }

  let updatedSelectedUser = (user) => {
    const options = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(user)
      };
      console.log("Attempting to update an existing user");
      console.log(user);
      console.log(options.body);
      return fetch(`${apiURL}/users/${user.id}`, options).then(response => {
        return response.json();
      });
  }
  let deleteSelectedUser = (id) => {
    const options = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
        })
      };
      return fetch(`${apiURL}/users/${id}`, options).then(response => {
        return response;
      });
  }
  
  let formValidated = (currentUser) => {
    if(currentUser.fname !== "" && currentUser.lname !== "" && currentUser.email !== "") {
        return true;
    }
    else{
        alert("Please enter all require information.");
        return false;
    }
  }
  let formSubmitted = () => {
    if(formValidated(currentUser)){
        if (formMode === "new") {
        
        postNewUser(currentUser).then(data => {
            console.log("Received data");
            console.log(data);
            if (!data.message) {
                currentUser.id = data.id;
                setUserList([...userList, currentUser]);
            } else {
                console.log("New user wasn't created because " + data.message);
            }
        });
        } else {
            console.log("update existing user.");
        let newUserList = [...userList];
        let userIndex = userList.findIndex((user) => user.id === currentUser.id);

        newUserList[userIndex] = currentUser;
        setUserList(newUserList);
        updatedSelectedUser(currentUser).then(data =>{

        });
        }
    }
  }

  let editClicked = (user) => {
    setFormMode("update");
    setCurrentUser(user);
  }

  let cancelClicked = () => {
    setFormMode("new");
    setCurrentUser(emptyUser)
  }


  let deleteClicked = (id) => {
    setUserList(userList.filter((item) => item.id !== id));
    deleteSelectedUser(id).then(data =>{

    });
    // reset the form after someone clicks delete.
    cancelClicked();
  }

  return (
    <div className="users">
      <UserForm formMode={formMode} user={currentUser} updateUser={updateUser} uploadSelectedFile={uploadSelectedFile}
        submitCallback={formSubmitted} cancelCallback={cancelClicked} />
      <div />
      <UserList users={userList} onEditClicked={editClicked} onDeleteClicked={deleteClicked} />
    </div>
  );
}

export default Users;