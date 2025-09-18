import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { getPostById } from '../features/postSlice';

const PostDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { post, isLoading, isError, message } = useSelector((state) => state.posts);

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
    }
  }, [dispatch, id]);

  return (
    <Container className="py-4">
      {isLoading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {isError && !isLoading && (
        <Alert variant="danger">{message || 'Failed to load post'}</Alert>
      )}

      {!isLoading && !isError && post && (
        <>
          <h1 className="mb-3">{post.title}</h1>
          <div>{post.content}</div>
        </>
      )}
    </Container>
  );
};

export default PostDetailPage;


