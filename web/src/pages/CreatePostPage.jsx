import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { createPost } from '../features/postSlice';

const CreatePostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message, post } = useSelector((state) => state.posts);
  const { token } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isSuccess && post?._id) {
      navigate(`/post/${post._id}`);
    }
  }, [isSuccess, post, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      let imageUrl = '';
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        const { data } = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = data?.url || '';
        setUploading(false);
      }

      dispatch(createPost({ title, content, tags, imageUrl }));
    } catch (err) {
      setUploading(false);
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to submit post');
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={7}>
          <h1 className="mb-4">New Post</h1>

          {!token && (
            <Alert variant="warning">You must be logged in to create a post.</Alert>
          )}

          {isError && message && <Alert variant="danger">{message}</Alert>}
          {submitError && <Alert variant="danger">{submitError}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Write your post..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="tags">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. react, javascript, webdev"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isLoading || uploading || !token}>
              {isLoading || uploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {uploading ? 'Uploading...' : 'Publishing...'}
                </>
              ) : (
                'Publish'
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePostPage;


