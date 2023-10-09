import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './crud.css';

const Crud = () => {
  // Define initial state for the new book
  const initialBookState = {
    id: uuidv4(), //generate a UUID as the inital ID
    type: '',
    title: '',
    author: '',
  };

  // Initialize state variables
  const [newBook, setNewBook] = useState(initialBookState);
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);

  // Load books from local storage on component mount
  useEffect(() => {
    try {
      const storedBooks = JSON.parse(localStorage.getItem('bookInfo'));
      if (storedBooks) {
        setBooks(storedBooks);
      }
    } catch (error) {
      // Handle the error, e.g., log it or show a user-friendly message
      console.error('Error while parsing JSON from localStorage:', error);
    }
  }, []);

  // Save books to local storage whenever the 'books' state changes
  useEffect(() => {
    localStorage.setItem('bookInfo', JSON.stringify(books));
  }, [books]);

  // Handle input field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook({ ...newBook, [name]: value });
  };

  // Handle form submission (add or update)
  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!newBook.type || !newBook.title || !newBook.author) {
      alert('Please enter all book details. Book details cannot be empty.');
      return;
    }

    if (editingBookId !== null) {
      // Editing an existing book
      const updatedBooks = books.map((book) =>
        book.id === editingBookId ? { ...newBook, id: editingBookId } : book
      );
      setBooks(updatedBooks);
      setEditingBookId(null);
    } else {
      // Adding a new book
      setBooks([newBook, ...books]);
    }

    // Reset the form and state
    setNewBook(initialBookState);
  };

  // Handle book deletion
  const handleBookDelete = (id) => {
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
  };

  // Handle book editing
  const handleEditBook = (id) => {
    setEditingBookId(id);
    const bookToEdit = books.find((book) => book.id === id);
    setNewBook({ ...bookToEdit });
  };

  // Handle canceling book editing
  const handleCancelEdit = () => {
    setNewBook(initialBookState);
    setEditingBookId(null);
  };

  return (
    <div className="container">
      <h1>Book Management System</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Enter book type"
          value={newBook.type}
          name="type"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Enter book title"
          value={newBook.title}
          name="title"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Enter author"
          value={newBook.author}
          name="author"
          onChange={handleInputChange}
        />
        <button className="submit-btn">
          {editingBookId !== null ? 'Update Book' : 'Add Book'}
        </button>
        {editingBookId !== null && (
          <button className="cancel-btn" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>
      <div className="book-list-container">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Author</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.type}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <button
                    className="del-btn"
                    onClick={() => handleBookDelete(book.id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="update-btn"
                    onClick={() => handleEditBook(book.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Crud;
