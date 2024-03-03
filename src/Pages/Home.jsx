import { useState, useEffect } from "react"; // Import useState and useEffect from React
import "../App.css"; // Import CSS file for styling
import { NavLink, useNavigate } from 'react-router-dom'; // Import NavLink and useNavigate from 'react-router-dom' package

const Home = () => {
  // State variables for managing posts, title, content, selected post, and second password
  const [posts, setPosts] = useState([]); 
  const [title, setTitle] = useState(""); 
  const [content, setContent] = useState(""); 
  const [selectedPost, setSelectedPost] = useState(null); 
  const [secondPassword, setSecondPassword] = useState(""); 

  // Effect to fetch posts from the server on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/postings"); // Fetch posts from the server
        const posts = await response.json(); // Parse the response as JSON
        setPosts(posts); // Update the posts state with the fetched data
      } catch (e) {
        console.log(e); // Log any errors that occur during the fetch operation
      }
    };

    fetchPosts(); // Call the fetchPosts function when the component mounts
  }, []);

  const navigate = useNavigate(); // Use useNavigate instead of useHistory for navigation

  // Function to handle clicking on a post for editing
  const handlePostClick = (post) => {
    // Navigate to the "/edit" page with post information passed as props
    navigate('/edit', { state: { post } });
  };

  // Function to handle clicking on a post for viewing
  const handleViewPost = (post) => {
    // Navigate to the "/view" page with post information passed as props
    navigate('/view', { state: { post } });
  };

  // Function to handle adding a new post
  const handleAddPost = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await fetch("https://api.listing.pw/api/postings", {
        method: "POST", // HTTP POST request to add a new post
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({
          title,
          content,
          secondPassword, // Include the second password in the request body
        }), // Convert the post data to JSON and send it in the request body
      });

      const newPost = await response.json(); // Parse the response as JSON
      setPosts([newPost, ...posts]); // Add the new post to the posts list
      setTitle(""); // Clear the title input
      setContent(""); // Clear the content input
    } catch (e) {
      console.log(e); // Log any errors that occur during the request
    }
  };

  // Function to handle updating an existing post
  const handleUpdatePost = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (!selectedPost) {
      return; // If no post is selected, exit early
    }

    try {
      const response = await fetch(
        `https://api.listing.pw/api/postings/${selectedPost.id}`,
        {
          method: "PUT", // HTTP PUT request to update the selected post
          headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
          },
          body: JSON.stringify({
            title,
            content,
          }), // Convert the updated post data to JSON and send it in the request body
        }
      );

      const updatedPost = await response.json(); // Parse the response as JSON

      // Update the posts list with the updated post
      const updatedPostsList = posts.map((post) =>
        post.id === selectedPost.id ? updatedPost : post
      );

      setPosts(updatedPostsList); // Update the posts state with the updated list
      setTitle(""); // Clear the title input
      setContent(""); // Clear the content input
      setSelectedPost(null); // Reset the selected post
    } catch (e) {
      console.log(e); // Log any errors that occur during the request
    }
  };

  // Function to handle canceling post update or addition
  const handleCancel = () => {
    setTitle(""); // Clear the title input
    setContent(""); // Clear the content input
    setSelectedPost(null); // Reset the selected post
  };

  // Function to handle deleting a post
  const deletePost = async (event, postId) => {
    event.stopPropagation(); // Stop the event from propagating to parent elements

    try {
      await fetch(`http://localhost:5000/api/postings/${postId}`, {
        method: "DELETE", // HTTP DELETE request to delete the specified post
      });

      // Update the posts list by filtering out the deleted post
      const updatedPosts = posts.filter(
        (post) => post.id !== postId
      );

      setPosts(updatedPosts); // Update the posts state with the updated list
    } catch (e) {
      console.log(e); // Log any errors that occur during the request
    }
  };

  // Render UI for Home component
  return (
    <div>
      <h1 className="header">Postings:</h1>
      <div className="app-container">
        {/* Navigation link to the "/add" page */}
        <NavLink id="hello" to="/add">
          <button id="createButton" className="generalButton">Create</button>
        </NavLink>
        {/* Render posts */}
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="posts-header">
                {/* Button to delete a post */}
                <button onClick={(event) => deletePost(event, post.id)}>x</button>
              </div>
              <br/>
              <div className="custom-content">
                <h1 className="custom-title">{post.title}</h1>
                <div className="custom-image-container">
                  <img src={post.picture} alt="Image"/>
                  
                  <p className="custom-description">{post.content}</p>
                </div>
              </div>
              <br/>
              {/* Button to update a post */}
              <button className="generalButton updateButton" onClick={() => handlePostClick(post)}>Update</button>
              <br/>
              {/* Button to view a post */}
              <button className="generalButton updateButton" onClick={() => handleViewPost(post)}>View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; // Export the Home component as the default export
