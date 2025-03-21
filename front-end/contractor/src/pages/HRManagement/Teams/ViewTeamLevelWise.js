import React, { useState } from "react";
import Tree from "react-d3-tree";

function ViewTeamLevelWise() {
  const [data, setData] = useState({
    name: "Root",
    children: [],
  });

  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState("");

  const handleAddRole = () => {
    if (newRole) {
      setData((prevData) => ({
        ...prevData,
        children: [
          ...prevData.children,
          {
            name: newRole,
            children: [],
          },
        ],
      }));
      setNewRole("");
    }
  };

  const handleAddUser = () => {
    if (newUser && data.name) {
      const newData = { ...data };
      const selectedRole = newData.children.find(
        (role) => role.name === data.name
      );
      if (selectedRole) {
        selectedRole.children.push({ name: newUser });
        setData(newData);
        setNewUser("");
      }
    }
  };

  return (
    <div>
      <div>
        <label>Select Role: </label>
        <select onChange={(e) => setData({ ...data, name: e.target.value })}>
          <option value={null}>-- Select Role --</option>
          {data.children.map((role) => (
            <option key={role.name} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {data.name && (
        <div>
          <label>Select User: </label>
          <input
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
          />
          <button onClick={handleAddUser}>Add User</button>
        </div>
      )}

      <div>
        <label>Add New Role: </label>
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        />
        <button onClick={handleAddRole}>Add Role</button>
      </div>

      <Tree data={data} />
    </div>
  );
}

export default ViewTeamLevelWise;
