import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function EditPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.post) {
      const { title, content } = location.state.post;
      setTitle(title);
      setContent(content);
    }
  }, [location]);

  const handleAddPost = async (event) => {
    event.preventDefault();
    if (imageFile) {
      // Encoding the image into base64 when the form is submitted
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        handleAddPostHelper(title, content, reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      alert('Please select an image');
    }
  };

  const handleAddPostHelper = async (title, content, picture) => {
    try {
      // Delete the note with the current ID
      await fetch(`https://api.listing.pw/api/postings/${location.state.post.id}`, {
        method: 'DELETE',
      });
      console.log('Note deleted successfully');
      
      // Add the new post
      const response = await fetch('https://api.listing.pw/api/postings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          picture,
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log('Post created successfully');
      } else {
        // Handle error response
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
    window.location.href = "/";
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  return (
    <>
      <form
        className="post-form"
        onSubmit={(event) => handleAddPost(event)}
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="School Name"
          required
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="About"
          rows={10}
          required
        />
        <input 
          type="file" 
          accept=".jpg, .jpeg, .png, .gif"
          onChange={handleImageChange} // Call handleImageChange on file selection
          required
        />
        <button type="submit">Submit</button>
        <NavLink to="/">
          <button className="generalButton">Cancel</button>
        </NavLink>
      </form>
    </>
  );
}

export default EditPage;
