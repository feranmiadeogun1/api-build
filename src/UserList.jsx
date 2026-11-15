
import React, { useState, useEffect } from "react";
import axios from "axios";

function UserList() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal }
        );

        setListOfUsers(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to fetch users. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, []);

  // Filter users by name
  const filteredUsers = listOfUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="status-message">
        <div className="spinner"></div>
        <h2>Loading users...</h2>
        <p>Please wait while we fetch your users.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="status-message error">
        <h2>Oops! Something went wrong.</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="user-container">

      <div className="header">
        <h1>User Directory</h1>
        <p>Discover and explore our community members.</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search users by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span>👥 {filteredUsers.length} Users Found</span>
      </div>

      <div className="user-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div className="user-card" key={user.id}>

              <div className="avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <h3>{user.name}</h3>

              <p className="email">✉ {user.email}</p>

              <p className="company">
                🏢 {user.company.name}
              </p>

              <button
                className="details-btn"
                onClick={() =>
                  setSelectedUser(
                    selectedUser?.id === user.id ? null : user
                  )
                }
              >
                {selectedUser?.id === user.id
                  ? "Hide Details"
                  : "View Details"}
              </button>

              {selectedUser?.id === user.id && (
                <div className="user-details">
                  <h4>Additional Information</h4>

                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>

                  <p>
                    <strong>Website:</strong> {user.website}
                  </p>

                  <p>
                    <strong>City:</strong> {user.address.city}
                  </p>

                  <p>
                    <strong>Street:</strong> {user.address.street}
                  </p>

                  <p>
                    <strong>Company:</strong> {user.company.name}
                  </p>
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No users found!</h3>
            <p>Try searching with another name.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default UserList;
