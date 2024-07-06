# DND React app front end

## You can run this app using following commands

**After cloning you have perform following steps**

## Add .env file and add following variables
**`REACT_APP_BASE_URL=****`**

## And then run the following commands
 
### `npm i` for installing dependencies

### `npm start` for run the app

## Database

**After running, you have to manully create a following records in MongoDb database**

### You have to add 3 records in columns collection

### 1 `{_id: "todo", taskIds: []}`
### 2 `{_id: "inprogress", taskIds: []}`
### 3 `{_id: "completed", taskIds: []}`

then just add title of task at + sign and press enter and it will push the task into respective column
it will add the task into the following task you can darg and drop the tasks in todo, inprogress, completed 

