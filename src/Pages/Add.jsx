import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function ImageForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  

  const handleAddPost = (event) => {
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

    // You can perform any additional actions here, such as submitting the form data to a server
  };

  const handleAddPostHelper = async (title, content, picture) => {
    try {
      const response = await fetch('http://localhost:5000/api/postings', {
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

export default ImageForm;
