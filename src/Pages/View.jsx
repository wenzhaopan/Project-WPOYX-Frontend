import React, { useState, useEffect } from 'react'; // Import React, useState, and useEffect from 'react' package
import { NavLink, useLocation } from 'react-router-dom'; // Import NavLink and useLocation from 'react-router-dom' package
import "../App.css"; // Import CSS file for styling

const View = () => {
  const location = useLocation(); // Get the current location object
  const { post } = location.state; // Destructure post from location.state

  const [posts, setPosts] = useState([]); // State for storing posts
  const [title, setTitle] = useState(post.title); // State for title initialized with post.title
  const [content, setContent] = useState(post.content); // State for content initialized with post.content
  const [selectedPost, setSelectedPost] = useState(post); // State for selected post initialized with post

  // Effect to fetch posts from the server on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://api.listing.pw/api/postings"); // Fetch posts from the server
        const posts = await response.json(); // Parse the response as JSON
        setPosts(posts); // Update the posts state with the fetched data
      } catch (e) {
        console.log(e); // Log any errors that occur during the fetch operation
      }
    };

    fetchPosts(); // Call the fetchPosts function when the component mounts
  }, []);

  // Function to handle deleting a post
  const deletePost = async (event, postId) => {
    event.stopPropagation(); // Stop the event from propagating to parent elements

    try {
      await fetch(`https://api.listing.pw/api/postings/${postId}`, {
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

  return (
    <div>
      {/* Display post details */}
      <div className="custom-content-view">
        <h1 className="custom-title-view">{post.title}</h1>
        <div className="custom-image-container-view">
          <img src={post.picture} alt="Image"/>
          <p className="custom-description-view">{post.content}</p>
        </div>
      </div>
      {/* Navigation button to go back to home page */}
      <NavLink to="/">
        <button id="backHomeButton" className="generalButton">Back To Home</button>
      </NavLink>
    </div>
  );
};

export default View; // Export the View component as the default export
